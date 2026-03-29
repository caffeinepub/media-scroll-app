import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import MediaFeed from "./components/MediaFeed";
import RightSidebar from "./components/RightSidebar";
import { useAppSettings, useIsAdmin } from "./hooks/useQueries";

export type AppView = "feed" | "admin";

export default function App() {
  const [view, setView] = useState<AppView>("feed");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: settings } = useAppSettings();
  const { data: isAdmin } = useIsAdmin();

  useEffect(() => {
    const html = document.documentElement;
    const theme = settings?.theme ?? "dark";
    const parts = theme.split("-");
    const baseTheme = parts[0] ?? "dark";
    const accent = parts[1] ?? "blue";
    if (baseTheme === "light") {
      html.setAttribute("data-theme", "light");
    } else {
      html.removeAttribute("data-theme");
    }
    html.setAttribute("data-accent", accent);
  }, [settings?.theme]);

  useEffect(() => {
    document.title = settings?.appName ?? "Media Scroll";
  }, [settings?.appName]);

  const closeOverlay = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header
        appName={settings?.appName ?? "Media Scroll"}
        view={view}
        setView={setView}
        isAdmin={isAdmin ?? false}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        {isAdmin && (
          <div
            className={`
              fixed inset-y-0 left-0 z-40 pt-14 w-60
              bg-sidebar border-r border-border
              transition-transform duration-200
              lg:static lg:translate-x-0 lg:pt-0
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <LeftSidebar
              view={view}
              setView={setView}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {sidebarOpen && isAdmin && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop
          <div
            role="presentation"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={closeOverlay}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          {view === "feed" ? (
            <MediaFeed setView={setView} />
          ) : (
            <AdminPanel setView={setView} />
          )}
        </main>

        {isAdmin && (
          <div className="hidden xl:block w-80 flex-shrink-0 border-l border-border bg-sidebar overflow-y-auto">
            <RightSidebar />
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}
