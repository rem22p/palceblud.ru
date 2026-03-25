import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { PracticeMode } from "./pages/PracticeMode";
import { LearningMode } from "./pages/LearningMode";
import { PrepMode } from "./pages/PrepMode";
import { SettingsPage } from "./pages/SettingsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        Component: PracticeMode,
      },
      {
        path: "/practice",
        Component: PracticeMode,
      },
      {
        path: "/learning",
        Component: LearningMode,
      },
      {
        path: "/prep",
        Component: PrepMode,
      },
      {
        path: "/settings",
        Component: SettingsPage,
      },
      {
        path: "/leaderboard",
        Component: LeaderboardPage,
      },
      {
        path: "*",
        element: <div style={{ minHeight: "100vh", backgroundColor: "#2b2d31", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", color: "rgba(224,224,224,0.5)" }}>404</div>,
      },
    ],
  },
]);
