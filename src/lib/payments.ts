import crypto from "crypto";
import { timingSafeEqual } from "./security";

/**
 * Razorpay Payment Engine for Hotel Amil
 * Supports:
 * 1. Live & Sandbox Razorpay Orders API
 * 2. Cryptographic HMAC-SHA256 signature verification (prevent payment tampering)
 * 3. Graceful Developer Simulation Mode (when keys not yet provisioned, ₹0 testing)
 */

export interface RazorpayOrderResult {
  success: boolean;
  orderId: string;
  amount: number; // in paise (e.g. ₹3675 = 367500 paise)
  amountRupees: number;
  currency: string;
  keyId: string;
  isMock: boolean;
  error?: string;
}

export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(keyId && keySecret && keyId.trim() !== "" && keySecret.trim() !== "");
}

export function getRazorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID || "rzp_test_hotelamil_demo";
}

/**
 * Create a new Razorpay Order for a room reservation.
 * Amount must be in whole INR; will be converted to paise (amount * 100).
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  receiptId: string,
  notes?: Record<string, string>
): Promise<RazorpayOrderResult> {
  const amountInPaise = Math.round(amountInRupees * 100);
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // 1. Live / Test Mode with actual Razorpay Credentials
  if (keyId && keySecret) {
    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: receiptId,
          notes: notes || {},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("[Razorpay API Error]:", data);
        return {
          success: false,
          orderId: "",
          amount: amountInPaise,
          amountRupees: amountInRupees,
          currency: "INR",
          keyId,
          isMock: false,
          error: data.error?.description || "Failed to create Razorpay order.",
        };
      }

      return {
        success: true,
        orderId: data.id,
        amount: data.amount,
        amountRupees: amountInRupees,
        currency: data.currency,
        keyId,
        isMock: false,
      };
    } catch (err: any) {
      console.error("[Razorpay Order Exception]:", err);
      return {
        success: false,
        orderId: "",
        amount: amountInPaise,
        amountRupees: amountInRupees,
        currency: "INR",
        keyId,
        isMock: false,
        error: err.message || "Network error communicating with payment gateway.",
      };
    }
  }

  // 2. Developer Simulation Mode (Zero cost, instant sandbox for development)
  const mockOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    success: true,
    orderId: mockOrderId,
    amount: amountInPaise,
    amountRupees: amountInRupees,
    currency: "INR",
    keyId: "rzp_test_hotelamil_demo",
    isMock: true,
  };
}

/**
 * Verify payment signature returned from client browser.
 * Uses HMAC-SHA256: hmac_sha256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId || !signature) return false;

  // Allow mock payment verification in simulation mode
  if (orderId.startsWith("order_sim_")) {
    return signature.startsWith("sig_sim_") || signature.length >= 10;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    return timingSafeEqual(expectedSignature, signature);
  } catch (err) {
    console.error("[Razorpay Signature Verification Error]:", err);
    return false;
  }
}

/**
 * Verify Razorpay Webhook signature (x-razorpay-signature).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return false;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    return timingSafeEqual(expectedSignature, signature);
  } catch (err) {
    console.error("[Razorpay Webhook Verification Error]:", err);
    return false;
  }
}
