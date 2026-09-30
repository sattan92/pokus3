import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type SectionLabelProps = HTMLAttributes<HTMLSpanElement>

/** Small mono uppercase micro-label used to caption sections/cards. */
export function SectionLabel({ className, children, ...props }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-hi",
        className,
      )}
      {...props}
    >
      <span className="inline-block h-px w-4 bg-accent/60" aria-hidden />
      {children}
    </span>
  )
}
