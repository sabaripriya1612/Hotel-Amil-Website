"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError("Please enter your staff access key.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid staff access credentials.");
      }
    } catch {
      setError("Failed to connect to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100/80 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Hotel Amil
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#382314]">
            Front Desk &amp; Operations Portal
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your staff access key to manage reservations and room inventory.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Staff Security Key / Passcode
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your security access key"
              autoFocus
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#382314] focus:ring-2 focus:ring-[#382314]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#382314] py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#4A301D] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Verifying Credentials..." : "Sign In to Control Center →"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Hotel Amil, 237/1, Tenkasi Road, Rajapalayam, Tamil Nadu
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Authorized Staff Access Only · Protected by Rate Limiting &amp; Secure Sessions
          </p>
        </div>
      </div>
    </div>
  );
}
