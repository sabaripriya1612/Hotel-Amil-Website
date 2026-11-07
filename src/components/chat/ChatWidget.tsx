"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { siteConfig, hotelPolicies } from "@/lib/site";

type Msg = { from: "bot" | "user"; text: string };

const chatLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
  "Hi Hotel Amil! I was chatting with your website assistant and would like your help."
)}`;

const QUICK = [
  "Room rates",
  "Check-in time",
  "Free cancellation",
  "Swimming pool",
  "Food & restaurant",
  "Banquet hall",
  "Your address",
];

const KNOWLEDGE: { keys: string[]; answer: string }[] = [
  {
    keys: ["rate", "price", "cost", "tariff", "much", "charge", "tariff"],
    answer:
      "Our CP-plan rates (breakfast included): Executive rooms ₹3,675, Deluxe ₹4,125 and Family ₹7,875 per night (incl. tax). Extra person is ₹1,050 per night. You can see every room on the Rooms page and book in minutes.",
  },
  {
    keys: ["check-in", "checkin", "check out", "checkout", "arrive", "timing"],
    answer: `Check-in is ${siteConfig.checkIn} and check-out is ${siteConfig.checkOut}. You can drop your bags early and our team will look after them.`,
  },
  {
    keys: ["cancel", "refund", "free"],
    answer: hotelPolicies.cancellation.note,
  },
  {
    keys: ["child", "kid", "children", "infant", "baby"],
    answer: `Children below ${siteConfig.freeChildAge} years stay free. Children under 8 normally don't need their own bed. Extra beds are available on request.`,
  },
  {
    keys: ["pool", "swim"],
    answer:
      "Our outdoor swimming pool is open for daytime swimming (7:00 AM to 6:30 PM). Night-time swimming is also allowed provided guests inform the hotel management/front desk previously. Wi-Fi is available around the pool deck, and pool hygiene rules apply.",
  },
  {
    keys: ["breakfast", "food", "restaurant", "dine", "eat", "cafe", "buffet", "menu", "veg", "non-veg"],
    answer:
      "Saffron Manor Restaurant serves multi-cuisine food — South & North Indian and Continental — with buffet catering for events. Breakfast runs ${siteConfig.breakfastTime} and is complimentary under the CP Plan. Amil Cafe is open 24/7 for coffee, tea and snacks.",
  },
  {
    keys: ["bar", "drink", "liquor"],
    answer:
      "Kings Bar is open 11:00 AM – 12:00 AM with a 21+ age restriction and valid ID required. Outside liquor is not allowed. It offers private cocktail parties and a vibrant ambient lounge.",
  },
  {
    keys: ["banquet", "wedding", "marriage", "reception", "hall", "event"],
    answer:
      "Our air-conditioned banquet hall seats 128–150 and is ideal for weddings, corporate meetings and family functions, with ample parking and buffet options. Food & beverages must be arranged through the hotel.",
  },
  {
    keys: ["parking", "car", "vehicle", "park"],
    answer: "We offer spacious, free parking for all hotel guests, diners and event visitors.",
  },
  {
    keys: ["address", "location", "where", "direction", "reach", "map", "near", "rajapalayam"],
    answer: `${siteConfig.address}. We're right on the main road — easy to reach, with easy parking. Tap the WhatsApp button below for a live location.`,
  },
  {
    keys: ["phone", "call", "number", "whatsapp", "contact", "reach"],
    answer: `You can call us on ${siteConfig.phones[0]} or ${siteConfig.phones[1]}, or message us on WhatsApp anytime. For grievances: ${siteConfig.grievancePhone}.`,
  },
  {
    keys: ["book", "booking", "reserve", "stay", "room availab", "available"],
    answer:
      "You can book directly on our website — pick your dates, add rooms and confirm. For a personal booking, message us on WhatsApp and our front desk will sort your dates, rates and any special requests instantly.",
  },
  {
    keys: ["ac", "wifi", "wi-fi", "internet", "tv", "balcony", "amenit", "locker", "kettle"],
    answer:
      "Every room has AC, flat-screen TV, electric kettle, refrigerator, private locker, free Wi-Fi and a hill-view balcony. Extra bed available on request.",
  },
  {
    keys: ["wifi", "wi-fi"],
    answer: "Free high-speed Wi-Fi is available in every room and around the pool area.",
  },
];

function matchAnswer(raw: string): string {
  const q = raw.toLowerCase();
  let best =
    "I can help with that! Could you ask me about room rates, check-in times, food, the pool, events or how to reach us? Or just message us on WhatsApp below and we'll reply right away.";
  let score = 0;
  for (const k of KNOWLEDGE) {
    const found = k.keys.filter((key) => q.includes(key)).length;
    if (found > score) {
      score = found;
      best = k.answer;
    }
  }
  return best;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      const t = setTimeout(() => {
        setMessages([
          {
            from: "bot",
            text: `Vanakkam! 👋 I'm the ${siteConfig.name} assistant. Ask me about rooms, rates, food, the pool or events — or tap a quick question below.`,
          },
        ]);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: "user", text: value }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: matchAnswer(value) }]);
      setTyping(false);
    }, 650);
  };

  return (
    <>
      {/* Toggle button (bottom-right, clear of the hero copy and booking controls) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open AI assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#382314] text-white shadow-xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:bg-[#4A301D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#382314] border border-[#D8A34F]/30 cursor-pointer"
      >
        <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-[#382314]" />
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M12 3C7 3 3 6.6 3 11c0 2.2 1 4.2 2.7 5.7L5 21l4.3-1.6c.9.2 1.8.3 2.7.3 5 0 9-3.6 9-8s-4-8-9-8zm-4.5 8.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#29180C] to-[#382C28] px-4 py-3 text-white">
            <div>
              <p className="font-display text-base leading-tight font-bold tracking-wide">{siteConfig.name} Concierge</p>
              <p className="flex items-center gap-1.5 text-xs text-[#F5EEE6]/85 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · instant answers
              </p>
            </div>
            <a
              href={chatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              WhatsApp
            </a>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#FAF8F5] p-4">
            {messages.length === 0 && (
              <div className="rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm text-stone-800 shadow-xs border border-stone-200/70">
                Vanakkam! Ask anything about your stay…
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs",
                  m.from === "bot"
                    ? "rounded-tl-sm bg-white text-stone-800 border border-stone-200/70"
                    : "ml-auto rounded-tr-sm bg-[#382314] text-white font-medium"
                )}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-xs border border-stone-200/70 w-fit">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#382314]"
                    style={{ animationDelay: `${d * 120}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-stone-100 bg-white px-3 pt-2.5">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-full border border-stone-200/90 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700 transition-colors hover:bg-[#382314] hover:text-white hover:border-[#382314] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2 p-3 bg-white border-t border-stone-100"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="h-10 flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 text-xs sm:text-sm text-stone-900 outline-none focus:border-[#382314] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#382314] text-white transition-all hover:bg-[#4A301D] active:scale-95 cursor-pointer shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M3.4 20.4l17-7.4a1 1 0 0 0 0-1.8l-17-7.4a1 1 0 0 0-1.4 1.1l1.6 6.2 11.4 1.9-11.4 1.9-1.6 6.2a1 1 0 0 0 1.4 1.1z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}