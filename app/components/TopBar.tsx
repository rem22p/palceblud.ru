import { Keyboard } from "lucide-react";
import { Link, useLocation } from "react-router";

export function TopBar() {
  const location = useLocation();
  const isLearning = location.pathname === "/learning";

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderBottom: "1px solid #2a2a2a",
      }}
      // Убрали py-4, чтобы высота зависела только от контента
      className="w-full px-6 md:px-10 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Логотип */}
      <div className="flex items-center gap-3 cursor-pointer select-none">
        <div
          style={{ backgroundColor: "#e2b714" }}
          className="w-9 h-9 rounded-lg flex items-center justify-center"
        >
          <Keyboard size={20} color="#1a1a1a" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#d1d0c5",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          пальцеблуд
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#e2b714",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          .рф
        </span>
      </div>

      {/* Переключатель режимов — УВЕЛИЧЕН В 2 РАЗА */}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          borderRadius: "99px",
          padding: "8px",         // Было 4px
          display: "flex",
          gap: "8px",             // Было 4px
          minHeight: "64px",      // НОВАЯ СТРОКА: Фиксируем минимальную высоту (было ~40px)
          alignItems: "center",   // Центрируем кнопки по вертикали
        }}
      >
        <Link
          to="/learning"
          style={{
            padding: "14px 32px",      // Было 8px 20px (увеличено в ~2 раза)
            borderRadius: "99px",      // Делаем полностью круглым
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.1rem",        // Было 0.85rem (увеличено)
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            backgroundColor: isLearning ? "#3b82f6" : "transparent",
            color: isLearning ? "#0f172a" : "#646669",
            whiteSpace: "nowrap",      // Запрещаем перенос текста
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="hover:bg-[#3a3a3a]"
        >
          обучение
        </Link>
        <Link
          to="/practice"
          style={{
            padding: "14px 32px",      // Было 8px 20px
            borderRadius: "99px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.1rem",        // Было 0.85rem
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            backgroundColor: !isLearning ? "#f97316" : "transparent",
            color: !isLearning ? "#0f172a" : "#646669",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="hover:bg-[#3a3a3a]"
        >
          практика
        </Link>
      </div>

      {/* Пустой div для центровки (чуть шире, чтобы компенсировать рост кнопок) */}
      <div style={{ width: "140px" }} />
    </div>
  );
}