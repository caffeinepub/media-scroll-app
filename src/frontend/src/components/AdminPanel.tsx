import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppView } from "../App";
import type { MediaItem } from "../backend";
import {
  useDeleteMediaItem,
  useMediaItems,
  useReorderMediaItems,
} from "../hooks/useQueries";
import EditDialog from "./EditDialog";
import MediaThumbnail from "./MediaThumbnail";
import RightSidebar from "./RightSidebar";
import UploadDialog from "./UploadDialog";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4"];

interface AdminPanelProps {
  setView: (v: AppView) => void;
}

export default function AdminPanel({ setView: _setView }: AdminPanelProps) {
  const { data: items, isLoading } = useMediaItems();
  const deleteItem = useDeleteMediaItem();
  const reorder = useReorderMediaItems();
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleMoveUp = async (index: number) => {
    if (!items || index === 0) return;
    const reordered = [...items];
    [reordered[index - 1], reordered[index]] = [
      reordered[index],
      reordered[index - 1],
    ];
    const orderList: Array<[bigint, bigint]> = reordered.map((item, i) => [
      item.id,
      BigInt((i + 1) * 10),
    ]);
    try {
      await reorder.mutateAsync(orderList);
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (!items || index === items.length - 1) return;
    const reordered = [...items];
    [reordered[index], reordered[index + 1]] = [
      reordered[index + 1],
      reordered[index],
    ];
    const orderList: Array<[bigint, bigint]> = reordered.map((item, i) => [
      item.id,
      BigInt((i + 1) * 10),
    ]);
    try {
      await reorder.mutateAsync(orderList);
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-full">
      <div className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              Media Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {items?.length ?? 0} items in your library
            </p>
          </div>
          <Button
            onClick={() => setUploadOpen(true)}
            className="gap-1.5"
            data-ocid="admin.primary_button"
          >
            <Plus className="w-4 h-4" />
            Upload Media
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-3" data-ocid="admin.loading_state">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="w-full h-20 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && (!items || items.length === 0) && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="admin.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              No media yet
            </h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">
              Upload your first photo or video to get started.
            </p>
            <Button
              onClick={() => setUploadOpen(true)}
              data-ocid="admin.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Upload Now
            </Button>
          </div>
        )}

        {!isLoading && items && items.length > 0 && (
          <div className="space-y-2" data-ocid="admin.list">
            {items.map((item, idx) => (
              <div
                key={String(item.id)}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 group"
                data-ocid={`admin.item.${idx + 1}`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <MediaThumbnail
                    blobId={item.blobId}
                    mediaType={item.mediaType}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs flex-shrink-0"
                    >
                      {item.mediaType}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0 || reorder.isPending}
                    data-ocid="admin.button"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleMoveDown(idx)}
                    disabled={
                      idx === (items?.length ?? 0) - 1 || reorder.isPending
                    }
                    data-ocid="admin.button"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => setEditItem(item)}
                    data-ocid={`admin.edit_button.${idx + 1}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:text-destructive"
                        data-ocid={`admin.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="admin.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete media?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &ldquo;{item.title}
                          &rdquo;. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="admin.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-ocid="admin.confirm_button"
                        >
                          {deleteItem.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="xl:hidden border-t border-border p-4">
        <h2 className="font-display font-semibold text-sm text-foreground mb-3">
          App Settings
        </h2>
        <RightSidebar />
      </div>

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        nextSortOrder={BigInt(((items?.length ?? 0) + 1) * 10)}
      />

      {editItem && (
        <EditDialog
          item={editItem}
          open={!!editItem}
          onClose={() => setEditItem(null)}
        />
      )}
    </div>
  );
}
