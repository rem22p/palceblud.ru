import { Outlet, useLocation } from "react-router";
import { ModeHeader } from "./ModeHeader";

export function Layout() {
  const location = useLocation();
  
  // Проверяем, показывать ли ModeHeader (не показываем на settings и leaderboard)
  const showModeHeader = ["/learning", "/prep", "/practice"].includes(location.pathname);

  return (
    <>
      {showModeHeader && <ModeHeader />}
      <Outlet />
    </>
  );
}
