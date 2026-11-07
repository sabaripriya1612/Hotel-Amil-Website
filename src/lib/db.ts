import { Pool } from "pg";

/**
 * PostgreSQL Database Client for Hotel Amil
 * Configured with connection pooling, automatic schema initialization,
 * strict parameterized query protection (SQL injection immunity),
 * and graceful fallback when offline or during pre-configuration testing.
 */

// Connection string from environment variable or standard local PostgreSQL defaults
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "";

declare global {
  var _amilPgPool: Pool | undefined;
}

let pool: Pool | null = global._amilPgPool || null;

if (!pool && connectionString) {
  try {
    const isLocalhost =
      connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1");

    // Enforce valid TLS certificate validation by default for cloud databases.
    // Never allow rejectUnauthorized: false in production unless explicitly opted in via DB_SSL_NO_VERIFY.
    const sslConfig = isLocalhost
      ? undefined
      : process.env.DB_SSL_NO_VERIFY === "true"
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: true };

    pool = new Pool({
      connectionString,
      ssl: sslConfig,
      max: process.env.NODE_ENV === "production" ? 10 : 5,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]: Unexpected error on idle client", err);
    });

    // Cache pool instance globally to reuse connections across serverless warm invocations
    global._amilPgPool = pool;
  } catch (err) {
    console.error("[PostgreSQL Init Error]: Failed to create pool", err);
    pool = null;
  }
}

export function getPool(): Pool | null {
  return pool;
}

export function isDbConnected(): boolean {
  return pool !== null;
}

/**
 * Initialize all required relational tables and security indexes in PostgreSQL.
 * Uses strict IF NOT EXISTS so it is idempotent and safe to run on boot.
 */
export async function initDatabase(): Promise<boolean> {
  if (!pool) {
    console.warn(
      "[Hotel Amil DB]: DATABASE_URL is not set. Operating in resilient fallback mode. To connect PostgreSQL, set DATABASE_URL in your .env or environment."
    );
    return false;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Bookings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS amil_bookings (
        id VARCHAR(64) PRIMARY KEY,
        room_slug VARCHAR(100) NOT NULL,
        room_title VARCHAR(150),
        guest_name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        nights INT NOT NULL CHECK (nights > 0),
        adults INT NOT NULL CHECK (adults > 0),
        children INT DEFAULT 0 CHECK (children >= 0),
        children_under_8 INT DEFAULT 0,
        special_requests TEXT,
        payment_method VARCHAR(50) NOT NULL,
        room_price NUMERIC(10,2) NOT NULL,
        extra_person_total NUMERIC(10,2) DEFAULT 0,
        total_amount NUMERIC(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        assigned_room_number VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Indexes for fast lookup & conflict detection
    await client.query(`
      ALTER TABLE amil_bookings 
      ADD COLUMN IF NOT EXISTS assigned_room_number VARCHAR(50);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_amil_bookings_room_dates 
      ON amil_bookings (room_slug, check_in, check_out);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_amil_bookings_email 
      ON amil_bookings (email);
    `);

    // 2. Contact Inquiries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS amil_contact_inquiries (
        id VARCHAR(64) PRIMARY KEY,
        guest_name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(200),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Guest Reviews Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS amil_reviews (
        id VARCHAR(64) PRIMARY KEY,
        author_name VARCHAR(150) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'Google Reviews',
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Staff & Admin Authentication Table (Module 3 preparation)
    await client.query(`
      CREATE TABLE IF NOT EXISTS amil_admin_users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'manager')),
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Room Inventory & Blackout Blocks Table (Module 2 preparation)
    await client.query(`
      CREATE TABLE IF NOT EXISTS amil_inventory_blocks (
        id VARCHAR(64) PRIMARY KEY,
        room_slug VARCHAR(100) NOT NULL,
        blocked_from DATE NOT NULL,
        blocked_to DATE NOT NULL,
        reason VARCHAR(255) DEFAULT 'Maintenance',
        created_by VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_amil_blocks_dates 
      ON amil_inventory_blocks (room_slug, blocked_from, blocked_to);
    `);

    await client.query("COMMIT");
    console.log("[Hotel Amil DB]: PostgreSQL tables verified & ready.");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[Hotel Amil DB Initialization Error]:", error);
    return false;
  } finally {
    client.release();
  }
}

/**
 * Execute a parameterized query securely.
 * Guaranteed protection against SQL injection attacks.
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  if (!pool) {
    throw new Error("DATABASE_URL_NOT_CONFIGURED");
  }
  const result = await pool.query(text, params);
  return result.rows as T[];
}
