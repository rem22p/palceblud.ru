import { useState } from "react";
import { KeyDrillMode } from "./KeyDrillMode";
import { LessonMode } from "./LessonMode";

export function LessonsPage() {
  const [tab, setTab] = useState<"drill" | "lessons">("drill");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Tab switcher — fixed top-left, same as PracticeMode */}
      <div style={{
        position: "fixed", top: "var(--space-md)", left: "var(--space-md)", zIndex: 100,
      }}>
        <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem" }}>
          {(["drill", "lessons"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "var(--accent)" : "var(--text-secondary)",
                background: tab === t ? "rgba(255,255,255,0.06)" : "transparent",
                border: "none", borderRadius: "12px", padding: "0.35rem 0.85rem",
                cursor: "pointer", textTransform: "uppercase",
                transition: "all var(--duration-fast) var(--ease-out)",
              }}
            >{t === "drill" ? "наработка" : "уроки"}</button>
          ))}
        </div>
      </div>
      {tab === "drill" ? <KeyDrillMode /> : <LessonMode />}
    </div>
  );
}
