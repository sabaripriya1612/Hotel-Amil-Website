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
}

// In-memory reservations mirror for environments without active PostgreSQL
// Exported so API route can sync it when needed
export interface OverlapBookingRef {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

const localBookingsMemory: OverlapBookingRef[] = [];

export function recordLocalBooking(booking: OverlapBookingRef) {
  localBookingsMemory.push(booking);
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
 * Check availability of a specific room category for a given date range.
 * Checks PostgreSQL if connected, otherwise falls back to memory store.
 */
export async function getRoomAvailability(
  roomSlug: string,
  checkIn: string,
  checkOut: string
): Promise<RoomAvailabilityStatus | null> {
  const room = getRoomBySlug(roomSlug);
  if (!room) return null;

  let bookedCount = 0;
  let blockedCount = 0;

  if (isDbConnected()) {
    try {
      await initDatabase();

      // 1. Count confirmed/active reservations overlapping this date range
      const bookingRes = await query<{ count: string }>(
        `SELECT COUNT(*) AS count 
         FROM amil_bookings 
         WHERE room_slug = $1 
           AND status != 'cancelled'
           AND check_in < $2 
           AND check_out > $3`,
        [roomSlug, checkOut, checkIn]
      );
      bookedCount = parseInt(bookingRes[0]?.count || "0", 10);

      // 2. Count maintenance/blackout blocks overlapping this date range
      const blockRes = await query<{ count: string }>(
        `SELECT COUNT(*) AS count 
         FROM amil_inventory_blocks 
         WHERE room_slug = $1 
           AND blocked_from < $2 
           AND blocked_to > $3`,
        [roomSlug, checkOut, checkIn]
      );
      blockedCount = parseInt(blockRes[0]?.count || "0", 10);
    } catch (err) {
      console.error("[Inventory Query Error]:", err);
      // Fall back to memory calculations on DB query error
      bookedCount = localBookingsMemory.filter(
        (b) =>
          b.roomSlug === roomSlug &&
          b.status !== "cancelled" &&
          areDatesOverlapping(b.checkIn, b.checkOut, checkIn, checkOut)
      ).length;
    }
  } else {
    // Memory fallback calculation
    bookedCount = localBookingsMemory.filter(
      (b) =>
        b.roomSlug === roomSlug &&
        b.status !== "cancelled" &&
        areDatesOverlapping(b.checkIn, b.checkOut, checkIn, checkOut)
    ).length;
  }

  const occupied = bookedCount + blockedCount;
  const availableRooms = Math.max(0, room.totalRooms - occupied);

  return {
    roomSlug: room.slug,
    roomName: room.name,
    totalRooms: room.totalRooms,
    bookedRooms: bookedCount,
    blockedRooms: blockedCount,
    availableRooms,
    isAvailable: availableRooms > 0,
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
