import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import {
  techniqueEmbedUrl,
  techniqueSearchUrl,
  type TechniqueVideo,
} from "@/lib/technique-videos";

export function ExerciseVideoModal({
  video,
  onClose,
}: {
  video: TechniqueVideo;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${video.name} technique video`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-sm border border-gold/40 bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-xl">{video.name}</h3>
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">
              {video.muscles}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="aspect-video w-full bg-background">
          <iframe
            className="h-full w-full"
            src={techniqueEmbedUrl(video.query)}
            title={`${video.name} demonstration`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="px-5 py-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {video.cues.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-gold">—</span>
                {c}
              </li>
            ))}
          </ul>
          <a
            href={techniqueSearchUrl(video.query)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-gold"
          >
            Watch on YouTube <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
