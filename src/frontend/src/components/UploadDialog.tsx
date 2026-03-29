import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Film, Image, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateMediaItem } from "../hooks/useQueries";
import { useStorage } from "../hooks/useStorage";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  nextSortOrder: bigint;
}

export default function UploadDialog({
  open,
  onClose,
  nextSortOrder,
}: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useStorage();
  const createItem = useCreateMediaItem();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const objectUrl = URL.createObjectURL(f);
    setPreview(objectUrl);
    if (!title) {
      setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    setTitle("");
    setDescription("");
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error("Please select a file and enter a title");
      return;
    }
    setUploading(true);
    try {
      const blobId = await uploadFile(file);
      const mediaType = file.type.startsWith("video/") ? "video" : "photo";
      await createItem.mutateAsync({
        id: 0n,
        title: title.trim(),
        description: description.trim(),
        blobId,
        mediaType,
        sortOrder: nextSortOrder,
        createdAt: BigInt(Date.now()),
      });
      toast.success("Media uploaded successfully!");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = file?.type.startsWith("video/");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" data-ocid="upload.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Upload Media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* File picker */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
              data-ocid="upload.upload_button"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                file
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
              data-ocid="upload.dropzone"
            >
              {preview ? (
                <div className="relative">
                  {isVideo ? (
                    // biome-ignore lint/a11y/useMediaCaption: upload preview
                    <video
                      src={preview}
                      className="mx-auto max-h-32 rounded-lg object-contain"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="preview"
                      className="mx-auto max-h-32 rounded-lg object-contain"
                    />
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {file?.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    <Image className="w-5 h-5 text-muted-foreground" />
                    <Film className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click to select photo or video
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    JPG, PNG, GIF, MP4, MOV, WebM
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="upload-title"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Title *
            </Label>
            <Input
              id="upload-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter media title"
              className="bg-input border-border"
              data-ocid="upload.input"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="upload-desc"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Description
            </Label>
            <Textarea
              id="upload-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={2}
              className="bg-input border-border resize-none"
              data-ocid="upload.textarea"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
            data-ocid="upload.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            data-ocid="upload.submit_button"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
