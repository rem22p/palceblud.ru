import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTyping } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { NumberTicker } from "@/components/ui/number-ticker";
import { VisualKeyboard } from "./VisualKeyboard";
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

export function KeyDrillMode() {
  const [stats, setStats] = useState<KeyStatsMap>(() => initKeyStats(HOME_ROW_EN, FULL_ALPHABET_EN));
  const [sessionKey, setSessionKey] = useState(0);
  const [sessionWpm, setSessionWpm] = useState<number | null>(null);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | undefined>();

  const unlockedKeys = useMemo(
    () => Object.entries(stats).filter(([, s]) => s.unlocked).map(([k]) => k),
    [stats],
  );
  const weakest = useMemo(() => getWeakestKey(stats), [stats]);

  // Generate words from unlocked keys, forcing weakest key
  const text = useMemo(
    () => generateDrillWords(unlockedKeys, weakest, WORDS_PER_SET).join(" "),
    [unlockedKeys, weakest, sessionKey],
  );

  const { state, reset } = useTyping({ text });
  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, isRunning, isFinished } = state;

  // Highlight pressed key on keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.length === 1) setPressedKey(e.key.toLowerCase());
    };
    const up = () => setPressedKey(undefined);
    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Process session result
  const handleSessionEnd = useCallback(() => {
    if (!isFinished || sessionWpm != null) return;

    setSessionWpm(wpm);

    // Update stats per unlocked key
    let newStats = { ...stats };
    for (const key of unlockedKeys) {
      newStats = updateKeyStats(newStats, key, wpm, accuracy);
    }
    setStats(newStats);

    // Check unlock
    if (shouldUnlockNext(newStats)) {
      const nextStats = unlockNextKey(newStats, FULL_ALPHABET_EN);
      setStats(nextStats);
      // Find which key was just unlocked
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

  const errorIndices = useMemo(() => {
    const a: number[] = [];
    for (let i = 0; i < typed.length; i++) if (typed[i] !== text[i]) a.push(i);
    return a;
  }, [typed, text]);

  const progress = typed.split(" ").filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Header */}
      <div style={{
        position: "fixed", top: "var(--space-md)", left: "var(--space-md)", zIndex: 100,
        display: "flex", flexDirection: "column", gap: "0.5rem",
      }}>
        <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem", alignSelf: "flex-start" }}>
          <span className="label">keys:</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)", color: "var(--accent)" }}>
            {unlockedKeys.length}/{FULL_ALPHABET_EN.length}
          </span>
        </div>

        {(isRunning || isFinished) && (
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
        )}
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

      {/* Keyboard — hidden until phase 5 (keymapMode setting) */}
      {/* <div style={{ ... }}>
        <VisualKeyboard stats={stats} weakestKey={weakest} pressedKey={pressedKey} />
      </div> */}

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
