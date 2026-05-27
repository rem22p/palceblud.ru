import { useState, useMemo } from "react";
import { useTyping, generateText } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { NumberTicker } from "@/components/ui/number-ticker";
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
  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, timeLeft, isRunning, isFinished } = state;

  const errorIndices = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== text[i]) arr.push(i);
    }
    return arr;
  }, [typed, text]);

  const handleRestart = () => { reset(); setKey((k) => k + 1); };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
      {/* Controls — glass pill, top-left */}
      {!isRunning && !isFinished && (
        <div style={{ paddingTop: "var(--space-lg)" }}>
          {/* Glass control bar */}
          <div
            className="glass"
            style={{
              display: "inline-flex",
              gap: "0.25rem",
              padding: "0.4rem",
              marginBottom: "var(--space-md)",
            }}
          >
            {(["en", "ru"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--font-size-body)",
                  fontWeight: 600,
                  color: language === lang ? "var(--accent)" : "var(--text-secondary)",
                  background: language === lang ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.35rem 0.85rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all var(--duration-fast) var(--ease-out)",
                }}
              >
                {lang === "en" ? "EN" : "RU"}
              </button>
            ))}
          </div>

          {/* Timer glass pill */}
          <div
            className="glass"
            style={{
              display: "inline-flex",
              gap: "0.25rem",
              padding: "0.4rem",
              marginBottom: "var(--space-md)",
            }}
          >
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setDuration(t)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--font-size-body)",
                  fontWeight: duration === t ? 600 : 400,
                  color: duration === t ? "var(--accent)" : "var(--text-secondary)",
                  background: duration === t ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.35rem 0.85rem",
                  cursor: "pointer",
                  transition: "all var(--duration-fast) var(--ease-out)",
                }}
              >
                {t}s
              </button>
            ))}
          </div>

          <p className="label">нажмите любую клавишу</p>
        </div>
      )}

      {/* Stats — glass bar */}
      {(isRunning || isFinished) && (
        <div
          className="glass"
          style={{
            display: "inline-flex",
            gap: "var(--space-md)",
            padding: "0.75rem 1.5rem",
            marginTop: "var(--space-md)",
          }}
        >
          {[
            { label: "TIME", value: timeLeft, suffix: "s", color: timeLeft <= 5 ? "var(--error)" : "var(--accent)" },
            { label: "WPM", value: wpm, color: "var(--accent)" },
            { label: "ACC", value: accuracy, suffix: "%", color: "var(--success)" },
          ].map(({ label, value, color, suffix }) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span className="label" style={{ marginRight: "0.25rem" }}>{label}</span>
              <NumberTicker
                value={value}
                className="text-lg"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  color,
                  fontSize: "var(--font-size-large)",
                }}
              />
              {suffix && (
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "var(--font-size-lead)", color }}>
                  {suffix}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Typing area — terminal, full bleed */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "var(--space-lg) 0",
        }}
      >
        <TypingDisplay text={text} currentIndex={currentIndex} errors={errorIndices} />
      </div>

      {/* Results — glass overlay + editorial */}
      {isFinished && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-md)",
          }}
        >
          <div
            className="glass"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "var(--space-lg)",
            }}
          >
            <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
              результат
            </p>

            <h2
              className="display"
              style={{
                fontSize: "var(--font-size-hero)",
                color: "var(--accent)",
                lineHeight: 0.8,
                marginBottom: "var(--space-md)",
              }}
            >
              {wpm}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-md)",
                marginBottom: "var(--space-lg)",
              }}
            >
              {[
                { label: "точность", value: `${accuracy}%` },
                { label: "raw", value: rawWpm },
                { label: "ошибок", value: errors },
                { label: "язык", value: language === "en" ? "EN" : "RU" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="label">{label}</div>
                  <div className="mono" style={{ fontSize: "var(--font-size-lead)", marginTop: "0.25rem" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <a
              onClick={handleRestart}
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "var(--font-size-lead)",
                color: "var(--accent)",
                cursor: "pointer",
              }}
            >
              ещё раз
              <span className="cursor" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
