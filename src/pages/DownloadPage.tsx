import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { SectionLabel } from "@/components/ui/SectionLabel"

interface B2File {
  name: string
  url: string
}

interface DownloadPageProps {
  navigate: (path: string) => void
  onGoogleDrive: () => void
  onBackblaze: () => void
  filesLoading: boolean
  files: B2File[]
}

export function DownloadPage({
  navigate,
  onGoogleDrive,
  onBackblaze,
  filesLoading,
  files,
}: DownloadPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <SectionLabel className="mb-3">Downloads</SectionLabel>
      <h1 className="text-3xl font-bold sm:text-4xl">Download clients</h1>
      <p className="mt-2 text-mute">Pick a source to grab your licensed clients.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={onGoogleDrive}>Download via Google Drive</Button>
        <Button variant="outline" onClick={onBackblaze} disabled={filesLoading}>
          {filesLoading ? "Loading…" : "Download via Backblaze"}
        </Button>
      </div>

      {files.length > 0 && (
        <Card className="mt-8">
          <SectionLabel className="mb-4">Available files</SectionLabel>
          <ul className="divide-y divide-line">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3">
                <span className="font-mono text-sm text-ink">{file.name}</span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-good/40 bg-good/10 px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-wide text-good transition hover:bg-good/20"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Back to home
        </Button>
      </div>
    </div>
  )
}
