import { useEffect, useState } from "react"

export function Clock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <span className="font-mono text-sm tabular-nums text-ink" aria-label="Current time">
      {pad(time.getHours())}
      <span className="text-accent-hi">:</span>
      {pad(time.getMinutes())}
      <span className="text-faint">:{pad(time.getSeconds())}</span>
    </span>
  )
}
