import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export interface TypingState {
  typed: string;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  consistency: number;
  errorCount: number;
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

export interface TypingDisplayProps {
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

export function useTyping(text: string, options: UseTypingOptions): TypingState {
  const { mode, timeLimit = 60, wordLimit = 25 } = options;
  
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const completedWordsCount = (typed.match(/ /g) || []).length;
  const wordsLeft = mode === "words" ? Math.max(0, wordLimit - completedWordsCount) : 0;

  const wpm = useMemo(() => {
    const elapsed = mode === "time" ? (timeLimit - timeLeft) / 60 : typed.length > 0 ? (Date.now() - startTimeRef.current) / 60000 : 0;
    if (elapsed < 0.05) return 0;
    const wordCount = typed.trim().split(/\s+/).filter(Boolean).length;
    return Math.round(wordCount / elapsed);
  }, [typed, timeLeft, timeLimit, mode]);

  const rawWpm = useMemo(() => {
    const elapsed = mode === "time" 
      ? (timeLimit - timeLeft) / 60 
      : typed.length > 0 
        ? (Date.now() - startTimeRef.current) / 60000 
        : 0;
    if (elapsed < 0.05) return 0;
    const allChars = typed.length;
    return Math.round((allChars / 5) / elapsed);
  }, [typed, timeLeft, timeLimit, mode]);

  const accuracy = useMemo(() => {
    if (typed.length === 0) return 100;
    const correct = typed.split("").filter((c, i) => c === text[i]).length;
    return Math.round((correct / typed.length) * 100);
  }, [typed, text]);

  const consistency = useMemo(() => {
    if (typed.length === 0) return 100;
    const correct = typed.split("").filter((c, i) => c === text[i]).length;
    return Math.round((correct / typed.length) * 100);
  }, [typed, text]);

  const errorCount = useMemo(() => {
    let errors = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== text[i]) errors++;
    }
    return errors;
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, isFinished, mode]);

  useEffect(() => {
    if (mode === "words" && completedWordsCount >= wordLimit && !isFinished && typed.length > 0) {
      setIsActive(false);
      setIsFinished(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [mode, wordLimit, completedWordsCount, isFinished, typed.length]);

  useEffect(() => { if (mode === "time") setTimeLeft(timeLimit); }, [timeLimit, mode]);

  const handleType = useCallback((val: string) => {
    if (isFinished) return;
    if (!isActive && val.length > 0) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }
    
    const spaceCount = (val.match(/ /g) || []).length;
    const typedWords = val.split(' ');
    const currentTypedWord = typedWords[spaceCount] || '';
    const wordsArray = text.split(' ');
    const currentWordIndex = spaceCount;
    
    if (currentWordIndex < wordsArray.length) {
      const currentWord = wordsArray[currentWordIndex];
      const extraLetters = currentTypedWord.length - currentWord.length;
      
      if (extraLetters > 7) {
        return;
      }
    }
    
    if (val.length <= text.length + 100) {
      setTyped(val);
    }
  }, [isFinished, isActive, text]);

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
    rawWpm,
    consistency,
    errorCount,
    timeLeft, 
    wordsLeft, 
    wordsCompleted: completedWordsCount, 
    isActive, 
    isFinished, 
    mode, 
    handleType, 
    reset 
  };
}

export function TypingDisplay({ text, typed, onType, onReset, colors, isFinished, fontSize = "36px", lineHeight = "40px", maxWidth = "1200px" }: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => text.split(" "), [text]);
  const completedWordsCount = (typed.match(/ /g) || []).length;

  const ERROR_COLOR = "#EF6C75";
  const CORRECT_COLOR = "#ffffff";
  const UNTYPED_COLOR = colors.untyped;
  const CURSOR_COLOR = colors.cursor || "#ff6b35";

  const fontSizeNum = parseInt(fontSize, 10) || 36;
  const avgCharWidth = fontSizeNum * 0.6;
  const containerWidth = typeof maxWidth === 'string' ? parseInt(maxWidth, 10) : maxWidth || 1200;
  const effectiveWidth = containerWidth - 40;

  const distributeWordsToLines = useCallback(() => {
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentWidth = 0;
    const wordSpacing = 16;
    const safeWidth = effectiveWidth * 0.95;
    
    for (let i = 0; i < words.length; i++) {
      const originalWord = words[i];
      const typedWord = typed.split(' ')[i] || "";
      const actualLength = Math.max(originalWord.length, typedWord.length);
      const wordWidth = actualLength * avgCharWidth + wordSpacing;
      
      if (currentWidth + wordWidth > safeWidth) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [originalWord];
        currentWidth = wordWidth;
      } else {
        currentLine.push(originalWord);
        currentWidth += wordWidth;
      }
    }
    
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  }, [words, typed, avgCharWidth, effectiveWidth]);

  const allLines = useMemo(() => distributeWordsToLines(), [distributeWordsToLines]);

  let activeLineIndex = 0;
  let wordCount = 0;
  for (let i = 0; i < allLines.length; i++) {
    if (completedWordsCount < wordCount + allLines[i].length) {
      activeLineIndex = i;
      break;
    }
    wordCount += allLines[i].length;
  }

  const visibleLineStart = Math.max(0, activeLineIndex - 1);
  const visibleLines = allLines.slice(visibleLineStart, visibleLineStart + 3);

  const getLineStartIndex = (lineIndex: number) => {
    let startIndex = 0;
    for (let i = 0; i < visibleLineStart + lineIndex; i++) {
      startIndex += allLines[i].length;
    }
    return startIndex;
  };

  const isLineCompleted = (lineIndex: number) => {
    const globalLineIndex = visibleLineStart + lineIndex;
    return globalLineIndex < activeLineIndex;
  };

  // ✅ ПРОВЕРКА ОШИБОК
  const hasWordErrors = (wordIndex: number, originalWord: string) => {
    const typedWord = typed.split(' ')[wordIndex] || "";
    
    if (!typedWord || typedWord.length === 0) return false;
    
    for (let i = 0; i < typedWord.length; i++) {
      if (i >= originalWord.length) return true;
      if (typedWord[i] !== originalWord[i]) return true;
    }
    
    return false;
  };

  // ✅ ПОЗИЦИЯ КУРСОРА - ИСПРАВЛЕНО
  const getCursorPosition = () => {
    if (!isFocused || isFinished) return null;
    
    const typedWords = typed.split(' ');
    const currentWordIndex = completedWordsCount;
    const currentTypedWord = typedWords[currentWordIndex] || "";
    
    return {
      wordIndex: currentWordIndex,
      charIndex: currentTypedWord.length  // ✅ Включает лишние буквы!
    };
  };

  const Cursor = () => (
    <span 
      style={{ 
        display: "inline-block",
        width: "3px",              // ✅ Чуть жирнее (было 2px)
        height: "1.5em",           // ✅ Длиннее по высоте (было 1.1em)
        backgroundColor: CURSOR_COLOR,
        marginLeft: "1px",
        marginRight: "-2px",       // ✅ Компенсация ширины
        marginBottom: "-0.2em",    // ✅ Сдвиг вниз чтобы центрировать
        borderRadius: "2px",       // ✅ Скруглённые углы (без острых краёв)
        verticalAlign: "text-bottom",
        animation: "cursorBlink 1s step-end infinite",
      }}
    />
  );

  // ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ РЕНДЕРА СЛОВ
  const renderWord = (word: string, globalIndex: number) => {
    const typedWord = typed.split(' ')[globalIndex] || "";
    const hasErrors = hasWordErrors(globalIndex, word);
    const cursorPos = getCursorPosition();
    const isCurrentWord = globalIndex === cursorPos?.wordIndex;
    
    // ✅ Длина для рендера = максимум из оригинала и введённого (для лишних букв)
    const displayLength = Math.max(word.length, typedWord.length);
    
    return (
      <span 
        key={globalIndex} 
        style={{ 
          display: "inline-block",
          marginRight: "16px", 
          color: CORRECT_COLOR,
          position: "relative",
          boxShadow: hasErrors ? `0 -3px 0 0 ${ERROR_COLOR} inset` : "none",
        }}
      >
        {/* ✅ КУРСОРОМ В НАЧАЛЕ (позиция 0) */}
        {isCurrentWord && cursorPos?.charIndex === 0 && isFocused && !isFinished && <Cursor />}
        
        {/* ✅ РЕНДЕРИМ КАЖДУЮ ПОЗИЦИЮ (буква + курсор после неё) */}
        {Array.from({ length: displayLength }, (_, pos: number) => {
          const originalChar = word[pos];
          const typedChar = typedWord[pos];
          const isTyped = pos < typedWord.length;
          const isError = isTyped && typedChar !== originalChar;
          const isExtra = pos >= word.length;
          
          return (
            <span key={`pos-${globalIndex}-${pos}`} style={{ display: "inline" }}>
              {/* Буква */}
              <span 
                style={{ 
                  color: isError ? ERROR_COLOR : isTyped ? CORRECT_COLOR : (isExtra ? ERROR_COLOR : UNTYPED_COLOR),
                  opacity: isTyped ? 1 : 0.5,
                  transition: "color 0.12s ease, opacity 0.12s ease",
                }}
              >
                {isExtra ? typedChar : originalChar}
              </span>
              {/* ✅ КУРСОРОМ ПОСЛЕ ЭТОЙ БУКВЫ */}
              {isCurrentWord && cursorPos?.charIndex === pos + 1 && isFocused && !isFinished && <Cursor />}
            </span>
          );
        })}
      </span>
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && isFinished) {
        e.preventDefault();
        onReset();
      }
    };
    
    if (isFinished) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFinished, onReset]);

  return (
    <div 
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
      style={{ 
        cursor: "text", 
        position: "relative",
        width: "100%", 
        maxWidth,
        margin: "0 0 0 200px",
        padding: "20px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize,
        lineHeight,
        boxSizing: "border-box",
      }}
    >
      {/* ✅ АНИМАЦИЯ КУРСОРА */}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      
      {!isFocused && !isFinished && (
        <div style={{ 
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
          transition: "opacity 0.3s ease" 
        }}>
          <span style={{ 
            fontFamily: "'JetBrains Mono', monospace", 
            fontSize: "14px", 
            color: "rgba(224,224,224,0.35)", 
            letterSpacing: "0.2em", 
            textTransform: "uppercase" 
          }}>
            кликните для фокуса
          </span>
        </div>
      )}
      
      <div 
        style={{ 
          opacity: isFocused || isFinished ? 1 : 0.5, 
          transition: "opacity 0.3s",
          filter: isFocused || isFinished ? "none" : "blur(6px)",
        }}
      >
        {visibleLines[0] && (
          <div style={{ 
            height: lineHeight,
            marginBottom: "20px", 
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            opacity: isLineCompleted(0) ? 0.3 : 1,
            transition: "opacity 0.3s",
          }}>
            {visibleLines[0].map((word: string, i: number) => 
              renderWord(word, getLineStartIndex(0) + i)
            )}
          </div>
        )}
        
        {visibleLines[1] && (
          <div style={{ 
            height: lineHeight,
            marginBottom: "20px", 
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            opacity: 1,
          }}>
            {visibleLines[1].map((word: string, i: number) => 
              renderWord(word, getLineStartIndex(1) + i)
            )}
          </div>
        )}
        
        {visibleLines[2] && (
          <div style={{ 
            height: lineHeight,
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            opacity: 0.5,
          }}>
            {visibleLines[2].map((word: string, i: number) => 
              renderWord(word, getLineStartIndex(2) + i)
            )}
          </div>
        )}
      </div>
      
      {isFinished && (
        <button
          onClick={onReset}
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "200px",
            transform: "translateX(0)",
            padding: "10px 24px",
            background: "rgba(255,107,53,0.1)",
            border: "1px solid rgba(255,107,53,0.3)",
            borderRadius: "8px",
            color: "#ff6b35",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,107,53,0.2)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,107,53,0.1)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.3)";
          }}
        >
          Начать заново (Tab)
        </button>
      )}
      
      <input 
        ref={inputRef} 
        value={typed} 
        onChange={(e) => onType(e.target.value)} 
        onFocus={() => setIsFocused(true)} 
        onBlur={() => setIsFocused(false)} 
        disabled={isFinished}
        style={{ 
          position: "absolute", 
          opacity: 0, 
          pointerEvents: "none", 
          width: "1px", 
          height: "1px", 
        }} 
        autoComplete="off" 
        autoCorrect="off" 
        autoCapitalize="off" 
        spellCheck={false}
      />
    </div>
  );
}