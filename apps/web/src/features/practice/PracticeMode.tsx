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

  const s = {
    font: "var(--font-mono)",
    xs: "var(--font-size-xs)",
    sm: "var(--font-size-sm)",
    lg: "var(--font-size-lg)",
    accent: "var(--accent)" as const,
    text: "var(--text)" as const,
    muted: "var(--text-muted)" as const,
    secondary: "var(--text-secondary)" as const,
    dim: "var(--text-dim)" as const,
    bg: "var(--bg)" as const,
    bgHover: "var(--bg-hover)" as const,
    success: "var(--success)" as const,
    error: "var(--error)" as const,
    border: "1px solid var(--text-dim)" as const,
    transition: "all var(--duration) var(--ease-out)" as const,
  };

  const btn = (active: boolean, isAccent = false): React.CSSProperties => ({
    fontFamily: s.font,
    fontSize: s.xs,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    padding: "0.4rem 1rem",
    border: active ? `1px solid ${isAccent ? s.accent : s.text}` : `1px solid ${s.dim}`,
    background: active ? (isAccent ? s.accent : "transparent") : "transparent",
    color: active ? (isAccent ? s.bg : s.text) : s.muted,
    cursor: "pointer",
    transition: s.transition,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      {/* Controls */}
      {!isRunning && !isFinished && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          {/* Language */}
          <div style={{ display: "flex", gap: s.xs }}>
            {(["en", "ru"] as const).map((lang) => (
              <button key={lang} onClick={() => setLanguage(lang)} style={btn(language === lang)}>
                {lang === "en" ? "EN" : "RU"}
              </button>
            ))}
          </div>

          {/* Timer */}
          <div style={{ display: "flex", gap: s.xs }}>
            {TIMER_OPTIONS.map((t) => (
              <button key={t} onClick={() => setDuration(t)} style={btn(duration === t)}>
                {t}S
              </button>
            ))}
          </div>

          <p style={{ fontFamily: s.font, fontSize: s.xs, color: s.dim, marginTop: "0.5rem" }}>
            PRESS ANY KEY TO START
          </p>
        </div>
      )}

      {/* Stats bar */}
      {(isRunning || isFinished) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            fontFamily: s.font,
            padding: "0.75rem 0",
            borderBottom: s.border,
            width: "100%",
          }}
        >
          {[
            { label: "TIME", value: timeLeft, suffix: "S", color: timeLeft <= 5 ? s.error : s.accent },
            { label: "WPM", value: wpm, suffix: "", color: s.accent },
            { label: "ACC", value: accuracy, suffix: "%", color: s.success },
          ].map(({ label, value, suffix, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span style={{ fontSize: s.xs, color: s.muted }}>{label}</span>
              <span style={{ fontSize: s.lg, fontWeight: 600, color }}>
                <AnimatedCounter
                  value={value}
                  suffix={suffix}
                  duration={200}
                  style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}
                />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Typing area */}
      <div
        style={{
          width: "100%",
          padding: "2rem 0",
          border: isRunning ? `1px solid ${s.accent}` : `1px solid ${s.dim}`,
          transition: "border-color 200ms var(--ease-out)",
        }}
      >
        <TypingDisplay text={text} currentIndex={currentIndex} errors={errorIndices} />
      </div>

      {/* Results overlay */}
      {isFinished && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(16,16,16,0.85)",
          }}
        >
          <div
            style={{
              background: s.bg,
              border: `1px solid ${s.accent}`,
              padding: "2.5rem",
              minWidth: "300px",
              textAlign: "center",
              fontFamily: s.font,
            }}
          >
            <h2
              style={{
                fontSize: s.lg,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "2rem",
              }}
            >
              RESULT
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {[
                { label: "WPM", value: wpm, color: s.accent },
                { label: "ACC", value: `${accuracy}%`, color: s.success },
                { label: "RAW", value: rawWpm, color: s.secondary },
                { label: "ERR", value: errors, color: s.error },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ fontSize: s.xs, color: s.muted, marginBottom: "0.25rem" }}>{label}</div>
                  <div style={{ fontSize: s.lg, fontWeight: 600, color }}>{value}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRestart}
              style={{
                fontFamily: s.font,
                fontSize: s.xs,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "0.6rem 2rem",
                border: `1px solid ${s.accent}`,
                background: "transparent",
                color: s.accent,
                cursor: "pointer",
                transition: s.transition,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = s.accent;
                e.currentTarget.style.color = s.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = s.accent;
              }}
            >
              RETRY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
