import { useEffect, useState } from "react"

interface LicenseData {
  status: string
}

export function GetExpire() {
  const [expire, setExpire] = useState<LicenseData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const baseUrl = import.meta.env.DEV ? "http://localhost:3001" : ""

    fetch(`${baseUrl}/api/get-expire`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
      .then((data) => setExpire(data))
      .catch(() => setError(true))
  }, [])

  if (error) return <span className="text-bad">Error</span>
  if (!expire) return <span className="text-faint">Loading…</span>

  return expire.status === "never" ? (
    <span className="text-good">Never</span>
  ) : (
    <span className="text-bad">No expiry date</span>
  )
}
