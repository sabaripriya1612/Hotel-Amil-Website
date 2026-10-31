import { getRoomBySlug } from "./rooms";
import { calcNights } from "./booking";

export type CartItem = {
  id: string;
  roomSlug: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  childrenUnder8: number;
  nights: number;
  roomPrice: number;
  gst: number;
  extraPersonTotal: number;
  total: number;
};

const STORAGE_KEY = "amil-hotel-cart";

type Listener = () => void;

let cartCache: CartItem[] = [];
const listenerSet = new Set<Listener>();
let initialized = false;

function emit() {
  listenerSet.forEach((listener) => listener());
}

export function subscribeCart(onChange: Listener): () => void {
  listenerSet.add(onChange);
  return () => {
    listenerSet.delete(onChange);
  };
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function ensureInit() {
  if (!initialized) {
    cartCache = readCart();
    initialized = true;
  }
}

export function getCart(): CartItem[] {
  ensureInit();
  return cartCache;
}

export function getCartServerSnapshot(): CartItem[] {
  return [];
}

function saveCart(items: CartItem[]) {
  cartCache = items;
  initialized = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  emit();
}

export function addToCart(input: {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenUnder8: number;
  roomPrice: number;
  gst: number;
  extraPersonTotal: number;
}): { ok: boolean; error?: string } {
  const room = getRoomBySlug(input.roomSlug);
  if (!room) return { ok: false, error: "Room not found." };
  if (!input.checkIn || !input.checkOut) {
    return { ok: false, error: "Please select check-in and check-out dates." };
  }
  const nights = calcNights(input.checkIn, input.checkOut);
  if (nights < 1) return { ok: false, error: "Check-out must be after check-in date." };

  const total = input.roomPrice * nights + input.extraPersonTotal;

  const item: CartItem = {
    id: `${input.roomSlug}-${input.checkIn}-${input.checkOut}-${input.adults}a-${input.children}c-${Date.now()}`,
    roomSlug: input.roomSlug,
    roomName: room.name,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.adults,
    children: input.children,
    childrenUnder8: input.childrenUnder8,
    nights,
    roomPrice: input.roomPrice,
    gst: input.gst,
    extraPersonTotal: input.extraPersonTotal,
    total,
  };

  ensureInit();
  const items = cartCache;
  const existing = items.findIndex(
    (i) =>
      i.roomSlug === item.roomSlug &&
      i.checkIn === item.checkIn &&
      i.checkOut === item.checkOut &&
      i.adults === item.adults &&
      i.children === item.children
  );
  if (existing !== -1) {
    const next = [...items];
    next[existing] = item;
    saveCart(next);
  } else {
    saveCart([...items, item]);
  }
  return { ok: true };
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(): number {
  return getCart().length;
}