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
    
    if (val.length <= text.length + 50) {
      setTyped(val);
    }
  }, [isFinished, isActive, text.length]);

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

export function TypingDisplay({ text, typed, onType, onReset, colors, isFinished, fontSize = "36px", lineHeight = "40px", maxWidth = "400px" }: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const words = useMemo(() => text.split(" "), [text]);
  const completedWordsCount = (typed.match(/ /g) || []).length;
  const typedWords = useMemo(() => { const trimmed = typed.trimEnd(); return trimmed === "" ? [] : trimmed.split(" "); }, [typed]);

  const wordsPerLine = 7;
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

  // ✅ ВЫЧИСЛЯЕМ ПОЗИЦИЮ КУРСОРА
  useEffect(() => {
    if (!textContainerRef.current || !isFocused || isFinished) return;
    
    const container = textContainerRef.current;
    const allChars = container.querySelectorAll('[data-char-index]');
    const spaceCount = (typed.match(/ /g) || []).length;
    
    // ✅ Если ввели больше пробелов чем слов - курсор в конце
    if (spaceCount >= words.length) {
      const lastChar = allChars[allChars.length - 1] as HTMLElement;
      if (lastChar) {
        const rect = lastChar.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setCursorPosition({
          top: rect.top - containerRect.top,
          left: rect.right - containerRect.left
        });
      }
      return;
    }
    
    const currentWordIndex = spaceCount;
    const currentWord = words[currentWordIndex];
    const typedInCurrentWord = typed.split(' ')[spaceCount] || '';
    
    // ✅ БЕЗ +1 для пробелов! В DOM только буквы
    const completedCharsBefore = words.slice(0, currentWordIndex).reduce((acc: number, word: string) => {
      return acc + word.length;
    }, 0);
    
    const cursorInWord = Math.min(typedInCurrentWord.length, currentWord.length);
    const cursorCharIndex = completedCharsBefore + cursorInWord;
    
    if (cursorCharIndex === 0 && allChars[0]) {
      const firstChar = allChars[0] as HTMLElement;
      const rect = firstChar.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setCursorPosition({
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left
      });
      return;
    }
    
    const targetChar = allChars[cursorCharIndex - 1] as HTMLElement;
    const nextChar = allChars[cursorCharIndex] as HTMLElement;
    
    if (nextChar) {
      const rect = nextChar.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setCursorPosition({
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left
      });
    } else if (targetChar) {
      const rect = targetChar.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setCursorPosition({
        top: rect.top - containerRect.top,
        left: rect.right - containerRect.left
      });
    }
  }, [typed, isFocused, isFinished, words]);

  useEffect(() => {
    if (!isFocused || isFinished) { 
      setShowCursor(false); 
      return; 
    }
    const hasTypedAnything = typed.length > 0;
    if (!hasTypedAnything) {
      const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530);
      return () => clearInterval(cursorInterval);
    } else { 
      setShowCursor(true); 
    }
  }, [isFocused, isFinished, typed.length]);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") { e.preventDefault(); onReset(); setTimeout(() => inputRef.current?.focus(), 50); }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [onReset]);

  const focusInput = () => inputRef.current?.focus();
  const currentWordIndex = completedWordsCount;
  const ERROR_COLOR = "#EF6C75";
  const CORRECT_COLOR = "#ffffff";
  const UNTYPED_COLOR = colors.untyped;

  const wordUnderlineStatus = useMemo(() => {
    const status: Record<number, boolean> = {};
    
    words.forEach((originalWord: string, idx: number) => {
      const typedWord = typedWords[idx] || "";
      const isCurrentWord = idx === currentWordIndex;
      
      if (isCurrentWord) return;
      
      if (typedWord.length > 0) {
        const hasErrors = typedWord.split("").some((char: string, i: number) => char !== originalWord[i]);
        const isIncomplete = typedWord.length < originalWord.length;
        
        if (hasErrors || isIncomplete) {
          status[idx] = true;
        }
      }
    });
    
    return status;
  }, [typedWords, words, currentWordIndex]);

  const renderWord = (word: string, globalWordIndex: number) => {
    const typedWord = typedWords[globalWordIndex] || "";
    const isCurrentWord = globalWordIndex === currentWordIndex;
    const isPastWord = globalWordIndex < currentWordIndex;
    const isUntyped = globalWordIndex > currentWordIndex;

    const hasErrorOrUntyped = wordUnderlineStatus[globalWordIndex] === true;

    return (
      <span 
        key={globalWordIndex} 
        style={{ 
          display: "inline-block", 
          position: "relative", 
          marginRight: "16px", 
          color: isUntyped ? UNTYPED_COLOR : CORRECT_COLOR, 
          transition: "color 0.25s ease",
          borderBottom: hasErrorOrUntyped ? `3px solid ${ERROR_COLOR}` : "none",
        }}
      >
        {word.split("").map((char: string, charIndex: number) => {
          // ✅ БЕЗ +1 для пробелов!
          const globalCharIndex = words.slice(0, globalWordIndex).reduce((acc: number, w: string) => 
            acc + w.length, 0) + charIndex;
          const isTyped = charIndex < typedWord.length;
          const isError = isTyped && typedWord[charIndex] !== char;
          let charColor = UNTYPED_COLOR;
          if (isPastWord || isCurrentWord) {
            if (isError) charColor = ERROR_COLOR;
            else if (isTyped) charColor = CORRECT_COLOR;
          }
          return (
            <span 
              key={charIndex} 
              data-char-index={globalCharIndex}
              style={{ 
                position: "relative", 
                color: charColor, 
                transition: "color 0.2s cubic-bezier(0.4, 0, 0.2, 1)", 
                display: "inline-block",
                willChange: "color",
              }}
            >
              {char}
            </span>
          );
        })}
        {typedWord.length > word.length && (
          <span 
            style={{ 
              color: ERROR_COLOR, 
              opacity: 0.7,
              transition: "opacity 0.2s ease",
            }}
          >
            {typedWord.slice(word.length)}
          </span>
        )}
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
        padding: "20px", 
        boxSizing: "border-box" 
      }}
    >
      <style>{`@keyframes cursorBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.3; } }`}</style>
      {!isFocused && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, gap: "8px", backgroundColor: "rgba(43,45,49,0.4)", backdropFilter: "blur(6px)", borderRadius: "8px", transition: "opacity 0.3s ease" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "rgba(224,224,224,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>кликните для фокуса</span>
        </div>
      )}
      <div 
        ref={textContainerRef}
        style={{ 
          fontFamily: "'JetBrains Mono', monospace", 
          fontSize, 
          lineHeight, 
          letterSpacing: "0", 
          userSelect: "none", 
          filter: isFocused ? "none" : "blur(6px)", 
          transition: "filter 0.3s ease", 
          pointerEvents: "none", 
          textAlign: "center",
          position: "relative",
          display: "inline-block",
        }}
      >
        {line1Words.length > 0 && (
          <div style={{ marginBottom: "20px", opacity: 0.5, whiteSpace: "nowrap" }}>
            {line1Words.map((word: string, i: number) => renderWord(word, line1Start + i))}
          </div>
        )}
        {line2Words.length > 0 && (
          <div style={{ marginBottom: "20px", whiteSpace: "nowrap" }}>
            {line2Words.map((word: string, i: number) => renderWord(word, line2Start + i))}
          </div>
        )}
        {line3Words.length > 0 && (
          <div style={{ opacity: 0.5, whiteSpace: "nowrap" }}>
            {line3Words.map((word: string, i: number) => renderWord(word, line3Start + i))}
          </div>
        )}
        
        {isFocused && !isFinished && showCursor && (
          <span
            style={{
              position: "absolute",
              top: `${cursorPosition.top}px`,
              left: `${cursorPosition.left}px`,
              width: "4px",
              height: "1.3em",
              backgroundColor: colors.cursor,
              borderRadius: "2px",
              transition: "top 0.08s cubic-bezier(0.4, 0, 0.2, 1), left 0.08s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "top, left",
              animation: "cursorBlink 1s ease-in-out infinite",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
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
          left: 0 
        }} 
        autoComplete="off" 
        autoCorrect="off" 
        autoCapitalize="off" 
        spellCheck={false} 
      />
    </div>
  );
}