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
  fontSize = "1.4rem",
  lineHeight = "2.7rem",
  maxWidth = "760px",
  cursorStyle = "underline",
}: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Разбиваем текст на слова
  const words = useMemo(() => text.split(" "), [text]);
  
  // Считаем количество завершённых слов по пробелам
  const completedWordsCount = (typed.match(/ /g) || []).length;
  
  // Разбиваем введенный текст на слова (убираем конечные пробелы)
  const typedWords = useMemo(() => {
    const trimmed = typed.trimEnd();
    return trimmed === "" ? [] : trimmed.split(" ");
  }, [typed]);

  // Количество слов в строке
  const wordsPerLine = 10;
  
  // Определяем текущую строку ввода
  const currentLineIndex = Math.floor(completedWordsCount / wordsPerLine);
  
  // Три строки: прошлая, текущая (ввод), следующая
  const line1Start = Math.max(0, (currentLineIndex - 1) * wordsPerLine);
  const line1End = Math.min(words.length, currentLineIndex * wordsPerLine);
  
  const line2Start = currentLineIndex * wordsPerLine;
  const line2End = Math.min(words.length, (currentLineIndex + 1) * wordsPerLine);
  
  const line3Start = (currentLineIndex + 1) * wordsPerLine;
  const line3End = Math.min(words.length, (currentLineIndex + 2) * wordsPerLine);

  const line1Words = words.slice(line1Start, line1End);
  const line2Words = words.slice(line2Start, line2End);
  const line3Words = words.slice(line3Start, line3End);

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

  // Текущее слово = количество пробелов (завершённых слов)
  const currentWordIndex = completedWordsCount;

  // Компонент для рендеринга слова
  const renderWord = (word: string, globalWordIndex: number) => {
    const typedWord = typedWords[globalWordIndex] || "";
    
    const isCurrentWord = globalWordIndex === currentWordIndex;
    const isPastWord = globalWordIndex < currentWordIndex;
    const isUntyped = globalWordIndex > currentWordIndex;
    
    let wordColor = colors.untyped;
    
    if (isPastWord) {
      const isWordCorrect = typedWord === word;
      wordColor = isWordCorrect ? colors.correct : colors.error;
    } else if (isCurrentWord) {
      const firstErrorIndex = typedWord.split("").findIndex((char, i) => char !== word[i]);
      if (firstErrorIndex !== -1) {
        wordColor = colors.error;
      } else if (typedWord.length > 0) {
        wordColor = colors.correct;
      }
    }

    return (
      <span
        key={globalWordIndex}
        style={{
          display: "inline",
          position: "relative",
          marginRight: "0.6em",
          color: isUntyped ? colors.untyped : wordColor,
          transition: "color 0.07s ease",
          borderBottom: isCurrentWord && !isFinished ? `2px solid ${colors.cursor}` : "none",
        }}
      >
        {word.split("").map((char, charIndex) => {
          const isTyped = charIndex < typedWord.length;
          const isCurrentChar = isCurrentWord && charIndex === typedWord.length;
          const isCorrect = isTyped && typedWord[charIndex] === char;
          const isError = isTyped && typedWord[charIndex] !== char;

          return (
            <span
              key={charIndex}
              style={{
                position: "relative",
                color: isCurrentWord
                  ? isCorrect
                    ? colors.correct
                    : isError
                    ? colors.error
                    : colors.untyped
                  : isPastWord
                  ? typedWord === word
                    ? colors.correct
                    : colors.error
                  : colors.untyped,
                transition: "color 0.07s ease",
              }}
            >
              {isCurrentChar && isFocused && !isFinished && (
                <span
                  className={cursorStyle === "underline" ? "typing-caret-underline" : "typing-caret-block"}
                  style={{
                    position: "absolute",
                    bottom: cursorStyle === "underline" ? "3px" : "3px",
                    left: 0,
                    width: "100%",
                    height: cursorStyle === "underline" ? "2.5px" : "auto",
                    backgroundColor: colors.cursor,
                    borderRadius: "2px",
                    opacity: cursorStyle === "underline" ? undefined : 0.85,
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
      }}
    >
      <style>{`
        @keyframes caretBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes caretBlockBlink {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0; }
        }
      `}</style>

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