import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { SectionLabel } from "@/components/ui/SectionLabel"

interface LoginProps {
  onClose: () => void
  onSwitch: () => void
  setAuth: (name: string) => void
}

export function Login({ onClose, onSwitch, setAuth }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  async function handleLogin() {
    if (!email || !password) {
      alert("Fill in all fields")
      return
    }
    if (!captchaToken) {
      alert("Please complete the Captcha")
      return
    }

    setBusy(true)
    const baseUrl = import.meta.env.DEV ? "http://localhost:3001" : ""

    try {
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("username", data.username)
        setAuth(data.username)
        onClose()
      } else {
        alert(data.error || "Login failed")
        setCaptchaToken(null)
        recaptchaRef.current?.reset()
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <SectionLabel>Auth / Login</SectionLabel>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded border border-line text-mute transition hover:border-accent hover:text-accent-hi"
          >
            ✕
          </button>
        </div>

        <h2 className="mb-5 text-2xl font-semibold">Sign in</h2>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-mute">
            Email
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-mute">
            Password
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </label>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token ?? null)}
              theme="dark"
            />
          </div>

          <Button onClick={handleLogin} disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Submit"}
          </Button>

          <p className="text-center text-sm text-mute">
            No account?{" "}
            <button onClick={onSwitch} className="cursor-pointer text-accent-hi underline underline-offset-4">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
