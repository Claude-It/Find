import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import {
  useTheme,
  THEMES,
  type ThemeName,
} from "@/components/theme/ThemeProvider";
import { ThemePreview } from "./ThemePreview";

type Phase = "hello" | "choose";

interface DesignOwnershipProps {
  /** "intro" = first visit (greeting + commit). "settings" = re-open to change. */
  mode: "intro" | "settings";
  onClose: () => void;
}

const GREETING = ["Hi", "there."];

export function DesignOwnership({ mode, onClose }: DesignOwnershipProps) {
  const { theme, setTheme, commitDesign } = useTheme();
  const [phase, setPhase] = useState<Phase>(mode === "intro" ? "hello" : "choose");
  const [selected, setSelected] = useState<ThemeName>(theme);

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Escape closes when in settings mode.
  useEffect(() => {
    if (mode !== "settings") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, onClose]);

  // Live-preview: applying the theme immediately updates everything behind.
  function pick(next: ThemeName) {
    setSelected(next);
    setTheme(next);
  }

  function confirm() {
    if (mode === "intro") {
      commitDesign(selected);
    } else {
      setTheme(selected);
    }
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop — slightly translucent so the live themed page peeks through. */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-xl" />

      {mode === "settings" && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {phase === "hello" ? (
          <Hello key="hello" onContinue={() => setPhase("choose")} />
        ) : (
          <Choose
            key="choose"
            mode={mode}
            selected={selected}
            onPick={pick}
            onConfirm={confirm}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- Phase 1: greeting ---------------- */
function Hello({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      className="relative z-10 mx-auto max-w-xl text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        Welcome to Fÿnd
      </motion.div>

      <h1 className="font-display text-7xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
        {GREETING.map((word, i) => (
          <motion.span
            key={word}
            className="mr-3 inline-block"
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        ))}
      </h1>

      <motion.p
        className="mx-auto mt-6 max-w-md text-base text-muted-foreground md:text-lg"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Before you dive in, let's make Fÿnd feel like yours. Pick the look you vibe with —
        you can always change it later in settings.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-10"
      >
        <button
          onClick={onContinue}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[var(--shadow-glow)] cursor-pointer"
        >
          Own your design
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Phase 2: design picker ---------------- */
function Choose({
  mode,
  selected,
  onPick,
  onConfirm,
}: {
  mode: "intro" | "settings";
  selected: ThemeName;
  onPick: (t: ThemeName) => void;
  onConfirm: () => void;
}) {
  const order: ThemeName[] = ["liquid", "foundry"];
  return (
    <motion.div
      className="relative z-10 mx-auto w-full max-w-4xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {mode === "intro" ? "Own your design." : "Change your design."}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Two looks, one Fÿnd. Tap a card to preview it live —{" "}
          <span className="text-foreground">you can switch any time in settings.</span>
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {order.map((id) => {
          const meta = THEMES[id];
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => onPick(id)}
              className={[
                "group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 cursor-pointer",
                active
                  ? "border-primary bg-white/[0.06] shadow-[var(--shadow-glow)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
              ].join(" ")}
            >
              {/* selected check */}
              <span
                className={[
                  "absolute right-4 top-4 z-10 inline-flex size-7 items-center justify-center rounded-full transition-all",
                  active ? "bg-primary text-primary-foreground scale-100" : "bg-white/10 text-transparent scale-90",
                ].join(" ")}
              >
                <Check className="size-4" />
              </span>

              <div className="h-44 w-full">
                <ThemePreview theme={id} />
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-foreground">{meta.name}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {meta.tagline}
                  </div>
                </div>
                {id === "liquid" && (
                  <span className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{meta.vibe}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-9 flex items-center justify-center">
        <button
          onClick={onConfirm}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[var(--shadow-glow)] cursor-pointer"
        >
          {mode === "intro" ? `Enter Fÿnd with ${THEMES[selected].name}` : "Save design"}
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground/70">
        Find this again under <span className="text-foreground/80">Design</span> in the nav.
      </p>
    </motion.div>
  );
}
