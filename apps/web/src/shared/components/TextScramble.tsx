import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-*/=<>";

interface TextScrambleProps {
  text: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Animate on mount */
  auto?: boolean;
}

/**
 * Magic UI-level text scramble — characters randomly cycle then resolve.
 * Uses framer-motion for smooth per-character animation.
 */
export function TextScramble({
  text,
  duration = 0.8,
  className,
  style,
  auto = true,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(auto ? "" : text);
  const [key, setKey] = useState(0);
  const mounted = useRef(false);

  const trigger = () => {
    setDisplay("");
    setKey((k) => k + 1);
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (!auto) return;
    }
    trigger();
  }, [text, auto]);

  useEffect(() => {
    if (display !== "" && !auto) return;
    const target = [...text];
    const startTime = performance.now();
    let frame: number;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const result = target.map((t, i) => {
        if (t === " ") return " ";
        const resolvePoint = i / target.length;
        if (progress > resolvePoint + 0.15) return t;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
      setDisplay(result.join(""));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [key, text, duration, auto]);

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {display}
    </motion.span>
  );
}
