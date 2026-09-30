import { Clock } from "@/components/Clock"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  currentPath: string
  navigate: (path: string) => void
  isLoggedIn: boolean
  userName: string
  onLogout: () => void
  onOpenLogin: () => void
  loginAlert: () => void
}

const NAV = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Download", path: "/download" },
  { label: "Clients", path: "/clients" },
]

export function Header({
  currentPath,
  navigate,
  isLoggedIn,
  userName,
  onLogout,
  onOpenLogin,
  loginAlert,
}: HeaderProps) {
  const handleNav = (item: (typeof NAV)[number]) => {
    if (item.path === "/dashboard" && !isLoggedIn) {
      loginAlert()
      return
    }
    navigate(item.path)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="font-display text-lg font-bold tracking-wide text-ink transition hover:text-white"
        >
          SATTAN<span className="text-accent-hi">SHOP</span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-faint">.tech</span>
        </button>

        {/* Nav */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = currentPath === item.path
            const locked = item.path === "/dashboard" && !isLoggedIn
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item)}
                className={cn(
                  "rounded-md px-3 py-1.5 font-display text-sm font-medium uppercase tracking-wide transition",
                  active
                    ? "text-accent-hi"
                    : locked
                      ? "text-faint hover:text-mute"
                      : "text-mute hover:text-ink",
                )}
              >
                {item.label}
                {locked && <span className="ml-1.5 font-mono text-[10px] text-faint">🔒</span>}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {/* Welcome */}
          <div className="hidden text-right sm:block">
            <div className="font-mono text-[10px] uppercase tracking-widest text-faint">user</div>
            <div className="text-sm font-medium text-ink">{isLoggedIn ? userName : "Guest"}</div>
          </div>

          {/* Clock */}
          <div className="hidden rounded-md border border-line bg-surface px-3 py-1.5 lg:block">
            <Clock />
          </div>

          {/* Auth */}
          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={onOpenLogin}>
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-line px-4 py-2 md:hidden">
        {NAV.map((item) => {
          const active = currentPath === item.path
          const locked = item.path === "/dashboard" && !isLoggedIn
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item)}
              className={cn(
                "rounded-md px-3 py-1.5 font-display text-xs font-medium uppercase tracking-wide",
                active ? "bg-accent/10 text-accent-hi" : locked ? "text-faint" : "text-mute",
              )}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
