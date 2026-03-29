import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, Play } from "lucide-react";
import type { AppView } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  appName: string;
  view: AppView;
  setView: (v: AppView) => void;
  isAdmin: boolean;
  onMenuToggle: () => void;
}

export default function Header({
  appName,
  view,
  setView,
  isAdmin,
  onMenuToggle,
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <header className="flex items-center h-14 px-4 border-b border-border bg-sidebar flex-shrink-0 z-20 gap-4">
      {isAdmin && (
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="header.toggle"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Play className="w-4 h-4 text-primary fill-primary" />
        </div>
        <span className="font-display font-semibold text-foreground truncate text-base">
          {appName}
        </span>
      </div>

      <nav className="flex items-center gap-1 ml-6">
        <button
          type="button"
          onClick={() => setView("feed")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === "feed"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          data-ocid="header.link"
        >
          Feed
        </button>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setView("admin")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === "admin"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            data-ocid="admin.link"
          >
            Admin
          </button>
        )}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="header.button"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={login}
            disabled={isLoggingIn}
            className="gap-1.5"
            data-ocid="header.button"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? "Connecting..." : "Login"}
          </Button>
        )}
      </div>
    </header>
  );
}
