import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes } from "react"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink",
          "placeholder:text-faint transition-colors",
          "focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20",
          className,
        )}
        {...props}
      />
    )
  },
)
