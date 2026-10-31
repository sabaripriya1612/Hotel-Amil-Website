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
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c0262d] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants = {
  primary: "bg-[#c0262d] text-white hover:bg-[#a51d23] shadow-md hover:shadow-lg active:scale-95",
  secondary: "bg-[#c0262d] text-white hover:bg-[#a51d23] shadow-md hover:shadow-lg active:scale-95",
  outline:
    "border-2 border-[#c0262d] text-[#c0262d] hover:bg-[#c0262d] hover:text-white bg-white shadow-sm active:scale-95",
  ghost: "text-[#c0262d] hover:bg-red-50",
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