import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type Tone = "neutral" | "good" | "bad" | "warn" | "accent"

interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  neutral: "text-mute bg-white/5 border-line",
  good: "text-good bg-good/10 border-good/30",
  bad: "text-bad bg-bad/10 border-bad/30",
  warn: "text-warn bg-warn/10 border-warn/30",
  accent: "text-accent-hi bg-accent/10 border-accent/40",
}

export function StatusPill({
  tone = "neutral",
  className,
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs uppercase tracking-wider",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
