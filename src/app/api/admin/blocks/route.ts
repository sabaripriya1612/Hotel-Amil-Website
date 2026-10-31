import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected, initDatabase } from "@/lib/db";
import { verifyAdminAuth, sanitizeText, validateBookingDates } from "@/lib/security";
import { getRoomBySlug } from "@/lib/rooms";

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    if (isDbConnected()) {
      await initDatabase();
      const rows = await query<any>(
        `SELECT 
          id, 
          room_slug AS "roomSlug", 
          blocked_from AS "blockedFrom", 
          blocked_to AS "blockedTo", 
          reason, 
          created_by AS "createdBy", 
          created_at AS "createdAt"
         FROM amil_inventory_blocks
         ORDER BY blocked_from ASC`
      );
      return NextResponse.json({ blocks: rows });
    }
    return NextResponse.json({ blocks: [] });
  } catch (err) {
    console.error("[Admin GET /api/admin/blocks Error]:", err);
    return NextResponse.json({ error: "Failed to fetch room blocks." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const roomSlug = sanitizeText(body.roomSlug, 100);
    const blockedFrom = sanitizeText(body.blockedFrom, 12);
    const blockedTo = sanitizeText(body.blockedTo, 12);
    const reason = sanitizeText(body.reason || "Maintenance", 255);
    const createdBy = sanitizeText(body.createdBy || "Front Desk Staff", 100);

    const room = getRoomBySlug(roomSlug);
    if (!room) {
      return NextResponse.json({ error: "Invalid room category." }, { status: 404 });
    }

    const dateVal = validateBookingDates(blockedFrom, blockedTo);
    if (!dateVal.valid) {
      return NextResponse.json({ error: dateVal.error }, { status: 400 });
    }

    const blockId = `BLK-${Date.now().toString(36).toUpperCase()}`;

    if (isDbConnected()) {
      await initDatabase();
      await query(
        `INSERT INTO amil_inventory_blocks (id, room_slug, blocked_from, blocked_to, reason, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [blockId, roomSlug, blockedFrom, blockedTo, reason, createdBy]
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Maintenance blackout scheduled for ${room.name} from ${blockedFrom} to ${blockedTo}.`,
        block: {
          id: blockId,
          roomSlug,
          blockedFrom,
          blockedTo,
          reason,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Admin POST /api/admin/blocks Error]:", err);
    return NextResponse.json({ error: "Failed to create room block." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = sanitizeText(searchParams.get("id") || "", 64);
    if (!id) {
      return NextResponse.json({ error: "Block ID is required." }, { status: 400 });
    }

    if (isDbConnected()) {
      await initDatabase();
      await query(`DELETE FROM amil_inventory_blocks WHERE id = $1`, [id]);
    }

    return NextResponse.json({
      success: true,
      message: `Maintenance block ${id} removed. Room returned to active inventory.`,
    });
  } catch (err) {
    console.error("[Admin DELETE /api/admin/blocks Error]:", err);
    return NextResponse.json({ error: "Failed to delete block." }, { status: 500 });
  }
}
