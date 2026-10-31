import { NextRequest, NextResponse } from "next/server";
import { getRoomAvailability, getAllRoomsAvailability } from "@/lib/inventory";
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
    const checkIn = sanitizeText(searchParams.get("checkIn") || "", 12);
    const checkOut = sanitizeText(searchParams.get("checkOut") || "", 12);
    const roomSlug = sanitizeText(searchParams.get("roomSlug") || "", 100);

    // If no dates provided, return general guidance or default
    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Both checkIn and checkOut dates (YYYY-MM-DD) are required." },
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
