import type { ThemeName } from "@/components/theme/ThemeProvider";

/**
 * A small, self-contained mock of each theme used inside the design picker.
 * Colors are hard-coded (not CSS vars) so both previews render their own look
 * regardless of the currently active theme.
 */

const PALETTES: Record<
  ThemeName,
  {
    bg: string;
    surface: string;
    text: string;
    sub: string;
    a: string;
    b: string;
    c: string;
    font: string;
    italic: boolean;
  }
> = {
  liquid: {
    bg: "oklch(0.16 0.012 60)",
    surface: "oklch(0.22 0.014 60 / 0.7)",
    text: "oklch(0.97 0.01 80)",
    sub: "oklch(0.68 0.02 70)",
    a: "oklch(0.82 0.17 70)", // ember
    b: "oklch(0.84 0.13 165)", // mint
    c: "oklch(0.72 0.16 295)", // violet
    font: '"Instrument Serif", ui-serif, Georgia, serif',
    italic: true,
  },
  foundry: {
    bg: "oklch(0.08 0.015 250)",
    surface: "oklch(0.14 0.02 250 / 0.7)",
    text: "oklch(0.97 0.01 250)",
    sub: "oklch(0.65 0.03 250)",
    a: "oklch(0.78 0.16 195)", // cyan
    b: "oklch(0.8 0.15 175)", // teal
    c: "oklch(0.72 0.18 320)", // magenta
    font: '"Space Grotesk", "Inter", sans-serif',
    italic: false,
  },
};

export function ThemePreview({ theme }: { theme: ThemeName }) {
  const p = PALETTES[theme];
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl"
      style={{ background: p.bg }}
      aria-hidden
    >
      {/* ambient blobs */}
      <div
        className="absolute -left-6 -top-8 h-28 w-28 rounded-full"
        style={{ background: p.a, opacity: 0.55, filter: "blur(28px)" }}
      />
      <div
        className="absolute -right-8 top-4 h-24 w-24 rounded-full"
        style={{ background: p.b, opacity: 0.45, filter: "blur(30px)" }}
      />
      <div
        className="absolute bottom-[-2rem] left-1/3 h-28 w-28 rounded-full"
        style={{ background: p.c, opacity: 0.4, filter: "blur(32px)" }}
      />

      {/* mini chrome */}
      <div className="relative flex h-full flex-col p-4">
        <div className="flex items-center justify-between">
          <span
            style={{ fontFamily: p.font, color: p.text, fontSize: 16, letterSpacing: "-0.04em" }}
          >
            fÿnd
          </span>
          <span
            className="rounded-full px-2 py-0.5"
            style={{ background: p.a, color: p.bg, fontSize: 8, fontWeight: 600 }}
          >
            {theme === "foundry" ? "WEB3" : "DEFAULT"}
          </span>
        </div>

        <div className="mt-auto">
          <div
            style={{
              fontFamily: p.font,
              color: p.text,
              fontSize: 26,
              lineHeight: 1,
              fontStyle: p.italic ? "italic" : "normal",
            }}
          >
            Work, vetted.
          </div>
          <div style={{ color: p.sub, fontSize: 10, marginTop: 6 }}>Gigs, instant.</div>

          <div className="mt-3 flex gap-1.5">
            <span
              className="rounded-full px-2 py-1"
              style={{ background: p.a, color: p.bg, fontSize: 8, fontWeight: 600 }}
            >
              Start
            </span>
            <span
              className="rounded-full px-2 py-1"
              style={{
                border: `1px solid ${p.sub}`,
                color: p.text,
                fontSize: 8,
                background: p.surface,
              }}
            >
              Bounty
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
