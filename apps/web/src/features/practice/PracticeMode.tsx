import { useState, useMemo } from "react";
import { useTyping, generateText } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { AnimatedCounter } from "@/shared/components/AnimatedCounter";
import { ENGLISH_WORDS, RUSSIAN_WORDS } from "@/shared/data/words";

const TIMER_OPTIONS = [15, 30, 60, 120];
const WORD_COUNT = 40;

export function PracticeMode() {
  const [language, setLanguage] = useState<"en" | "ru">("en");
  const [duration, setDuration] = useState(30);
  const [key, setKey] = useState(0);

  const words = language === "en" ? ENGLISH_WORDS : RUSSIAN_WORDS;
  const text = useMemo(() => generateText(words, WORD_COUNT), [words, key]);

  const { state, reset } = useTyping({ text, duration });

  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, timeLeft, isRunning, isFinished } =
    state;

  const errorIndices = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== text[i]) arr.push(i);
    }
    return arr;
  }, [typed, text]);

  const handleRestart = () => {
    reset();
    setKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto relative z-10">
      {/* Controls — glass pill bar */}
      {!isRunning && !isFinished && (
        <div className="flex flex-col items-center gap-4">
          {/* Language */}
          <div className="glass rounded-2xl p-1 flex gap-0.5">
            {(["en", "ru"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "var(--font-sans)",
                  background: language === lang ? "var(--accent)" : "transparent",
                  color: language === lang ? "var(--accent-text)" : "var(--text-muted)",
                }}
              >
                {lang === "en" ? "English" : "Русский"}
              </button>
            ))}
          </div>

          {/* Timer */}
          <div className="glass rounded-2xl p-1 flex gap-0.5">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setDuration(t)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: duration === t ? "var(--accent)" : "transparent",
                  color: duration === t ? "var(--accent-text)" : "var(--text-muted)",
                }}
              >
                {t}s
              </button>
            ))}
          </div>

          <p
            className="text-sm animate-pulse mt-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}
          >
            начните печатать...
          </p>
        </div>
      )}

      {/* Stats bar — animated counters */}
      {(isRunning || isFinished) && (
        <div
          className="glass rounded-2xl px-6 py-3 flex items-center justify-center gap-10 text-sm"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>время</span>
            <span
              className="font-bold tabular-nums"
              style={{
                color: timeLeft <= 5 ? "var(--error)" : "var(--accent)",
                fontSize: "1.1rem",
              }}
            >
              <AnimatedCounter
                value={timeLeft}
                suffix="s"
                duration={200}
                style={{
                  color: "inherit",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                }}
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>wpm</span>
            <span className="font-bold tabular-nums" style={{ color: "var(--accent)", fontSize: "1.1rem" }}>
              <AnimatedCounter
                value={wpm}
                duration={250}
                style={{
                  color: "inherit",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                }}
              />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>точность</span>
            <span className="font-bold tabular-nums" style={{ color: "var(--success)", fontSize: "1.1rem" }}>
              <AnimatedCounter
                value={accuracy}
                suffix="%"
                duration={300}
                style={{
                  color: "inherit",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                }}
              />
            </span>
          </div>
        </div>
      )}

      {/* Typing area — glass card with inner glow */}
      <div
        className="glass rounded-2xl p-8 w-full transition-all duration-300"
        style={{
          borderColor: isRunning ? "rgba(255,255,255,0.06)" : undefined,
          boxShadow: isRunning
            ? "0 0 48px var(--accent-glow), 0 4px 24px rgba(0,0,0,0.3)"
            : undefined,
        }}
      >
        <TypingDisplay text={text} currentIndex={currentIndex} errors={errorIndices} />
      </div>

      {/* Results overlay */}
      {isFinished && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="glass rounded-3xl p-10 max-w-sm w-full text-center"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              boxShadow: "0 48px 96px rgba(0,0,0,0.5), 0 0 64px var(--accent-glow)",
            }}
          >
            <h2
              className="text-3xl font-bold mb-8 tracking-tight"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              результат
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "WPM", value: wpm, color: "var(--accent)" },
                { label: "точность", value: `${accuracy}%`, color: "var(--success)" },
                { label: "raw", value: rawWpm, color: "var(--text-secondary)" },
                { label: "ошибок", value: errors, color: "var(--error)" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="glass rounded-2xl p-4"
                  style={{ borderColor: "rgba(255,255,255,0.03)" }}
                >
                  <div
                    className="text-xs mb-1.5 uppercase tracking-wider"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-3xl font-bold tabular-nums"
                    style={{ color, fontFamily: "var(--font-mono)" }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all duration-200
                         hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "var(--accent)",
                color: "var(--accent-text)",
                fontFamily: "var(--font-sans)",
              }}
            >
              ещё раз
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
