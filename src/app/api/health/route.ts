import { NextResponse } from "next/server";
import { isDbConnected, query } from "@/lib/db";

export async function GET() {
  const dbConnected = isDbConnected();
  let dbStatus = "Not Configured (Operating in Memory Fallback)";
  let totalBookings = 0;

  if (dbConnected) {
    try {
      const res = await query<{ count: string }>(
        "SELECT COUNT(*) AS count FROM amil_bookings"
      );
      dbStatus = "Connected (PostgreSQL)";
      totalBookings = parseInt(res[0]?.count || "0", 10);
    } catch (e: any) {
      dbStatus = `Connection Error: ${e.message || "Failed to query"}`;
    }
  }

  return NextResponse.json({
    status: "ok",
    hotel: "Hotel Amil, Rajapalayam",
    database: {
      type: "PostgreSQL",
      status: dbStatus,
      totalBookings,
    },
    timestamp: new Date().toISOString(),
  });
}
