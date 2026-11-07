import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected, initDatabase } from "@/lib/db";
import { getRoomAvailability, recordLocalBooking } from "@/lib/inventory";
import { calculateStayPricing } from "@/lib/pricing";
import { getRoomBySlug } from "@/lib/rooms";
import {
  verifyAdminAuth,
  sanitizeText,
  isValidPhone,
  validateBookingDates,
  generateSecureId,
} from "@/lib/security";

/**
 * Walk-In / Front Desk Manual Booking API
 * Allows staff to immediately reserve or check-in a guest at the desk.
 */

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Staff authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const roomSlug = sanitizeText(body.roomSlug, 100);
    const guestName = sanitizeText(body.guestName || body.name, 120);
    const email = sanitizeText(body.email || "desk@hotelamil.com", 150).toLowerCase();
    const phone = sanitizeText(body.phone, 30);
    const checkIn = sanitizeText(body.checkIn, 12);
    const checkOut = sanitizeText(body.checkOut, 12);
    const adults = Math.max(1, Math.min(10, Number(body.adults) || 1));
    const children = Math.max(0, Math.min(10, Number(body.children) || 0));
    const childrenUnder8 = Math.max(0, Math.min(children, Number(body.childrenUnder8) || 0));
    const specialRequests = sanitizeText(body.specialRequests || "Front-desk walk-in", 500);
    const paymentMethod = sanitizeText(body.paymentMethod || "paid_cash", 50);
    const immediateCheckIn = Boolean(body.immediateCheckIn);

    if (!guestName || guestName.length < 2) {
      return NextResponse.json({ error: "Please provide guest name." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Please provide a valid 10-digit phone number." }, { status: 400 });
    }

    const dateVal = validateBookingDates(checkIn, checkOut);
    if (!dateVal.valid) {
      return NextResponse.json({ error: dateVal.error }, { status: 400 });
    }

    const room = getRoomBySlug(roomSlug);
    if (!room) {
      return NextResponse.json({ error: "Invalid room category." }, { status: 404 });
    }

    // Availability check
    await initDatabase();
    const availability = await getRoomAvailability(roomSlug, checkIn, checkOut);
    if (!availability || !availability.isAvailable) {
      return NextResponse.json(
        { error: `Room ${room.name} has no available units for these dates.` },
        { status: 409 }
      );
    }

    // Pricing calculation
    const pricingRes = calculateStayPricing({
      roomSlug,
      checkIn,
      checkOut,
      adults,
      children,
      childrenUnder8,
    });

    if (!pricingRes.success) {
      return NextResponse.json({ error: pricingRes.error }, { status: 400 });
    }
    const pricing = pricingRes.pricing;

    const bookingId = generateSecureId(`AH-DESK-${new Date().getFullYear()}`, 3);

    const status = immediateCheckIn ? "checked_in" : "confirmed";

    if (isDbConnected()) {
      await query(
        `INSERT INTO amil_bookings (
          id, room_slug, room_title, guest_name, email, phone,
          check_in, check_out, nights, adults, children, children_under_8,
          special_requests, payment_method, room_price, extra_person_total,
          total_amount, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          bookingId,
          room.slug,
          room.name,
          guestName,
          email,
          phone,
          checkIn,
          checkOut,
          pricing.nights,
          adults,
          children,
          childrenUnder8,
          specialRequests,
          paymentMethod,
          pricing.roomDailyPriceInclusive,
          pricing.extraPersonDailyPriceInclusive * pricing.extraPersons * pricing.nights,
          pricing.grandTotal,
          status,
        ]
      );
    }

    recordLocalBooking({
      roomSlug: room.slug,
      checkIn,
      checkOut,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Walk-in booking created successfully for ${guestName}.`,
        booking: {
          id: bookingId,
          guestName,
          roomName: room.name,
          checkIn,
          checkOut,
          status,
          totalAmount: pricing.grandTotal,
          paymentMethod,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Admin Walkin Booking Error]:", err);
    return NextResponse.json({ error: "Failed to create walk-in booking." }, { status: 500 });
  }
}
