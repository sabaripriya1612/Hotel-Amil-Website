import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold uppercase tracking-wider transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#382314] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants = {
  primary: "bg-[#382314] text-white hover:bg-[#4A301D] shadow-sm hover:shadow-md active:scale-[0.98]",
  secondary: "bg-[#D8A34F] text-[#382314] hover:bg-[#E7B765] shadow-sm hover:shadow-md active:scale-[0.98]",
  outline:
    "border border-stone-300 text-stone-800 hover:border-[#382314] hover:text-[#382314] bg-white shadow-xs active:scale-[0.98]",
  ghost: "text-[#382314] hover:bg-[#F5EEE6]",
};

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
} as const;

export function Button({ children, href, ...props }: ButtonProps) {
  const { variant = "primary", size = "md", className, onClick, type, disabled } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}