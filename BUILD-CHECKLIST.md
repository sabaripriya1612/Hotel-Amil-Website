# Hotel Amil Website — Build Checklist

> We update this file together after every major step. `[x]` = done, `[ ]` = still to do.
> How to run locally: `npm.cmd run dev` (use `npm.cmd`, not `npm`) → open http://localhost:3000

---

## Phase 0 — Planning (DONE)
- [x] 8 planning documents written in `docs/1` – `docs/8`
- [x] Requirements, tech stack, app flow, UI brief, backend scheme, plan, security, build guide

## Phase 1 — Front-end demo (DONE)
- [x] Next.js 16 + TypeScript + Tailwind v4 project set up in `amil-hotel/`
- [x] Design foundation originally navy/gold — re-skinned in Phase 1.5 to the maroon/gold brand theme
- [x] Real hotel data: rooms & prices, facilities, attractions, blog, reviews, gallery, policies
- [x] Home page (hero + availability search + rooms + facilities + gallery + reviews + blog + CTA)
- [x] Rooms listing with real-time availability (`/rooms`)
- [x] Room detail pages with live price breakdown & booking widget (`/rooms/[slug]`)
- [x] Booking cart → guest details → confirmation flow (demo, saved in browser)
- [x] Facilities listing + 8 facility detail pages
- [x] Gallery (filterable), Blog + 4 posts, Attractions, Contact (opens WhatsApp)
- [x] 8 of 9 security headers applied (CSP pending — production phase)
- [x] Lint clean, production build & all routes verified (all return 200)

