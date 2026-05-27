import { useState, useMemo, useEffect, useRef } from "react";
import { useTyping, generateText } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ENGLISH_WORDS, RUSSIAN_WORDS, CODE_WORDS, ENGLISH_QUOTES } from "@/shared/data/words";

// Modes
type PracticeMode_ = "words" | "count" | "quotes" | "custom" | "infinite";
const TIMER_OPTIONS = [15, 30, 60, 120];
const WORD_COUNT_OPTIONS = [10, 25, 50, 100];
const DEFAULT_WORD_COUNT = 40;
const COUNT_WORD_COUNT = 25;

const LABELS: Record<string, string> = {
  words: "english", count: "english", quotes: "english", code: "code", ru: "русский",
};

export function PracticeMode() {
  const [mode, setMode] = useState<PracticeMode_>("words");
  const [language, setLanguage] = useState<"en" | "ru" | "code">("en");
  const [duration, setDuration] = useState(30);
  const [wordCount, setWordCount] = useState(COUNT_WORD_COUNT);
  const [customText, setCustomText] = useState("");
  const [key, setKey] = useState(0);

  // Word pool handling
  const wordPool = useMemo(() => {
    if (language === "ru") return RUSSIAN_WORDS;
    if (language === "code") return CODE_WORDS;
    return ENGLISH_WORDS;
  }, [language]);

  // Text generation per mode
  const text = useMemo(() => {
    if (mode === "custom") return customText || "Start typing...";
    if (mode === "quotes") {
      const q = ENGLISH_QUOTES[key % ENGLISH_QUOTES.length];
      return q + " " + q.slice(0, Math.floor(q.length * 0.6));
    }
    const count = mode === "count" ? wordCount : DEFAULT_WORD_COUNT;
    return generateText(wordPool, count);
  }, [mode, wordPool, key, customText, wordCount]);

  // Timer: null for count/infinite/custom modes
  const timerDuration = (mode === "words" || mode === "quotes") ? duration : undefined;
  const { state, reset } = useTyping({ text, duration: timerDuration });
  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, timeLeft, isRunning, isFinished } = state;

  const errorIndices = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== text[i]) arr.push(i);
    }
    return arr;
  }, [typed, text]);

  const handleRestart = () => { reset(); setKey((k) => k + 1); };

  // Auto-save
  const savedRef = useRef(false);
  useEffect(() => {
    if (!isFinished || savedRef.current) return;
    savedRef.current = true;
    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        mode, duration: timerDuration ?? 0, wpm, accuracy, rawWpm,
        consistency: 100, correctKeystrokes: currentIndex - errors,
        totalKeystrokes: currentIndex, language, textSnippet: text.slice(0, 200),
      }),
    }).catch(() => {});
  }, [isFinished]);

  useEffect(() => { savedRef.current = false; }, [key]);

  // Progress for count mode
  const wordProgress = mode === "count" ? text.split(" ").filter((_, i) => i < typed.split(" ").length).length : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
      {/* Controls */}
      {!isRunning && !isFinished && (
        <div style={{ paddingTop: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
            {([
              ["words", "слова"],
              ["count", "счёт"],
              ["quotes", "цитаты"],
              ["custom", "свой"],
              ["infinite", "∞"],
            ] as [PracticeMode_, string][]).map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--font-size-body)",
                  color: mode === m ? "var(--accent)" : "var(--text-muted)",
                  background: mode === m ? "var(--bg-elevated)" : "transparent",
                  border: "none",
                  padding: "0.35rem 0.85rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderRadius: "8px",
                  transition: "all var(--duration-fast) var(--ease-out)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Timer/language/count controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", flexWrap: "wrap" }}>
            {/* Timer (for words/quotes) */}
            {(mode === "words" || mode === "quotes") && (
              <div style={{ display: "flex", gap: "2px" }}>
                {TIMER_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDuration(t)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--font-size-body)",
                      color: duration === t ? "var(--accent)" : "var(--text-muted)",
                      background: "transparent",
                      border: "none",
                      padding: "0.25rem 0.6rem",
                      cursor: "pointer",
                      textDecoration: duration === t ? "underline" : "none",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            )}

            {/* Word count (for count mode) */}
            {mode === "count" && (
              <div style={{ display: "flex", gap: "2px" }}>
                {WORD_COUNT_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setWordCount(c)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--font-size-body)",
                      color: wordCount === c ? "var(--accent)" : "var(--text-muted)",
                      background: "transparent",
                      border: "none",
                      padding: "0.25rem 0.6rem",
                      cursor: "pointer",
                      textDecoration: wordCount === c ? "underline" : "none",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    {c}w
                  </button>
                ))}
              </div>
            )}

            {/* Language (for words/count modes) */}
            {(mode === "words" || mode === "count") && (
              <div style={{ display: "flex", gap: "2px" }}>
                {(["en", "ru", "code"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--font-size-body)",
                      color: language === l ? "var(--accent)" : "var(--text-muted)",
                      background: "transparent",
                      border: "none",
                      padding: "0.25rem 0.6rem",
                      cursor: "pointer",
                      textDecoration: language === l ? "underline" : "none",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    {LABELS[l]}
                  </button>
                ))}
              </div>
            )}

            {/* Custom text input */}
            {mode === "custom" && (
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="вставьте текст для тренировки..."
                style={{
                  flex: 1,
                  minWidth: "200px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--font-size-body)",
                  color: "var(--text)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "0.4rem 0.75rem",
                  outline: "none",
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Typing area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-xl) 0",
          minHeight: "300px",
        }}
      >
        <div style={{ maxWidth: "900px", width: "100%", padding: "0 var(--space-md)" }}>
          <TypingDisplay text={text} currentIndex={currentIndex} errors={errorIndices} />
        </div>
      </div>

      {/* Stats — floating bottom-left */}
      <div
        style={{
          position: "fixed",
          bottom: "var(--space-md)",
          left: "var(--space-md)",
          display: "flex",
          gap: "var(--space-md)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-body)",
        }}
      >
        {(isRunning || isFinished) && (
          <>
            <div>
              <span className="label" style={{ display: "block", color: "var(--text-muted)" }}>
                {mode === "count" ? "прогресс" : "время"}
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--font-size-large)", color: "var(--accent)", fontStyle: "italic" }}>
                {mode === "count"
                  ? `${wordProgress}/${wordCount}`
                  : timeLeft != null ? `${timeLeft}s` : "—"}
              </span>
            </div>
            <div>
              <span className="label" style={{ display: "block", color: "var(--text-muted)" }}>wpm</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--font-size-large)", fontStyle: "italic" }}>
                <NumberTicker value={wpm} />
              </span>
            </div>
            <div>
              <span className="label" style={{ display: "block", color: "var(--text-muted)" }}>точность</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--font-size-large)", fontStyle: "italic", color: "var(--success)" }}>
                <NumberTicker value={accuracy} />%
              </span>
            </div>
          </>
        )}
      </div>

      {/* Results overlay */}
      {isFinished && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(40px)", zIndex: 50,
        }}>
          <div style={{
            background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--text-dim)",
            padding: "var(--space-xl)", minWidth: "340px", maxWidth: "440px",
            display: "flex", flexDirection: "column", gap: "var(--space-md)",
          }}>
            {/* Giant WPM */}
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "7rem", fontStyle: "italic", lineHeight: 0.9, color: "var(--accent)" }}>
                <NumberTicker value={wpm} />
              </span>
              <span className="label" style={{ display: "block", marginTop: "0.5rem", color: "var(--text-muted)" }}>слов в минуту</span>
            </div>

            {/* Details */}
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)" }}>
              <div style={{ textAlign: "center" }}>
                <span className="label" style={{ display: "block", color: "var(--text-muted)" }}>точность</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-large)", color: "var(--success)" }}>
                  {accuracy}%
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span className="label" style={{ display: "block", color: "var(--text-muted)" }}>raw</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-large)" }}>
                  {rawWpm}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span className="label" style={{ display: "block", color: "var(--text-muted)" }}>ошибок</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-large)", color: "var(--error)" }}>
                  {errors}
                </span>
              </div>
            </div>

            {/* Retry */}
            <button
              onClick={handleRestart}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
                color: "var(--accent)", background: "none",
                border: "1px solid var(--accent)", borderRadius: "8px",
                padding: "0.5rem 1.5rem", cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.06em",
                marginTop: "var(--space-sm)",
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
