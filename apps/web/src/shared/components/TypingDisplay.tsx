import { useMemo } from "react";

interface TypingDisplayProps {
  text: string;
  currentIndex: number;
  errors: number[];
}

interface CharStatus {
  char: string;
  index: number;
  isError: boolean;
  isTyped: boolean;
  isCaret: boolean;
  isSpace: boolean;
}

/**
 * Renders text with per-character highlighting.
 * Words are wrapped in inline-block containers to prevent mid-word breaks.
 */
export function TypingDisplay({ text, currentIndex, errors }: TypingDisplayProps) {
  const errorSet = useMemo(() => new Set(errors), [errors]);

  const chars: CharStatus[] = useMemo(() => {
    return [...text].map((char, i) => ({
      char,
      index: i,
      isError: errorSet.has(i),
      isTyped: i < currentIndex,
      isCaret: i === currentIndex,
      isSpace: char === " ",
    }));
  }, [text, currentIndex, errorSet]);

  // Split into word groups (spaces between words are rendered as regular spaces)
  const words = useMemo(() => {
    const groups: CharStatus[][] = [];
    let current: CharStatus[] = [];

    for (const ch of chars) {
      if (ch.isSpace) {
        if (current.length > 0) {
          groups.push(current);
          current = [];
        }
        // Render space as a dedicated element for spacing
        groups.push([ch]);
      } else {
        current.push(ch);
      }
    }
    if (current.length > 0) groups.push(current);
    return groups;
  }, [chars]);

  const charClass = (ch: CharStatus): string => {
    if (ch.isSpace) return "text-transparent";
    if (ch.isTyped && ch.isError) return "text-red-500 line-through";
    if (ch.isTyped) return "text-green-400";
    return "text-text-muted/40";
  };

  return (
    <div
      className="font-mono text-2xl leading-relaxed text-center select-none"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "normal",
      }}
    >
      {words.map((word, wi) => {
        // Space group — just render a space
        if (word.length === 1 && word[0].isSpace) {
          return <span key={wi} data-space="true"> </span>;
        }

        // Word group — render as inline-block to prevent mid-word breaks
        return (
          <span
            key={wi}
            data-word="true"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.map((ch) => (
              <span key={ch.index} className={`relative ${charClass(ch)}`}>
                {ch.isCaret && (
                  <span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent animate-pulse"
                    style={{ animationDuration: "1.1s" }}
                  />
                )}
                {ch.char}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
