interface FyndLogoProps {
  className?: string;
  size?: number;
}

/**
 * Custom Fÿnd wordmark. The "y" has two dots — one on each upper branch.
 */
export function FyndLogo({ className, size = 28 }: FyndLogoProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.05em",
        fontFamily: "var(--font-display-theme)",
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.04em",
        color: "var(--color-foreground)",
      }}
    >
      <span>f</span>
      <YWithDots size={size} />
      <span>nd</span>
    </span>
  );
}

function YWithDots({ size }: { size: number }) {
  const dot = size * 0.11;
  return (
    <span style={{ position: "relative", display: "inline-block", lineHeight: 1 }}>
      <span>y</span>
      {/* left branch dot */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: `-${size * 0.05}px`,
          left: `${size * 0.05}px`,
          width: dot,
          height: dot,
          borderRadius: "999px",
          background: "var(--color-ember)",
          boxShadow: "0 0 12px var(--color-ember-glow)",
        }}
      />
      {/* right branch dot */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: `-${size * 0.05}px`,
          left: `${size * 0.42}px`,
          width: dot,
          height: dot,
          borderRadius: "999px",
          background: "var(--color-mint)",
          boxShadow: "0 0 12px oklch(0.84 0.13 165 / 0.8)",
        }}
      />
    </span>
  );
}
