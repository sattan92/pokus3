interface FooterProps {
  navigate: (path: string) => void
}

const LINKS = [
  { label: "Terms of Service", path: "/tos" },
  { label: "Privacy Policy", path: "/pp" },
  { label: "Refunds", path: "/ref" },
]

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="font-display text-sm font-bold tracking-wide text-ink">
            SATTAN<span className="text-accent-hi">SHOP</span>
          </div>
          <p className="mt-1 text-sm text-faint">© 2026 Sattanshop. All rights reserved.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="font-display text-sm font-medium uppercase tracking-wide text-mute transition hover:text-accent-hi"
            >
              {link.label}
            </button>
          ))}

          <a
            href="mailto:danko1.blasko@gmail.com"
            className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 font-display text-sm text-mute transition hover:border-accent/40 hover:text-accent-hi"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-faint">Support</span>
            <span className="font-medium text-ink">danko1.blasko@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
