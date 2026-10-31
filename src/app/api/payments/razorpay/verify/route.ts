import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/payments";
import { query, isDbConnected, initDatabase } from "@/lib/db";
import { recordLocalBooking } from "@/lib/inventory";
import { calculateStayPricing } from "@/lib/pricing";
import { getRoomBySlug } from "@/lib/rooms";
import {
  sanitizeText,
  isValidEmail,
  isValidPhone,
  validateBookingDates,
  validateCsrfOrigin,
} from "@/lib/security";

/**
 * POST /api/payments/razorpay/verify
 * Cryptographically verifies Razorpay payment signature and writes confirmed reservation.
 */

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payment verification payload." }, { status: 400 });
    }

    const orderId = sanitizeText(body.razorpay_order_id, 100);
    const paymentId = sanitizeText(body.razorpay_payment_id, 100);
    const signature = sanitizeText(body.razorpay_signature, 255);

    // 1. Cryptographic HMAC Signature Verification
    const isValid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!isValid) {
      console.warn("[Razorpay Forgery Attempt]: Invalid signature for order:", orderId);
      return NextResponse.json(
        { error: "Payment verification failed. Cryptographic signature does not match." },
        { status: 400 }
      );
    }

    // 2. Extract and Validate Booking Details
    const b = body.booking || {};
    const roomSlug = sanitizeText(b.roomSlug, 100);
    const guestName = sanitizeText(b.name, 120);
    const email = sanitizeText(b.email, 150).toLowerCase();
    const phone = sanitizeText(b.phone, 30);
    const checkIn = sanitizeText(b.checkIn, 12);
    const checkOut = sanitizeText(b.checkOut, 12);
    const adults = Math.max(1, Math.min(10, Number(b.adults) || 1));
    const children = Math.max(0, Math.min(10, Number(b.children) || 0));
    const childrenUnder8 = Math.max(0, Math.min(children, Number(b.childrenUnder8) || 0));
    const specialRequests = sanitizeText(b.specialRequests || "", 800);

    if (!guestName || !isValidEmail(email) || !isValidPhone(phone)) {
      return NextResponse.json({ error: "Invalid guest contact details." }, { status: 400 });
    }

    const dateVal = validateBookingDates(checkIn, checkOut);
    if (!dateVal.valid) {
      return NextResponse.json({ error: dateVal.error }, { status: 400 });
    }

    const room = getRoomBySlug(roomSlug);
    if (!room) {
      return NextResponse.json({ error: "Invalid room category." }, { status: 404 });
    }

    // 3. Price calculation
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

    // 4. Create confirmed booking
    const bookingId = `AH-PAY-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    if (isDbConnected()) {
      await initDatabase();
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
          `razorpay:${paymentId}`,
          pricing.roomDailyPriceInclusive,
          pricing.extraPersonDailyPriceInclusive * pricing.extraPersons * pricing.nights,
          pricing.grandTotal,
          "confirmed",
        ]
      );
    }

    recordLocalBooking({
      roomSlug: room.slug,
      checkIn,
      checkOut,
      status: "confirmed",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully. Reservation confirmed!",
        booking: {
          id: bookingId,
          roomSlug: room.slug,
          roomTitle: room.name,
          guestName,
          email,
          phone,
          checkIn,
          checkOut,
          nights: pricing.nights,
          adults,
          children,
          childrenUnder8,
          paymentMethod: "online",
          paymentId,
          orderId,
          totalAmount: pricing.grandTotal,
          pricing,
          status: "confirmed",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Razorpay Verify Route Error]:", err);
    return NextResponse.json(
      { error: "Payment verification failed due to internal error." },
      { status: 500 }
    );
  }
}
