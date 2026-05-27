import { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-*/=<>";

interface TextScrambleProps {
  text: string;
  duration?: number;
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scrambles text character by character, then resolves to the target text.
 * 099.supply brutalist effect.
 */
export function TextScramble({
  text,
  duration = 800,
  interval = 40,
  className,
  style,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const chars = [...text];
    const target = chars.map((c) => c === " " ? " " : c);
    let current = chars.map(() => CHARS[Math.floor(Math.random() * CHARS.length)]);
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);

      current = current.map((_c, i) => {
        if (progress === 1) return target[i];
        // Each character resolves at a random point
        const resolvePoint = 0.3 + Math.random() * 0.5;
        if (progress > resolvePoint) return target[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplay(current.join(""));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [text, duration, interval]);

  return (
    <span className={className} style={style}>
      {display}
    </span>
  );
}
