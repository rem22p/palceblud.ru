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
      className="w-full px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Логотип — ВСЕГДА видим */}
      <div className="flex items-center gap-3 cursor-pointer select-none">
        <div
          style={{ backgroundColor: "#e2b714" }}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
        >
          <Keyboard size={18} color="#1a1a1a" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#d1d0c5",
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          пальцеблуд
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#e2b714",
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          .рф
        </span>
      </div>

      {/* Переключатель режимов — ВСЕГДА видим, только цвет меняется */}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          borderRadius: "20px",
          padding: "4px",
          display: "flex",
          gap: "4px",
        }}
      >
        <Link
          to="/learning"
          style={{
            padding: "8px 20px",
            borderRadius: "16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
            // Плавный переход ТОЛЬКО цвета и фона
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            backgroundColor: isLearning ? "#3b82f6" : "transparent",
            color: isLearning ? "#0f172a" : "#646669",
          }}
          className="hover:bg-[#3a3a3a]"
        >
          обучение
        </Link>
        <Link
          to="/practice"
          style={{
            padding: "8px 20px",
            borderRadius: "16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
            // Плавный переход ТОЛЬКО цвета и фона
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            backgroundColor: !isLearning ? "#f97316" : "transparent",
            color: !isLearning ? "#0f172a" : "#646669",
          }}
          className="hover:bg-[#3a3a3a]"
        >
          практика
        </Link>
      </div>

      {/* Пустой div для центровки (если нужно) */}
      <div style={{ width: "100px" }} />
    </div>
  );
}