import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LiquidLanding } from "@/components/liquid/Landing";
import { FoundryLanding } from "@/components/foundry/Landing";
import { DesignOwnership } from "@/components/intro/DesignOwnership";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { theme, chosen, mounted } = useTheme();
  // Re-opening the picker from the landing "Design" buttons (settings entry).
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSettings = () => setSettingsOpen(true);

  // The intro shows on first visit; the settings panel shows on demand.
  const showIntro = mounted && !chosen;
  const showSettings = mounted && chosen && settingsOpen;

  return (
    <>
      {/* The pre-login landing, rendered in the active theme. */}
      {theme === "foundry" ? (
        <FoundryLanding onOpenSettings={openSettings} />
      ) : (
        <LiquidLanding onOpenSettings={openSettings} />
      )}

      {/* "Hi there" + own-your-design overlay. */}
      <AnimatePresence>
        {showIntro && <DesignOwnership key="intro" mode="intro" onClose={() => {}} />}
        {showSettings && (
          <DesignOwnership
            key="settings"
            mode="settings"
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
