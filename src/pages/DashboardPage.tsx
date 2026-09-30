import { DbCheck } from "@/components/DbCheck"
import { GetExpire } from "@/components/GetExpire"
import { LicenseBadge } from "@/components/LicenseBadge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SectionLabel } from "@/components/ui/SectionLabel"

interface DashboardPageProps {
  navigate: (path: string) => void
  isLoggedIn: boolean
  userName: string
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3 last:border-b-0">
      <span className="font-mono text-xs uppercase tracking-widest text-faint">{label}</span>
      <span className="text-sm font-medium text-ink">{children}</span>
    </div>
  )
}

export function DashboardPage({ navigate, isLoggedIn, userName }: DashboardPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <SectionLabel className="mb-3">Dashboard</SectionLabel>
      <h1 className="text-3xl font-bold sm:text-4xl">Account</h1>

      <Card ticks className="mt-8 p-6">
        <Row label="Service status">
          <DbCheck />
        </Row>
        <Row label="Name">{isLoggedIn ? userName : "Guest"}</Row>
        <Row label="License">
          <LicenseBadge loggedIn={isLoggedIn} />
        </Row>
        <Row label="Expiry date">
          <GetExpire />
        </Row>
      </Card>

      <Card className="mt-4 p-6">
        <SectionLabel className="mb-3">Security</SectionLabel>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mute">Change password</span>
          <Button variant="outline" size="sm" disabled title="Coming soon">
            Coming soon
          </Button>
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
