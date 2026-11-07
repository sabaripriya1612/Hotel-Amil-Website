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
        <p className="mb-2.5 text-xs font-semibold tracking-[0.25em] text-[#D8A34F] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-normal tracking-tight text-[#1C1917] sm:text-4xl lg:text-[2.6rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-base leading-relaxed text-stone-600 sm:text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}