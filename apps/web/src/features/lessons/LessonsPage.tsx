import { useState } from "react";
import { KeyDrillMode } from "./KeyDrillMode";
import { LessonMode } from "./LessonMode";

export function LessonsPage() {
  const [tab, setTab] = useState<"drill" | "lessons">("drill");
  const [lang, setLang] = useState<"en" | "ru">("en");

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Controls — fixed top-left */}
      <div style={{
        position: "fixed", top: "var(--space-md)", left: "var(--space-md)", zIndex: 100,
        display: "flex", flexDirection: "column", gap: "0.5rem",
      }}>
        {/* Tab switcher */}
        <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem", alignSelf: "flex-start" }}>
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

        {/* Language selector — only for lessons tab */}
        {tab === "lessons" && (
          <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem", alignSelf: "flex-start" }}>
            {(["en", "ru"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
                  fontWeight: lang === l ? 600 : 400,
                  color: lang === l ? "var(--accent)" : "var(--text-secondary)",
                  background: lang === l ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none", borderRadius: "12px", padding: "0.35rem 0.85rem",
                  cursor: "pointer", textTransform: "uppercase",
                }}
              >{l === "en" ? "EN" : "RU"}</button>
            ))}
          </div>
        )}
      </div>

      {tab === "drill" ? <KeyDrillMode /> : <LessonMode lang={lang} />}
    </div>
  );
}
