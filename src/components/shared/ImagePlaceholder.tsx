import Image from "next/image";
import { cn } from "@/lib/cn";
import { resolveImage } from "@/lib/images";

export function ImagePlaceholder({
  name,
  className,
  label,
  alt,
}: {
  name: string;
  className?: string;
  label?: string;
  alt?: string;
}) {
  const src = resolveImage(name);

  if (src) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-maroon-900", className)}>
        <Image
          src={src}
          alt={alt ?? (label ?? "Hotel Amil, Rajapalayam")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {label && (
          <span className="pointer-events-none absolute bottom-3 left-4 z-10 text-sm font-medium tracking-wide text-white drop-shadow">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-maroon-900 via-maroon-700 to-gold-500",
        className
      )}
    >
      <svg viewBox="0 0 64 64" className="h-16 w-16 opacity-90" fill="none">
        <rect x="6" y="10" width="52" height="40" rx="3" className="stroke-white/80" strokeWidth="2" />
        <path d="M30 14h4v14h10v4H20v-4h10z" className="fill-white/80" />
        <path d="M6 46h52v8H6z" className="fill-gold-400/90" />
      </svg>
      {label && (
        <span className="pointer-events-none absolute bottom-3 left-4 text-sm font-medium tracking-wide text-white/90">
          {label}
        </span>
      )}
    </div>
  );
}