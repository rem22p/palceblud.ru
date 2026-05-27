import { useState, useMemo, useEffect, useRef } from "react";
import { useTyping, generateText } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ENGLISH_WORDS, RUSSIAN_WORDS, CODE_WORDS, ENGLISH_QUOTES } from "@/shared/data/words";

// ─── Modes ───
type PracMode = "words" | "count" | "quotes" | "custom" | "infinite";
const MODE_BUTTONS: [PracMode, string][] = [
  ["words", "слова"], ["count", "счёт"], ["quotes", "цитаты"], ["custom", "свой"], ["infinite", "∞"],
];
const TIMERS = [15, 30, 60, 120];
const COUNTS = [10, 25, 50, 100];
const DEFAULT_WORDS = 40;
const DEFAULT_COUNT = 25;

// ─── Pill button style ───
const pillBase: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
  border: "none", borderRadius: "12px", padding: "0.35rem 0.85rem",
  cursor: "pointer", textTransform: "uppercase",
  transition: "all var(--duration-fast) var(--ease-out)",
};
const pill = (active: boolean) => ({
  ...pillBase, fontWeight: active ? 600 : 400,
  color: active ? "var(--accent)" : "var(--text-secondary)",
  background: active ? "rgba(255,255,255,0.06)" : "transparent",
});

// ─── Language pill labels ───
const LANG_PILLS: ["en" | "ru" | "code", string][] = [
  ["en", "EN"], ["ru", "RU"], ["code", "code"],
];

export function PracticeMode() {
  const [mode, setMode] = useState<PracMode>("words");
  const [lang, setLang] = useState<"en" | "ru" | "code">("en");
  const [dur, setDur] = useState(30);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [custom, setCustom] = useState("");
  const [key, setKey] = useState(0);

  // Word pool
  const pool = useMemo(() => {
    if (lang === "ru") return RUSSIAN_WORDS;
    if (lang === "code") return CODE_WORDS;
    return ENGLISH_WORDS;
  }, [lang]);

  // Text
  const text = useMemo(() => {
    if (mode === "custom") return custom || "Start typing...";
    if (mode === "quotes") {
      const q = ENGLISH_QUOTES[key % ENGLISH_QUOTES.length];
      return q + " " + q.slice(0, Math.floor(q.length * 0.6));
    }
    const n = mode === "count" ? count : DEFAULT_WORDS;
    return generateText(pool, n);
  }, [mode, pool, key, custom, count]);

  // Timer (null = no timer for count/custom/infinite)
  const timer = (mode === "words" || mode === "quotes") ? dur : undefined;
  const { state, reset } = useTyping({ text, duration: timer });
  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, timeLeft, isRunning, isFinished } = state;

  const errorIndices = useMemo(() => {
    const a: number[] = [];
    for (let i = 0; i < typed.length; i++) if (typed[i] !== text[i]) a.push(i);
    return a;
  }, [typed, text]);

  const handleRestart = () => { reset(); setKey((k) => k + 1); };

  // Auto-save
  const savedRef = useRef(false);
  useEffect(() => {
    if (!isFinished || savedRef.current) return;
    savedRef.current = true;
    fetch("/api/sessions", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ mode, duration: timer ?? 0, wpm, accuracy, rawWpm,
        consistency: 100, correctKeystrokes: currentIndex - errors,
        totalKeystrokes: currentIndex, language: lang, textSnippet: text.slice(0, 200) }),
    }).catch(() => {});
  }, [isFinished]);
  useEffect(() => { savedRef.current = false; }, [key]);

  // Count progress
  const done = mode === "count" ? typed.split(" ").length : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
      {/* Controls */}
      {!isRunning && !isFinished && (
        <div style={{ paddingTop: "var(--space-lg)" }}>
          {/* Mode selector pill */}
          <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem", marginBottom: "var(--space-md)" }}>
            {MODE_BUTTONS.map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)} style={pill(mode === m)}>{label}</button>
            ))}
          </div>

          {/* Timer pill — words/quotes */}
          {(mode === "words" || mode === "quotes") && (
            <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem", marginBottom: "var(--space-md)" }}>
              {TIMERS.map((t) => (
                <button key={t} onClick={() => setDur(t)} style={pill(dur === t)}>{t}s</button>
              ))}
            </div>
          )}

          {/* Count pill — count mode */}
          {mode === "count" && (
            <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem", marginBottom: "var(--space-md)" }}>
              {COUNTS.map((c) => (
                <button key={c} onClick={() => setCount(c)} style={pill(count === c)}>{c}w</button>
              ))}
            </div>
          )}

          {/* Language pill — words/count */}
          {(mode === "words" || mode === "count") && (
            <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem", marginBottom: "var(--space-md)" }}>
              {LANG_PILLS.map(([l, label]) => (
                <button key={l} onClick={() => setLang(l)} style={pill(lang === l)}>{label}</button>
              ))}
            </div>
          )}

          {/* Custom text input */}
          {mode === "custom" && (
            <div className="glass" style={{ display: "inline-flex", padding: "0.5rem 0.75rem", marginBottom: "var(--space-md)" }}>
              <input
                type="text" value={custom} onChange={(e) => setCustom(e.target.value)}
                placeholder="вставьте текст..."
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
                  color: "var(--text)", background: "transparent", border: "none",
                  outline: "none", width: "320px",
                }}
              />
            </div>
          )}

          <p className="label">нажмите любую клавишу</p>
        </div>
      )}

      {/* Stats — glass bar at top */}
      {(isRunning || isFinished) && (
        <div className="glass" style={{ display: "inline-flex", gap: "var(--space-md)", padding: "0.75rem 1.5rem", marginTop: "var(--space-md)" }}>
          {[
            { label: mode === "count" ? "COUNT" : "TIME", value: mode === "count" ? done : timeLeft ?? 0,
              suffix: mode === "count" ? `/${count}` : "s", color: "var(--accent)" },
            { label: "WPM", value: wpm, color: "var(--accent)" },
            { label: "ACC", value: accuracy, suffix: "%", color: "var(--success)" },
          ].map(({ label, value, color, suffix }) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span className="label" style={{ marginRight: "0.25rem" }}>{label}</span>
              <NumberTicker
                value={value}
                className="text-lg"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, color, fontSize: "var(--font-size-large)" }}
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

      {/* Typing area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "var(--space-lg) 0" }}>
        <TypingDisplay text={text} currentIndex={currentIndex} errors={errorIndices} />
      </div>

      {/* Results */}
      {isFinished && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-md)" }}>
          <div className="glass" style={{ maxWidth: "520px", width: "100%", padding: "var(--space-lg)" }}>
            <p className="label" style={{ marginBottom: "var(--space-sm)" }}>результат</p>
            <h2 className="display" style={{ fontSize: "var(--font-size-hero)", color: "var(--accent)", lineHeight: 0.8, marginBottom: "var(--space-md)" }}>
              {wpm}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
              {[
                { label: "точность", value: `${accuracy}%` },
                { label: "raw", value: rawWpm },
                { label: "ошибок", value: errors },
                { label: "режим", value: MODE_BUTTONS.find(([m]) => m === mode)?.[1] ?? mode },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="label">{label}</div>
                  <div className="mono" style={{ fontSize: "var(--font-size-lead)", marginTop: "0.25rem" }}>{value}</div>
                </div>
              ))}
            </div>
            <a onClick={handleRestart} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--font-size-lead)", color: "var(--accent)", cursor: "pointer" }}>
              ещё раз <span className="cursor" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
