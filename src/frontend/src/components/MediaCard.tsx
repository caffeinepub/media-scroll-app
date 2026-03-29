import { Film, Heart, MessageCircle, Pause, Play, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../backend";
import { useStorage } from "../hooks/useStorage";

type SampleItem = MediaItem & { sampleBg?: string };

interface MediaCardProps {
  item: SampleItem;
  isSample?: boolean;
}

export default function MediaCard({ item, isSample }: MediaCardProps) {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { getBlobUrl } = useStorage();

  useEffect(() => {
    if (!isSample && item.blobId) {
      getBlobUrl(item.blobId).then(setMediaUrl);
    }
  }, [item.blobId, isSample, getBlobUrl]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((v) => !v);
  };

  const isVideo = item.mediaType === "video";
  const sampleBg =
    (item as SampleItem).sampleBg ?? "from-slate-800/60 to-slate-900/40";

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden shadow-card group">
      <div className="relative">
        {isVideo ? (
          <div className="relative">
            {mediaUrl ? (
              // biome-ignore lint/a11y/useMediaCaption: user-uploaded content
              <video
                ref={videoRef}
                src={mediaUrl}
                className="w-full object-cover"
                style={{ maxHeight: "400px" }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                playsInline
              />
            ) : (
              <div
                className={`w-full h-48 bg-gradient-to-br ${sampleBg} flex items-center justify-center`}
              >
                <Film className="w-10 h-10 text-muted-foreground/50" />
              </div>
            )}

            <button
              type="button"
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center group/btn"
              data-ocid="feed.button"
            >
              <div
                className={`w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity ${
                  isPlaying
                    ? "opacity-0 group-hover/btn:opacity-100"
                    : "opacity-100"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                )}
              </div>
            </button>

            <div className="absolute bottom-2 right-2">
              <span className="bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                VIDEO
              </span>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            {mediaUrl ? (
              <img
                src={mediaUrl}
                alt={item.title}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ maxHeight: "500px" }}
              />
            ) : (
              <div
                className={`w-full h-52 bg-gradient-to-br ${sampleBg} transition-transform duration-300 group-hover:scale-105`}
              />
            )}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-foreground text-sm leading-snug mb-0.5">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 px-3 pb-3">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-1 text-xs transition-colors ${
            liked
              ? "text-red-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="feed.button"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-400" : ""}`} />
        </button>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="feed.button"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="feed.button"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
