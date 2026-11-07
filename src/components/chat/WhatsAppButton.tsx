import { siteConfig } from "@/lib/site";

export function WhatsAppButton() {
  const text = encodeURIComponent(
    `Hi ${siteConfig.name}! I am browsing your website and would like to know more.`
  );
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Hotel Amil on WhatsApp"
      className="fixed bottom-24 right-5 z-50 hidden lg:inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-xl transition-all duration-300 hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-4 w-4 fill-white" aria-hidden>
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.6.8 5 2.2 7L4 29l7.2-2.1c1.5.6 3.2.9 4.8.9 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.3 0-2.6-.3-3.8-.8l-.7-.3-4.2 1.2 1.3-4-.5-.7c-1.2-1.6-1.9-3.6-1.9-5.6 0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.2 9.2-9.8 9.2zm5.4-6.8c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.3-.3.4-.5.1-.2.1-.4 0-.6-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.3z" />
      </svg>
      <span>CHAT ON WHATSAPP</span>
    </a>
  );
}