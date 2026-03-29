import { Film, Image } from "lucide-react";
import { useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage";

interface MediaThumbnailProps {
  blobId: string;
  mediaType: string;
}

export default function MediaThumbnail({
  blobId,
  mediaType,
}: MediaThumbnailProps) {
  const [url, setUrl] = useState<string>("");
  const { getBlobUrl } = useStorage();

  useEffect(() => {
    if (blobId) {
      getBlobUrl(blobId).then(setUrl);
    }
  }, [blobId, getBlobUrl]);

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        {mediaType === "video" ? (
          <Film className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Image className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    );
  }

  if (mediaType === "video") {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-muted">
        {/* biome-ignore lint/a11y/useMediaCaption: thumbnail preview */}
        <video src={url} className="w-full h-full object-cover" />
        <Film className="absolute w-4 h-4 text-white/80" />
      </div>
    );
  }

  return (
    <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
  );
}
