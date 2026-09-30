import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SectionLabel } from "@/components/ui/SectionLabel"

interface BuyPageProps {
  navigate: (path: string) => void
  onBuy: () => void
  userName: string
}

export function BuyPage({ navigate, onBuy, userName }: BuyPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <SectionLabel className="mb-3">Checkout</SectionLabel>
      <h1 className="text-3xl font-bold sm:text-4xl">Payment options</h1>

      <div className="mt-8 flex flex-col gap-4">
        <Card ticks className="p-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent-hi">01</span>
            <h2 className="text-lg font-semibold">Crypto</h2>
          </div>
          <p className="mt-3 text-sm text-mute">
            Fastest option. You'll be redirected to our reseller (Sell.app) to complete the purchase.
          </p>
          <Button onClick={onBuy} className="mt-4">
            Pay with crypto
          </Button>
        </Card>

        <Card ticks className="p-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent-hi">02</span>
            <h2 className="text-lg font-semibold">Direct bank transfer</h2>
          </div>

          <p className="mt-3 text-sm text-mute">
            Processing time 0–2 days. Add your{" "}
            <span className="font-semibold text-ink">site username</span> to the payment note and set the amount to{" "}
            <span className="font-semibold text-ink">6.99 EUR (8.17 USD)</span>.
          </p>

          <dl className="mt-4 grid gap-2 rounded-lg border border-line bg-bg p-4 font-mono text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-faint">IBAN</dt>
              <dd className="text-ink">SK1411000000002971012476</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-faint">Beneficiary</dt>
              <dd className="text-ink">Daniel Blasko</dd>
            </div>
            {userName && (
              <div className="flex justify-between gap-4">
                <dt className="text-faint">Username</dt>
                <dd className="text-accent-hi">{userName}</dd>
              </div>
            )}
          </dl>
        </Card>
      </div>

      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to home
        </Button>
      </div>
    </div>
  )
}
