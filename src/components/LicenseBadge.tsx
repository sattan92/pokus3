import { useEffect, useState } from "react"
import { StatusPill } from "@/components/ui/StatusPill"

export function LicenseBadge({ loggedIn }: { loggedIn: boolean }) {
  const [license, setLicense] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loggedIn) return

    let active = true
    const baseUrl = import.meta.env.DEV ? "http://localhost:3001" : ""
    const token = localStorage.getItem("token")

    fetch(`${baseUrl}/api/licence`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setLicense(Boolean(data.status))
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [loggedIn])

  const tone = !loggedIn ? "bad" : loading ? "neutral" : license === true ? "good" : "bad"
  const text = !loggedIn ? "INACTIVE" : loading ? "LOADING" : license === true ? "ACTIVE" : "INACTIVE"

  return <StatusPill tone={tone}>{text}</StatusPill>
}
