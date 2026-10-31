# Hotel Amil Website — Master Project Handoff & Continuity Brief

> **Purpose**: This document contains complete context, architectural state, known vulnerabilities, and the module-by-module execution roadmap. If a chat session expires or tokens run out, paste the prompt below into a new chat to immediately resume work.

---

## 📋 Quick Copy-Paste Prompt for New Chat

```markdown
I am continuing the development of the "Hotel Amil" website (Hotel in Rajapalayam, Tamil Nadu, India).
Read `PROJECT-HANDOFF.md` and `BUILD-CHECKLIST.md` in the project root to understand the full context.

### Current Tech Stack
- Next.js 16.4.2 (App Router) + React 19.2.4 + TypeScript 5 + Tailwind CSS v4
- Database driver: `pg` (PostgreSQL connection pool in `src/lib/db.ts`)
- Design: Maroon (#7b1626) & Gold (#d9a441), Lucida Calligraphy headings

### What is Already Built
- Complete frontend UI: Home (Hero Slider), Rooms (`/rooms`, `/rooms/[slug]` with 360° viewer), Facilities, Gallery, Attractions, Blog, Policy, Contact
- Booking cart, Guest details form, Demo Checkout & Confirmation
- Security headers in `next.config.ts`

### Critical Issues That Need Immediate Attention
1. SECURITY LEAK: `GET /api/bookings` in `src/app/api/bookings/route.ts` is unauthenticated and exposes guest PII (name, phone, email, amount) to anyone. Needs admin protection immediately.
2. DATA SPLIT: System has an in-memory fallback (`memoryBookings`) and raw SQL `pg` pool without an ORM (Prisma/Drizzle) or verified migrations.
3. NO INVENTORY LOCK: No concurrency control / double-booking prevention.
4. NO PAYMENT GATEWAY: Checkout is simulated; needs Razorpay (UPI/Cards) + HMAC webhook validation.
5. NO ADMIN DASHBOARD: Hotel front-desk staff have no portal to manage check-ins, check-outs, room statuses, or walk-ins.

### What We Have Completed
- Module 1 (Security Hardening & DB Foundation):
  * Eliminated critical PII data leak on `GET /api/bookings` with timing-safe admin authorization (`verifyAdminAuth`)
  * Guest lookup secured: guests can only query reservations with both `id` AND (`email` or `phone`)
  * CSRF origin defense added to all mutating routes
  * DB schema expanded with `amil_admin_users` and `amil_inventory_blocks`
  * Safe environment secrets configured in `.env` and `.env.example`
  * Production build tested & passed (code 0, 34 routes)
- Module 2 (Booking Engine, Inventory Locking & GST):
  * Created concurrency-safe inventory manager (`src/lib/inventory.ts`)
  * Server-side double booking prevention in `POST /api/bookings` (rejects with 409 Conflict if sold out)
  * Indian Hotel GST Pricing Engine (`src/lib/pricing.ts`) with 12%/18% tiers, SAC 9963, CGST + SGST
  * Fast availability API endpoint (`GET /api/rooms/availability`)
  * Real-time server inventory wired into `AvailabilitySearch.tsx` and `BookingWidget.tsx`
  * Production build tested & passed (code 0, 35 routes)

- Module 3 (Admin & Front-Desk Staff Dashboard):
  * Created `/admin/login` and `/admin` Front-Desk Control Center with `httpOnly` secure cookie sessions
  * Live KPIs: Total Bookings, In-House Guests, Upcoming Arrivals, Departed
  * Reservations rack with real-time search, filters, and one-click Check-In, Check-Out, and Cancel actions
  * Walk-in manual booking entry (`/api/admin/bookings/walkin`) with immediate check-in option
  * Room fleet & maintenance blackout block manager (`/api/admin/blocks`)
  * Created Next.js `robots.ts` blocking web crawlers from `/admin/` and `/api/`
  * Production build passed (code 0, 42 routes)

- Module 4 (Razorpay Payment Gateway & Webhook Signature Verification):
  * Created Razorpay payments engine (`src/lib/payments.ts`) with zero-cost developer simulation mode
  * Order creation endpoint (`POST /api/payments/razorpay/order`) with double-booking lock & server price calculation
  * Cryptographic HMAC-SHA256 signature verification endpoint (`POST /api/payments/razorpay/verify`)
  * Webhook receiver (`POST /api/payments/razorpay/webhook`) with `x-razorpay-signature` verification
  * Complete `/checkout` integration: UPI (GPay/PhonePe/Paytm), Cards, NetBanking, and Pay-at-Hotel
  * Production build passed (code 0, 45 routes)
- Frontend Enhancements & Brand Design:
  * Header updated with solid white background (`bg-white/98`) and `font-display` gold typography (`text-gold-600`) matching footer Quick Links.
  * Hero photo slides arranged in exact order: 1. `day front.png`, 2. `mainhall1.jpeg`, 3. `restrant.png`, 4. `duluxe2.jpeg`, 5. `hall.png`, 6. `day night.png`.
  * Check Availability box on the home page transformed to a white card identical to the rooms page, made compact and neatly aligned.
  * "Welcome to Our Haven" section updated with embedded YouTube video tour (`https://www.youtube-nocookie.com/embed/z4BrL1BRVtU`).
  * Section padding across the home page streamlined from `py-20 lg:py-28` to `py-10 lg:py-14` for cohesive spacing.
  * Admin / Front-Desk Login: Staff navigate to `/admin/login` and enter `ADMIN_API_KEY` (dev default: `amil-admin-dev-secret-2026`).

