import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments";
import { calculateStayPricing } from "@/lib/pricing";
import { getRoomAvailability } from "@/lib/inventory";
import {
  validateBookingDates,
  checkRateLimit,
  sanitizeText,
  validateCsrfOrigin,
} from "@/lib/security";

/**
 * POST /api/payments/razorpay/order
 * Creates an authorized Razorpay Order with tamper-proof server-side price calculation.
 */

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many payment requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const roomSlug = sanitizeText(body.roomSlug, 100);
    const checkIn = sanitizeText(body.checkIn, 12);
    const checkOut = sanitizeText(body.checkOut, 12);
    const adults = Math.max(1, Math.min(10, Number(body.adults) || 1));
    const children = Math.max(0, Math.min(10, Number(body.children) || 0));
    const childrenUnder8 = Math.max(0, Math.min(children, Number(body.childrenUnder8) || 0));

    // Date validation
    const dateVal = validateBookingDates(checkIn, checkOut);
    if (!dateVal.valid) {
      return NextResponse.json({ error: dateVal.error }, { status: 400 });
    }

    // Availability validation (double booking defense)
    const availability = await getRoomAvailability(roomSlug, checkIn, checkOut);
    if (!availability || !availability.isAvailable) {
      return NextResponse.json(
        { error: "This room is no longer available for the chosen dates." },
        { status: 409 }
      );
    }

    // Server-side price calculation (tamper-proof)
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

    const grandTotal = pricingRes.pricing.grandTotal;
    const receiptId = `RCP-${Date.now().toString(36).toUpperCase()}`;

    const orderResult = await createRazorpayOrder(grandTotal, receiptId, {
      roomSlug,
      checkIn,
      checkOut,
      nights: String(pricingRes.pricing.nights),
    });

    if (!orderResult.success) {
      return NextResponse.json(
        { error: orderResult.error || "Failed to create payment order." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderResult.orderId,
      amount: orderResult.amount, // in paise
      amountRupees: orderResult.amountRupees,
      currency: orderResult.currency,
      keyId: orderResult.keyId,
      isMock: orderResult.isMock,
      pricing: pricingRes.pricing,
    });
  } catch (err) {
    console.error("[Razorpay Order Route Error]:", err);
    return NextResponse.json(
      { error: "Internal server error initiating payment order." },
      { status: 500 }
    );
  }
}
