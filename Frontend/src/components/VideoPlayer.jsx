import { ExternalLink, PlayCircle } from "lucide-react";
import { resolveVideoEmbed } from "@/lib/video";

export function VideoPlayer({ url }) {
  const embed = resolveVideoEmbed(url);

  if (!embed) return null;

  if (embed.type === "iframe") {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video">
        <iframe
          src={embed.src}
          title="Video de la clase"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (embed.type === "video") {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video">
        <video src={embed.src} controls className="w-full h-full" />
      </div>
    );
  }

  // No pudimos reconocer el formato: dejamos un link como último recurso.
  return (
    <a
      href={embed.src}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <PlayCircle size={20} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">Ver video de la clase</p>
        <p className="text-xs text-muted-foreground">No pudimos incrustarlo, se abre en una pestaña nueva</p>
      </div>
      <ExternalLink size={16} className="text-muted-foreground" />
    </a>
  );
}
