"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Enquiry",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    setApiError("");
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.phone.trim()) next.phone = "Please enter a phone number.";
    if (!form.message.trim()) next.message = "Please tell us how we can help.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (openWhatsApp: boolean) => {
    if (!validate()) return;
    setSending(true);
    setApiError("");

    try {
      // 1. Persist to PostgreSQL database via API route
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          subject: form.subject,
          message: form.message.trim(),
        }),
      });

      // 2. Open WhatsApp if requested
      if (openWhatsApp) {
        const text = [
          `*New enquiry · ${siteConfig.name}*`,
          `Name: ${form.name}`,
          `Phone: ${form.phone}`,
          form.email && `Email: ${form.email}`,
          `Subject: ${form.subject}`,
          `Message: ${form.message}`,
        ]
          .filter(Boolean)
          .join("\n");
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/${siteConfig.whatsapp}?text=${encoded}`, "_blank");
      }

      setSent(true);
    } catch {
      setApiError("Could not submit online. You can still reach us directly on WhatsApp or phone.");
    } finally {
      setSending(false);
    }
  };

  const fieldCls =
    "w-full rounded-xl border border-maroon-800/15 bg-white px-4 py-3 text-sm text-maroon-900 outline-none transition-colors focus:border-gold-500";

  if (sent) {
    return (
      <div className="rounded-2xl border border-maroon-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-maroon-900">
          Message Received &amp; Saved
        </h2>
        <p className="mt-2 text-sm text-muted">
          Your inquiry has been safely recorded in our hotel database. Our front desk concierge will
          get back to you on {form.phone} shortly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSent(false);
              setForm({
                name: "",
                phone: "",
                email: "",
                subject: "General Enquiry",
                message: "",
              });
            }}
          >
            Send Another Message
          </Button>
          <a
            href={`tel:${siteConfig.phones[0].replace(/\s/g, "")}`}
            className="rounded-full bg-maroon-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-900 inline-flex items-center"
          >
            Call Front Desk
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-maroon-100 bg-white p-6 sm:p-8 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(true);
      }}
    >
      <h2 className="font-display text-2xl font-semibold text-maroon-900">Send us a message</h2>
      <p className="mt-2 text-sm text-muted">
        Fill out this form to record your inquiry directly with Hotel Amil's reservations desk.
      </p>

      {apiError && (
        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
          {apiError}
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-maroon-900">Name *</label>
          <input
            className={fieldCls}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your full name"
            required
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-maroon-900">Phone *</label>
          <input
            className={fieldCls}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 98765 43210"
            required
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-maroon-900">
            Email (optional)
          </label>
          <input
            type="email"
            className={fieldCls}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-maroon-900">Subject</label>
          <select
            className={fieldCls}
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
          >
            {[
              "General Enquiry",
              "Room Booking",
              "Restaurant & Food Delivery",
              "Kings Bar",
              "Banquet / Event Booking",
              "Conference Hall",
              "Feedback & Grievance",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-maroon-900">Message *</label>
          <textarea
            className={`${fieldCls} min-h-32 resize-y`}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="How can we assist you today?"
            required
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={sending}
          onClick={() => handleSubmit(false)}
        >
          {sending ? "Submitting..." : "Submit Message to Database"}
        </Button>
        <Button
          type="submit"
          size="lg"
          variant="outline"
          className="flex-1 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          disabled={sending}
        >
          Send via WhatsApp
        </Button>
      </div>
    </form>
  );
}