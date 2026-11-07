import { NextRequest, NextResponse } from "next/server";
import {
  timingSafeEqual,
  verifyAdminAuth,
  sanitizeText,
  checkRateLimit,
  createAdminSessionToken,
} from "@/lib/security";

/**
 * Staff & Admin Authentication API
 * POST: Authenticate staff with passcode / admin key and issue httpOnly session cookie
 * GET: Verify if currently authenticated
 * DELETE: Log out and clear session cookie
 */

const SESSION_COOKIE_NAME = "amil_admin_session";

function getAdminSecret(): string {
  return process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET || "amil-admin-dev-secret-2026";
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting to prevent brute-force attacks on staff credentials
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`admin-login:${ip}`, 5, 60000);
    if (!rateCheck.allowed) {
      console.warn(`[Security Alert]: Brute-force rate limit exceeded for admin login from IP ${ip}`);
      return NextResponse.json(
        { error: "Too many failed login attempts. Please wait 60 seconds before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const key = sanitizeText(body.key || body.password || "", 100);
    const expectedSecret = getAdminSecret();

    if (!key) {
      return NextResponse.json({ error: "Please enter staff access key." }, { status: 400 });
    }

    // Verify key with constant-time equality
    if (!timingSafeEqual(key.trim(), expectedSecret)) {
      console.warn(`[Security Alert]: Failed admin authentication attempt from IP ${ip}`);
      return NextResponse.json(
        { error: "Invalid staff credentials. Access denied." },
        { status: 401 }
      );
    }

    // Generate cryptographically signed session token (does NOT expose raw secret in cookie)
    const sessionToken = createAdminSessionToken();

    // Create response with secure httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful. Welcome to Hotel Amil Front Desk.",
      user: {
        role: "admin",
        hotel: "Hotel Amil, Rajapalayam",
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[Admin Auth POST Error]:", err);
    return NextResponse.json({ error: "Authentication system error." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const isAuth = verifyAdminAuth(request);
  if (!isAuth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      role: "admin",
      hotel: "Hotel Amil, Rajapalayam",
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
