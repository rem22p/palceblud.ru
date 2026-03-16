import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export interface TypingState {
  typed: string;
  wpm: number; // Теперь здесь хранится CPM
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
  showIntroAnimation?: boolean;
  isActive?: boolean;
  wpm?: number;
  accuracy?: number;
  progress?: number;
}

export function useTyping(text: string, options: UseTypingOptions): TypingState {
  const { mode, timeLimit = 60, wordLimit = 25 } = options;
  
  const [typed, setTyped] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const completedWordsCount = (typed.match(/ /g) || []).length;
  const wordsLeft = mode === "words" ? Math.max(0, wordLimit - completedWordsCount) : 0;

  // --- РАСЧЕТ CPM (ЗНАКОВ В МИНУТУ) ---
  const wpm = useMemo(() => {
    if (typed.length === 0) return 0;
    
    let elapsedMinutes = 0;
    if (mode === "time") {
      elapsedMinutes = (timeLimit - timeLeft) / 60;
    } else {
      elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    }

    if (elapsedMinutes < 0.01) return 0;
    
    // ФОРМУЛА CPM: Общее количество символов / Минуты
    const cpm = Math.round(typed.length / elapsedMinutes);
    
    return Math.min(Math.max(cpm, 0), 600); // Лимит увеличен до 600 для CPM
  }, [typed, timeLeft, timeLimit, mode]);

  const rawWpm = useMemo(() => {
     if (typed.length === 0) return 0;
     let elapsedMinutes = 0;
     if (mode === "time") {
       elapsedMinutes = (timeLimit - timeLeft) / 60;
     } else {
       elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
     }
     if (elapsedMinutes < 0.01) return 0;
     return Math.round((typed.length / 5) / elapsedMinutes);
  }, [typed, timeLeft, timeLimit, mode]);

  const accuracy = useMemo(() => {
    if (typed.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
    }
    return Math.round((correct / typed.length) * 100);
  }, [typed, text]);

  const consistency = useMemo(() => {
    if (typed.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
    }
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
        setTimeLeft((t: number) => {
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
    wpm, // Теперь это CPM
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

// --- СПИДОМЕТР (ПЛАВНОСТЬ УВЕЛИЧЕНА В 2 РАЗА) ---
function StatsBar({ wpm, accuracy, progress, isActive }: { wpm: number, accuracy: number, progress: number, isActive: boolean }) {
  const maxWpm = 600; // Лимит для CPM
  
  const percentage = Math.min(Math.max(wpm / maxWpm, 0), 1);
  const angle = -90 + (percentage * 180);

  const dim_color = "#333";
  const main_color = "#e0e0e0";
  const accent_color = "#ff6b35";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      margin: "-200px auto 20px auto",
      fontFamily: "'JetBrains Mono', monospace",
      opacity: isActive ? 1 : 0.1,
      transition: "opacity 0.3s ease",
      pointerEvents: "none",
    }}>
      <div style={{ position: "relative", width: "360px", height: "210px" }}>
        <svg width="360" height="210" viewBox="0 0 360 210" style={{ overflow: "visible" }}>
          {/* Фон дуги */}
          <path d="M 30 180 A 150 150 0 0 1 330 180" fill="none" stroke={dim_color} strokeWidth="12" strokeLinecap="round" />
          
          {/* Активная дуга (заполнение) */}
          <path 
            d="M 30 180 A 150 150 0 0 1 330 180" 
            fill="none" 
            stroke={accent_color} 
            strokeWidth="12" 
            strokeLinecap="butt" 
            strokeDasharray="471"
            strokeDashoffset={471 - (percentage * 471)}
            style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
          />

          {/* Риски (Сверху) */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const deg = 180 + (i * 18);
            const rad = (deg * Math.PI) / 180;
            const rInner = 150 - 20;
            const rOuter = 150;
            const x1 = 180 + rInner * Math.cos(rad);
            const y1 = 180 + rInner * Math.sin(rad);
            const x2 = 180 + rOuter * Math.cos(rad);
            const y2 = 180 + rOuter * Math.sin(rad);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={dim_color} strokeWidth="2" />
            );
          })}

          {/* СТРЕЛКА (ПЛАВНОСТЬ УВЕЛИЧЕНА В 2 РАЗА: 0.12s -> 0.24s) */}
          <g transform={`rotate(${angle}, 180, 180)`} style={{ transition: "transform 0.24s cubic-bezier(0.25, 0.1, 0.25, 1)" }}>
            {/* Тело стрелки (треугольник) */}
            <path 
              d="M 176 180 L 180 50 L 184 180 Z" 
              fill="#fff" 
              style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
            />
            {/* Основание (круглый шарнир) */}
            <circle cx="180" cy="180" r="10" fill="#fff" />
            {/* Декоративный центр шарнира */}
            <circle cx="180" cy="180" r="4" fill={accent_color} />
          </g>

          {/* ЦИФРЫ (ПОВЕРХ СТРЕЛКИ) */}
          <text 
            x="180" 
            y="145" 
            textAnchor="middle" 
            fill={main_color} 
            fontSize="64" 
            fontWeight="bold" 
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              zIndex: 10
            }}
          >
            {wpm}
          </text>

          {/* ПОДПИСЬ CPM */}
          <text 
            x="180" 
            y="175" 
            textAnchor="middle" 
            fill={dim_color} 
            fontSize="16" 
            fontWeight="600" 
            style={{ letterSpacing: "4px" }}
          >
            CPM
          </text>

        </svg>
      </div>

      {/* Прогресс бар */}
      <div style={{ width: "300px", height: "6px", backgroundColor: dim_color, borderRadius: "3px", overflow: "hidden", marginTop: "15px" }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: accent_color,
          transition: "width 0.2s ease-out",
          boxShadow: `0 0 10px ${accent_color}40`
        }} />
      </div>
    </div>
  );
}

