import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { Settings, X, Keyboard } from "lucide-react";

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

function SettingsDropdown({
  isOpen,
  onClose,
  accentColor,
}: SettingsDropdownProps) {
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [smoothCaret, setSmoothCaret] = useState(true);
  const [blindMode, setBlindMode] = useState(false);

  if (!isOpen) return null;

  const toggleStyle = (active: boolean) => ({
    width: "34px",
    height: "18px",
    borderRadius: "9px",
    backgroundColor: active ? accentColor : "rgba(255,255,255,0.08)",
    border: "none",
    cursor: "pointer",
    position: "relative" as const,
    transition: "background-color 0.2s",
    flexShrink: 0,
  });

  const knobStyle = (active: boolean) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    position: "absolute" as const,
    top: "3px",
    left: active ? "19px" : "3px",
    transition: "left 0.2s",
  });

  const options = [
    { label: "пунктуация", value: punctuation, set: setPunctuation },
    { label: "цифры", value: numbers, set: setNumbers },
    { label: "плавный курсор", value: smoothCaret, set: setSmoothCaret },
    { label: "слепой режим", value: blindMode, set: setBlindMode },
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 12px)",
          right: 0,
          zIndex: 50,
          backgroundColor: "#1e2028",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "6px",
          minWidth: "200px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px 8px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.68rem",
              color: "rgba(224,224,224,0.3)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            настройки
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(224,224,224,0.3)",
              cursor: "pointer",
              padding: "2px",
            }}
          >
            <X size={13} />
          </button>
        </div>

        {options.map((opt) => (
          <div
            key={opt.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 14px",
              borderRadius: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "rgba(224,224,224,0.5)",
              }}
            >
              {opt.label}
            </span>
            <button
              onClick={() => opt.set(!opt.value)}
              style={toggleStyle(opt.value)}
            >
              <div style={knobStyle(opt.value)} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

interface ModeHeaderProps {
  isActive?: boolean;
}

export function ModeHeader({ isActive = false }: ModeHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isLearning = location.pathname === "/learning";
  const isPractice = location.pathname === "/" || location.pathname === "/practice";

  const accentColor = isLearning ? "#60a5fa" : "#ff6b35";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",  // ← ИСПРАВЛЕНО: было "center"
        padding: "0 40px",
        height: "60px",
        opacity: isActive ? 0.25 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: isActive ? "none" : "auto",
      }}
    >
      {/* Logo — слева */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            backgroundColor: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Keyboard size={15} color="#111" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "rgba(224,224,224,0.85)",
            letterSpacing: "-0.02em",
          }}
        >
          пальцеблуд.рф
        </span>
      </div>

      {/* Mode toggle — по центру */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.04)",
          borderRadius: "99px",
          padding: "4px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Индикатор */}
        <div
          style={{
            position: "absolute",
            left: isLearning ? "4px" : "50%",
            top: "4px",
            bottom: "4px",
            width: "calc(50% - 8px)",
            backgroundColor: isLearning ? "#60a5fa" : "#ff6b35",
            borderRadius: "99px",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 0,
          }}
        />
        
        {/* Кнопка ОБУЧЕНИЕ */}
        <button
          onClick={() => navigate("/learning")}
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.05em",
            padding: "6px 18px",
            borderRadius: "99px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "transparent",
            color: isLearning ? "#111" : "rgba(224,224,224,0.35)",
            fontWeight: isLearning ? 700 : 400,
            transition: "color 0.5s ease",
          }}
        >
          обучение
        </button>
        
        {/* Кнопка ПРАКТИКА */}
        <button
          onClick={() => navigate("/practice")}
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.05em",
            padding: "6px 18px",
            borderRadius: "99px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "transparent",
            color: isPractice ? "#111" : "rgba(224,224,224,0.35)",
            fontWeight: isPractice ? 700 : 400,
            transition: "color 0.5s ease",
          }}
        >
          практика
        </button>
      </div>

      {/* Settings — справа */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          style={{
            background: "none",
            border: "none",
            color: settingsOpen ? accentColor : "rgba(224,224,224,0.3)",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            transition: "color 0.15s",
          }}
        >
          <Settings size={17} />
        </button>
        <SettingsDropdown
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          accentColor={accentColor}
        />
      </div>
    </header>
  );
}