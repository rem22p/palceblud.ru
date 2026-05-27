import { useState } from "react";
import { motion } from "framer-motion";

interface KineticTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Magic UI-level kinetic text. Characters lift and scale on hover.
 * Uses framer-motion spring physics for fluid feel.
 */
export function KineticText({
  text,
  className,
  style,
}: KineticTextProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const chars = [...text];

  return (
    <span
      className={className}
      style={{ display: "inline", cursor: "default", ...style }}
    >
      {chars.map((char, i) => {
        const isActive = hovered !== null;
        const distance = isActive ? Math.abs(i - hovered!) : Infinity;
        const influence = distance <= 2 ? 1 - distance / 3 : 0;

        return (
          <motion.span
            key={i}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            animate={{
              y: influence * -4,
              scale: 1 + influence * 0.1,
              color:
                distance === 0 && isActive
                  ? "var(--accent)"
                  : "var(--text)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}
