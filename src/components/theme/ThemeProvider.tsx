import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeName = "liquid" | "foundry";

export const THEME_STORAGE_KEY = "fynd-theme";
export const CHOSEN_STORAGE_KEY = "fynd-design-chosen";
export const DEFAULT_THEME: ThemeName = "liquid";

export const THEMES: Record<
  ThemeName,
  { id: ThemeName; name: string; tagline: string; vibe: string }
> = {
  liquid: {
    id: "liquid",
    name: "Liquid Glass",
    tagline: "Warm, editorial, serif.",
    vibe: "Amber & mint on deep ink — soft glass, liquid blobs, an unhurried feel.",
  },
  foundry: {
    id: "foundry",
    name: "Foundry",
    tagline: "Cool, neon, web3.",
    vibe: "Cyan & magenta on slate — shattered glass, glow, a high-tech edge.",
  },
};

interface ThemeContextValue {
  /** The currently active theme. */
  theme: ThemeName;
  /** Apply a theme (persisted + reflected on <html data-theme>). */
  setTheme: (theme: ThemeName) => void;
  /** Has the user committed to a design yet? Gates the intro flow. */
  chosen: boolean;
  /** Commit to a design (dismisses the intro). */
  commitDesign: (theme: ThemeName) => void;
  /** True once mounted on the client — avoids SSR/hydration flashes. */
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeAttribute(theme: ThemeName) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);
  const [chosen, setChosen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage once on the client.
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
      const storedChosen = localStorage.getItem(CHOSEN_STORAGE_KEY) === "1";
      if (storedTheme === "liquid" || storedTheme === "foundry") {
        setThemeState(storedTheme);
        applyThemeAttribute(storedTheme);
      } else {
        applyThemeAttribute(DEFAULT_THEME);
      }
      setChosen(storedChosen);
    } catch {
      applyThemeAttribute(DEFAULT_THEME);
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    applyThemeAttribute(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }, []);

  const commitDesign = useCallback(
    (next: ThemeName) => {
      setTheme(next);
      setChosen(true);
      try {
        localStorage.setItem(CHOSEN_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    },
    [setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, chosen, commitDesign, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

/**
 * Inline script string injected into <head> so the correct theme is applied
 * before first paint (prevents a flash of the default theme on reload).
 */
export const NO_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="liquid"&&t!=="foundry"){t="${DEFAULT_THEME}";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","${DEFAULT_THEME}");}})();`;
