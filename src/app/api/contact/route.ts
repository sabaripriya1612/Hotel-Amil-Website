import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected, initDatabase } from "@/lib/db";
import {
  checkRateLimit,
  sanitizeText,
  isValidEmail,
  isValidPhone,
  validateCsrfOrigin,
} from "@/lib/security";

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
        { error: "Cross-site submission blocked." },
        { status: 403 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const name = sanitizeText(body.name, 100);
    const email = sanitizeText(body.email, 150).toLowerCase();
    const phone = sanitizeText(body.phone || "", 30);
    const subject = sanitizeText(body.subject || "General Inquiry", 150);
    const message = sanitizeText(body.message, 2000);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Phone number is not valid. Please provide a 10-digit number." },
        { status: 400 }
      );
    }
    if (!message || message.length < 5) {
      return NextResponse.json(
        { error: "Please write a message with at least 5 characters." },
        { status: 400 }
      );
    }

    const inquiryId = `MSG-${Date.now().toString(36).toUpperCase()}`;

    await ensureDbInit();

    if (isDbConnected()) {
      await query(
        `INSERT INTO amil_contact_inquiries (id, guest_name, email, phone, subject, message, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [inquiryId, name, email, phone, subject, message, "new"]
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been received. Our concierge will contact you shortly.",
        id: inquiryId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/contact Error]:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please contact us directly at our phone number." },
      { status: 500 }
    );
  }
}
