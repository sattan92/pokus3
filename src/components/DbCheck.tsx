import { useEffect, useState } from "react"
import { StatusPill } from "@/components/ui/StatusPill"

export function DbCheck() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    let active = true

    const run = () => {
      const baseUrl = import.meta.env.DEV ? "http://localhost:3001" : ""
      fetch(`${baseUrl}/api/db-check`)
        .then((res) => res.json())
        .then((data) => {
          if (active) setStatus(data.connected ? "online" : "offline")
        })
        .catch(() => {
          if (active) setStatus("offline")
        })
    }

    run()
    const id = setInterval(run, 60000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return (
    <StatusPill tone={status === "online" ? "good" : status === "offline" ? "bad" : "neutral"}>
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (status === "online"
            ? "bg-good"
            : status === "offline"
              ? "bg-bad animate-pulse"
              : "bg-mute animate-pulse")
        }
      />
      {status.toUpperCase()}
    </StatusPill>
  )
}
