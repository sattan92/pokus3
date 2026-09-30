interface LogoProps {
  size?: number
}

export function Logo({ size = 26 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="shrink-0"
    >
      <rect width="64" height="64" rx="14" fill="#0a0a0b" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" fill="none" stroke="#26262c" strokeWidth="1" />
      <path
        d="M43 21h-15a6 6 0 0 0-6 6v0a6 6 0 0 0 6 6h8a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H21"
        fill="none"
        stroke="#e21d2f"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  )
}
