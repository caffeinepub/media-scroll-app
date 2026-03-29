import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, Upload } from "lucide-react";
import type { AppView } from "../App";
import { useIsAdmin, useMediaItems } from "../hooks/useQueries";
import MediaCard from "./MediaCard";

const SAMPLE_ITEMS = [
  {
    id: -1n,
    title: "Golden Hour Landscape",
    description: "Warm tones over rolling hills at sunset",
    blobId: "",
    mediaType: "photo",
    sortOrder: 1n,
    createdAt: 0n,
    sampleBg: "from-amber-900/40 to-orange-800/20",
  },
  {
    id: -2n,
    title: "City Timelapse",
    description: "Downtown lights come alive at night",
    blobId: "",
    mediaType: "video",
    sortOrder: 2n,
    createdAt: 0n,
    sampleBg: "from-blue-900/40 to-indigo-900/20",
  },
  {
    id: -3n,
    title: "Ocean Waves",
    description: "Peaceful shoreline during high tide",
    blobId: "",
    mediaType: "photo",
    sortOrder: 3n,
    createdAt: 0n,
    sampleBg: "from-cyan-900/40 to-teal-900/20",
  },
  {
    id: -4n,
    title: "Mountain Drone Footage",
    description: "Aerial views of the alpine ridge",
    blobId: "",
    mediaType: "video",
    sortOrder: 4n,
    createdAt: 0n,
    sampleBg: "from-slate-700/40 to-gray-800/20",
  },
  {
    id: -5n,
    title: "Wildflower Meadow",
    description: "Spring blooms in vivid color",
    blobId: "",
    mediaType: "photo",
    sortOrder: 5n,
    createdAt: 0n,
    sampleBg: "from-purple-900/40 to-pink-900/20",
  },
  {
    id: -6n,
    title: "Forest Trail",
    description: "Morning mist through ancient trees",
    blobId: "",
    mediaType: "photo",
    sortOrder: 6n,
    createdAt: 0n,
    sampleBg: "from-green-900/40 to-emerald-900/20",
  },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];
const SKELETON_HEIGHTS = [200, 260, 220, 280, 200, 240];

interface MediaFeedProps {
  setView?: (v: AppView) => void;
}

export default function MediaFeed({ setView }: MediaFeedProps) {
  const { data: items, isLoading } = useMediaItems();
  const { data: isAdmin } = useIsAdmin();

  const showSamples = !isLoading && (!items || items.length === 0);
  const displayItems = showSamples ? SAMPLE_ITEMS : (items ?? []);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            Media Feed
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {showSamples
              ? "Sample content — upload your own media to get started"
              : `${displayItems.length} item${displayItems.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {isAdmin && setView && (
          <Button
            size="sm"
            onClick={() => setView("admin")}
            className="gap-1.5"
            data-ocid="feed.primary_button"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        )}
      </div>

      {isLoading && (
        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-4"
          data-ocid="feed.loading_state"
        >
          {SKELETON_KEYS.map((k, i) => (
            <div key={k} className="mb-4 break-inside-avoid">
              <Skeleton
                className="w-full rounded-xl"
                style={{ height: `${SKELETON_HEIGHTS[i]}px` }}
              />
            </div>
          ))}
        </div>
      )}

      {!isLoading && items && items.length === 0 && !isAdmin && (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="feed.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <ImageOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            No media yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            The feed is empty. Check back soon for photos and videos.
          </p>
        </div>
      )}

      {!isLoading && displayItems.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {displayItems.map((item, idx) => (
            <div
              key={String(item.id)}
              className="mb-4 break-inside-avoid"
              data-ocid={`feed.item.${idx + 1}`}
            >
              <MediaCard item={item} isSample={showSamples} />
            </div>
          ))}
        </div>
      )}

      <footer className="mt-16 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
