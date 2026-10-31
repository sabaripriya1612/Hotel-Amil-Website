import { cn } from "@/lib/cn";

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs sm:text-sm font-bold tracking-[0.2em] text-[#c0262d] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold text-stone-900 sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}