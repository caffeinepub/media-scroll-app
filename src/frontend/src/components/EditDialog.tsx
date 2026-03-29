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
import { Film, Image, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { MediaItem } from "../backend";
import { useUpdateMediaItem } from "../hooks/useQueries";
import { useStorage } from "../hooks/useStorage";

interface EditDialogProps {
  item: MediaItem;
  open: boolean;
  onClose: () => void;
}

export default function EditDialog({ item, open, onClose }: EditDialogProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useStorage();
  const updateItem = useUpdateMediaItem();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setNewFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      let blobId = item.blobId;
      if (newFile) {
        blobId = await uploadFile(newFile);
      }
      const mediaType = newFile
        ? newFile.type.startsWith("video/")
          ? "video"
          : "photo"
        : item.mediaType;
      await updateItem.mutateAsync({
        id: item.id,
        item: {
          ...item,
          title: title.trim(),
          description: description.trim(),
          blobId,
          mediaType,
        },
      });
      toast.success("Media updated!");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" data-ocid="edit.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-border rounded-xl p-4 text-center hover:border-primary/40 hover:bg-muted/20 transition-colors"
              data-ocid="edit.upload_button"
            >
              {preview ? (
                <div>
                  {newFile?.type.startsWith("video/") ? (
                    // biome-ignore lint/a11y/useMediaCaption: preview only
                    <video
                      src={preview}
                      className="mx-auto max-h-24 rounded-lg"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="preview"
                      className="mx-auto max-h-24 rounded-lg object-contain"
                    />
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {newFile?.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-2">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <Film className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click to replace file (optional)
                  </p>
                </div>
              )}
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Title *
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-input border-border"
              data-ocid="edit.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="bg-input border-border resize-none"
              data-ocid="edit.textarea"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            data-ocid="edit.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            data-ocid="edit.submit_button"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
