import { useState, useCallback } from "react";

interface KineticTextProps {
  text: string;
  tag?: "h1" | "h2" | "span";
  className?: string;
  style?: React.CSSProperties;
  /** Per-character style */
  charStyle?: (char: string, index: number) => React.CSSProperties;
}

/**
 * Characters that shift on hover — 099.supply kinetic effect.
 */
export function KineticText({
  text,
  tag: Tag = "h1",
  className,
  style,
  charStyle,
}: KineticTextProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleMouseEnter = useCallback((i: number) => setHovered(i), []);
  const handleMouseLeave = useCallback(() => setHovered(null), []);

  const chars = [...text];

  return (
    <Tag
      className={className}
      style={{ display: "inline", cursor: "default", ...style }}
    >
      {chars.map((char, i) => {
        const isActive = hovered !== null && Math.abs(i - hovered) <= 2;
        const offset = isActive ? (i - hovered) * 2 : 0;
        const scale = isActive ? 1.08 : 1;
        const color =
          isActive && i === hovered ? "var(--accent)" : undefined;

        return (
          <span
            key={i}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            style={{
              display: "inline-block",
              transform: `translateY(${offset}px) scale(${scale})`,
              transition: "transform 120ms var(--ease-out), color 120ms var(--ease-out)",
              color,
              ...charStyle?.(char, i),
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </Tag>
  );
}
