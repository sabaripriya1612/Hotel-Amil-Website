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
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Visual */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-[#c0262d] px-3.5 py-1 text-xs font-bold text-white shadow-md">
          {badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-2xl font-semibold text-stone-900 transition-colors group-hover:text-[#c0262d]">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{description}</p>

        <div className="mt-6 border-t border-stone-100 pt-4">
          <Link
            href={href}
            aria-label={`${ctaLabel}: ${title}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#c0262d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#a51d23]"
          >
            <span>{ctaLabel}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
