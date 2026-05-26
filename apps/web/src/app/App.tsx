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
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <h1 className="text-6xl font-bold tracking-tight">
        <span className="text-accent">пальце</span>блуд
      </h1>
      <p className="text-text-muted text-lg">клавиатурный тренажёр</p>
      <div className="flex gap-4 mt-4">
        <a
          href="/practice"
          className="px-8 py-3 bg-accent text-black font-semibold rounded-lg 
                     hover:bg-accent-hover transition-colors"
        >
          Практика
        </a>
        <a
          href="/lessons"
          className="px-8 py-3 border border-text-muted/30 rounded-lg 
                     hover:border-text-muted/60 transition-colors"
        >
          Обучение
        </a>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-text-muted">Скоро будет...</p>
      </div>
    </div>
  );
}
