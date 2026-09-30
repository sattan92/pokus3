import { useState } from "react"
import ImageList from "@/images.json"
import { cn } from "@/lib/utils"

export function ImageCarousel() {
  const images = ImageList.images
  const [index, setIndex] = useState(0)

  const next = () => setIndex((i) => (i + 1) % images.length)
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="relative flex-1 overflow-hidden rounded-lg border border-line bg-bg">
        <img
          src={images[index]}
          alt="Product preview"
          className="h-full w-full object-contain"
          draggable={false}
        />
        <div className="absolute left-3 top-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-mute backdrop-blur">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous image"
          className="flex h-9 w-9 items-center justify-center rounded border border-line bg-surface text-mute transition hover:border-accent hover:text-accent-hi"
        >
          ←
        </button>

        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-accent" : "w-1.5 bg-line hover:bg-faint",
              )}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next image"
          className="flex h-9 w-9 items-center justify-center rounded border border-line bg-surface text-mute transition hover:border-accent hover:text-accent-hi"
        >
          →
        </button>
      </div>
    </div>
  )
}
