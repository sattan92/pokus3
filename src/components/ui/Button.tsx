import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "ghost" | "outline" | "danger"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hi shadow-[0_0_0_1px_rgba(226,29,47,0.4),0_8px_24px_-8px_rgba(226,29,47,0.6)]",
  ghost: "text-ink hover:text-white hover:bg-white/5",
  outline:
    "border border-line text-ink hover:border-accent hover:text-accent-hi bg-surface",
  danger: "bg-bad/10 text-bad border border-bad/30 hover:bg-bad/20",
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-display font-semibold uppercase tracking-wide",
        "transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}
