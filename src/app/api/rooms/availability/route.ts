import { NextRequest, NextResponse } from "next/server";
import { getRoomAvailability, getAllRoomsAvailability, getMonthCalendarAvailability } from "@/lib/inventory";
import { validateBookingDates, checkRateLimit, sanitizeText } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many availability checks. Please wait a moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roomSlug = sanitizeText(searchParams.get("roomSlug") || "", 100);
    const monthParam = sanitizeText(searchParams.get("month") || "", 7); // e.g. 2026-11

    // Monthly Calendar Inventory Mode
    if (monthParam && roomSlug) {
      const parts = monthParam.split("-").map(Number);
      if (parts.length === 2 && parts[0] >= 2024 && parts[1] >= 1 && parts[1] <= 12) {
        const cal = await getMonthCalendarAvailability(roomSlug, parts[0], parts[1]);
        if (!cal) {
          return NextResponse.json({ error: "Room category not found." }, { status: 404 });
        }
        return NextResponse.json({
          roomSlug,
          year: parts[0],
          month: parts[1],
          totalRooms: cal.room.totalRooms,
          days: cal.days,
        });
      }
    }

    const checkIn = sanitizeText(searchParams.get("checkIn") || "", 12);
    const checkOut = sanitizeText(searchParams.get("checkOut") || "", 12);

    // If no dates provided, return error
    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Both checkIn and checkOut dates (YYYY-MM-DD), or roomSlug and month (YYYY-MM) are required." },
        { status: 400 }
      );
    }

    const dateVal = validateBookingDates(checkIn, checkOut);
    if (!dateVal.valid) {
      return NextResponse.json({ error: dateVal.error }, { status: 400 });
    }

    // Single room category check
    if (roomSlug) {
      const status = await getRoomAvailability(roomSlug, checkIn, checkOut);
      if (!status) {
        return NextResponse.json({ error: "Room category not found." }, { status: 404 });
      }
      return NextResponse.json({
        checkIn,
        checkOut,
        nights: dateVal.nights,
        availability: status,
      });
    }

    // All rooms category check
    const allStatuses = await getAllRoomsAvailability(checkIn, checkOut);
    return NextResponse.json({
      checkIn,
      checkOut,
      nights: dateVal.nights,
      rooms: allStatuses,
    });
  } catch (error) {
    console.error("[GET /api/rooms/availability Error]:", error);
    return NextResponse.json(
      { error: "Internal error checking room availability." },
      { status: 500 }
    );
  }
}
