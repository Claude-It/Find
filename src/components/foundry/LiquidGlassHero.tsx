import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

/*
 * Foundry hero background.
 *
 * One big liquid-glass block → breaks into a few bits → those bits break into
 * smaller bits → then everything merges back in the same order, on a loop.
 *
 * Geometry is expressed entirely in PERCENTAGES (no JS measurement), so it
 * renders identically on the server and client and never depends on a layout
 * pass to appear. Only `transform` + `opacity` animate — both GPU-composited —
 * so 32 tiles stay smooth. (The old version animated per-tile backdrop-filter
 * on ~84 nodes, which is what made it stutter.)
 */

const COLS = 8;
const ROWS = 4;
const TILE_COUNT = COLS * ROWS;

// Merge levels, fully merged → fully broken. Each is [groupCols, groupRows] and
// must divide the grid evenly (clean nesting).
const LEVELS: ReadonlyArray<readonly [number, number]> = [
  [1, 1], // 1 block  — one big liquid glass
  [2, 2], // 4 blocks
  [4, 2], // 8 blocks
  [8, 4], // 32 blocks — fully shattered
];

// Keyframe order through the loop: hold merged → break down → hold shattered →
// merge back in reverse. First and last frame match for a seamless loop.
const SEQ = [0, 0, 1, 2, 3, 3, 2, 1, 0] as const;
const TIMES = [0, 0.07, 0.2, 0.32, 0.46, 0.56, 0.7, 0.84, 1];
const DURATION = 10;

interface Props {
  className?: string;
}

export function LiquidGlassHero({ className = "" }: Props) {
  const reduce = useReducedMotion();

  const tiles = useMemo(() => {
    const result = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // home centre as a fraction of the container
        const hx = (c + 0.5) / COLS;
        const hy = (r + 0.5) / ROWS;

        const x: string[] = [];
        const y: string[] = [];
        const scaleX: number[] = [];
        const scaleY: number[] = [];
        const opacity: number[] = [];

        for (const li of SEQ) {
          const [gc, gr] = LEVELS[li];
          const groupCol = Math.floor(c / (COLS / gc));
          const groupRow = Math.floor(r / (ROWS / gr));
          // group centre as a fraction of the container
          const gx = (groupCol + 0.5) / gc;
          const gy = (groupRow + 0.5) / gr;

          // translate delta expressed as a % of THIS tile's own width/height
          // (tile width = 1/COLS of container, so multiply the container-delta
          // by COLS to convert into element-relative %).
          x.push(`${(gx - hx) * COLS * 100}%`);
          y.push(`${(gy - hy) * ROWS * 100}%`);
          scaleX.push(COLS / gc);
          scaleY.push(ROWS / gr);

          const tilesPerGroup = TILE_COUNT / (gc * gr);
          opacity.push(Math.min(0.85, 0.82 / tilesPerGroup));
        }

        result.push({
          key: `${r}-${c}`,
          left: `${(c * 100) / COLS}%`,
          top: `${(r * 100) / ROWS}%`,
          width: `${100 / COLS}%`,
          height: `${100 / ROWS}%`,
          x,
          y,
          scaleX,
          scaleY,
          opacity,
        });
      }
    }
    return result;
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* ambient glow behind the grid */}
      <div
        className="absolute inset-0 opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 35% 45%, oklch(0.78 0.16 195 / 0.55), transparent 55%), radial-gradient(circle at 75% 60%, oklch(0.72 0.18 320 / 0.45), transparent 60%)",
        }}
      />

      {/* bright core that flares while the block is whole */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.65, 0.65, 0.3, 0.08, 0.04, 0.08, 0.3, 0.5, 0.65] }}
          transition={{ duration: DURATION, times: TIMES, ease: "easeInOut", repeat: Infinity }}
        >
          <div
            className="h-[55%] w-[70%] rounded-[24%] blur-3xl"
            style={{
              background:
                "radial-gradient(circle, oklch(0.95 0.05 195 / 0.85), oklch(0.78 0.16 195 / 0.25) 60%, transparent 80%)",
            }}
          />
        </motion.div>
      )}

      {tiles.map((t) => (
        <motion.div
          key={t.key}
          className="absolute"
          style={{
            left: t.left,
            top: t.top,
            width: t.width,
            height: t.height,
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
          initial={false}
          animate={
            reduce
              ? { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 0.35 }
              : {
                  x: t.x,
                  y: t.y,
                  scaleX: t.scaleX,
                  scaleY: t.scaleY,
                  opacity: t.opacity,
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: DURATION, times: TIMES, ease: "easeInOut", repeat: Infinity }
          }
        >
          <div
            className="absolute"
            style={{
              inset: "6%",
              borderRadius: "16%",
              background: "linear-gradient(135deg, oklch(1 0 0 / 0.16), oklch(1 0 0 / 0.03))",
              border: "1px solid oklch(1 0 0 / 0.2)",
              boxShadow:
                "inset 0 1px 0 oklch(1 0 0 / 0.28), 0 18px 40px -22px oklch(0.78 0.16 195 / 0.4)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
