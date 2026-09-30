import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Render the crimson corner-bracket accents. */
  ticks?: boolean
  /** Add a subtle hover lift / border brightening. */
  interactive?: boolean
}

export function Card({
  ticks = false,
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-line bg-surface",
        ticks && "ticks",
        interactive &&
          "transition-colors duration-200 hover:border-accent/40 hover:bg-elevated",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
