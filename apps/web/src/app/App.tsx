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
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-10">
      {/* Logo */}
      <div className="text-center">
        <h1
          className="text-7xl font-extrabold tracking-tight leading-none mb-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span style={{ color: "var(--accent)" }}>пальце</span>
          <span style={{ color: "var(--text)" }}>блуд</span>
        </h1>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          клавиатурный тренажёр
        </p>
      </div>

      {/* CTA buttons — liquid glass cards */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/practice"
          className="px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 
                     hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "var(--accent)",
            color: "var(--accent-text)",
            fontFamily: "var(--font-sans)",
          }}
        >
          Начать практику
        </a>
        <a
          href="/lessons"
          className="glass glass-hover px-8 py-3.5 rounded-xl font-medium text-sm
                     transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-sans)",
          }}
        >
          Пройти обучение
        </a>
      </div>

      {/* Feature cards — liquid glass */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
        {[
          { title: "WPM", desc: "Скорость печати" },
          { title: "100%", desc: "Точность набора" },
          { title: "∞", desc: "Бесконечная практика" },
        ].map(({ title, desc }) => (
          <div
            key={title}
            className="glass rounded-xl p-4 text-center transition-all duration-200 hover:bg-white/[0.05]"
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
            >
              {title}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {desc}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <p className="text-xs animate-pulse" style={{ color: "var(--text-dim)" }}>
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
