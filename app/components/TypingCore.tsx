// app/components/TypingCore.tsx

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

export interface TypingState {
  typed: string;
  wpm: number;
  accuracy: number;
  timeLeft: number;
  wordsLeft: number;
  wordsCompleted: number;
  isActive: boolean;
  isFinished: boolean;
  mode: "time" | "words";
  handleType: (val: string) => void;
  reset: () => void;
}

export interface UseTypingOptions {
  mode: "time" | "words";
  timeLimit?: number;
  wordLimit?: number;
}

export interface TypingColors {
  correct: string;
  error: string;
  untyped: string;
  cursor: string;
  errorBg: string;
}

export function useTyping(
  text: string,
  options: UseTypingOptions
): TypingState {
  const { mode, timeLimit = 60, wordLimit = 25 } = options;
  
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const completedWordsCount = (typed.match(/ /g) || []).length;
  const wordsLeft = mode === "words" 
    ? Math.max(0, wordLimit - completedWordsCount)
    : 0;

  const wpm = useMemo(() => {
    const elapsed = mode === "time" 
      ? (timeLimit - timeLeft) / 60 
      : typed.length > 0 
        ? (Date.now() - startTimeRef.current) / 60000 
        : 0;
    if (elapsed < 0.05) return 0;
    const wordCount = typed.trim().split(/\s+/).filter(Boolean).length;
    return Math.round(wordCount / elapsed);
  }, [typed, timeLeft, timeLimit, mode]);

  const accuracy = useMemo(() => {
    if (typed.length === 0) return 100;
    const correct = typed.split("").filter((c, i) => c === text[i]).length;
    return Math.round((correct / typed.length) * 100);
  }, [typed, text]);

  useEffect(() => {
    if (isActive && !isFinished && mode === "time") {
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
  }, [isActive, isFinished, mode]);

  useEffect(() => {
    if (mode === "words" && completedWordsCount >= wordLimit && !isFinished && typed.length > 0) {
      setIsActive(false);
      setIsFinished(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [mode, wordLimit, completedWordsCount, isFinished, typed.length]);

  useEffect(() => {
    if (mode === "time") {
      setTimeLeft(timeLimit);
    }
  }, [timeLimit, mode]);

  const handleType = useCallback(
    (val: string) => {
      if (isFinished) return;
      if (!isActive && val.length > 0) {
        setIsActive(true);
        startTimeRef.current = Date.now();
      }
      if (val.length <= text.length) setTyped(val);
    },
    [isFinished, isActive, text.length]
  );

  const reset = useCallback(() => {
    setTyped("");
    setIsActive(false);
    setTimeLeft(timeLimit);
    setIsFinished(false);
    startTimeRef.current = Date.now();
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [timeLimit]);

  return {
    typed,
    wpm,
    accuracy,
    timeLeft,
    wordsLeft,
    wordsCompleted: completedWordsCount,
    isActive,
    isFinished,
    mode,
    handleType,
    reset,
  };
}

// ─── Display Component ────────────────────────────────────────────────────────

interface TypingDisplayProps {
  text: string;
  typed: string;
  onType: (val: string) => void;
  onReset: () => void;
  colors: TypingColors;
  isFinished: boolean;
  fontSize?: string;
  lineHeight?: string;
  maxWidth?: string;
}

export function TypingDisplay({
  text,
  typed,
  onType,
  onReset,
  colors,
  isFinished,
  fontSize = "1.4rem",
  lineHeight = "2.7rem",
  maxWidth = "760px",
}: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const words = useMemo(() => text.split(" "), [text]);
  const completedWordsCount = (typed.match(/ /g) || []).length;
  const typedWords = useMemo(() => {
    const trimmed = typed.trimEnd();
    return trimmed === "" ? [] : trimmed.split(" ");
  }, [typed]);

  const wordsPerLine = 10;
  const currentLineIndex = Math.floor(completedWordsCount / wordsPerLine);
  
  const line1Start = Math.max(0, (currentLineIndex - 1) * wordsPerLine);
  const line1End = Math.min(words.length, currentLineIndex * wordsPerLine);
  
  const line2Start = currentLineIndex * wordsPerLine;
  const line2End = Math.min(words.length, (currentLineIndex + 1) * wordsPerLine);
  
  const line3Start = (currentLineIndex + 1) * wordsPerLine;
  const line3End = Math.min(words.length, (currentLineIndex + 2) * wordsPerLine);

  const line1Words = words.slice(line1Start, line1End);
  const line2Words = words.slice(line2Start, line2End);
  const line3Words = words.slice(line3Start, line3End);

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

  const currentWordIndex = completedWordsCount;
  const ERROR_COLOR = "#BE4B58";
  const CORRECT_COLOR = "#ffffff";
  const UNTYPED_COLOR = colors.untyped;

  const renderWord = (word: string, globalWordIndex: number) => {
    const typedWord = typedWords[globalWordIndex] || "";
    
    const isCurrentWord = globalWordIndex === currentWordIndex;
    const isPastWord = globalWordIndex < currentWordIndex;
    const isUntyped = globalWordIndex > currentWordIndex;

    return (
      <span
        key={globalWordIndex}
        style={{
          display: "inline",
          position: "relative",
          marginRight: "0.6em",
          color: isUntyped ? UNTYPED_COLOR : CORRECT_COLOR,
          transition: "color 0.07s ease",
          borderBottom: isCurrentWord && !isFinished ? `2px solid ${colors.cursor}` : "none",
        }}
      >
        {word.split("").map((char, charIndex) => {
          const isTyped = charIndex < typedWord.length;
          const isCurrentChar = isCurrentWord && charIndex === typedWord.length;
          const isCorrect = isTyped && typedWord[charIndex] === char;
          const isError = isTyped && typedWord[charIndex] !== char;

          let charColor = UNTYPED_COLOR;
          
          if (isPastWord || isCurrentWord) {
            if (isError) {
              charColor = ERROR_COLOR;
            } else if (isCorrect) {
              charColor = CORRECT_COLOR;
            } else {
              charColor = UNTYPED_COLOR;
            }
          }

          return (
            <span
              key={charIndex}
              style={{
                position: "relative",
                color: charColor,
                transition: "color 0.07s ease",
              }}
            >
              {isCurrentChar && isFocused && !isFinished && (
                <span
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
              )}
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div
      onClick={focusInput}
      style={{
        cursor: "text",
        position: "relative",
        width: "100%",
        maxWidth,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
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
            backgroundColor: "rgba(43,45,49,0.4)",
            backdropFilter: "blur(6px)",
            borderRadius: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              color: "rgba(224,224,224,0.35)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            кликните для фокуса
          </span>
        </div>
      )}

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
          textAlign: "center",
        }}
      >
        {line1Words.length > 0 && (
          <div style={{ marginBottom: "0.3em", opacity: 0.5 }}>
            {line1Words.map((word, i) => renderWord(word, line1Start + i))}
          </div>
        )}
        
        {line2Words.length > 0 && (
          <div style={{ marginBottom: "0.3em" }}>
            {line2Words.map((word, i) => renderWord(word, line2Start + i))}
          </div>
        )}
        
        {line3Words.length > 0 && (
          <div style={{ opacity: 0.5 }}>
            {line3Words.map((word, i) => renderWord(word, line3Start + i))}
          </div>
        )}
      </div>

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