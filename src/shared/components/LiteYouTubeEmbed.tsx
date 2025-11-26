import { Play } from 'lucide-react'
import { useState } from 'react'

interface LiteYouTubeEmbedProps {
  videoId: string
  title: string
}

export function LiteYouTubeEmbed({ videoId, title }: LiteYouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // High-quality thumbnail
  const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div className="bg-card relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {!isLoaded ? (
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail Image */}
          <img
            src={posterUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
            width="1280"
            height="720"
            loading="lazy"
          />

          {/* Play Button Overlay */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-300 ease-out group-hover:scale-110 group-focus:scale-110">
            <Play className="ml-1 h-8 w-8 fill-black" />
          </div>
        </button>
      ) : (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="animate-in fade-in absolute inset-0 h-full w-full duration-500"
        />
      )}
    </div>
  )
}
