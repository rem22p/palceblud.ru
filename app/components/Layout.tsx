import { Outlet, useLocation } from "react-router";
import { ModeHeader } from "./ModeHeader";
import { useEffect, useState } from "react";

export function Layout() {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  // Проверяем, показывать ли ModeHeader (не показываем на settings и leaderboard)
  const showModeHeader = ["/learning", "/prep", "/practice"].includes(location.pathname);

  // Слушаем события начала/конца печати
  useEffect(() => {
    const handleTypingStart = () => setIsActive(true);
    const handleTypingEnd = () => setIsActive(false);

    window.addEventListener('user-is-typing', handleTypingStart);
    window.addEventListener('user-is-typing-end', handleTypingEnd);

    return () => {
      window.removeEventListener('user-is-typing', handleTypingStart);
      window.removeEventListener('user-is-typing-end', handleTypingEnd);
    };
  }, []);

  // Определяем текущий режим
  const currentMode = location.pathname === "/learning" ? "learning"
                      : location.pathname === "/prep" ? "prep"
                      : location.pathname === "/practice" ? "practice"
                      : "practice";

  // Скрываем ли хедер во время печати (во всех режимах)
  const shouldHideHeader = isActive && (currentMode === "learning" || currentMode === "prep" || currentMode === "practice");

  return (
    <>
      {showModeHeader && <ModeHeader isActive={isActive} shouldHideHeader={shouldHideHeader} />}
      <Outlet />
    </>
  );
}
