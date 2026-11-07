/**
 * Security and Defense Utilities for Hotel Amil
 * Provides protection against:
 * 1. Denial of Service (DoS) & API flooding via rate limiting
 * 2. Cross-Site Scripting (XSS) via strict input sanitization
 * 3. Parameter tampering (prices, dates, guest counts)
 * 4. SQL Injection (enforced via parameterized queries in db.ts)
 */

// In-Memory Rate Limiter (Sliding Window)
type RateLimitRecord = {
  timestamps: number[];
};

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 60000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * Check if a client IP has exceeded the allowed request limit within a window.
 * @param ip Client IP address or identifier
 * @param limit Max requests allowed in the window (default: 20 per minute)
 * @param windowMs Window in milliseconds (default: 60,000ms = 1 min)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 20,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { timestamps: [] };

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.timestamps.push(now);
  rateLimitMap.set(ip, record);

  return { allowed: true, remaining: limit - record.timestamps.length };
}

/**
 * Sanitize untrusted text to prevent XSS and malicious characters.
 */
export function sanitizeText(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "") // Strip raw HTML angle brackets
    .trim()
    .slice(0, maxLength);
}

/**
 * Strict Email validation using RFC 5322 standard pattern.
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email.length <= 254 && emailRegex.test(email);
}

/**
 * Phone number validation (accepts standard international and Indian mobile formats).
 */
export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== "string") return false;
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Date validation for hotel bookings:
 * - Must be valid ISO YYYY-MM-DD
 * - checkIn must not be in the distant past (allowing today in UTC/IST)
 * - checkOut must be after checkIn
 * - Max stay length <= 30 nights
 */
export function validateBookingDates(
  checkIn: string,
  checkOut: string
): { valid: boolean; nights: number; error?: string } {
  if (!checkIn || !checkOut) {
    return { valid: false, nights: 0, error: "Both check-in and check-out dates are required." };
  }

  const checkInDate = new Date(checkIn + "T00:00:00Z");
  const checkOutDate = new Date(checkOut + "T00:00:00Z");

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return { valid: false, nights: 0, error: "Invalid date format. Expected YYYY-MM-DD." };
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Allow today or future
  const oneDayBuffer = 24 * 60 * 60 * 1000;
  if (checkInDate.getTime() < today.getTime() - oneDayBuffer) {
    return { valid: false, nights: 0, error: "Check-in date cannot be in the past." };
  }

  const diffMs = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    return { valid: false, nights: 0, error: "Check-out date must be after check-in date." };
  }

  if (nights > 30) {
    return { valid: false, nights, error: "Reservations for more than 30 consecutive nights require contacting the hotel directly." };
  }

  return { valid: true, nights };
}

import crypto from "crypto";

/**
 * Generate a cryptographically secure random identifier.
 * Example: generateSecureId("AH-2026", 4) -> "AH-2026-A1B2C3D4"
 */
export function generateSecureId(prefix: string, bytes: number = 4): string {
  const random = crypto.randomBytes(bytes).toString("hex").toUpperCase();
  return prefix ? `${prefix}-${random}` : random;
}

/**
 * Generate an HMAC-signed session token for administrative users.
 * Avoids storing raw passwords or master API keys in browser cookies.
 */
export function createAdminSessionToken(): string {
  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_API_KEY ||
    "amil-session-fallback-secret-2026";
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", sessionSecret)
    .update(`admin:staff:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

/**
 * Verify an administrative session token.
 * Token format: timestamp.signature (valid for 7 days)
 */
export function verifyAdminSessionToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Max age: 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) return false;

  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_API_KEY ||
    "amil-session-fallback-secret-2026";

  const expectedSignature = crypto
    .createHmac("sha256", sessionSecret)
    .update(`admin:staff:${timestampStr}`)
    .digest("hex");

  return timingSafeEqual(signature, expectedSignature);
}

/**
 * Verify administrative authorization header or cookie.
 * Uses timing-safe comparison to prevent timing side-channel attacks.
 */
export function verifyAdminAuth(req: {
  headers: { get(name: string): string | null };
  cookies?: { get(name: string): { value: string } | undefined };
}): boolean {
  const adminSecret = process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET;
  if (!adminSecret || adminSecret.trim() === "") {
    // If not configured, deny admin access in production, allow default dev key in local dev
    if (process.env.NODE_ENV === "production") {
      return false;
    }
  }

  const effectiveSecret = adminSecret || "amil-admin-dev-secret-2026";

  // 1. Check Bearer Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (timingSafeEqual(token, effectiveSecret)) {
      return true;
    }
  }

  // 2. Check X-Admin-Key header
  const xAdminKey = req.headers.get("x-admin-key");
  if (xAdminKey && timingSafeEqual(xAdminKey.trim(), effectiveSecret)) {
    return true;
  }

  // 3. Check admin session cookie if available (supports HMAC signed token and legacy key)
  if (req.cookies) {
    const cookieToken = req.cookies.get("amil_admin_session")?.value;
    if (cookieToken) {
      if (verifyAdminSessionToken(cookieToken.trim())) {
        return true;
      }
      // Fallback check for direct key comparison (legacy)
      if (timingSafeEqual(cookieToken.trim(), effectiveSecret)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Constant-time string comparison to defend against timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validate request origin to defend against Cross-Site Request Forgery (CSRF).
 */
export function validateCsrfOrigin(req: {
  headers: { get(name: string): string | null };
}): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  // In non-browser or GET calls origin may be null
  if (!origin || !host) return true;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

/**
 * Mask Personally Identifiable Information (PII) to comply with DPDP Act 2023.
 */
export function maskPII(value: string, type: "email" | "phone" | "name"): string {
  if (!value) return "";
  if (type === "email") {
    const [name, domain] = value.split("@");
    if (!domain) return value;
    const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
    return `${maskedName}@${domain}`;
  }
  if (type === "phone") {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    return `******${digits.slice(-4)}`;
  }
  if (type === "name") {
    const parts = value.trim().split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return value;
}

