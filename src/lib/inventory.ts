import { getRoomBySlug, rooms, Room } from "./rooms";
import { query, isDbConnected, initDatabase } from "./db";

export interface RoomAvailabilityStatus {
  roomSlug: string;
  roomName: string;
  totalRooms: number;
  bookedRooms: number;
  blockedRooms: number;
  availableRooms: number;
  isAvailable: boolean;
  nightlyBreakdown?: NightlyAvailability[];
}

export interface NightlyAvailability {
  date: string; // YYYY-MM-DD
  bookedRooms: number;
  blockedRooms: number;
  availableRooms: number;
  isAvailable: boolean;
}

export interface DayCalendarStatus {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  totalRooms: number;
  bookedRooms: number;
  availableRooms: number;
  isAvailable: boolean;
  isSoldOut: boolean;
  price: number;
  remainingLabel: string;
}

// In-memory reservations mirror for environments without active PostgreSQL
export interface OverlapBookingRef {
  id?: string;
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  status: string;
  assignedRoomNumber?: string;
}

const localBookingsMemory: OverlapBookingRef[] = [];

export function recordLocalBooking(booking: OverlapBookingRef) {
  localBookingsMemory.push(booking);
}

export function updateLocalBookingStatus(id: string, status: string, assignedRoomNumber?: string) {
  const item = localBookingsMemory.find((b) => b.id === id);
  if (item) {
    item.status = status;
    if (assignedRoomNumber !== undefined) {
      item.assignedRoomNumber = assignedRoomNumber;
    }
  }
}

/**
 * Check if a specific night falls in stay nights [checkIn, checkOut - 1].
 * Checkout date is an available departure date, NOT an occupied night.
 */
export function isNightOccupiedByBooking(nightDate: string, checkIn: string, checkOut: string): boolean {
  return nightDate >= checkIn && nightDate < checkOut;
}

/**
 * Check if two date ranges overlap.
 * Standard interval overlap: StartA < EndB and EndA > StartB
 */
export function areDatesOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB);
}

/**
 * Generate array of ISO date strings (YYYY-MM-DD) for every night of a stay.
 */
