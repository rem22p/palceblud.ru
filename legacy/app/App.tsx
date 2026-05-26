import { RouterProvider } from "react-router";
import { router } from "./routes";  // ← расширение .tsx указывать НЕ нужно

export default function App() {
  return <RouterProvider router={router} />;
}