import { createBrowserRouter } from "react-router";
import { PracticeMode } from "./pages/PracticeMode";
import { LearningMode } from "./pages/LearningMode";
import { PrepMode } from "./pages/PrepMode";
import { SettingsPage } from "./pages/SettingsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PracticeMode />,
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
  {
    path: "*",
    element: <div style={{ minHeight: "100vh", backgroundColor: "#2b2d31", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", color: "rgba(224,224,224,0.5)" }}>404</div>,
  },
]);
