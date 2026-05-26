import { useState, useMemo } from "react";
import { useTyping, generateText } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { ENGLISH_WORDS, RUSSIAN_WORDS } from "@/shared/data/words";

const TIMER_OPTIONS = [15, 30, 60, 120];
const WORD_COUNT = 40;

export function PracticeMode() {
  const [language, setLanguage] = useState<"en" | "ru">("en");
  const [duration, setDuration] = useState(30);
  const [key, setKey] = useState(0); // remount trigger

  const words = language === "en" ? ENGLISH_WORDS : RUSSIAN_WORDS;
  const text = useMemo(() => generateText(words, WORD_COUNT), [words, key]);

  const { state, reset } = useTyping({
    text,
    duration,
  });

  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, timeLeft, isRunning, isFinished } =
    state;

  // Track which indices have errors
  const errorIndices = useMemo(() => {
    const arr: number[] = [];
    let errCount = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== text[i]) {
        arr.push(i);
        errCount++;
      }
    }
    return arr;
  }, [typed, text]);

  const handleRestart = () => {
    reset();
    setKey((k) => k + 1); // regenerate text
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
      {/* Controls */}
      {!isRunning && !isFinished && (
        <div className="flex flex-col items-center gap-4">
          {/* Language */}
          <div className="flex gap-2">
            {(["en", "ru"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-1.5 rounded-md text-sm transition-colors
                  ${language === lang ? "bg-accent text-black font-semibold" : "bg-white/5 text-text-muted hover:bg-white/10"}`}
              >
                {lang === "en" ? "English" : "Русский"}
              </button>
            ))}
          </div>

          {/* Timer */}
          <div className="flex gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setDuration(t)}
                className={`px-3 py-1 rounded-md text-xs transition-colors
                  ${duration === t ? "bg-accent text-black font-semibold" : "bg-white/5 text-text-muted hover:bg-white/10"}`}
              >
                {t}s
              </button>
            ))}
          </div>

          <p className="text-text-muted text-sm mt-4">Начните печатать...</p>
        </div>
      )}

      {/* Timer + Stats bar */}
      {(isRunning || isFinished) && (
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-text-muted">⏱</span>
            <span className={`font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-accent"}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-muted">WPM</span>
            <span className="text-accent font-bold">{wpm}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-muted">Точность</span>
            <span className="text-green-400 font-bold">{accuracy}%</span>
          </div>
        </div>
      )}

      {/* Typing area */}
      <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-6">
        <TypingDisplay text={text} currentIndex={currentIndex} errors={errorIndices} />
      </div>

      {/* Hidden input to capture keystrokes — actually we use window keydown */}
      {/* Results overlay */}
      {isFinished && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-6">Результат</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/[0.03] rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">WPM</div>
                <div className="text-accent text-3xl font-bold">{wpm}</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">Точность</div>
                <div className="text-green-400 text-3xl font-bold">{accuracy}%</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">Raw</div>
                <div className="text-white text-xl font-bold">{rawWpm}</div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">Ошибок</div>
                <div className="text-red-400 text-xl font-bold">{errors}</div>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full px-6 py-3 bg-accent text-black font-semibold rounded-lg
                         hover:bg-accent-hover transition-colors"
            >
              Ещё раз
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
