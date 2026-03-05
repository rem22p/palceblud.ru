import { useState } from "react";
import {
  Keyboard,
  User,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  BarChart2,
  Trophy,
  LogIn,
} from "lucide-react";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      style={{ backgroundColor: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}
      className="w-full px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Logo */}
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
            letterSpacing: "-0.02em",
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

      {/* Center nav */}
      <nav className="hidden md:flex items-center gap-6">
        {[
          { label: "таблица лидеров", icon: <Trophy size={14} /> },
          { label: "статистика", icon: <BarChart2 size={14} /> },
          { label: "о проекте", icon: null },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#646669",
              fontSize: "0.8rem",
              background: "none",
              border: "none",
              transition: "color 0.15s",
            }}
            className="flex items-center gap-1.5 cursor-pointer hover:!text-[#d1d0c5]"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            background: "none",
            border: "none",
            color: "#646669",
            padding: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          className="hover:!text-[#d1d0c5] hover:!bg-[#2a2a2a]"
          title="Сменить тему"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          style={{
            background: "none",
            border: "none",
            color: "#646669",
            padding: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          className="hover:!text-[#d1d0c5] hover:!bg-[#2a2a2a]"
          title="Настройки"
        >
          <Settings size={18} />
        </button>

        {/* Divider */}
        <div
          style={{ width: "1px", height: "24px", backgroundColor: "#2a2a2a" }}
          className="mx-1 hidden sm:block"
        />

        {/* User */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: "none",
              border: "none",
              color: "#646669",
              padding: "6px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.82rem",
            }}
            className="hover:!text-[#d1d0c5] hover:!bg-[#2a2a2a]"
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                backgroundColor: "#2a2a2a",
                border: "1.5px solid #3a3a3a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={14} color="#646669" />
            </div>
            <span style={{ color: "#d1d0c5" }}>гость</span>
            <ChevronDown size={12} />
          </button>

          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                backgroundColor: "#222222",
                border: "1px solid #2a2a2a",
                borderRadius: "10px",
                padding: "6px",
                minWidth: "160px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                zIndex: 100,
              }}
            >
              {[
                { icon: <User size={14} />, label: "профиль" },
                { icon: <Trophy size={14} />, label: "таблица лидеров" },
                { icon: <Settings size={14} />, label: "настройки" },
                { icon: <LogIn size={14} />, label: "войти" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#646669",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.78rem",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                  className="hover:!text-[#d1d0c5] hover:!bg-[#2a2a2a]"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
