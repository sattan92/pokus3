import { useEffect, useState } from "react"
import { ImageCarousel } from "@/components/ImageCarousel"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SectionLabel } from "@/components/ui/SectionLabel"

interface HomePageProps {
  navigate: (path: string) => void
  isLoggedIn: boolean
}

const STATS = [
  { value: "25+", label: "Clients included" },
  { value: "$6.99", label: "Lifetime license" },
  { value: "0–2d", label: "Instant access" },
]

function PriceCard({ loggedIn, navigate }: { loggedIn: boolean; navigate: (p: string) => void }) {
  const [license, setLicense] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loggedIn) return

    let active = true
    const baseUrl = import.meta.env.DEV ? "http://localhost:3001" : ""
    const token = localStorage.getItem("token")
    fetch(`${baseUrl}/api/licence`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (active) setLicense(Boolean(d.status))
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [loggedIn])

  const showLoading = loading && loggedIn
  const showLicensed = !showLoading && license

  return (
    <Card ticks className="flex flex-col p-6">
      <SectionLabel className="mb-4">Pricing</SectionLabel>
      <h2 className="text-2xl font-semibold">Price</h2>

      {showLoading ? (
        <p className="mt-3 text-mute">Checking license…</p>
      ) : showLicensed ? (
        <p className="mt-3 text-sm text-mute">
          Thanks for purchasing! Head to the{" "}
          <button onClick={() => navigate("/download")} className="text-accent-hi underline underline-offset-4">
            download
          </button>{" "}
          section.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          <p className="text-sm text-mute">
            Launch sale — <span className="text-3xl font-bold text-ink">$6.99</span>{" "}
            <span className="text-base text-faint line-through">$14.99</span>
          </p>
          <Button onClick={() => navigate("/buy")} className="self-start">
            Buy now
          </Button>
        </div>
      )}
    </Card>
  )
}

export function HomePage({ navigate, isLoggedIn }: HomePageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Hero */}
      <section className="py-14 text-center sm:py-20">
        <SectionLabel className="mb-5 justify-center">Minecraft utility clients</SectionLabel>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
          Every client.
          <br />
          <span className="text-accent-hi">One license.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-mute sm:text-lg">
          A wide variety of clients for every type of gameplay — at an affordable price, with access right after purchase.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={() => navigate("/clients")}>
            Browse clients
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/buy")}>
            Get access
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STATS.map((s) => (
          <Card key={s.label} className="p-5 text-center">
            <div className="font-display text-3xl font-bold text-accent-hi">{s.value}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-faint">{s.label}</div>
          </Card>
        ))}
      </section>

      {/* Feature cards */}
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card ticks className="p-6">
          <SectionLabel className="mb-4">Features</SectionLabel>
          <ul className="space-y-2 text-sm text-mute">
            <li>· Be on top of the leaderboard.</li>
            <li>· Clients for every type of gameplay.</li>
            <li>· 25 fully functional paid clients.</li>
          </ul>
        </Card>

        <Card ticks className="p-6">
          <SectionLabel className="mb-4">About us</SectionLabel>
          <ul className="space-y-2 text-sm text-mute">
            <li>· Wide variety of clients, very affordable.</li>
            <li>· Access to products right after purchase.</li>
          </ul>
        </Card>

        <PriceCard loggedIn={isLoggedIn} navigate={navigate} />
      </section>

      {/* Carousel */}
      <section className="mt-6">
        <Card className="p-6">
          <SectionLabel className="mb-4">Preview</SectionLabel>
          <div className="h-[320px] sm:h-[420px]">
            <ImageCarousel />
          </div>
        </Card>
      </section>
    </div>
  )
}
