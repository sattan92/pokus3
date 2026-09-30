import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SectionLabel } from "@/components/ui/SectionLabel"

interface NotFoundPageProps {
  navigate: (path: string) => void
}

export function NotFoundPage({ navigate }: NotFoundPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <Card ticks className="p-10 text-center sm:p-14">
        <SectionLabel className="mb-6 justify-center">Error / 404</SectionLabel>
        <div className="font-display text-7xl font-bold leading-none text-accent-hi sm:text-8xl">404</div>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-mute">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => navigate("/")}>Back to home</Button>
          <Button variant="outline" onClick={() => navigate("/clients")}>
            Browse clients
          </Button>
        </div>
      </Card>
    </div>
  )
}
