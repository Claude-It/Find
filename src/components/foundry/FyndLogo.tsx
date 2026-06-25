import type { CSSProperties } from "react";

interface FyndLogoProps {
  className?: string;
  /** Optional explicit pixel size (matches the liquid logo API). */
  size?: number;
  style?: CSSProperties;
}

export function FyndLogo({ className, size, style }: FyndLogoProps) {
  // "y" with two dots — one over each branch
  return (
    <span
      className={`font-display inline-flex items-baseline ${className ?? ""}`}
      style={{ fontSize: size, ...style }}
    >
      <span>f</span>
      <YWithDots />
      <span>nd</span>
    </span>
  );
}

function YWithDots() {
  return (
    <span className="relative inline-block" style={{ width: "0.62em" }}>
      {/* y glyph */}
      <span>y</span>
      {/* left dot — above left branch */}
      <span
        aria-hidden
        className="absolute rounded-full bg-current"
        style={{ width: "0.12em", height: "0.12em", left: "0.04em", top: "-0.18em" }}
      />
      {/* right dot — above right branch */}
      <span
        aria-hidden
        className="absolute rounded-full bg-current"
        style={{ width: "0.12em", height: "0.12em", left: "0.42em", top: "-0.18em" }}
      />
    </span>
  );
}
