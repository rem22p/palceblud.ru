import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTyping } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  initKeyStats,
  updateKeyStats,
  getWeakestKey,
  shouldUnlockNext,
  unlockNextKey,
  generateDrillWords,
  type KeyStatsMap,
} from "./keyDrill";

const HOME_ROW_EN = ["a", "s", "d", "f", "j", "k", "l", ";"];
const FULL_ALPHABET_EN = "abcdefghijklmnopqrstuvwxyz,./;'".split("");
const WORDS_PER_SET = 25;

function letterColor(stats: KeyStatsMap, key: string, isWeakest: boolean): { bg: string; text: string } {
  const s = stats[key];
  if (!s?.unlocked) return { bg: "transparent", text: "var(--text-dim)" };
  if (isWeakest) return { bg: "rgba(212,120,110,0.15)", text: "var(--error)" };
  if (s.tests >= 5 && s.accuracy >= 100) return { bg: "rgba(126,184,126,0.12)", text: "var(--success)" };
  if (s.tests >= 1) return { bg: "rgba(202,154,107,0.12)", text: "var(--accent)" };
  return { bg: "rgba(202,154,107,0.06)", text: "var(--accent)" };
}

export function KeyDrillMode() {
  const [stats, setStats] = useState<KeyStatsMap>(() => initKeyStats(HOME_ROW_EN, FULL_ALPHABET_EN));
  const [sessionKey, setSessionKey] = useState(0);
  const [sessionWpm, setSessionWpm] = useState<number | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  const unlockedKeys = useMemo(
    () => Object.entries(stats).filter(([, s]) => s.unlocked).map(([k]) => k),
    [stats],
  );
  const weakest = useMemo(() => getWeakestKey(stats), [stats]);

  const text = useMemo(
    () => generateDrillWords(unlockedKeys, weakest, WORDS_PER_SET).join(" "),
    [unlockedKeys, weakest, sessionKey],
  );

  const { state, reset } = useTyping({ text });
  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, isRunning, isFinished } = state;

  const errorIndices = useMemo(() => {
    const a: number[] = [];
    for (let i = 0; i < typed.length; i++) if (typed[i] !== text[i]) a.push(i);
    return a;
  }, [typed, text]);

  const handleSessionEnd = useCallback(() => {
    if (!isFinished || sessionWpm != null) return;
    setSessionWpm(wpm);

    let newStats = { ...stats };
    for (const key of unlockedKeys) {
      newStats = updateKeyStats(newStats, key, wpm, accuracy);
    }
    setStats(newStats);

    if (shouldUnlockNext(newStats)) {
      const nextStats = unlockNextKey(newStats, FULL_ALPHABET_EN);
      setStats(nextStats);
      for (const [k, s] of Object.entries(nextStats)) {
        if (s.unlocked && !stats[k]?.unlocked) {
          setJustUnlocked(k);
          setTimeout(() => setJustUnlocked(null), 3000);
          break;
        }
      }
    }
  }, [isFinished, sessionWpm, wpm, accuracy, stats, unlockedKeys]);

  useEffect(() => { handleSessionEnd(); }, [handleSessionEnd]);

  const handleRetry = () => {
    reset();
    setSessionKey((k) => k + 1);
    setSessionWpm(null);
  };

  const progress = typed.split(" ").filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Stats bar — fixed top-left */}
      {(isRunning || isFinished) && (
        <div style={{ position: "fixed", top: "var(--space-md)", left: "var(--space-md)", zIndex: 100 }}>
          <div className="glass" style={{ display: "inline-flex", gap: "var(--space-md)", padding: "0.75rem 1.5rem" }}>
            {[
              { label: "COUNT", value: progress, suffix: `/${WORDS_PER_SET}`, color: "var(--accent)" },
              { label: "WPM", value: wpm, color: "var(--accent)" },
              { label: "ACC", value: accuracy, suffix: "%", color: "var(--success)" },
            ].map(({ label, value, color, suffix }) => (
              <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                <span className="label">{label}</span>
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, color, fontSize: "var(--font-size-large)" }}>
                  <NumberTicker value={value} className="!text-inherit" />
                </span>
                {suffix && (
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "var(--font-size-lead)", color }}>{suffix}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Letter panel — left side, below tabs */}
      <div style={{
        position: "fixed", top: "calc(var(--space-md) + 70px)", left: "var(--space-md)", zIndex: 99,
        maxWidth: "360px", width: "100%",
      }}>
        <div className="glass" style={{ padding: "var(--space-md)" }}>
          <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
            клавиши · {unlockedKeys.length}/{FULL_ALPHABET_EN.length}
          </p>

          {/* Letter grid */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "3px",
            fontFamily: "var(--font-mono)", fontSize: "var(--font-size-label)",
          }}>
            {FULL_ALPHABET_EN.map((key) => {
              const s = stats[key];
              const isWeak = weakest === key;
              const c = letterColor(stats, key, isWeak);
              return (
                <span
                  key={key}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "1.8rem", height: "1.8rem", borderRadius: "4px",
                    color: c.text, background: c.bg,
                    fontWeight: isWeak ? 700 : s?.unlocked ? 600 : 400,
                    border: isWeak ? "1px solid var(--error)" : s?.unlocked ? "1px solid rgba(202,154,107,0.2)" : "1px solid transparent",
                    transition: "all var(--duration-fast) var(--ease-out)",
                  }}
                >
                  {key.toUpperCase()}
                </span>
              );
            })}
          </div>

          {/* Weakest key highlight */}
          {weakest && isRunning && (
            <div style={{
              marginTop: "var(--space-sm)", padding: "0.5rem 0.75rem",
              background: "rgba(212,120,110,0.08)", borderRadius: "8px",
              fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <span style={{ color: "var(--text-muted)" }}>слабое:</span>
              <span style={{ color: "var(--error)", fontWeight: 700, fontSize: "var(--font-size-lead)" }}>
                {weakest.toUpperCase()}
              </span>
              <span style={{ color: "var(--text-muted)", marginLeft: "auto" }}>
                {stats[weakest].tests}/5 тестов
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Just unlocked toast */}
      {justUnlocked && (
        <div className="glass" style={{
          position: "fixed", top: "var(--space-md)", left: "50%", transform: "translateX(-50%)", zIndex: 200,
          padding: "0.5rem 1.5rem", fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
        }}>
          <span style={{ color: "var(--success)" }}>+{justUnlocked.toUpperCase()}</span>
          <span style={{ color: "var(--text-secondary)", marginLeft: "0.5rem" }}>разблокировано</span>
        </div>
      )}

      {/* Typing area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "900px", width: "100%", padding: "0 var(--space-md)" }}>
          <TypingDisplay text={text} currentIndex={currentIndex} errors={errorIndices} />
        </div>
      </div>

      {/* Results overlay */}
      {isFinished && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-md)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(40px)" }}>
          <div className="glass" style={{ maxWidth: "520px", width: "100%", padding: "var(--space-lg)" }}>
            <p className="label" style={{ marginBottom: "var(--space-sm)" }}>результат</p>
            <h2 className="display" style={{ fontSize: "var(--font-size-hero)", color: "var(--accent)", lineHeight: 0.8, marginBottom: "var(--space-md)" }}>{wpm}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
              {[
                { label: "точность", value: `${accuracy}%` },
                { label: "raw", value: rawWpm },
                { label: "ошибок", value: errors },
                { label: "клавиш", value: `${unlockedKeys.length}/${FULL_ALPHABET_EN.length}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="label">{label}</div>
                  <div className="mono" style={{ fontSize: "var(--font-size-lead)", marginTop: "0.25rem" }}>{value}</div>
                </div>
              ))}
            </div>
            <a onClick={handleRetry} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--font-size-lead)", color: "var(--accent)", cursor: "pointer" }}>
              ещё раз <span className="cursor" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