export function TypingDisplay({ text, typed, onType, onReset, colors, isFinished, fontSize = "36px", lineHeight = "40px", maxWidth = "1200px", showIntroAnimation = false, isActive = false, wpm = 0, accuracy = 100, progress = 0 }: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(showIntroAnimation);
  const [cursorTarget, setCursorTarget] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorRAFRef = useRef<number | null>(null);
  const cursorCurrentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const words = useMemo(() => text.split(" "), [text]);
  const completedWordsCount = (typed.match(/ /g) || []).length;
  
  const localProgress = useMemo(() => {
     if (progress > 0) return progress;
     const totalWords = words.length;
     return totalWords > 0 ? (completedWordsCount / totalWords) * 100 : 0;
  }, [progress, completedWordsCount, words.length]);

  const ERROR_COLOR = "#EF6C75";
  const CORRECT_COLOR = "#ffffff";
  const UNTYPED_COLOR = colors.untyped;
  const CURSOR_COLOR = colors.cursor || "#ff6b35";

  const fontSizeNum = parseInt(fontSize, 10) || 36;
  const avgCharWidth = fontSizeNum * 0.6;
  const containerWidth = typeof maxWidth === 'string' ? parseInt(maxWidth, 10) : maxWidth || 1200;
  const effectiveWidth = containerWidth - 40;
  const lineHeightNum = parseInt(lineHeight, 10) || 40;

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

  const hasWordErrors = (wordIndex: number, originalWord: string) => {
    const typedWord = typed.split(' ')[wordIndex] || "";
    if (!typedWord || typedWord.length === 0) return false;
    for (let i = 0; i < typedWord.length; i++) {
      if (i >= originalWord.length) return true;
      if (typedWord[i] !== originalWord[i]) return true;
    }
    return false;
  };

  const getCursorPosition = () => {
    if (!isFocused || isFinished) return null;
    const typedWords = typed.split(' ');
    const currentWordIndex = completedWordsCount;
    const currentTypedWord = typedWords[currentWordIndex] || "";
    return {
      wordIndex: currentWordIndex,
      charIndex: currentTypedWord.length
    };
  };

  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  useEffect(() => {
    if (!isAnimating) return;
    const animateCursor = () => {
      const current = { ...cursorCurrentRef.current };
      const target = { ...cursorTarget };
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0.1) {
        const overshoot = 1.07;
        const progressVal = Math.min(1, distance / (avgCharWidth * 0.5));
        const eased = easeOutQuart(progressVal) * overshoot;
        const clampedEased = Math.min(eased, 1.07);
        cursorCurrentRef.current = {
          x: current.x + dx * clampedEased * 0.25,
          y: current.y + dy * clampedEased * 0.25,
        };
        cursorRAFRef.current = requestAnimationFrame(animateCursor);
      } else {
        if (Math.abs(current.x - target.x) > 0.01 || Math.abs(current.y - target.y) > 0.01) {
          cursorCurrentRef.current = {
            x: current.x + (target.x - current.x) * 0.15,
            y: current.y + (target.y - current.y) * 0.15,
          };
          cursorRAFRef.current = requestAnimationFrame(animateCursor);
        }
      }
    };
    animateCursor();
    return () => { if (cursorRAFRef.current) cancelAnimationFrame(cursorRAFRef.current); };
  }, [cursorTarget, avgCharWidth, isAnimating]);

  useEffect(() => {
    if (showIntroAnimation && !isAnimating) {
      setIsAnimating(true);
      setAnimProgress(0);
      cursorCurrentRef.current = { x: 0, y: 0 };
      setCursorTarget({ x: 0, y: 0 });
      const totalChars = text.length;
      const baseDelay = 65;
      let currentIndex = 0;
      const animate = () => {
        if (currentIndex < totalChars) {
          const variation = Math.random() * 30 - 15;
          const delay = Math.max(50, Math.min(80, baseDelay + variation));
          const nextGlobalIndex = currentIndex + 1;
          const nextLineIndex = Math.floor(nextGlobalIndex / 40);
          const nextCharInLine = nextGlobalIndex % 40;
          const nextX = nextCharInLine * avgCharWidth;
          const nextY = nextLineIndex * lineHeightNum;
          setCursorTarget({ x: nextX, y: nextY });
          setTimeout(() => { setAnimProgress(nextGlobalIndex); }, 30);
          currentIndex = nextGlobalIndex;
          animTimeoutRef.current = setTimeout(animate, delay);
        } else {
          setTimeout(() => { setIsAnimating(false); setAnimProgress(0); }, 200);
        }
      };
      animTimeoutRef.current = setTimeout(animate, 300);
    }
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (cursorRAFRef.current) cancelAnimationFrame(cursorRAFRef.current);
    };
  }, [showIntroAnimation, text, avgCharWidth, lineHeightNum]);

  const Cursor = ({ x, y }: { x: number; y: number }) => (
    <span style={{ position: "absolute", left: 0, top: 0, width: "3px", height: "1.5em", backgroundColor: CURSOR_COLOR, borderRadius: "2px", transform: `translate3d(${x}px, ${y}px, 0)`, willChange: "transform", animation: "cursorBlinkTypewriter 1s steps(1) infinite", opacity: isFocused && !isFinished ? 1 : 0, pointerEvents: "none", zIndex: 10, boxShadow: `0 0 8px 2px ${CURSOR_COLOR}50, 0 0 20px 4px ${CURSOR_COLOR}20` }} />
  );

  const WordUnderline = ({ wordIndex, lineIndex, progress }: { wordIndex: number; lineIndex: number; progress: number }) => {
    const word = words[wordIndex];
    const hasErrors = hasWordErrors(wordIndex, word);
    if (progress <= 0 && !hasErrors) return null;
    const wordStartGlobalIndex = getLineStartIndex(lineIndex);
    const wordStartX = (wordIndex - wordStartGlobalIndex) * avgCharWidth * 1.4;
    const wordWidth = word.length * avgCharWidth;
    return (
      <span style={{ position: "absolute", left: wordStartX, bottom: "-4px", height: "2px", width: `${wordWidth * Math.min(1, progress)}px`, backgroundColor: ERROR_COLOR, borderRadius: "1px", transition: "width 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)", opacity: hasErrors ? 1 : 0.7, willChange: "width" }} />
    );
  };

  const renderWord = (word: string, globalIndex: number, lineIndex: number) => {
    const typedWord = typed.split(' ')[globalIndex] || "";
    const hasErrors = hasWordErrors(globalIndex, word);
    const cursorPos = getCursorPosition();
    const isCurrentWord = globalIndex === cursorPos?.wordIndex;
    const displayLength = Math.max(word.length, typedWord.length);
    const wordStartGlobalIndex = getLineStartIndex(lineIndex);
    const underlineProgress = typedWord.length > 0 ? Math.min(1, typedWord.length / word.length) : 0;
    
    return (
      <span key={globalIndex} style={{ display: "inline-block", marginRight: "16px", color: CORRECT_COLOR, position: "relative", boxShadow: hasErrors && !isAnimating ? `0 -3px 0 0 ${ERROR_COLOR} inset` : "none" }}>
        {!isAnimating && <WordUnderline wordIndex={globalIndex} lineIndex={lineIndex} progress={underlineProgress} />}
        {Array.from({ length: displayLength }, (_, pos: number) => {
          const originalChar = word[pos];
          const typedChar = typedWord[pos];
          const isTyped = pos < typedWord.length;
          const isError = isTyped && typedChar !== originalChar;
          const isExtra = pos >= word.length;
          const globalCharIndex = wordStartGlobalIndex + pos;
          const shouldShow = !isAnimating || animProgress > globalCharIndex;
          const appearProgress = isAnimating ? Math.max(0, Math.min(1, (animProgress - globalCharIndex) * 2.5)) : 1;
          const charColor = isError ? ERROR_COLOR : isTyped ? CORRECT_COLOR : (isExtra ? ERROR_COLOR : UNTYPED_COLOR);
          return (
            <span key={`pos-${globalIndex}-${pos}`} style={{ display: "inline" }}>
              <span style={{ color: charColor, opacity: shouldShow ? (isTyped ? 1 : 0.5) * appearProgress : 0, transform: `scale(${0.9 + appearProgress * 0.1})`, transition: "color 0.06s ease, opacity 0.07s ease, transform 0.07s ease", display: "inline-block", willChange: "opacity, transform" }}>
                {isExtra ? typedChar : originalChar}
              </span>
            </span>
          );
        })}
        {isAnimating && <Cursor x={cursorCurrentRef.current.x} y={cursorCurrentRef.current.y} />}
        {!isAnimating && isCurrentWord && isFocused && !isFinished && cursorPos && <Cursor x={cursorPos.charIndex * avgCharWidth} y={0} />}
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
    <div ref={containerRef} onClick={() => inputRef.current?.focus()} style={{ cursor: "text", position: "relative", width: "100%", maxWidth, margin: "0 auto", padding: "20px", fontFamily: "'JetBrains Mono', monospace", fontSize, lineHeight, boxSizing: "border-box", backgroundColor: "", borderRadius: "12px", minHeight: "200px" }}>
      <style>{`@keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } } @keyframes cursorBlinkTypewriter { 0%, 70% { opacity: 1; } 70%, 100% { opacity: 0; } }`}</style>
      
      {/* ПАНЕЛЬ СТАТИСТИКИ */}
      <StatsBar wpm={wpm} accuracy={accuracy} progress={localProgress} isActive={isActive || isFocused} />

      {!isFocused && !isFinished && !isAnimating && (
        <div style={{ position: "fixed", top: "55%", left: "50%", transform: "translate(-50%, -50%)", height: "180px", width: "100%", maxWidth: "1200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50, gap: "8px", backgroundColor: "rgba(42, 43, 46, 0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "16px", transition: "opacity 0.3s ease" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", color: "rgba(224,224,224,0.8)", letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center" }}>кликните для фокуса</span>
        </div>
      )}
      
      <div style={{ opacity: isFocused || isFinished || isAnimating ? 1 : 0.5, transition: "opacity 0.3s", filter: isFocused || isFinished || isAnimating ? "none" : "blur(6px)" }}>
        {visibleLines[0] && (<div style={{ height: lineHeight, marginBottom: "20px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", opacity: isLineCompleted(0) ? 0.3 : 1, transition: "opacity 0.3s" }}>{visibleLines[0].map((word: string, i: number) => renderWord(word, getLineStartIndex(0) + i, 0))}</div>)}
        {visibleLines[1] && (<div style={{ height: lineHeight, marginBottom: "20px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", opacity: 1 }}>{visibleLines[1].map((word: string, i: number) => renderWord(word, getLineStartIndex(1) + i, 1))}</div>)}
        {visibleLines[2] && (<div style={{ height: lineHeight, width: "100%", whiteSpace: "nowrap", overflow: "hidden", opacity: 0.5 }}>{visibleLines[2].map((word: string, i: number) => renderWord(word, getLineStartIndex(2) + i, 2))}</div>)}
      </div>
      
      {isFinished && (
        <button onClick={onReset} style={{ position: "absolute", bottom: "-50px", left: "200px", transform: "translateX(0)", padding: "10px 24px", background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "8px", color: "#ff6b35", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,107,53,0.2)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.5)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,107,53,0.1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.3)"; }}>Начать заново (Tab)</button>
      )}
      
      <input ref={inputRef} value={typed} onChange={(e) => onType(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} disabled={isFinished || isAnimating} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: "1px", height: "1px" }} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
    </div>
  );
}