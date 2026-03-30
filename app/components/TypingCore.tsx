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
  width?: string;
  paddingRight?: number;
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
  const lastTypedTimeRef = useRef<number>(Date.now());
  const typedHistoryRef = useRef<{ time: number, typedLength: number }[]>([]);

  const completedWordsCount = (typed.match(/ /g) || []).length;
  const wordsLeft = mode === "words" ? Math.max(0, wordLimit - completedWordsCount) : 0;

  // Вычисляем статистику только если не пауза
  const computedStats = useMemo(() => {
    if (typed.length === 0) return { wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 };

    let elapsedMinutes = 0;
    if (mode === "time") {
      elapsedMinutes = (timeLimit - timeLeft) / 60;
    } else {
      // В режиме words используем lastTypedTimeRef вместо Date.now() чтобы статистика замирала при паузе
      elapsedMinutes = (lastTypedTimeRef.current - startTimeRef.current) / 60000;
    }
    if (elapsedMinutes < 0.01) return { wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 };

    const cpm = Math.round(typed.length / elapsedMinutes);
    const wpm = Math.min(Math.max(cpm, 0), 600);
    const rawWpm = Math.round((typed.length / 5) / elapsedMinutes);

    // Считаем точность по последним 50 символам (чтобы старые ошибки не влияли)
    const recentLength = Math.min(typed.length, 50);
    const startIndex = typed.length - recentLength;
    let correct = 0;
    let errors = 0;
    for (let i = startIndex; i < typed.length; i++) {
      if (i < text.length && typed[i] === text[i]) correct++;
      else errors++;
    }
    const accuracy = recentLength > 0 ? Math.round((correct / recentLength) * 100) : 100;
    const errorCount = errors;

    return { wpm, rawWpm, accuracy, consistency: accuracy, errorCount };
  }, [typed, timeLeft, timeLimit, mode, text]);

  // Возвращаем либо замороженную статистику (пауза), либо текущую
  const stats = isPaused ? displayStats : computedStats;
  const wpm = stats.wpm;
  const rawWpm = stats.rawWpm;
  const accuracy = stats.accuracy;
  const consistency = stats.consistency;
  const errorCount = stats.errorCount;

  // При паузе останавливаем обновление статистики (используется displayStats)
  // При возобновлении сбрасываем displayStats чтобы использовалась computedStats
  useEffect(() => {
    if (!isPaused) {
      // При возобновлении сбрасываем displayStats
      setDisplayStats({ wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 });
    }
  }, [isPaused]);

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

  // Обновляем статистику в реальном времени во время печати
  useEffect(() => {
    if (isActive && !isFinished && !isPaused && typed.length > 0) {
      const updateInterval = setInterval(() => {
        const now = Date.now();
        
        // Проверяем, печатал ли пользователь в последнюю секунду
        const timeSinceLastTyped = now - lastTypedTimeRef.current;
        
        if (timeSinceLastTyped > 1000) {
          // Если не печатал больше 1 секунды, сбрасываем статистику
          setDisplayStats({ wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 });
          return;
        }
        
        // Рассчитываем WPM на основе последних 15 секунд
        const history = typedHistoryRef.current;
        if (history.length < 2) {
          setDisplayStats({ wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100, errorCount: 0 });
          return;
        }
        
        const oldestRecord = history[0];
        const newestRecord = history[history.length - 1];
        const timeDiffMs = newestRecord.time - oldestRecord.time;
        const typedDiff = newestRecord.typedLength - oldestRecord.typedLength;
        
        if (timeDiffMs < 1000) {
          // Нужно хотя бы 1 секунда данных для расчёта
          return;
        }
        
        const elapsedMinutes = timeDiffMs / 60000;
        const cpm = Math.round(typedDiff / elapsedMinutes);
        const currentWpm = Math.min(Math.max(cpm, 0), 600);
        const currentRawWpm = Math.round((typedDiff / 5) / elapsedMinutes);
        
        // Считаем точность по текущему тексту
        let correct = 0;
        let errors = 0;
        for (let i = 0; i < typed.length; i++) {
          if (typed[i] === text[i]) correct++;
          else errors++;
        }
        const currentAccuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
        
        setDisplayStats({
          wpm: currentWpm,
          rawWpm: currentRawWpm,
          accuracy: currentAccuracy,
          consistency: currentAccuracy,
          errorCount: errors
        });
      }, 200);
      return () => clearInterval(updateInterval);
    }
  }, [isActive, isFinished, isPaused, typed.length, text]);

  useEffect(() => {
    // Для режима words - завершаем когда набран весь текст
    if (mode === "words" && !isFinished && typed.length > 0) {
      // Завершаем когда набрано последнее слово (текст заканчивается пробелом после слова)
      const isComplete = typed.trim().length >= text.trim().length || 
                         (typed.endsWith(' ') && typed.trim().split(' ').length >= text.trim().split(' ').length);
      console.log("TypingCore check:", { mode, typedLength: typed.length, textLength: text.length, isComplete, typedWords: typed.trim().split(' ').length, textWords: text.trim().split(' ').length });
      if (isComplete) {
        console.log("TypingCore: setting isFinished=true");
        setIsActive(false);
        setIsFinished(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }
  }, [mode, isFinished, typed.length, text]);

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

  // Отслеживаем изменения typed для обновления истории и lastTypedTime
  const prevTypedRef = useRef<string>("");
  useEffect(() => {
    if (typed !== prevTypedRef.current) {
      const now = Date.now();
      lastTypedTimeRef.current = now;
      typedHistoryRef.current.push({ time: now, typedLength: typed.length });
      // Очищаем старые записи (старше 15 секунд)
      typedHistoryRef.current = typedHistoryRef.current.filter(h => now - h.time < 15000);
      // Оставляем только последние 100 записей для производительности
      if (typedHistoryRef.current.length > 100) {
        typedHistoryRef.current = typedHistoryRef.current.slice(-100);
      }
      prevTypedRef.current = typed;
    }
  }, [typed]);

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
    if (isFinished || typed.length === 0) return;
    if (isPaused) {
      // Возобновление
      setIsPaused(false);
    } else {
      // Пауза - сохраняем текущую статистику для отображения
      let elapsedMinutes = 0;
      if (mode === "time") {
        elapsedMinutes = (timeLimit - timeLeft) / 60;
      } else {
        elapsedMinutes = (lastTypedTimeRef.current - startTimeRef.current) / 60000;
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

export function TypingDisplay({ text, typed, onType, onReset, colors, isFinished, fontSize: propFontSize, lineHeight: propLineHeight, width: propWidth, paddingRight: propPaddingRight, isPaused, togglePause }: TypingDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPosRef = useRef<{ x: number; y: number }>({ x: 60, y: 0 });

  // Обёртка для onType - игнорирует ввод пока не в фокусе
  const handleTypeWrapper = useCallback((val: string) => {
    if (!isFocused && typed.length === 0) return;
    onType(val);
  }, [onType, isFocused, typed.length]);

  const settingsFontSize = useSettingsStore((state) => state.fontSize);
  const settingsLineHeight = useSettingsStore((state) => state.lineHeight);
  const settingsFontFamily = useSettingsStore((state) => state.fontFamily);
  const settingsAccentColor = useSettingsStore((state) => state.accentColor);
  const settingsCursorBlink = useSettingsStore((state) => state.cursorBlink);
  const settingsCursorStyle = useSettingsStore((state) => state.cursorStyle);
  const settingsSoundEnabled = useSettingsStore((state) => state.soundEnabled);
  const settingsSoundVolume = useSettingsStore((state) => state.soundVolume);

  const fontSize = propFontSize || `${settingsFontSize || 24}px`;
  const lineHeight = propLineHeight || `${settingsLineHeight || 48}px`;
  const width = propWidth || 1000;
  const paddingRight = propPaddingRight !== undefined ? propPaddingRight : 40;
  const fontFamily = settingsFontFamily || "JetBrains Mono";
  const fontFamilyStack = `${fontFamily}, 'JetBrains Mono', 'Cascadia Code', 'Consolas', 'Lucida Console', 'Courier New', monospace`;
  const widthNum = typeof width === 'string' ? parseInt(width, 10) : width;
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
  const lineHeightNum = parseInt(lineHeight, 10) || 64;

  const cursorWordIndex = completedWordsCount;
  const currentTypedWord = typed.split(' ')[cursorWordIndex] || "";
  const cursorCharPos = currentTypedWord.length;
  const showCursor = isFocused && !isPaused && !isFinished;
  
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

  const distributeWordsToLines = useCallback(() => {
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentWidth = 0;
    const wordSpacing = 10;
    const safeWidth = widthNum - paddingRight;

    for (let i = 0; i < words.length; i++) {
      const originalWord = words[i];
      const typedWord = typed.split(' ')[i] || "";
      const displayLength = Math.max(originalWord.length, typedWord.length);
      const wordWidth = displayLength * avgCharWidth + wordSpacing;

      if (currentWidth + wordWidth > safeWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [originalWord];
        currentWidth = wordWidth;
      } else {
        currentLine.push(originalWord);
        currentWidth += wordWidth;
      }
    }
    if (currentLine.length > 0) lines.push(currentLine);
    return lines;
  }, [words, typed, avgCharWidth, widthNum]);

  const allLines = useMemo(() => distributeWordsToLines(), [distributeWordsToLines]);

  // Определяем активную строку по позиции курсора
  let activeLineIndex = 0;
  let cumulativeWordCount = 0;
  for (let i = 0; i < allLines.length; i++) {
    const lineWordCount = allLines[i].length;
    // Курсор находится в этой строке, если completedWordsCount попадает в диапазон этой строки
    if (completedWordsCount >= cumulativeWordCount && completedWordsCount < cumulativeWordCount + lineWordCount) {
      activeLineIndex = i;
      break;
    }
    cumulativeWordCount += lineWordCount;
    // Если это последняя строка
    if (i === allLines.length - 1) {
      activeLineIndex = i;
    }
  }

  const visibleLineStart = activeLineIndex >= 1 ? activeLineIndex - 1 : 0;
  const visibleLines = allLines.slice(visibleLineStart, visibleLineStart + 3);

  const getLineStartIndex = (lineIndex: number) => {
    let startIndex = 0;
    for (let i = 0; i < visibleLineStart + lineIndex; i++) startIndex += allLines[i].length;
    return startIndex;
  };

  // Ref для хранения текущей целевой позиции
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 60, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Обновляем целевую позицию при изменении typed
  useEffect(() => {
    if (!showCursor || !containerRef.current) return;
    
    const container = containerRef.current;
    const lines = container.querySelectorAll('[data-line-key]');
    
    if (lines.length === 0) return;

    // Находим активную строку по глобальному индексу cursorWordIndex
    let activeLine: HTMLElement | null = null;
    let wordCountSoFar = 0;
    
    for (let i = 0; i < allLines.length; i++) {
      const lineWordCount = allLines[i].length;
      
      if (cursorWordIndex >= wordCountSoFar && cursorWordIndex < wordCountSoFar + lineWordCount) {
        activeLine = container.querySelector(`[data-line-key="line-${i}"]`) as HTMLElement;
        break;
      }
      wordCountSoFar += lineWordCount;
      
      if (i === allLines.length - 1) {
        activeLine = container.querySelector(`[data-line-key="line-${i}"]`) as HTMLElement;
      }
    }

    if (!activeLine) return;

    const lineRect = activeLine.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const allChars = Array.from(activeLine.querySelectorAll('span[id^="char-"], span[id^="extra-"]')) as HTMLElement[];
    
    interface CharInfo {
      element: HTMLElement;
      wordIdx: number;
      charIdx: number;
      isExtra: boolean;
    }
    const sortedChars: CharInfo[] = [];
    const wordLengths = new Map<number, number>();
    
    for (const charSpan of allChars) {
      const charMatch = charSpan.id.match(/char-(\d+)-(\d+)/);
      if (charMatch) {
        const wordIdx = parseInt(charMatch[1], 10);
        const charIdx = parseInt(charMatch[2], 10);
        sortedChars.push({ element: charSpan, wordIdx, charIdx, isExtra: false });
        const currentMax = wordLengths.get(wordIdx) || 0;
        wordLengths.set(wordIdx, Math.max(currentMax, charIdx + 1));
      }
    }
    
    for (const charSpan of allChars) {
      const extraMatch = charSpan.id.match(/extra-(\d+)-(\d+)/);
      if (extraMatch) {
        const wordIdx = parseInt(extraMatch[1], 10);
        const extraIdx = parseInt(extraMatch[2], 10);
        const wordLength = wordLengths.get(wordIdx) || 0;
        const actualCharIdx = wordLength + extraIdx;
        sortedChars.push({ element: charSpan, wordIdx, charIdx: actualCharIdx, isExtra: true });
      }
    }
    
    sortedChars.sort((a, b) => {
      if (a.wordIdx !== b.wordIdx) return a.wordIdx - b.wordIdx;
      return a.charIdx - b.charIdx;
    });
    
    const currentWordChars = sortedChars.filter(c => c.wordIdx === cursorWordIndex);

    // Берём Y позицию из lineRect (базовая линия строки), а не из символов
    // Это гарантирует, что курсор всегда на одной высоте, даже если текст приподнят из-за ошибки
    const baseLineY = lineRect.top - containerRect.top + 10;

    let targetX: number;
    
    if (currentWordChars.length > 0 && currentWordChars[cursorCharPos]) {
      const charRect = currentWordChars[cursorCharPos].element.getBoundingClientRect();
      targetX = charRect.left - containerRect.left - 2;
    } else if (currentWordChars.length > 0) {
      const lastChar = currentWordChars[currentWordChars.length - 1];
      if (lastChar) {
        const lastCharRect = lastChar.element.getBoundingClientRect();
        targetX = lastCharRect.right - containerRect.left - 2;
      } else {
        targetX = lineRect.left - containerRect.left;
      }
    } else {
      targetX = lineRect.left - containerRect.left;
    }

    // Обновляем целевую позицию
    targetPosRef.current = { x: targetX, y: baseLineY };
  }, [showCursor, typed, cursorWordIndex, cursorCharPos, allLines]);
  
  // Постоянная анимация курсора к целевой позиции
  useEffect(() => {
    if (!showCursor || !cursorRef.current) return;
    
    const animate = () => {
      const dx = targetPosRef.current.x - cursorPosRef.current.x;
      const dy = targetPosRef.current.y - cursorPosRef.current.y;
      
      // Плавная интерполяция (linear interpolation с коэффициентом 0.2)
      cursorPosRef.current.x += dx * 0.2;
      cursorPosRef.current.y += dy * 0.2;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPosRef.current.x}px, ${cursorPosRef.current.y}px, 0)`;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showCursor]);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        cursor: "text",
        position: "relative",
        width: widthNum,
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
        @keyframes cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes cursor-pulse {
          0%, 100% { opacity: 1; transform: translate3d(var(--cursor-x, 0), var(--cursor-y, 0), 0) scaleY(1); }
          50% { opacity: 0.4; transform: translate3d(var(--cursor-x, 0), var(--cursor-y, 0), 0) scaleY(0.95); }
        }
        .cursor-line {
          width: 3px;
          height: ${fontSizeNum * 1.1}px;
          background-color: ${accentColor};
          border-radius: 2px;
          transform-origin: center;
          will-change: transform, opacity;
        }
        .cursor-line.blink {
          animation: cursor-blink 1s step-end infinite;
        }
        .cursor-block {
          width: ${fontSizeNum * 0.7}px;
          height: ${fontSizeNum * 1.15}px;
          background-color: transparent;
          border: 2px solid ${accentColor};
          border-radius: 4px;
          transform-origin: center;
          will-change: transform, opacity;
          box-shadow: 0 0 8px ${accentColor}40;
        }
        .cursor-block.blink {
          animation: cursor-blink 1s step-end infinite;
        }
        .cursor-underline {
          width: ${fontSizeNum * 0.6}px;
          height: 3px;
          background-color: ${accentColor};
          border-radius: 1px;
          transform-origin: center;
          will-change: transform, opacity;
        }
        .cursor-underline.blink {
          animation: cursor-blink 1s step-end infinite;
        }
      `}</style>

      {showCursor && (
        <div
          ref={cursorRef}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            transform: `translate3d(${cursorPosRef.current.x}px, ${cursorPosRef.current.y}px, 0)`,
            pointerEvents: "none",
            zIndex: 100,
          }}
          className={cursorBlink ? "blink" : ""}
        >
          {settingsCursorStyle === "block" && (
            <div className="cursor-block" />
          )}
          {settingsCursorStyle === "underline" && (
            <div
              className="cursor-underline"
              style={{ marginTop: fontSizeNum * 1.1 }}
            />
          )}
          {settingsCursorStyle === "line" && (
            <div className="cursor-line" />
          )}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0, width: "100%" }}>
        {visibleLines.map((line, lineIdx) => {
          const actualIndex = visibleLineStart + lineIdx;
          const isCurrentLine = actualIndex === activeLineIndex;
          const isPastLine = actualIndex < activeLineIndex;
          const isNotFocused = !isFocused && typed.length === 0;
          
          // Когда нет фокуса - все строки имеют пониженную прозрачность
          const opacityStyle = isCurrentLine
            ? { opacity: isNotFocused ? 0.3 : 1 }
            : isPastLine
              ? { opacity: isNotFocused ? 0.2 : 0.3 }
              : { opacity: isNotFocused ? 0.2 : 0.5 };

          // Когда нет фокуса - ВСЕ строки размываются
          const blurStyle = isNotFocused ? { filter: "blur(4px)", WebkitFilter: "blur(4px)" } : {};

          return (
            <div
              key={lineIdx}
              data-line-key={`line-${visibleLineStart + lineIdx}`}
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
                      position: "relative",
                      bottom: shouldUnderline ? "6px" : "0",
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
                        <span id={`char-${wordGlobalIndex}-${charIdx}`} key={`char-${wordGlobalIndex}-${charIdx}`} style={{
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
                        <span id={`extra-${wordGlobalIndex}-${extraIdx}`} key={`extra-${wordGlobalIndex}-${extraIdx}`} style={{
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
      {isPaused && !isFinished && (
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
