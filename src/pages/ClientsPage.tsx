import { CLIENTS } from "@/data/clients"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { StatusPill } from "@/components/ui/StatusPill"

interface ClientsPageProps {
  navigate: (path: string) => void
}

export function ClientsPage({ navigate }: ClientsPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionLabel className="mb-3">Included clients</SectionLabel>
      <h1 className="text-3xl font-bold sm:text-4xl">Client arsenal</h1>
      <p className="mt-2 text-mute">
        {CLIENTS.length} clients, one license. Unavailable entries are greyed out.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLIENTS.map((client) => (
          <Card
            key={client.id}
            id={client.id}
            className={client.unavailable ? "opacity-50" : undefined}
          >
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">{client.name}</h2>
                {client.unavailable && <StatusPill tone="bad">Unavailable</StatusPill>}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-mute">{client.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to home
        </Button>
      </div>
    </div>
  )
}
