import type { KeyStatsMap } from "./keyDrill";

interface VisualKeyboardProps {
  stats: KeyStatsMap;
  weakestKey: string | null;
  pressedKey?: string;
}

// Standard QWERTY layout rows
const ROWS = [
  "`1234567890-=",
  "qwertyuiop[]\\",
  "asdfghjkl;'",
  "zxcvbnm,./",
];

export function VisualKeyboard({ stats, weakestKey, pressedKey }: VisualKeyboardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "var(--space-sm)",
        fontFamily: "var(--font-mono)",
        userSelect: "none",
      }}
    >
      {ROWS.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            gap: "3px",
            justifyContent: ri === 1 ? "flex-start" : ri === 0 ? "flex-start" : "center",
            paddingLeft: ri === 1 ? "0" : ri === 2 ? "1rem" : ri === 3 ? "2.5rem" : "0",
          }}
        >
          {row.split("").map((key) => {
            const s = stats[key.toLowerCase()];
            const isActive = s?.unlocked;
            const isWeakest = weakestKey === key.toLowerCase();
            const isPressed = pressedKey === key.toLowerCase();

            return (
              <div
                key={key}
                data-key={key.toLowerCase()}
                style={{
                  width: "2rem",
                  height: "2.4rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--font-size-label)",
                  borderRadius: "4px",
                  color: isActive
                    ? isWeakest
                      ? "var(--error)"
                      : isPressed
                        ? "var(--bg)"
                        : "var(--accent)"
                    : "var(--text-dim)",
                  background: isPressed
                    ? isWeakest
                      ? "var(--error)"
                      : "var(--accent)"
                    : isActive
                      ? isWeakest
                        ? "rgba(212,120,110,0.12)"
                        : "rgba(202,154,107,0.08)"
                      : "transparent",
                  border: isWeakest
                    ? "1px solid var(--error)"
                    : isActive
                      ? "1px solid rgba(202,154,107,0.2)"
                      : "1px solid transparent",
                  transition: "all var(--duration-fast) var(--ease-out)",
                  fontWeight: isWeakest ? 700 : isActive ? 600 : 400,
                }}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
