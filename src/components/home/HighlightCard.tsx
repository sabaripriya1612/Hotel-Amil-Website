import Image from "next/image";
import Link from "next/link";

export type HighlightCardData = {
  title: string;
  description: string;
  image: string;
  badge: string;
  href: string;
  ctaLabel: string;
};

/**
 * Reusable hotel highlight card (rooms, dining, celebrations, …).
 * Server component — rendered alongside the home page markup.
 */
export function HighlightCard({
  title,
  description,
  image,
  badge,
  href,
  ctaLabel,
}: HighlightCardData) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-[#382314]/40 hover:shadow-xl">
      {/* Visual */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-[#382314] px-3.5 py-1 text-xs font-semibold text-[#F5EEE6] shadow-sm border border-[#D8A34F]/40">
          {badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-2xl font-medium tracking-tight text-[#1C1917] transition-colors group-hover:text-[#382314]">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{description}</p>

        <div className="mt-6 border-t border-stone-100 pt-4">
          <Link
            href={href}
            aria-label={`${ctaLabel}: ${title}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#382314] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#4A301D]"
          >
            <span>{ctaLabel}</span>
            <span aria-hidden="true" className="text-[#D8A34F] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
