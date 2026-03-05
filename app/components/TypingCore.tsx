import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface TypingState {
  typed: string;
  wpm: number;
  accuracy: number;
  timeLeft: number;
  isActive: boolean;
  isFinished: boolean;
  handleType: (val: string) => void;
  reset: () => void;
}

export function useTyping(text: string, timeLimit: number): TypingState {
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const wpm = useMemo(() => {
    const elapsed = (timeLimit - timeLeft) / 60;
    if (elapsed < 0.05) return 0;
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    return Math.round(words / elapsed);
  }, [typed, timeLeft, timeLimit]);

  const accuracy = useMemo(() => {
    if (typed.length === 0) return 100;
    const correct = typed.split("").filter((c, i) => c === text[i]).length;
    return Math.round((correct / typed.length) * 100);
  }, [typed, text]);

  useEffect(() => {
    if (isActive && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isFinished]);

  const handleType = useCallback(
    (val: string) => {
      if (isFinished) return;
      if (!isActive && val.length > 0) setIsActive(true);
      if (val.length <= text.length) setTyped(val);
    },
    [isFinished, isActive, text.length]
  );

  const reset = useCallback(() => {
    setTyped("");
    setIsActive(false);
    setTimeLeft(timeLimit);
    setIsFinished(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [timeLimit]);

  return { typed, wpm, accuracy, timeLeft, isActive, isFinished, handleType, reset };
}

// ─── Display Component ────────────────────────────────────────────────────────

export interface TypingColors {
  correct: string;
  error: string;
  untyped: string;
  cursor: string;
  errorBg: string;
}

interface TypingDisplayProps {
  text: string;
  typed: string;
  onType: (val: string) => void;
  onReset: () => void;
  colors: TypingColors;
  isFinished: boolean;
  isActive: boolean;
  fontSize?: string;
  lineHeight?: string;
  maxWidth?: string;
  cursorStyle?: "underline" | "block";
}

export function TypingDisplay({
  text,
  typed,
  onType,
  onReset,
  colors,
  isFinished,
  fontSize = "1.35rem",
  lineHeight = "2.8rem",
  maxWidth = "740px",
  cursorStyle = "underline",
}: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Tab to restart
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        onReset();
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [onReset]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      onClick={focusInput}
      style={{
        cursor: "text",
        position: "relative",
        width: "100%",
        maxWidth,
      }}
    >
      {/* Cursor blink & transition animations */}
      <style>{`
        @keyframes caretBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes caretBlockBlink {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0; }
        }
        .typing-caret-underline {
          animation: caretBlink 1.1s ease-in-out infinite;
        }
        .typing-caret-block {
          animation: caretBlockBlink 1.1s ease-in-out infinite;
        }
      `}</style>

      {/* Unfocused overlay — blurs text with a gentle prompt */}
      {!isFocused && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            gap: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              color: "rgba(224,224,224,0.25)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            кликните для фокуса
          </span>
        </div>
      )}

      {/* Borderless text display */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize,
          lineHeight,
          letterSpacing: "0.03em",
          userSelect: "none",
          filter: isFocused ? "none" : "blur(6px)",
          transition: "filter 0.25s ease",
          pointerEvents: "none",
        }}
      >
        {text.split("").map((char, i) => {
          const isTyped = i < typed.length;
          const isCurrent = i === typed.length && !isFinished;
          const isCorrect = isTyped && typed[i] === char;
          const isError = isTyped && typed[i] !== char;

          return (
            <span
              key={i}
              style={{
                position: "relative",
                color: isCorrect
                  ? colors.correct
                  : isError
                  ? colors.error
                  : colors.untyped,
                backgroundColor: isError ? colors.errorBg : "transparent",
                borderRadius: isError ? "2px" : "0",
                transition: "color 0.07s ease",
              }}
            >
              {/* Caret */}
              {isCurrent &&
                (cursorStyle === "underline" ? (
                  <span
                    className="typing-caret-underline"
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      left: 0,
                      width: "100%",
                      height: "2.5px",
                      backgroundColor: colors.cursor,
                      borderRadius: "2px",
                    }}
                  />
                ) : (
                  <span
                    className="typing-caret-block"
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: 0,
                      width: "100%",
                      bottom: "3px",
                      backgroundColor: colors.cursor,
                      borderRadius: "2px",
                      mixBlendMode: "overlay",
                    }}
                  />
                ))}
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => onType(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: "1px",
          height: "1px",
          top: 0,
          left: 0,
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  );
}
