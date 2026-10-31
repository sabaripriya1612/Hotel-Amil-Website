import { rooms, getRoomBySlug, type Room } from "./rooms";
import { hotelPolicies, siteConfig } from "./site";

export type BookingInput = {
  roomSlug: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  childrenUnder8: number;
  specialRequests?: string;
  paymentMethod: "online" | "pay_at_hotel";
};

export type Booking = BookingInput & {
  id: string;
  nights: number;
  roomPrice: number;
  extraPersonTotal: number;
  total: number;
  status: "pending" | "confirmed";
  createdAt: string;
};

const STORAGE_KEY = "amil-hotel-bookings";

type Listener = () => void;

let bookingCache: Booking[] = [];
const bookingListeners = new Set<Listener>();
let bookingsInitialized = false;

function emitBookings() {
  bookingListeners.forEach((listener) => listener());
}

export function subscribeBookings(onChange: Listener): () => void {
  bookingListeners.add(onChange);
  return () => {
    bookingListeners.delete(onChange);
  };
}

function readBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

function ensureBookingsInit() {
  if (!bookingsInitialized) {
    bookingCache = readBookings();
    bookingsInitialized = true;
  }
}

export function getBookings(): Booking[] {
  ensureBookingsInit();
  return bookingCache;
}

export function getBookingsServerSnapshot(): Booking[] {
  return [];
}

function saveBookings(bookings: Booking[]) {
  bookingCache = bookings;
  bookingsInitialized = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }
  emitBookings();
}

export function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

export function countDateOverlaps(
  roomSlug: string,
  checkIn: string,
  checkOut: string
): number {
  const bookings = getBookings();
  return bookings.filter((b) => {
    if (b.roomSlug !== roomSlug) return false;
    if (b.status !== "confirmed") return false;
    const overlap =
      new Date(b.checkIn) < new Date(checkOut) &&
      new Date(checkIn) < new Date(b.checkOut);
    return overlap;
  }).length;
}

export function getAvailableRoomsForDates(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return rooms;
  return rooms.filter((room) => {
    const active = countDateOverlaps(room.slug, checkIn, checkOut);
    return active < room.totalRooms;
  });
}

export function isRoomAvailable(
  roomSlug: string,
  checkIn: string,
  checkOut: string
): boolean {
  const room = getRoomBySlug(roomSlug);
  if (!room) return false;
  return countDateOverlaps(roomSlug, checkIn, checkOut) < room.totalRooms;
}

export function roomsLeftForDates(
  roomSlug: string,
  checkIn: string,
  checkOut: string
): number {
  const room = getRoomBySlug(roomSlug);
  if (!room || !checkIn || !checkOut) return room ? room.totalRooms : 0;
  const active = countDateOverlaps(roomSlug, checkIn, checkOut);
  return Math.max(room.totalRooms - active, 0);
}

export type PriceBreakdown = {
  room: Room;
  nights: number;
  baseTotal: number; // per night price × nights
  gstTotal: number;
  extraPersons: number;
  extraPersonTotal: number;
  freeChildren: number;
  total: number;
};

export function calcPriceBreakdown(
  room: Room,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
  childrenUnder8: number
): { breakdown: PriceBreakdown; error?: string } {
  const nights = calcNights(checkIn, checkOut);
  if (nights < 1) {
    return {
      breakdown: {
        room,
        nights,
        baseTotal: 0,
        gstTotal: 0,
        extraPersons: 0,
        extraPersonTotal: 0,
        freeChildren: 0,
        total: 0,
      },
      error: "Check-out must be after check-in date.",
    };
  }

  const chargeableChildren = Math.max(children - childrenUnder8, 0);
  const totalPersons = adults + chargeableChildren;
  const extraPersons = Math.max(totalPersons - room.maxGuests, 0);

  if (extraPersons > room.maxExtraPersons) {
    return {
      breakdown: {
        room,
        nights,
        baseTotal: room.price * nights,
        gstTotal: room.gst * nights,
        extraPersons,
        extraPersonTotal: 0,
        freeChildren: childrenUnder8,
        total: 0,
      },
      error: `Maximum ${room.maxGuests + room.maxExtraPersons} persons allowed (${room.maxGuests}+${room.maxExtraPersons}) in ${room.name}.`,
    };
  }

  const baseTotal = room.price * nights;
  const gstTotal = room.gst * nights;
  const extraPersonTotal = extraPersons * room.extraPersonCharge * nights;
  const total = baseTotal + extraPersonTotal;

  return {
    breakdown: {
      room,
      nights,
      baseTotal,
      gstTotal,
      extraPersons,
      extraPersonTotal,
      freeChildren: childrenUnder8,
      total,
    },
  };
}

export async function createBookingAsync(data: BookingInput): Promise<{
  ok: boolean;
  booking?: Booking;
  error?: string;
}> {
  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok && result.success && result.booking) {
      const b: Booking = {
        ...data,
        id: result.booking.id,
        nights: result.booking.nights,
        roomPrice: result.booking.roomPrice,
        extraPersonTotal: result.booking.extraPersonTotal,
        total: result.booking.totalAmount,
        status: "confirmed",
        createdAt: result.booking.createdAt,
      };
      // Keep local store synchronized for instant page rendering
      const all = getBookings();
      all.unshift(b);
      saveBookings(all);
      return { ok: true, booking: b };
    } else {
      // Fallback to local booking if offline or DB error
      console.warn("API returned error, falling back to local reservation:", result.error);
      return createBooking(data);
    }
  } catch (err) {
    console.warn("Failed to reach booking API, falling back to local reservation:", err);
    return createBooking(data);
  }
}

export function createBooking(data: BookingInput): {
  ok: boolean;
  booking?: Booking;
  error?: string;
} {
  const room = getRoomBySlug(data.roomSlug);
  if (!room) return { ok: false, error: "Room not found." };
  if (!isRoomAvailable(data.roomSlug, data.checkIn, data.checkOut)) {
    return { ok: false, error: "This room is fully booked for the selected dates." };
  }

  const { breakdown, error } = calcPriceBreakdown(
    room,
    data.checkIn,
    data.checkOut,
    data.adults,
    data.children,
    data.childrenUnder8
  );
  if (error) return { ok: false, error };

  const booking: Booking = {
    ...data,
    id: `AH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    nights: breakdown.nights,
    roomPrice: room.price,
    extraPersonTotal: breakdown.extraPersonTotal,
    total: breakdown.total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const all = getBookings();
  all.push(booking);
  saveBookings(all);
  return { ok: true, booking };
}

export function confirmBooking(id: string): Booking | undefined {
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], status: "confirmed" };
  saveBookings(all);
  return all[idx];
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(value: number): string {
  return `${siteConfig.currency}${value.toLocaleString("en-IN")}`;
}

export { hotelPolicies };