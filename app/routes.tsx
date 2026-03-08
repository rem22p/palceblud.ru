import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { PracticeMode } from "./pages/PracticeMode";
import { LearningMode } from "./pages/LearningMode";

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
    ],
  },
]);