### What We Are Working on Next
- Module 5: Automated Email & PDF Booking Vouchers (Resend)
- Module 6: Hotel Operations (Dining/Banquet inquiry, reviews)
- Module 7: DPDP Act 2023 Compliance, SEO & Vercel Production Deployment

Please acknowledge this context and proceed with Module 5.
```

---

## 🏛️ Project Identity & Business Context
- **Business**: Hotel Amil
- **Location**: Rajapalayam, Tamil Nadu, India
- **Brand Colors**: 
  - Primary Maroon: `#7b1626`, Dark `#5c0f1c`, Deep `#3f0a13`
  - Accent Gold: `#d9a441`, Saffron `#e8912c`, Cream `#faf6ef`
- **Room Types**: Executive Single, Executive Double, Twin Executive, Deluxe, Family
- **Policies**: Check-in 12:00 PM, Check-out 11:00 AM, CP Plan (Complimentary Breakfast), Extra Person ₹1,050/night, Kids under 8 free.

---

## 📁 Key File Map
| Path | Description |
| :--- | :--- |
| `src/app/api/bookings/route.ts` | Bookings API (POST creates reservation, GET retrieves — needs auth!) |
| `src/lib/db.ts` | PostgreSQL client pool & schema definitions |
| `src/lib/security.ts` | Rate limiter, input sanitization, date/email/phone validators |
| `src/lib/rooms.ts` | Room catalog, tariffs, amenities, GST data |
| `src/app/checkout/page.tsx` | Checkout flow (online vs pay at hotel) |
| `src/components/rooms/EquirectViewer.tsx` | 360° Room equirectangular photo viewer |
| `next.config.ts` | Production HTTP security headers |

---

## 🔒 Security Checklist
- [ ] Fix unauthenticated `GET /api/bookings`
- [ ] Replace in-memory rate limiter with persistent / distributed rate limiter (Upstash Redis or DB-backed)
- [ ] Add Cloudflare Turnstile bot protection on booking and contact forms
- [ ] Implement CSRF tokens for state-changing POST requests
- [ ] Add Content-Security-Policy (CSP) with nonces in `next.config.ts`
- [ ] Enforce environment variables validation (`DATABASE_URL`, `ADMIN_SECRET`, etc.)
