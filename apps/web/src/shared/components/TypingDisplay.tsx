import { useMemo } from "react";

interface TypingDisplayProps {
  text: string;
  currentIndex: number;
  errors: number[];
}

/**
 * Renders text with per-character status highlighting.
 * - Correct chars: green
 * - Incorrect chars: red with strike-through
 * - Pending chars: muted gray
 * - Caret at current position
 */
export function TypingDisplay({ text, currentIndex, errors }: TypingDisplayProps) {
  const chars = useMemo(() => [...text], [text]);
  const errorSet = useMemo(() => new Set(errors), [errors]);

  return (
    <div
      className="font-mono text-2xl leading-relaxed tracking-wide text-center select-none"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
      }}
    >
      {chars.map((char, i) => {
        const isError = errorSet.has(i);
        const isTyped = i < currentIndex;
        const isCaret = i === currentIndex;

        let colorClass = "text-text-muted/40"; // pending
        if (isTyped && isError) colorClass = "text-red-500 line-through";
        else if (isTyped) colorClass = "text-green-400";

        return (
          <span
            key={i}
            className={`relative ${colorClass}`}
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {isCaret && (
              <span
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent animate-pulse"
                style={{ animationDuration: "1.1s" }}
              />
            )}
            {char === " " ? " " : char}
          </span>
        );
      })}
    </div>
  );
}
