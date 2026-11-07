import { NextRequest, NextResponse } from "next/server";
import { getRoomBySlug } from "@/lib/rooms";
import { query, isDbConnected, initDatabase } from "@/lib/db";
import { getRoomAvailability, recordLocalBooking } from "@/lib/inventory";
import { calculateStayPricing } from "@/lib/pricing";
import {
  checkRateLimit,
  sanitizeText,
  isValidEmail,
  isValidPhone,
  validateBookingDates,
  verifyAdminAuth,
  validateCsrfOrigin,
  generateSecureId,
} from "@/lib/security";

// In-memory fallback repository when DATABASE_URL is not yet provisioned
interface BookingRecord {
  id: string;
  roomSlug: string;
  roomTitle: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  childrenUnder8: number;
  specialRequests: string;
  paymentMethod: string;
  roomPrice: number;
  extraPersonTotal: number;
  subtotalBeforeTax: number;
  gstAmount: number;
  gstRate: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const memoryBookings: BookingRecord[] = [];

// Initialize DB schema once on first request if DB is connected
let dbInitialized = false;

async function ensureDbInit() {
  if (!dbInitialized && isDbConnected()) {
    dbInitialized = await initDatabase();
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF Defense
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "Cross-site request blocked." },
        { status: 403 }
      );
    }

    // 2. Rate Limiting Protection (Anti-DoS / Anti-spam)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip, 15, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before attempting another booking." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // 3. Extract and Sanitize Inputs
    const roomSlug = sanitizeText(body.roomSlug, 100);
    const guestName = sanitizeText(body.name, 120);
    const email = sanitizeText(body.email, 150).toLowerCase();
    const phone = sanitizeText(body.phone, 30);
    const checkIn = sanitizeText(body.checkIn, 12);
    const checkOut = sanitizeText(body.checkOut, 12);
    const adults = Math.max(1, Math.min(10, Number(body.adults) || 1));
    const children = Math.max(0, Math.min(10, Number(body.children) || 0));
    const childrenUnder8 = Math.max(0, Math.min(children, Number(body.childrenUnder8) || 0));
    const specialRequests = sanitizeText(body.specialRequests || "", 800);
    const paymentMethod = body.paymentMethod === "online" ? "online" : "pay_at_hotel";

    // 4. Validation
    if (!guestName || guestName.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit phone or mobile number." },
        { status: 400 }
      );
    }

    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      return NextResponse.json({ error: dateValidation.error }, { status: 400 });
    }
    const nights = dateValidation.nights;

    const room = getRoomBySlug(roomSlug);
    if (!room) {
      return NextResponse.json({ error: "Selected room category is invalid." }, { status: 404 });
    }

    // 5. Concurrency Check: Real-time Double Booking Defense
    await ensureDbInit();
    const availability = await getRoomAvailability(roomSlug, checkIn, checkOut);
    if (!availability || !availability.isAvailable) {
      return NextResponse.json(
        {
          error: `Sorry, ${room.name} has no available rooms remaining for the selected dates (${checkIn} to ${checkOut}). Please select other dates or explore another room category.`,
          code: "ROOM_SOLD_OUT",
        },
        { status: 409 }
      );
    }

    // 6. Certified Indian Hotel GST Pricing Engine
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

    // Unique Cryptographically Secure Booking Reference ID: AH-YEAR-RANDOM
    const bookingId = generateSecureId(`AH-${new Date().getFullYear()}`, 3);

    const newBooking: BookingRecord = {
      id: bookingId,
      roomSlug: room.slug,
      roomTitle: room.name,
      guestName,
      email,
      phone,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      childrenUnder8,
      specialRequests,
      paymentMethod,
      roomPrice: pricing.roomDailyPriceInclusive,
      extraPersonTotal: pricing.extraPersonDailyPriceInclusive * pricing.extraPersons * nights,
      subtotalBeforeTax: pricing.subtotalBeforeTax,
      gstAmount: pricing.totalGst,
      gstRate: pricing.gstRatePercent,
      totalAmount: pricing.grandTotal,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // 7. Persist to PostgreSQL and mirror to memory inventory
    if (isDbConnected()) {
      try {
        await query(
          `INSERT INTO amil_bookings (
            id, room_slug, room_title, guest_name, email, phone,
            check_in, check_out, nights, adults, children, children_under_8,
            special_requests, payment_method, room_price, extra_person_total,
            total_amount, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            newBooking.id,
            newBooking.roomSlug,
            newBooking.roomTitle,
            newBooking.guestName,
            newBooking.email,
            newBooking.phone,
            newBooking.checkIn,
            newBooking.checkOut,
            newBooking.nights,
            newBooking.adults,
            newBooking.children,
            newBooking.childrenUnder8,
            newBooking.specialRequests,
            newBooking.paymentMethod,
            newBooking.roomPrice,
            newBooking.extraPersonTotal,
            newBooking.totalAmount,
            newBooking.status,
          ]
        );
      } catch (dbErr) {
        console.error("[PostgreSQL Booking Insert Error]:", dbErr);
        memoryBookings.unshift(newBooking);
      }
    } else {
      memoryBookings.unshift(newBooking);
    }

    // Mirror to inventory tracker so concurrent requests immediately see one fewer room
    recordLocalBooking({
      roomSlug: newBooking.roomSlug,
      checkIn: newBooking.checkIn,
      checkOut: newBooking.checkOut,
      status: newBooking.status,
    });

    return NextResponse.json(
      {
        success: true,
        booking: newBooking,
        pricing,
        message: "Your booking at Hotel Amil has been successfully confirmed!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/bookings Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your reservation." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * Strictly Protected:
 * - Hotel staff / Admin: can list bookings with Bearer auth or admin session cookie.
 * - Guest: can ONLY query their own single booking by providing BOTH 'id' AND 'email' (or 'phone').
 * - Public bulk querying without credentials is categorically rejected (401 Unauthorized).
 */
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`bookings-get:${ip}`, 30, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lookupId = sanitizeText(searchParams.get("id") || "", 64);
    const lookupEmail = sanitizeText(searchParams.get("email") || "", 150).toLowerCase();
    const lookupPhone = sanitizeText(searchParams.get("phone") || "", 30);

    // Case 1: Individual Guest Booking Lookup (e.g. checking status with Booking ID + Email/Phone)
    if (lookupId && (lookupEmail || lookupPhone)) {
      await ensureDbInit();

      if (isDbConnected()) {
        const rows = await query<any>(
          `SELECT 
            id, room_slug AS "roomSlug", room_title AS "roomTitle", guest_name AS "guestName",
            email, phone, check_in AS "checkIn", check_out AS "checkOut", nights,
            adults, children, children_under_8 AS "childrenUnder8", special_requests AS "specialRequests",
            payment_method AS "paymentMethod", room_price AS "roomPrice", extra_person_total AS "extraPersonTotal",
            total_amount AS "totalAmount", status, created_at AS "createdAt"
          FROM amil_bookings 
          WHERE id = $1 AND (LOWER(email) = $2 OR phone = $3)
          LIMIT 1`,
          [lookupId, lookupEmail, lookupPhone]
        );

        if (rows.length > 0) {
          return NextResponse.json({ booking: rows[0] });
        }
      } else {
        const found = memoryBookings.find(
          (b) =>
            b.id === lookupId &&
            (b.email.toLowerCase() === lookupEmail || b.phone === lookupPhone)
        );
        if (found) {
          return NextResponse.json({ booking: found });
        }
      }

      return NextResponse.json(
        { error: "No matching booking found for the provided reference and contact details." },
        { status: 404 }
      );
    }

    // Case 2: Administrative Bulk Access (Requires Valid Admin Auth)
    const isAdmin = verifyAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Access Denied. Administrative or staff credentials required to view reservation records.",
        },
        { status: 401 }
      );
    }

    await ensureDbInit();

    if (isDbConnected()) {
      const rows = await query<any>(
        `SELECT 
          id, room_slug AS "roomSlug", room_title AS "roomTitle", guest_name AS "guestName",
          email, phone, check_in AS "checkIn", check_out AS "checkOut", nights,
          adults, children, children_under_8 AS "childrenUnder8", special_requests AS "specialRequests",
          payment_method AS "paymentMethod", room_price AS "roomPrice", extra_person_total AS "extraPersonTotal",
          total_amount AS "totalAmount", status, created_at AS "createdAt"
        FROM amil_bookings 
        ORDER BY created_at DESC 
        LIMIT 100`
      );
      return NextResponse.json({ bookings: rows });
    }

    return NextResponse.json({ bookings: memoryBookings });
  } catch (error) {
    console.error("[GET /api/bookings Error]:", error);
    return NextResponse.json(
      { error: "Internal server error fetching bookings." },
      { status: 500 }
    );
  }
}

