import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./Layout";
import { PracticeMode } from "@/features/practice/PracticeMode";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="practice" element={<PracticeMode />} />
          <Route path="lessons" element={<PlaceholderPage title="Обучение" />} />
          <Route path="multiplayer" element={<PlaceholderPage title="Мультиплеер" />} />
          <Route path="leaderboard" element={<PlaceholderPage title="Таблица лидеров" />} />
          <Route path="profile" element={<PlaceholderPage title="Профиль" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] gap-12 relative z-10">
      {/* ─── Hero ─── */}
      <div className="text-center">
        {/* Kinetic logo — letters tight, dramatic scale */}
        <h1
          className="select-none"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(4rem, 12vw, 9rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            marginBottom: "0.15em",
          }}
        >
          <span
            className="inline-block transition-all"
            style={{
              color: "var(--accent)",
              filter: "drop-shadow(0 0 48px var(--accent-glow))",
              animation: "floatText 6s ease-in-out infinite",
            }}
          >
            пальце
          </span>
          <span
            className="inline-block"
            style={{
              color: "var(--text)",
              animation: "floatText 6s ease-in-out 0.3s infinite",
            }}
          >
            блуд
          </span>
        </h1>

        {/* Subtitle — tight, understated */}
        <p
          className="tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            letterSpacing: "0.35em",
          }}
        >
          клавиатурный тренажёр
        </p>
      </div>

      {/* ─── CTA ─── */}
      <div className="flex gap-3">
        <a
          href="/practice"
          className="glass-accent px-10 py-4 rounded-xl font-semibold text-base
                     transition-all hover:scale-[1.03] active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--accent)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Практика
        </a>
        <a
          href="/lessons"
          className="glass px-10 py-4 rounded-xl font-medium text-base
                     transition-all hover:scale-[1.03] active:scale-[0.98]"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--text-secondary)",
          }}
        >
          Обучение
        </a>
      </div>

      {/* ─── Stats row — live feel ─── */}
      <div className="flex gap-6 text-center">
        {[
          ["60", "слов/мин"],
          ["99%", "точность"],
          ["∞", "практика"],
        ].map(([value, label]) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div
              className="font-bold"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.6rem",
                color: "var(--accent)",
              }}
            >
              {value}
            </div>
            <div
              className="uppercase tracking-wider"
              style={{
                fontSize: "0.6rem",
                color: "var(--text-dim)",
                letterSpacing: "0.2em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Hint ─── */}
      <p
        className="animate-pulse"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-dim)",
        }}
      >
        нажмите любую клавишу чтобы начать
      </p>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {title}
        </h1>
        <p style={{ color: "var(--text-muted)" }}>Скоро будет...</p>
      </div>
    </div>
  );
}
