import { Image, LayoutGrid, Settings, Upload, Video, X } from "lucide-react";
import type { AppView } from "../App";

interface LeftSidebarProps {
  view: AppView;
  setView: (v: AppView) => void;
  onClose: () => void;
}

export default function LeftSidebar({
  view,
  setView,
  onClose,
}: LeftSidebarProps) {
  return (
    <div className="flex flex-col h-full py-4 px-3">
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Admin Hub
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2">
          Upload
        </p>
        <nav className="space-y-0.5">
          <button
            type="button"
            onClick={() => {
              setView("admin");
              onClose();
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === "admin"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
            data-ocid="sidebar.link"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </button>
        </nav>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2">
          Manage
        </p>
        <nav className="space-y-0.5">
          {(
            [
              { label: "All Media", icon: LayoutGrid, filter: "all" },
              { label: "Photos", icon: Image, filter: "photo" },
              { label: "Videos", icon: Video, filter: "video" },
            ] as const
          ).map((item) => (
            <button
              key={item.filter}
              type="button"
              onClick={() => {
                setView("admin");
                onClose();
              }}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === "admin"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              data-ocid="sidebar.link"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-2">
            Settings
          </p>
          <button
            type="button"
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            data-ocid="sidebar.link"
          >
            <Settings className="w-4 h-4" />
            App Settings
          </button>
        </div>
      </div>
    </div>
  );
}
