import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected, initDatabase } from "@/lib/db";
import { verifyAdminAuth, sanitizeText } from "@/lib/security";

/**
 * Admin Bookings Management API
 * GET: Retrieve bookings with filter and search
 * PATCH: Update booking status (e.g. check-in, check-out, cancel)
 */

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Staff authentication required." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = sanitizeText(searchParams.get("status") || "all", 20);
    const search = sanitizeText(searchParams.get("search") || "", 100);

    if (isDbConnected()) {
      await initDatabase();

      let sql = `
        SELECT 
          id, 
          room_slug AS "roomSlug", 
          room_title AS "roomTitle", 
          guest_name AS "guestName",
          email, 
          phone, 
          check_in AS "checkIn", 
          check_out AS "checkOut", 
          nights,
          adults, 
          children, 
          children_under_8 AS "childrenUnder8", 
          special_requests AS "specialRequests",
          payment_method AS "paymentMethod", 
          room_price AS "roomPrice", 
          extra_person_total AS "extraPersonTotal",
          total_amount AS "totalAmount", 
          status, 
          created_at AS "createdAt"
        FROM amil_bookings
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status !== "all") {
        params.push(status);
        sql += ` AND status = $${params.length}`;
      }

      if (search) {
        params.push(`%${search.toLowerCase()}%`);
        sql += ` AND (LOWER(guest_name) LIKE $${params.length} OR LOWER(id) LIKE $${params.length} OR phone LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`;
      }

      sql += ` ORDER BY created_at DESC LIMIT 200`;

      const rows = await query<any>(sql, params);
      return NextResponse.json({ bookings: rows });
    }

    // Fallback response for offline/pre-DB testing
    return NextResponse.json({ bookings: [] });
  } catch (err) {
    console.error("[Admin GET /api/admin/bookings Error]:", err);
    return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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

    const id = sanitizeText(body.id, 64);
    const status = sanitizeText(body.status, 30);

    const validStatuses = ["confirmed", "checked_in", "checked_out", "cancelled"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    if (isDbConnected()) {
      await initDatabase();
      await query(
        `UPDATE amil_bookings 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [status, id]
      );

      return NextResponse.json({
        success: true,
        message: `Reservation ${id} updated to ${status}.`,
        id,
        status,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Reservation ${id} status updated to ${status} (memory mode).`,
      id,
      status,
    });
  } catch (err) {
    console.error("[Admin PATCH /api/admin/bookings Error]:", err);
    return NextResponse.json({ error: "Failed to update reservation status." }, { status: 500 });
  }
}