## Phase 1.5 — Content approval & design revision (IN PROGRESS — your review needed)
- [x] Re-skin: replaced navy theme with the original brand palette (maroon #7b1626, dark #5c0f1c, deep #3f0a13; gold #d9a441; saffron #e8912c; cream #faf6ef)
- [x] Brand font: Lucida Calligraphy for headings/brand (system font, no download), Segoe UI body
- [x] Real logo.png in header & footer (copied from original site)
- [x] All 41 real photos copied into `public/images/` and wired across rooms, facilities, gallery, home
- [x] Home hero is now a rotating slider (5 photos, arrows, dots, touch swipe, auto-advance)
- [x] Room pages: main photo has a "Drag to see the room in 360°" viewer (drag-to-pan + zoom) + thumbnail strip
- [x] Swimming pool page: auto-changing main image + photo strip + Terms & Conditions below
- [x] Kings Bar, Banquet Hall, Restaurant pages: auto-changing image galleries
- [x] WhatsApp floating button (bottom-right) + all enquiry forms send via WhatsApp
- [x] Simple AI chatbot (bottom-left) answering rooms/food/pool/events FAQs with WhatsApp handoff
- [x] Lint clean, production build passes, all routes + images verified (200)
- [ ] You review the re-skinned site in the browser and list any fine-tuning (colors, copy, photos to swap)

## Phase 1.9 — Module 1: Security Hardening & Database Foundation (COMPLETED)
- [x] Fixed critical PII data leak: `GET /api/bookings` now strictly requires Bearer token or admin session
- [x] Guest single-booking lookup: Guests can only query their reservation by supplying both `id` AND (`email` or `phone`)
- [x] Cross-Site Request Forgery (CSRF) origin verification added to `POST /api/bookings` and `POST /api/contact`
- [x] Added timing-safe comparison (`timingSafeEqual`) to prevent timing side-channel attacks on secrets
- [x] Added DPDP-compliant PII masking utility (`maskPII`) for public display of guest records
- [x] Database schema expanded in `src/lib/db.ts` to include `amil_admin_users` and `amil_inventory_blocks`
- [x] Created secure `.env` and updated `.env.example` with `ADMIN_API_KEY`, `ADMIN_SESSION_SECRET`, and payment/email slots
- [x] Full production build verified (`npm.cmd run build` passed with zero errors, 34 static/dynamic routes)

## Phase 2 — Module 2: Booking Engine, Inventory Locking & GST (COMPLETED)
- [x] Concurrency-safe inventory deduction (`src/lib/inventory.ts` with real-time overlap checking)
- [x] Server-side double-booking prevention in `POST /api/bookings` (returns 409 Conflict if sold out)
- [x] Certified Indian Hotel GST tax calculator (`src/lib/pricing.ts` with 12% for ≤ ₹7,500, 18% for > ₹7,500, SAC 9963, CGST + SGST)
- [x] High-speed live availability API endpoint: `GET /api/rooms/availability`
- [x] Front-end real-time inventory synchronization in `AvailabilitySearch.tsx` and `BookingWidget.tsx`
- [x] Full production build passed (35 routes, 0 TypeScript/Turbopack errors)

## Phase 2.5 — Module 3: Admin & Front-Desk Staff Dashboard (COMPLETED)
- [x] Front-desk staff login portal (`/admin/login`) with secure httpOnly cookie session (`amil_admin_session`)
- [x] Central Front-Desk Control Center (`/admin`): live KPIs (Total, In-House, Upcoming Arrivals, Checked-Out)
- [x] Reservations Rack: real-time search (Name, Phone, Ref ID), status filters, instant Check-In/Check-Out/Cancel actions
- [x] Walk-In & Telephone reservation entry modal (`/api/admin/bookings/walkin`): direct front-desk booking with payment tracking
- [x] Room Maintenance & Blackout blocks manager (`/api/admin/blocks`): add/remove rooms from inventory for service/cleaning
- [x] App Router `robots.ts`: search engines instructed to index public hotel pages while strictly blocking `/admin/` and `/api/`
- [x] Full production build passed (42 static/dynamic routes, 0 errors)

## Phase 3 — Module 4: Payment Gateway & Webhook Verification (COMPLETED)
- [x] Built Razorpay payments engine (`src/lib/payments.ts`) with zero-cost developer simulation mode
- [x] Secure Order Creation endpoint (`POST /api/payments/razorpay/order`) with tamper-proof pricing & double-booking prevention
- [x] Cryptographic HMAC-SHA256 signature verification endpoint (`POST /api/payments/razorpay/verify`)
- [x] Automated Razorpay webhook receiver (`POST /api/payments/razorpay/webhook`) with `x-razorpay-signature` verification
- [x] Native Razorpay SDK dynamic checkout integration on `/checkout` supporting UPI (GPay, PhonePe, Paytm), Cards & NetBanking
- [x] Full production build passed (45 static/dynamic routes, 0 errors)

## Phase 3.2 — Frontend Design & Home Page Polish (COMPLETED)
- [x] Solid white navbar background (`bg-white`) with clean black typography (`text-black`)
- [x] Exact 6-slide hero order: 1. `day front.png`, 2. `mainhall1.jpeg`, 3. `restrant.png`, 4. `duluxe2.jpeg`, 5. `hall.png`, 6. `day night.png`
- [x] Availability search box on front page updated to clean white card identical to rooms page, made compact with proportional letters
- [x] Replaced "Welcome to Our Haven" static image with responsive YouTube video tour (`https://youtu.be/z4BrL1BRVtU`)
- [x] Streamlined section paddings from `py-20 lg:py-28` to `py-10 lg:py-14` across the front page for balanced vertical rhythm
- [x] Admin Login & Dashboard White Theme: Replaced dark theme with clean white professional theme (`bg-slate-50`), removed unwanted "HA" logos, added clear KPI cards, sleek reservation rack table, and intuitive walk-in/block controls

## Phase 3.5 — Module 5: Automated Email & PDF Booking Vouchers (NEXT)
- [ ] Email notification service via Resend (`src/lib/email.ts`)
- [ ] Branded HTML & printable PDF booking voucher with QR code, reference ID, and hotel directions
- [ ] Automated front-desk email & WhatsApp reservation alert to staff (`frontdesk@hotelamil.com`)
- [ ] Resend email confirmation on both Pay-at-Hotel and Online payments

## Phase 3 — Security completion (from docs/7-security-requirements.md)
- [ ] Content-Security-Policy header with nonces
- [ ] Rate limiting on all public forms & booking endpoints
- [ ] Google reCAPTCHA v3 / Turnstile on contact + booking forms
- [ ] File upload checks (MIME, size, random filenames) for admin gallery
- [ ] Booking ID as UUID (no sequential IDs), double-booking prevention
- [ ] `npm audit` passed, `eslint-plugin-security`, secret scanning
- [ ] Audit log for admin actions; booking history view with ref + email/phone
- [ ] Kids-below-8 & extra-person rules enforced server-side

## Phase 4 — Legal, SEO & analytics
- [ ] Privacy Policy page (DPDP Act 2023)
- [ ] Cookie consent banner for analytics
- [ ] `robots.txt` (block /admin, /staff, /api) + sitemap.xml
- [ ] Google Analytics 4 (anonymized IP) + Search Console verification
- [ ] Full SEO check: meta tags, Open Graph, alt text on all images
- [ ] Prefer real images replaced everywhere (removes placeholders)

## Phase 5 — Deployment (GO LIVE)
- [ ] Deploy to Vercel (production preview on hotelamil.com or subdomain)
- [ ] Custom domain + forced HTTPS + valid SSL
- [ ] Environment variables scoped per environment (never expose service-role key)
- [ ] Backup + point-in-time recovery enabled; restore test
- [ ] Post-deployment security scan (headers, payments sandbox → live keys)
- [ ] Search Console submit + sitemap

## Phase 6 — After launch (maintain)
- [ ] Uptime monitoring (UptimeRobot/Pingdom, 60s probe)
- [ ] Monthly: `npm audit`, dependency updates
- [ ] Quarterly: key rotation, backup restore drill, security review
- [ ] Respond to reviews; keep blog/gallery fresh

---

### Notes
- Current position: Phase 1 & the Phase 1.5 design revision are built and verified. Your browser review of the re-skin is the active step before Phase 2 (backend).
- The live hotelamil.com website is untouched — this project only runs on your machine.