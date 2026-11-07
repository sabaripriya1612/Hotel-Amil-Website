import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments";
import { query, isDbConnected, initDatabase } from "@/lib/db";

/**
 * POST /api/payments/razorpay/webhook
 * Receives automated payment status events from Razorpay.
 * Cryptographically verifies x-razorpay-signature before processing.
 */

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-razorpay-signature") || "";
    const rawBody = await request.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature." }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[Razorpay Webhook]: Invalid webhook signature rejected.");
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log(`[Razorpay Webhook Verified]: Event ${event.event} received.`);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      if (isDbConnected() && orderId) {
        await initDatabase();
        await query(
          `UPDATE amil_bookings 
           SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP
           WHERE payment_method LIKE $1`,
          [`%${orderId}%`]
        );
      }
    }

    return NextResponse.json({ status: "ok", received: true });
  } catch (err) {
    console.error("[Razorpay Webhook Error]:", err);
    return NextResponse.json({ error: "Webhook processing error." }, { status: 500 });
  }
}
