import { useState } from "react";
import { KeyDrillMode } from "./KeyDrillMode";

export function LessonsPage() {
  const [tab, setTab] = useState<"drill" | "lessons">("drill");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
      {/* Tab switcher — in the header area */}
      {tab === "lessons" && (
        <div style={{
          position: "fixed", top: "var(--space-md)", left: "var(--space-md)", zIndex: 101,
        }}>
          <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem" }}>
            {(["drill", "lessons"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
                  fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? "var(--accent)" : "var(--text-secondary)",
                  background: tab === t ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none", borderRadius: "12px", padding: "0.35rem 0.85rem",
                  cursor: "pointer", textTransform: "uppercase",
                  transition: "all var(--duration-fast) var(--ease-out)",
                }}
              >
                {t === "drill" ? "наработка" : "уроки"}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "drill" ? (
        <KeyDrillMode />
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, paddingTop: "var(--space-xl)" }}>
          <div className="glass" style={{ padding: "var(--space-lg)", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <p className="label">уроки</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--font-size-lead)", fontStyle: "italic", color: "var(--text-muted)" }}>
              Структурированные уроки — в разработке
            </p>
            <p className="mono" style={{ fontSize: "var(--font-size-body)", color: "var(--text-secondary)" }}>
              12 последовательных уровней от домашнего ряда до длинных текстов.
            </p>
            <button
              onClick={() => setTab("drill")}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
                color: "var(--accent)", background: "none",
                border: "1px solid var(--accent)", borderRadius: "8px",
                padding: "0.5rem 1.5rem", cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.06em",
                alignSelf: "flex-start",
              }}
            >
              к наработке
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
