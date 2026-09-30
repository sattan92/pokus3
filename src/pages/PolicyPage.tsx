import type { ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SectionLabel } from "@/components/ui/SectionLabel"

interface PolicyPageProps {
  title: string
  updated?: string
  navigate: (path: string) => void
  children: ReactNode
}

export function PolicyPage({ title, updated, navigate, children }: PolicyPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <SectionLabel className="mb-3">Legal</SectionLabel>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {updated && <p className="mt-2 font-mono text-xs uppercase tracking-widest text-faint">{updated}</p>}

      <Card className="mt-8 p-6 sm:p-8">
        <div className="space-y-4 text-sm leading-relaxed text-mute [&_a]:text-accent-hi [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      </Card>

      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to home
        </Button>
      </div>
    </div>
  )
}
