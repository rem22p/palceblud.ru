import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSettingsStore } from "../features/settings/store/settingsStore";
import { keyboardSound } from "../lib/keyboardSound";

export interface TypingState {
  typed: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  errorCount: number;
  timeLeft: number;
  wordsLeft: number;
  wordsCompleted: number;
  isActive: boolean;
  isFinished: boolean;
  isPaused: boolean;
  mode: "time" | "words";
  handleType: (val: string) => void;
  reset: () => void;
  togglePause: () => void;
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
  isActive?: boolean;
  wpm?: number;
  accuracy?: number;
  isPaused?: boolean;
  togglePause?: () => void;
  mode?: "time" | "words";
  timeLimit?: number;
  timeLeft?: number;
}

export function useTyping(text: string, options: UseTypingOptions): TypingState {
  const { mode, timeLimit = 60, wordLimit = 25 } = options;

  const [typed, setTyped] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [displayStats, setDisplayStats] = useState<{ wpm: number, rawWpm: number, accuracy: number, consistency: number, errorCount: number }>({ wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);

  const completedWordsCount = (typed.match(/ /g) || []).length;
  const wordsLeft = mode === "words" ? Math.max(0, wordLimit - completedWordsCount) : 0;

  // Вычисляем статистику только если не пауза
  const computedStats = useMemo(() => {
    if (typed.length === 0) return { wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 };
    
    let elapsedMinutes = 0;
    if (mode === "time") {
      elapsedMinutes = (timeLimit - timeLeft) / 60;
    } else {
      elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    }
    if (elapsedMinutes < 0.01) return { wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 };
    
    const cpm = Math.round(typed.length / elapsedMinutes);
    const wpm = Math.min(Math.max(cpm, 0), 600);
    const rawWpm = Math.round((typed.length / 5) / elapsedMinutes);
    
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
      else errors++;
    }
    const accuracy = Math.round((correct / typed.length) * 100);
    
    return { wpm, rawWpm, accuracy, consistency: accuracy, errorCount: errors };
  }, [typed, timeLeft, timeLimit, mode, text, isPaused]);

  // Возвращаем либо замороженную статистику (пауза), либо текущую
  const stats = isPaused ? displayStats : computedStats;
  const wpm = stats.wpm;
  const rawWpm = stats.rawWpm;
  const accuracy = stats.accuracy;
  const consistency = stats.consistency;
  const errorCount = stats.errorCount;

  useEffect(() => {
    if (isActive && !isFinished && !isPaused && mode === "time") {
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
  }, [isActive, isFinished, isPaused, mode]);

  useEffect(() => {
    if (mode === "words" && completedWordsCount >= wordLimit && !isFinished && typed.length > 0) {
      setIsActive(false);
      setIsFinished(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [mode, wordLimit, completedWordsCount, isFinished, typed.length]);

  useEffect(() => { if (mode === "time") setTimeLeft(timeLimit); }, [timeLimit, mode]);

  const handleType = useCallback((val: string) => {
    if (isFinished || isPaused) return;
    
    if (!isActive && val.length > 0) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    const prevSpaceCount = (typed.match(/ /g) || []).length;
    const newSpaceCount = (val.match(/ /g) || []).length;

    // Обработка пробела - переход к следующему слову
    if (newSpaceCount > prevSpaceCount) {
      const typedWords = typed.split(' ');
      const currentTypedWord = typedWords[prevSpaceCount] || '';
      // Запрещаем пробел если слово пустое (ничего не введено)
      if (currentTypedWord.length === 0) {
        return;
      }
    }

    const spaceCount = (val.match(/ /g) || []).length;
    const typedWords = val.split(' ');
    const currentTypedWord = typedWords[spaceCount] || '';
    const wordsArray = text.split(' ');
    const currentWordIndex = spaceCount;

    if (currentWordIndex < wordsArray.length) {
      const currentWord = wordsArray[currentWordIndex];
      const extraLetters = currentTypedWord.length - currentWord.length;
      if (extraLetters > 7) return;
    }

    setTyped(val);
  }, [isFinished, isPaused, isActive, typed, text]);

  const reset = useCallback(() => {
    setTyped("");
    setIsActive(false);
    setTimeLeft(timeLimit);
    setIsFinished(false);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [timeLimit]);

  const togglePause = useCallback(() => {
    console.log('togglePause called, isPaused:', isPaused, 'typed.length:', typed.length);
    if (isFinished || typed.length === 0) return;
    if (isPaused) {
      // Возобновление - сбрасываем замороженную статистику
      console.log('Resuming...');
      setIsPaused(false);
      setDisplayStats({ wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 });
    } else {
      // Пауза - сохраняем текущую статистику для отображения
      console.log('Pausing...');
      let elapsedMinutes = 0;
      if (mode === "time") {
        elapsedMinutes = (timeLimit - timeLeft) / 60;
      } else {
        elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      }

      const currentWpm = elapsedMinutes >= 0.01 ? Math.round(typed.length / elapsedMinutes) : 0;
      const currentRawWpm = elapsedMinutes >= 0.01 ? Math.round((typed.length / 5) / elapsedMinutes) : 0;

      let correct = 0;
      let errors = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === text[i]) correct++;
        else errors++;
      }
      const currentAccuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

      console.log('Freezing stats:', { wpm: currentWpm, rawWpm: currentRawWpm, accuracy: currentAccuracy });
      setDisplayStats({
        wpm: currentWpm,
        rawWpm: currentRawWpm,
        accuracy: currentAccuracy,
        consistency: currentAccuracy,
        errorCount: errors
      });

      setIsPaused(true);
      pausedTimeRef.current = Date.now();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isFinished, isPaused, typed.length, mode, timeLimit, timeLeft, text]);

  return {
    typed, wpm, accuracy, rawWpm, consistency, errorCount, timeLeft, wordsLeft, wordsCompleted: completedWordsCount, isActive, isFinished, isPaused, mode, handleType, reset, togglePause
  };
}

export function TypingDisplay({ text, typed, onType, onReset, colors, isFinished, fontSize: propFontSize, lineHeight: propLineHeight, maxWidth: propMaxWidth, isActive: _isActive, wpm: _wpm, accuracy: _accuracy, isPaused, togglePause, mode = "words", timeLimit = 60, timeLeft = 60 }: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPausedInternal, setIsPausedInternal] = useState<boolean>(false);
  const [blurEnabled, setBlurEnabled] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const cursorPosRef = useRef<{ x: number; y: number }>({ x: 60, y: 0 });
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 60, y: 0 });
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Обёртка для onType - игнорирует ввод пока не в фокусе
  const handleTypeWrapper = useCallback((val: string) => {
    if (!isFocused && typed.length === 0) return;
    onType(val);
  }, [onType, isFocused, typed.length]);

  const effectiveIsPaused = isPaused !== undefined ? isPaused : isPausedInternal;
  const effectiveTogglePause = togglePause !== undefined ? togglePause : () => setIsPausedInternal(p => !p);

  const settingsFontSize = useSettingsStore((state) => state.fontSize);
  const settingsLineHeight = useSettingsStore((state) => state.lineHeight);
  const settingsMaxWidth = useSettingsStore((state) => state.maxWidth);
  const settingsFontFamily = useSettingsStore((state) => state.fontFamily);
  const settingsAccentColor = useSettingsStore((state) => state.accentColor);
  const settingsCursorBlink = useSettingsStore((state) => state.cursorBlink);
  const settingsSoundEnabled = useSettingsStore((state) => state.soundEnabled);
  const settingsSoundVolume = useSettingsStore((state) => state.soundVolume);

  const fontSize = propFontSize || `${settingsFontSize || 24}px`;
  const lineHeight = propLineHeight || `${settingsLineHeight || 48}px`;
  const maxWidth = propMaxWidth || settingsMaxWidth || 1200;
  const fontFamily = settingsFontFamily || "JetBrains Mono";
  const fontFamilyStack = `${fontFamily}, 'JetBrains Mono', 'Cascadia Code', 'Consolas', 'Lucida Console', 'Courier New', monospace`;
  const accentColor = settingsAccentColor || "#60a5fa";
  const cursorBlink = settingsCursorBlink !== undefined ? settingsCursorBlink : true;
  const soundEnabled = settingsSoundEnabled;
  const soundVolume = settingsSoundVolume;

  const words = useMemo(() => text.split(" "), [text]);
  const completedWordsCount = (typed.match(/ /g) || []).length;

  // Сбрасываем фокус при смене текста (новый урок) - чтобы был блюр
  useEffect(() => {
    setIsFocused(false);
  }, [text]);

  // Обработчик клика для снятия блюра
  const handleContainerClick = useCallback(() => {
    setIsFocused(true);
    inputRef.current?.focus();
  }, []);

  // Обработчик нажатия пробела для снятия блюра
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused && e.key === ' ' && typed.length === 0 && !isFinished) {
        e.preventDefault();
        setIsFocused(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isFocused, typed.length, isFinished]);

  // Глобальный обработчик ESC и TAB для паузы
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      
      if (e.key === 'Escape') {
        e.preventDefault();
        togglePause?.();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isFinished, togglePause, onReset]);

  const ERROR_COLOR = colors.error || "#ca4754";
  const CORRECT_COLOR = colors.correct || "#e0e0e0";
  const UNTYPED_COLOR = colors.untyped || "rgba(224,224,224,0.2)";

  const fontSizeNum = parseInt(fontSize, 10) || 32;
  const avgCharWidth = fontSizeNum * 0.6;
  const containerWidth = typeof maxWidth === 'string' ? parseInt(maxWidth, 10) : maxWidth || 1400;
  const effectiveWidth = containerWidth;
  const lineHeightNum = parseInt(lineHeight, 10) || 64;

  const cursorWordIndex = completedWordsCount;
  const currentTypedWord = typed.split(' ')[cursorWordIndex] || "";
  const cursorCharPos = currentTypedWord.length;
  const showCursor = isFocused && !effectiveIsPaused && !isFinished;

  useEffect(() => {
    if (!showCursor || !cursorRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const lines = container.querySelectorAll('[data-line-key]');
    
    if (lines.length > 0) {
      const activeLineIndex = Math.min(cursorWordIndex, lines.length - 1);
      const lineEl = lines[activeLineIndex] as HTMLElement;
      
      if (lineEl) {
        const lineRect = lineEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const xOffset = cursorCharPos * avgCharWidth;
        const targetX = (lineRect.left - containerRect.left) + xOffset;
        const targetY = lineRect.top - containerRect.top + 2;

        targetPosRef.current = { x: targetX, y: targetY };
      }
    }

    const animate = () => {
      const dx = targetPosRef.current.x - cursorPosRef.current.x;
      const dy = targetPosRef.current.y - cursorPosRef.current.y;

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        cursorPosRef.current = { ...targetPosRef.current };
        animationRef.current = null;
      } else {
        cursorPosRef.current.x += dx * 0.25;
        cursorPosRef.current.y += dy * 0.25;
        animationRef.current = requestAnimationFrame(animate);
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPosRef.current.x}px, ${cursorPosRef.current.y}px)`;
      }
    };

    if (animationRef.current === null) {
      animate();
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showCursor, cursorWordIndex, cursorCharPos, avgCharWidth]);

  const prevTypedRef = useRef<string>("");
  useEffect(() => {
    if (!soundEnabled || isFinished) return;

    if (typed.length > prevTypedRef.current.length) {
      keyboardSound.init();
      keyboardSound.setVolume(soundVolume);
      keyboardSound.setEnabled(soundEnabled);
      keyboardSound.play('keypress');
    }

    prevTypedRef.current = typed;
  }, [typed, soundEnabled, soundVolume, isFinished]);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const distributeWordsToLines = useCallback(() => {
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentWidth = 0;
    const wordSpacing = 16;
    const safeWidth = effectiveWidth - 40;

    for (let i = 0; i < words.length; i++) {
      const originalWord = words[i];
      const typedWord = typed.split(' ')[i] || "";
      const displayLength = Math.max(originalWord.length, typedWord.length);
      const wordWidth = displayLength * avgCharWidth + wordSpacing;

      if (currentWidth + wordWidth > safeWidth) {
        if (currentLine.length > 0) lines.push(currentLine);
        currentLine = [originalWord];
        currentWidth = wordWidth;
      } else {
        currentLine.push(originalWord);
        currentWidth += wordWidth;
      }
    }
    if (currentLine.length > 0) lines.push(currentLine);
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

  const visibleLineStart = activeLineIndex >= 1 ? activeLineIndex - 1 : 0;
  const visibleLines = allLines.slice(visibleLineStart, visibleLineStart + 3);

  const getLineStartIndex = (lineIndex: number) => {
    let startIndex = 0;
    for (let i = 0; i < visibleLineStart + lineIndex; i++) startIndex += allLines[i].length;
    return startIndex;
  };

  // Обработка клавиш ESC (пауза) и TAB (заново)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isFinished) {
        e.preventDefault();
        effectiveTogglePause();
      }
      if (e.key === "Tab" && isFinished) {
        e.preventDefault();
        onReset();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, effectiveTogglePause, onReset]);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        cursor: "text",
        position: "relative",
        width: "100%",
        maxWidth,
        margin: "0 auto",
        padding: "0",
        fontFamily: fontFamilyStack,
        fontSize,
        lineHeight,
        boxSizing: "border-box",
        outline: "none",
        minHeight: "160px",
      }}
    >
      <style>{`
        .typing-line {
          transition: opacity 0.2s ease;
        }
        .typing-line.inactive {
          opacity: 0.3;
        }
        .typing-line.active {
          opacity: 1;
        }
        .typing-line.future {
          opacity: 0.5;
        }
        @keyframes monkeytype-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes cursor-smooth-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {showCursor && (
        <div
          ref={cursorRef}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "3px",
            height: `${fontSizeNum * 1.1}px`,
            backgroundColor: accentColor,
            animation: cursorBlink ? "cursor-smooth-fade 1s ease-in-out infinite" : "none",
            borderRadius: "2px",
            pointerEvents: "none",
            zIndex: 100,
            willChange: "transform",
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0, width: "100%", paddingLeft: "60px" }}>
        {visibleLines.map((line, lineIdx) => {
          const actualIndex = visibleLineStart + lineIdx;
          const isCurrentLine = actualIndex === activeLineIndex;
          const isPastLine = actualIndex < activeLineIndex;
          const isNotFocused = !isFocused && typed.length === 0;
          const opacityStyle = isCurrentLine ? { opacity: isNotFocused ? 0.3 : 1 } : isPastLine ? { opacity: 0.3 } : { opacity: 0.5 };
          const blurStyle = blurEnabled && isNotFocused ? { filter: "blur(4px)", WebkitFilter: "blur(4px)" } : {};

          return (
            <div
              key={lineIdx}
              data-line-key={`line-${lineIdx}`}
              style={{
                fontSize,
                lineHeight: `${lineHeightNum}px`,
                whiteSpace: "nowrap",
                ...opacityStyle,
                ...blurStyle,
                transition: "opacity 0.2s ease, filter 0.2s ease",
                textAlign: "left"
              }}
            >
              {line.map((w: string, i: number) => {
                const wordGlobalIndex = getLineStartIndex(lineIdx) + i;
                const typedWord = typed.split(' ')[wordGlobalIndex] || "";
                const isWordCompleted = wordGlobalIndex < completedWordsCount;
                const isCurrentWord = wordGlobalIndex === cursorWordIndex;

                const hasError = typedWord.length > 0 && (
                  typedWord.split('').some((c, idx) => c !== w[idx]) ||
                  typedWord.length < w.length ||
                  typedWord.length > w.length
                );

                const shouldUnderline = isWordCompleted && hasError;

                return (
                  <span
                    key={wordGlobalIndex}
                    style={{
                      display: "inline-block",
                      marginRight: "0.5em",
                      borderBottom: shouldUnderline ? `2px solid ${ERROR_COLOR}` : "2px solid transparent",
                    }}
                  >
                    {Array.from({ length: w.length }, (_, charIdx: number) => {
                      const typedChar = typedWord[charIdx];
                      const isTyped = charIdx < typedWord.length;
                      const isError = isTyped && typedChar !== w[charIdx];

                      let charColor = UNTYPED_COLOR;
                      if (isError) {
                        charColor = "#ca4754";
                      } else if (isTyped) {
                        charColor = CORRECT_COLOR;
                      }

                      return (
                        <span key={`char-${wordGlobalIndex}-${charIdx}`} style={{
                          color: charColor,
                          transition: "color 0.1s ease",
                        }}>
                          {w[charIdx]}
                        </span>
                      );
                    })}

                    {Array.from({ length: Math.max(0, typedWord.length - w.length) }, (_, extraIdx: number) => {
                      const extraChar = typedWord[w.length + extraIdx];
                      
                      return (
                        <span key={`extra-${wordGlobalIndex}-${extraIdx}`} style={{
                          color: "#4D2113",
                          fontSize: "0.85em",
                        }}>
                          {extraChar}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {!isFocused && !isFinished && typed.length === 0 && (
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            cursor: "text",
            pointerEvents: "none"
          }}
        >
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "14px",
            color: "rgba(224,224,224,0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            pointerEvents: "none"
          }}>
            кликните чтобы начать
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => handleTypeWrapper(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { if (typed.length === 0) setIsFocused(false); }}
        disabled={isFinished}
        style={{
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          cursor: "text"
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Пауза (ESC) */}
      {effectiveIsPaused && !isFinished && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            pointerEvents: "none"
          }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.5rem",
            color: "#e0e0e0",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "16px"
          }}>
            ПАУЗА
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.85rem",
            color: "rgba(224,224,224,0.6)",
            letterSpacing: "0.05em"
          }}>
            ESC — продолжить &nbsp;·&nbsp; TAB — заново
          </div>
        </div>
      )}
    </div>
  );
}
