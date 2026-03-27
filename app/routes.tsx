import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { PracticeMode } from "./pages/PracticeMode";
import { LearningMode } from "./pages/LearningMode";
import { PrepMode } from "./pages/PrepMode";
import { SettingsPage } from "./pages/SettingsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

// Компонент для перенаправления на последний выбранный режим
function LastModeRedirect() {
  const lastMode = localStorage.getItem("palceblud_last_mode") as "learning" | "prep" | "practice" | null;
  const target = lastMode && ["learning", "prep", "practice"].includes(lastMode) ? lastMode : "practice";
  return <Navigate to={`/${target}`} replace />;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LastModeRedirect />,
      },
      {
        path: "practice",
        element: <PracticeMode />,
      },
      {
        path: "learning",
        element: <LearningMode />,
      },
      {
        path: "prep",
        element: <PrepMode />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "leaderboard",
        element: <LeaderboardPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div style={{ minHeight: "100vh", backgroundColor: "#2b2d31", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", color: "rgba(224,224,224,0.5)" }}>404</div>,
  },
]);
