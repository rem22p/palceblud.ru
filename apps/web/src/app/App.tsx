import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { Layout } from "./Layout";
import { PracticeMode } from "@/features/practice/PracticeMode";
import { ProfilePage } from "@/features/auth/ProfilePage";
import { LessonsPage } from "@/features/lessons/LessonsPage";
import { useAuthStore } from "@/features/auth/authStore";

export function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="practice" element={<PracticeMode />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="battle" element={<PlaceholderPage title="Битва" num="03" />} />
          <Route path="rank" element={<PlaceholderPage title="Рейтинг" num="04" />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        position: "relative",
        paddingTop: "var(--space-xl)",
      }}
    >
      {/* ─── Architectural mega-letter ─── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-8vh",
          right: "-3vw",
          fontFamily: "var(--font-display)",
          fontSize: "var(--font-size-mega)",
          fontWeight: 900,
          color: "var(--text-dim)",
          lineHeight: 0.7,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        П
      </div>

      {/* ─── Content ─── */}
      <div style={{ position: "relative", zIndex: 1, paddingLeft: "5%" }}>
        {/* Label */}
        <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
          клавиатурный тренажёр
        </p>

        {/* Title */}
        <h1
          className="display"
          style={{
            fontSize: "var(--font-size-hero)",
            color: "var(--text)",
            marginBottom: "var(--space-md)",
          }}
        >
          пальцеблуд
        </h1>

        {/* CTA */}
        <a
          href="/practice"
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "var(--font-size-lead)",
            color: "var(--accent)",
            textDecoration: "none",
            marginBottom: "var(--space-xl)",
            transition: "opacity var(--duration-fast) var(--ease-out)",
          }}
        >
          начать практику
          <span className="cursor" />
        </a>

        {/* GitVerse-style glass stat cards */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-md)",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "∞", label: "бесплатно", sub: "навсегда" },
            { value: "RU", label: "русский", sub: "+ english" },
            { value: "WPM", label: "скорость", sub: "метрика" },
          ].map(({ value, label, sub }) => (
            <div
              key={label}
              className="glass"
              style={{
                padding: "1.25rem 1.5rem",
                minWidth: "160px",
              }}
            >
              <div
                className="display"
                style={{
                  fontSize: "var(--font-size-display)",
                  color: "var(--accent)",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {value}
              </div>
              <div className="label" style={{ marginBottom: "0.15rem" }}>{label}</div>
              <div className="mono" style={{ fontSize: "var(--font-size-label)", color: "var(--text-muted)" }}>
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, num }: { title: string; num: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <div>
        <span className="label">{num}</span>
        <h1 className="display" style={{ fontSize: "var(--font-size-display)", marginTop: "var(--space-sm)" }}>
          {title}
        </h1>
      </div>
    </div>
  );
}
