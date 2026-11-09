"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { rooms } from "@/lib/rooms";
import { todayISO, addDaysISO, formatCurrency } from "@/lib/format";

interface BookingItem {
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
  specialRequests?: string;
  paymentMethod: string;
  roomPrice: number;
  extraPersonTotal: number;
  totalAmount: number;
  status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
  createdAt: string;
}

interface BlockItem {
  id: string;
  roomSlug: string;
  blockedFrom: string;
  blockedTo: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication & Loading state
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"reservations" | "walkin" | "inventory">("reservations");
  
  // Data state
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Walk-in form state
  const [walkin, setWalkin] = useState({
    guestName: "",
    phone: "",
    email: "",
    roomSlug: rooms[0].slug,
    checkIn: todayISO(),
    checkOut: addDaysISO(todayISO(), 1),
    adults: 2,
    children: 0,
    specialRequests: "",
    paymentMethod: "paid_cash",
    immediateCheckIn: true,
  });
  const [walkinLoading, setWalkinLoading] = useState(false);
  const [walkinNotice, setWalkinNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Block form state
  const [blockForm, setBlockForm] = useState({
    roomSlug: rooms[0].slug,
    blockedFrom: todayISO(),
    blockedTo: addDaysISO(todayISO(), 2),
    reason: "Preventive AC Maintenance",
  });
  const [blockLoading, setBlockLoading] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [resBookings, resBlocks] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/blocks"),
      ]);

      if (resBookings.ok) {
        const data = await resBookings.json();
        setBookings(data.bookings || []);
      }
      if (resBlocks.ok) {
        const data = await resBlocks.json();
        setBlocks(data.blocks || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Verify Auth on mount
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setAuthChecked(true);
          loadDashboardData();
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router, loadDashboardData]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  // Status Update Handler
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
        );
        setActionNotice(`Reservation ${id} updated to ${newStatus.replace("_", " ")}`);
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch {
      alert("Failed to update status. Please try again.");
    }
  };

  // Walk-in form submit
  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkinLoading(true);
    setWalkinNotice(null);

    try {
      const res = await fetch("/api/admin/bookings/walkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(walkin),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWalkinNotice({
          type: "success",
          msg: `Walk-in confirmed! Booking Reference: ${data.booking.id}`,
        });
        setWalkin({
          guestName: "",
          phone: "",
          email: "",
          roomSlug: rooms[0].slug,
          checkIn: todayISO(),
          checkOut: addDaysISO(todayISO(), 1),
          adults: 2,
          children: 0,
          specialRequests: "",
          paymentMethod: "paid_cash",
          immediateCheckIn: true,
        });
        loadDashboardData();
      } else {
        setWalkinNotice({
          type: "error",
          msg: data.error || "Failed to create walk-in reservation.",
        });
      }
    } catch {
      setWalkinNotice({ type: "error", msg: "Network error occurred." });
    } finally {
      setWalkinLoading(false);
    }
  };

  // Block submit handler
  const handleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockLoading(true);

    try {
      const res = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blockForm),
      });

      if (res.ok) {
        loadDashboardData();
        alert("Room maintenance block added successfully.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add block.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setBlockLoading(false);
    }
  };

  // Remove block handler
  const handleRemoveBlock = async (id: string) => {
    if (!confirm("Are you sure you want to release this maintenance block?")) return;
    try {
      const res = await fetch(`/api/admin/blocks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlocks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch {
      alert("Failed to remove block.");
    }
  };

  // Computed KPIs
  const kpis = useMemo(() => {
    const total = bookings.length;
    const inHouse = bookings.filter((b) => b.status === "checked_in").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const completed = bookings.filter((b) => b.status === "checked_out").length;
    return { total, inHouse, confirmed, completed };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        b.guestName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, search]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-sm font-medium">
        Checking front desk authorization...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight font-display">Hotel Amil</h1>
                <span className="rounded-full bg-maroon-50 border border-maroon-200/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-maroon-800">
                  Front Desk Operations
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Rajapalayam, Tamil Nadu · Administrative Console</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-slate-500">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.451a.75.75 0 000-1.5H4.5a.75.75 0 00-.75.75v3.75a.75.75 0 001.5 0v-2.19l.524.523a7 7 0 0011.713-3.138.75.75 0 00-1.425-.499zM4.688 8.576a5.5 5.5 0 019.201-2.466l.312.311H11.75a.75.75 0 000 1.5h3.75a.75.75 0 00.75-.75V3.5a.75.75 0 00-1.5 0v2.19l-.524-.523A7 7 0 002.513 8.305a.75.75 0 001.425.499z" clipRule="evenodd" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {actionNotice && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-xs">
            {actionNotice}
          </div>
        )}

        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Reservations
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{kpis.total}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              In-House Guests
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600">{kpis.inHouse}</p>
          </div>
          <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Upcoming Arrivals
            </p>
            <p className="mt-2 text-3xl font-extrabold text-amber-600">{kpis.confirmed}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Departed / Checked Out
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-700">{kpis.completed}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="mt-8 flex border-b border-slate-200 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`border-b-2 px-5 py-3 transition cursor-pointer ${
              activeTab === "reservations"
                ? "border-maroon-800 text-maroon-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Reservations Rack ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("walkin")}
            className={`border-b-2 px-5 py-3 transition cursor-pointer ${
              activeTab === "walkin"
                ? "border-maroon-800 text-maroon-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            New Walk-In Entry
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`border-b-2 px-5 py-3 transition cursor-pointer ${
              activeTab === "inventory"
                ? "border-maroon-800 text-maroon-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Room Fleet &amp; Maintenance ({blocks.length} Blocks)
          </button>
        </div>

        {/* TAB 1: RESERVATIONS RACK */}
        {activeTab === "reservations" && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search guest name, phone, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-1.5">
                {["all", "confirmed", "checked_in", "checked_out", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                      statusFilter === st
                        ? "bg-maroon-800 text-white font-bold shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-slate-500 font-medium">
                Loading reservations...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-xs">
                <p className="text-sm text-slate-500">No reservations found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="mt-3 text-xs font-semibold text-maroon-800 underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-4 py-3.5">Ref / Guest</th>
                      <th className="px-4 py-3.5">Room</th>
                      <th className="px-4 py-3.5">Dates</th>
                      <th className="px-4 py-3.5">Occupants</th>
                      <th className="px-4 py-3.5">Amount</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-3.5">
                          <p className="font-mono font-bold text-maroon-900">{b.id}</p>
                          <p className="font-semibold text-slate-900">{b.guestName}</p>
                          <p className="text-[11px] text-slate-500">{b.phone}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-900">{b.roomTitle || b.roomSlug}</p>
                          <p className="text-[11px] text-slate-500">
                            {b.paymentMethod === "online" ? "Online Paid" : "Pay at Hotel"}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="font-medium text-slate-900">
                            {b.checkIn} → {b.checkOut}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {b.nights} night{b.nights > 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-slate-800">
                            {b.adults} Adult{b.adults > 1 ? "s" : ""}
                          </p>
                          {b.children > 0 && (
                            <p className="text-[11px] text-slate-500">{b.children} Child(ren)</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="font-bold text-slate-900">
                            {formatCurrency(Number(b.totalAmount))}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              b.status === "confirmed"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : b.status === "checked_in"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : b.status === "checked_out"
                                ? "bg-slate-100 text-slate-700 border border-slate-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {b.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => updateStatus(b.id, "checked_in")}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                            >
                              Check In
                            </button>
                          )}
                          {b.status === "checked_in" && (
                            <button
                              onClick={() => updateStatus(b.id, "checked_out")}
                              className="rounded-lg bg-slate-700 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
                            >
                              Check Out
                            </button>
                          )}
                          {b.status !== "cancelled" && b.status !== "checked_out" && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel reservation ${b.id}?`)) {
                                  updateStatus(b.id, "cancelled");
                                }
                              }}
                              className="ml-2.5 text-[11px] font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WALK-IN BOOKING ENTRY */}
        {activeTab === "walkin" && (
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 font-display">Create Walk-In / Phone Reservation</h2>
            <p className="mt-1 text-xs text-slate-500">
              Immediately books a room into inventory, issues instant confirmation, and allocates room keys.
            </p>

            {walkinNotice && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs font-semibold ${
                  walkinNotice.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {walkinNotice.msg}
              </div>
            )}

            <form onSubmit={handleWalkinSubmit} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={walkin.guestName}
                    onChange={(e) => setWalkin({ ...walkin, guestName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={walkin.phone}
                    onChange={(e) => setWalkin({ ...walkin, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={walkin.email}
                  onChange={(e) => setWalkin({ ...walkin, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="font-bold text-slate-700">Room Category *</label>
                  <select
                    value={walkin.roomSlug}
                    onChange={(e) => setWalkin({ ...walkin, roomSlug: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  >
                    {rooms.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.name} ({formatCurrency(r.price)}/nt)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Check-in Date *</label>
                  <input
                    type="date"
                    required
                    value={walkin.checkIn}
                    onChange={(e) => setWalkin({ ...walkin, checkIn: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Check-out Date *</label>
                  <input
                    type="date"
                    required
                    value={walkin.checkOut}
                    onChange={(e) => setWalkin({ ...walkin, checkOut: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="font-bold text-slate-700">Adults</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={walkin.adults}
                    onChange={(e) => setWalkin({ ...walkin, adults: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Children</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={walkin.children}
                    onChange={(e) => setWalkin({ ...walkin, children: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-slate-700">Payment Collection *</label>
                  <select
                    value={walkin.paymentMethod}
                    onChange={(e) => setWalkin({ ...walkin, paymentMethod: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                  >
                    <option value="paid_cash">Cash Collected at Desk</option>
                    <option value="paid_upi">UPI / GPay / PhonePe Paid</option>
                    <option value="paid_card">Card Swiped (POS)</option>
                    <option value="pay_at_checkout">Pay at Checkout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Special Notes / Room Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Ground floor preferred, extra towel"
                  value={walkin.specialRequests}
                  onChange={(e) => setWalkin({ ...walkin, specialRequests: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="immediateCheckIn"
                  checked={walkin.immediateCheckIn}
                  onChange={(e) => setWalkin({ ...walkin, immediateCheckIn: e.target.checked })}
                  className="rounded border-slate-300 text-maroon-800 focus:ring-maroon-800 cursor-pointer"
                />
                <label htmlFor="immediateCheckIn" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Mark guest as Checked In immediately upon saving
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={walkinLoading}
                  className="w-full rounded-xl bg-maroon-800 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-maroon-900 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {walkinLoading ? "Processing Walk-in..." : "Confirm & Save Walk-In Reservation →"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: INVENTORY & MAINTENANCE BLOCKS */}
        {activeTab === "inventory" && (
          <div className="mt-6 space-y-8">
            {/* Physical Inventory Overview */}
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">Physical Room Fleet &amp; Capacity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live availability across all 5 hotel room categories.</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
                {rooms.map((r) => {
                  const activeBlocksForRoom = blocks.filter((b) => b.roomSlug === r.slug).length;
                  return (
                    <div
                      key={r.slug}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                    >
                      <p className="text-xs font-bold text-slate-700">{r.name}</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{r.totalRooms}</p>
                      <p className="text-[11px] text-slate-500">Total Units in Fleet</p>
                      {activeBlocksForRoom > 0 && (
                        <span className="mt-2 inline-block rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          {activeBlocksForRoom} Blackout Block{activeBlocksForRoom > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Block Creation Form & List */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 font-display">Schedule Maintenance Blackout Block</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Takes a room offline for cleaning, AC service, or repair so guests cannot book it online.
                </p>

                <form onSubmit={handleBlockSubmit} className="mt-5 space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Room Category</label>
                    <select
                      value={blockForm.roomSlug}
                      onChange={(e) => setBlockForm({ ...blockForm, roomSlug: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                    >
                      {rooms.map((r) => (
                        <option key={r.slug} value={r.slug}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700">From Date</label>
                      <input
                        type="date"
                        value={blockForm.blockedFrom}
                        onChange={(e) => setBlockForm({ ...blockForm, blockedFrom: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">To Date</label>
                      <input
                        type="date"
                        value={blockForm.blockedTo}
                        onChange={(e) => setBlockForm({ ...blockForm, blockedTo: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Reason</label>
                    <input
                      type="text"
                      value={blockForm.reason}
                      onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-maroon-800 focus:ring-1 focus:ring-maroon-800/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={blockLoading}
                    className="w-full rounded-xl bg-maroon-800 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-maroon-900 transition active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    {blockLoading ? "Applying Block..." : "Apply Blackout Block"}
                  </button>
                </form>
              </div>

              {/* Active Blocks */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 font-display">Active Room Blackouts ({blocks.length})</h3>
                {blocks.length === 0 ? (
                  <p className="mt-8 text-center text-xs text-slate-400">
                    No active maintenance blocks. All rooms are available for online booking.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {blocks.map((blk) => (
                      <div
                        key={blk.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3.5"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{blk.roomSlug}</p>
                          <p className="text-[11px] text-amber-800 font-semibold">
                            {blk.blockedFrom} → {blk.blockedTo}
                          </p>
                          <p className="text-[11px] text-slate-500">{blk.reason}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveBlock(blk.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition cursor-pointer"
                        >
                          Release Block
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
