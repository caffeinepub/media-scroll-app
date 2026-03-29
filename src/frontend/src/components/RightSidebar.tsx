import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSettings, useUpdateAppSettings } from "../hooks/useQueries";

const ACCENT_COLORS = [
  { value: "blue", label: "Blue", color: "oklch(0.60 0.22 261)" },
  { value: "purple", label: "Purple", color: "oklch(0.53 0.22 280)" },
  { value: "green", label: "Green", color: "oklch(0.66 0.18 162)" },
  { value: "orange", label: "Orange", color: "oklch(0.73 0.18 70)" },
];

export default function RightSidebar() {
  const { data: settings } = useAppSettings();
  const updateSettings = useUpdateAppSettings();

  const [appName, setAppName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("blue");

  useEffect(() => {
    if (settings) {
      const parts = settings.theme.split("-");
      setAppName(settings.appName);
      setTheme(parts[0] ?? "dark");
      setAccent(parts[1] ?? "blue");
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        appName,
        theme: `${theme}-${accent}`,
      });
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="p-5 space-y-6">
      <div>
        <h2 className="font-display font-semibold text-sm text-foreground mb-4">
          App Settings
        </h2>

        {/* App Name */}
        <div className="space-y-2 mb-5">
          <Label
            htmlFor="app-name"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            App Name
          </Label>
          <Input
            id="app-name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="My Media App"
            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-9"
            data-ocid="settings.input"
          />
        </div>

        {/* Theme Toggle */}
        <div className="space-y-2 mb-5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Theme
          </Label>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors border ${
                  theme === t
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="settings.toggle"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Color Accent */}
        <div className="space-y-2 mb-6">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Color Accent
          </Label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setAccent(c.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  accent === c.value
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="settings.button"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="w-full"
          data-ocid="settings.submit_button"
        >
          {updateSettings.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {updateSettings.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