export function getStayNights(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const [sy, sm, sd] = checkIn.split("-").map(Number);
  const [ey, em, ed] = checkOut.split("-").map(Number);
  const current = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);

  while (current < end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/**
 * Calculate available inventory separately for every night in a date range.
 * Treats checkout dates as available departure dates, not occupied nights.
 * An entire category is NEVER marked unavailable when only one room is booked.
 */
export async function getRoomAvailability(
  roomSlug: string,
  checkIn: string,
  checkOut: string
): Promise<RoomAvailabilityStatus | null> {
  const room = getRoomBySlug(roomSlug);
  if (!room) return null;

  const nights = getStayNights(checkIn, checkOut);
  if (nights.length === 0) {
    return {
      roomSlug: room.slug,
      roomName: room.name,
      totalRooms: room.totalRooms,
      bookedRooms: 0,
      blockedRooms: 0,
      availableRooms: room.totalRooms,
      isAvailable: true,
      nightlyBreakdown: [],
    };
  }

  const nightlyBreakdown: NightlyAvailability[] = [];

  if (isDbConnected()) {
    try {
      await initDatabase();

      // High-Performance Batch Optimization:
      // Fetch all overlapping reservations and blocks in 2 parallel queries instead of 2 * N sequential queries
      const [dbBookings, dbBlocks] = await Promise.all([
        query<{ check_in: string; check_out: string }>(
          `SELECT check_in, check_out 
           FROM amil_bookings 
           WHERE room_slug = $1 
             AND status != 'cancelled'
             AND check_in < $3 
             AND check_out > $2`,
          [roomSlug, checkIn, checkOut]
        ),
        query<{ blocked_from: string; blocked_to: string }>(
          `SELECT blocked_from, blocked_to 
           FROM amil_inventory_blocks 
           WHERE room_slug = $1 
             AND blocked_from < $3 
             AND blocked_to > $2`,
          [roomSlug, checkIn, checkOut]
        ),
      ]);

      for (const night of nights) {
        const booked = dbBookings.filter((b) =>
          isNightOccupiedByBooking(night, b.check_in, b.check_out)
        ).length;
        const blocked = dbBlocks.filter((b) =>
          isNightOccupiedByBooking(night, b.blocked_from, b.blocked_to)
        ).length;

        const occupied = booked + blocked;
        const available = Math.max(0, room.totalRooms - occupied);

        nightlyBreakdown.push({
          date: night,
          bookedRooms: booked,
          blockedRooms: blocked,
          availableRooms: available,
          isAvailable: available > 0,
        });
      }
    } catch (err) {
      console.error("[Inventory DB Query Error]: Falling back to memory calculation", err);
      for (const night of nights) {
        const booked = localBookingsMemory.filter(
          (b) =>
            b.roomSlug === roomSlug &&
            b.status !== "cancelled" &&
            isNightOccupiedByBooking(night, b.checkIn, b.checkOut)
        ).length;
        const available = Math.max(0, room.totalRooms - booked);
        nightlyBreakdown.push({
          date: night,
          bookedRooms: booked,
          blockedRooms: 0,
          availableRooms: available,
          isAvailable: available > 0,
        });
      }
    }
  } else {
    // Pure memory calculation
    for (const night of nights) {
      const booked = localBookingsMemory.filter(
        (b) =>
          b.roomSlug === roomSlug &&
          b.status !== "cancelled" &&
          isNightOccupiedByBooking(night, b.checkIn, b.checkOut)
      ).length;
      const available = Math.max(0, room.totalRooms - booked);
      nightlyBreakdown.push({
        date: night,
        bookedRooms: booked,
        blockedRooms: 0,
        availableRooms: available,
        isAvailable: available > 0,
      });
    }
  }

  // Bottleneck night calculation: stay availability is the lowest room count on any night of the stay
  const minAvailable = Math.min(...nightlyBreakdown.map((n) => n.availableRooms));
  const maxBooked = Math.max(...nightlyBreakdown.map((n) => n.bookedRooms));
  const maxBlocked = Math.max(...nightlyBreakdown.map((n) => n.blockedRooms));

  return {
    roomSlug: room.slug,
    roomName: room.name,
    totalRooms: room.totalRooms,
    bookedRooms: maxBooked,
    blockedRooms: maxBlocked,
    availableRooms: minAvailable,
    isAvailable: minAvailable > 0,
    nightlyBreakdown,
  };
}

/**
 * Get availability status for all rooms simultaneously for a date range.
 */
export async function getAllRoomsAvailability(
  checkIn: string,
  checkOut: string
): Promise<RoomAvailabilityStatus[]> {
  const results: RoomAvailabilityStatus[] = [];

  for (const room of rooms) {
    const status = await getRoomAvailability(room.slug, checkIn, checkOut);
    if (status) {
      results.push(status);
    }
  }

  return results;
}

/**
 * Calculate month-level calendar inventory for a room category.
 * Returns each calendar day's availability, remaining stock, sold out status, and price.
 */
export async function getMonthCalendarAvailability(
  roomSlug: string,
  year: number,
  month: number // 1 to 12
): Promise<{ room: Room; days: DayCalendarStatus[] } | null> {
  const room = getRoomBySlug(roomSlug);
  if (!room) return null;

  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DayCalendarStatus[] = [];

  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonthYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const monthEndBoundary = `${nextMonthYear}-${String(nextMonth).padStart(2, "0")}-01`;

  let dbBookings: { check_in: string; check_out: string }[] = [];
  let dbBlocks: { blocked_from: string; blocked_to: string }[] = [];

  if (isDbConnected()) {
    try {
      await initDatabase();
      // Batch fetch entire month's overlapping bookings and blocks in 2 parallel queries
      const [bRes, blkRes] = await Promise.all([
        query<{ check_in: string; check_out: string }>(
          `SELECT check_in, check_out 
           FROM amil_bookings 
           WHERE room_slug = $1 
             AND status != 'cancelled'
             AND check_in < $3 
             AND check_out > $2`,
          [roomSlug, monthStart, monthEndBoundary]
        ),
        query<{ blocked_from: string; blocked_to: string }>(
          `SELECT blocked_from, blocked_to 
           FROM amil_inventory_blocks 
           WHERE room_slug = $1 
             AND blocked_from < $3 
             AND blocked_to > $2`,
          [roomSlug, monthStart, monthEndBoundary]
        ),
      ]);
      dbBookings = bRes;
      dbBlocks = blkRes;
    } catch (err) {
      console.error("[Month Calendar DB Query Error]: Falling back to local memory", err);
    }
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const nextDate = new Date(year, month - 1, d);
    const dayOfWeek = nextDate.getDay();

    let bookedCount = 0;
    let blockedCount = 0;

    if (isDbConnected() && dbBookings.length > 0) {
      bookedCount = dbBookings.filter((b) =>
        isNightOccupiedByBooking(dateStr, b.check_in, b.check_out)
      ).length;
      blockedCount = dbBlocks.filter((b) =>
        isNightOccupiedByBooking(dateStr, b.blocked_from, b.blocked_to)
      ).length;
    } else {
      bookedCount = localBookingsMemory.filter(
        (b) =>
          b.roomSlug === roomSlug &&
          b.status !== "cancelled" &&
          isNightOccupiedByBooking(dateStr, b.checkIn, b.checkOut)
      ).length;
    }

    const occupied = bookedCount + blockedCount;
    const available = Math.max(0, room.totalRooms - occupied);
    const isAvailable = available > 0;
    const isSoldOut = available === 0;

    let remainingLabel = `${available} available`;
    if (isSoldOut) {
      remainingLabel = "Sold Out";
    } else if (available === 1) {
      remainingLabel = "Only 1 room left";
    } else if (available <= 3) {
      remainingLabel = `Only ${available} left`;
    }

    days.push({
      date: dateStr,
      dayNumber: d,
      dayOfWeek,
      totalRooms: room.totalRooms,
      bookedRooms: bookedCount,
      availableRooms: available,
      isAvailable,
      isSoldOut,
      price: room.price,
      remainingLabel,
    });
  }

  return { room, days };
}

/**
 * Assign a specific physical room number to a confirmed reservation.
 * Strictly prevents two active reservations from occupying the same physical room on overlapping dates.
 */
export async function assignPhysicalRoomNumber(
  bookingId: string,
  roomNumber: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  if (isDbConnected()) {
    try {
      await initDatabase();

      // 1. Fetch target booking dates
      const bRes = await query<{ check_in: string; check_out: string; room_slug: string }>(
        `SELECT check_in, check_out, room_slug FROM amil_bookings WHERE id = $1`,
        [bookingId]
      );
      if (!bRes.length) {
        return { success: false, error: "Booking reservation not found." };
      }
      const { check_in: checkIn, check_out: checkOut } = bRes[0];

      // 2. Prevent overlapping assignment on same physical room
      const conflictRes = await query<{ id: string; guest_name: string; check_in: string; check_out: string }>(
        `SELECT id, guest_name, check_in, check_out FROM amil_bookings 
         WHERE assigned_room_number = $1 
           AND id != $2 
           AND status != 'cancelled'
           AND check_in < $3 
           AND check_out > $4`,
        [roomNumber, bookingId, checkOut, checkIn]
      );

      if (conflictRes.length > 0) {
        const c = conflictRes[0];
        return {
          success: false,
          error: `Physical room ${roomNumber} is already occupied by reservation ${c.id} (${c.guest_name}) from ${c.check_in} to ${c.check_out}. Overlapping assignment prevented.`,
        };
      }

      // 3. Assign room
      await query(
        `UPDATE amil_bookings 
         SET assigned_room_number = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [roomNumber, bookingId]
      );

      return {
        success: true,
        message: `Physical room ${roomNumber} successfully assigned to booking ${bookingId}.`,
      };
    } catch (err: any) {
      console.error("[Assign Room DB Error]:", err);
      return { success: false, error: err.message || "Failed to assign room in database." };
    }
  } else {
    // Memory fallback
    const b = localBookingsMemory.find((x) => x.id === bookingId);
    if (!b) {
      return { success: false, error: "Booking reservation not found in memory store." };
    }
    const conflict = localBookingsMemory.find(
      (x) =>
        x.assignedRoomNumber === roomNumber &&
        x.id !== bookingId &&
        x.status !== "cancelled" &&
        areDatesOverlapping(x.checkIn, x.checkOut, b.checkIn, b.checkOut)
    );
    if (conflict) {
      return {
        success: false,
        error: `Physical room ${roomNumber} is already occupied by reservation ${conflict.id} on overlapping dates.`,
      };
    }
    b.assignedRoomNumber = roomNumber;
    return {
      success: true,
      message: `Physical room ${roomNumber} assigned to reservation ${bookingId} (memory mode).`,
    };
  }
}
