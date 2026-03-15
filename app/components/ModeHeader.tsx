import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { Settings, User, X, Keyboard, Languages } from "lucide-react";

// --- КОНСТАНТЫ ---
const GOLD_COLOR = "#D4AF37";
const GOLD_HOVER = "#C5A028";

// --- Компонент выпадающего меню настроек ---
interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

function SettingsDropdown({ isOpen, onClose, accentColor }: SettingsDropdownProps) {
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [smoothCaret, setSmoothCaret] = useState(true);
  const [blindMode, setBlindMode] = useState(false);

  if (!isOpen) return null;

  const toggleStyle = (active: boolean) => ({
    width: "34px", height: "18px", borderRadius: "9px",
    backgroundColor: active ? accentColor : "rgba(255,255,255,0.08)",
    border: "none", cursor: "pointer", position: "relative" as const,
    transition: "background-color 0.2s", flexShrink: 0,
  });

  const knobStyle = (active: boolean) => ({
    width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#fff",
    position: "absolute" as const, top: "3px",
    left: active ? "19px" : "3px", transition: "left 0.2s",
  });

  const options = [
    { label: "пунктуация", value: punctuation, set: setPunctuation },
    { label: "цифры", value: numbers, set: setNumbers },
    { label: "плавный курсор", value: smoothCaret, set: setSmoothCaret },
    { label: "слепой режим", value: blindMode, set: setBlindMode },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
      <div style={{
        position: "absolute", bottom: "calc(100% + 10px)", left: 0, zIndex: 50,
        backgroundColor: "#1e2028", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px", padding: "6px", minWidth: "200px",
        boxShadow: "0 -24px 48px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 8px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>настройки</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(224,224,224,0.3)", cursor: "pointer", padding: "2px" }}><X size={13} /></button>
        </div>
        {options.map((opt) => (
          <div key={opt.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderRadius: "6px" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "rgba(224,224,224,0.5)" }}>{opt.label}</span>
            <button onClick={() => opt.set(!opt.value)} style={toggleStyle(opt.value)}><div style={knobStyle(opt.value)} /></button>
          </div>
        ))}
      </div>
    </>
  );
}

// --- Компонент выпадающего меню языков ---
interface LangDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
  onLangChange: (lang: string) => void;
}

function LangDropdown({ isOpen, onClose, currentLang, onLangChange }: LangDropdownProps) {
  if (!isOpen) return null;
  const languages = [{ code: "ru", label: "Русский" }, { code: "en", label: "English" }];
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
      <div style={{
        position: "absolute", bottom: "calc(100% + 10px)", left: 0, zIndex: 50,
        backgroundColor: "#1e2028", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px", padding: "6px", minWidth: "140px",
        boxShadow: "0 -24px 48px rgba(0,0,0,0.4)",
      }}>
        {languages.map((lang) => (
          <button key={lang.code} onClick={() => { onLangChange(lang.code); onClose(); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 14px", borderRadius: "6px", background: "none", border: "none", cursor: "pointer" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: currentLang === lang.code ? "#fff" : "rgba(224,224,224,0.5)", fontWeight: currentLang === lang.code ? 600 : 400 }}>{lang.label}</span>
            {currentLang === lang.code && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: GOLD_COLOR }} />}
          </button>
        ))}
      </div>
    </>
  );
}

// --- КОМПОНЕНТ АВТОРИЗАЦИИ С РАБОЧИМИ КНОПКАМИ ---
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  // Функции-заглушки для кнопок
  const handleRegister = () => {
    console.log("Нажата кнопка: Зарегистрироваться");
    alert("Функция регистрации будет доступна скоро!");
    onClose(); // Закрываем окно после нажатия
  };

  const handleLogin = () => {
    console.log("Нажата кнопка: Войти");
    alert("Функция входа будет доступна скоро!");
    onClose(); // Закрываем окно после нажатия
  };

  return (
    <>
      {/* Затемнение фона */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(5px)",
          zIndex: 90,
          cursor: "pointer",
        }}
      />
      
      {/* Само окно */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          backgroundColor: "#1a1a1a",
          border: `1px solid rgba(212, 175, 55, 0.3)`,
          borderRadius: "16px",
          padding: "40px 32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          textAlign: "center",
          fontFamily: "'JetBrains Mono', monospace",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none", color: "#888888",
            cursor: "pointer", transition: "color 0.2s", zIndex: 101,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
        >
          <X size={20} />
        </button>

        <h2 style={{ margin: "0 0 32px 0", fontSize: "1.5rem", color: "#fff", fontWeight: 600 }}>
          Вход в профиль
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Кнопка ЗАРЕГИСТРИРОВАТЬСЯ (ТЕПЕРЬ РАБОТАЕТ) */}
          <button
            onClick={handleRegister}
            style={{
              width: "100%", padding: "14px",
              backgroundColor: GOLD_COLOR, color: "#1a1a1a",
              border: "none", borderRadius: "8px",
              fontSize: "0.95rem", fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(212, 175, 55, 0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD_HOVER;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD_COLOR;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Зарегистрироваться
          </button>

          {/* Кнопка ВОЙТИ (ТЕПЕРЬ РАБОТАЕТ) */}
          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "14px",
              backgroundColor: "transparent", color: GOLD_COLOR,
              border: `1px solid rgba(212, 175, 55, 0.4)`,
              borderRadius: "8px", fontSize: "0.95rem",
              fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(212, 175, 55, 0.1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD_COLOR;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212, 175, 55, 0.4)";
            }}
          >
            Войти
          </button>
        </div>
        
        <p style={{ marginTop: "24px", fontSize: "0.75rem", color: "#888888", lineHeight: "1.5" }}>
          Присоединяйтесь, чтобы сохранять прогресс<br/>и участвовать в рейтинге
        </p>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, -40%); opacity: 0; }
          to { transform: translate(-50%, -50%); opacity: 1; }
        }
      `}</style>
    </>
  );
}

// --- Основной компонент Header ---
interface ModeHeaderProps {
  isActive?: boolean;
  isFinished?: boolean; 
}

export function ModeHeader({ isActive = false, isFinished = false }: ModeHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");

  const isLearning = location.pathname === "/learning";
  const isPractice = location.pathname === "/" || location.pathname === "/practice";
  const accentColor = isLearning ? "#60a5fa" : "#ff6b35";

  const shouldHideControls = isFinished;

  const toggleAuth = () => {
    setAuthOpen(prev => !prev);
    setSettingsOpen(false);
    setLangOpen(false);
  };

  return (
    <>
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", height: "60px",
          opacity: shouldHideControls ? 1 : (isActive ? 0.25 : 1),
          transition: "opacity 0.4s ease",
          pointerEvents: isActive && !shouldHideControls ? "none" : "auto",
          backgroundColor: "transparent",
        }}
      >
        {/* Логотип */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "9px",
            cursor: "pointer", zIndex: 31,
            opacity: shouldHideControls ? 0 : 1, 
            pointerEvents: shouldHideControls ? "none" : "auto",
            transition: "opacity 0.3s"
          }}
          onClick={() => navigate("/")}
        >
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            backgroundColor: accentColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <Keyboard size={15} color="#111" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.95rem", fontWeight: 600,
            color: "rgba(224,224,224,0.85)", letterSpacing: "-0.02em",
          }}>
            пальцеблуд.рф
          </span>
        </div>

        {/* Переключатель режимов (ЦЕНТР) */}
        {!shouldHideControls && (
          <div
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: "99px", padding: "5px",
              border: "1px solid rgba(255,255,255,0.06)",
              zIndex: 31,
              opacity: isActive ? 0 : 1,
              pointerEvents: isActive ? "none" : "auto",
              transition: "opacity 0.3s"
            }}
          >
            <div
              style={{
                position: "absolute",
                left: isLearning ? "5px" : "50%",
                top: "5px", bottom: "5px",
                width: "calc(50% - 5px)",
                backgroundColor: isLearning ? "#60a5fa" : "#ff6b35",
                borderRadius: "99px",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 0,
              }}
            />
            <button onClick={() => navigate("/learning")} style={{
              position: "relative", zIndex: 1, flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem", letterSpacing: "0.05em",
              padding: "8px 24px", borderRadius: "99px",
              border: "none", cursor: "pointer",
              backgroundColor: "transparent",
              color: isLearning ? "#111" : "rgba(224,224,224,0.35)",
              fontWeight: isLearning ? 700 : 400,
              transition: "color 0.5s ease",
            }}>обучение</button>
            
            <button onClick={() => navigate("/practice")} style={{
              position: "relative", zIndex: 1, flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem", letterSpacing: "0.05em",
              padding: "8px 24px", borderRadius: "99px",
              border: "none", cursor: "pointer",
              backgroundColor: "transparent",
              color: isPractice ? "#111" : "rgba(224,224,224,0.35)",
              fontWeight: isPractice ? 700 : 400,
              transition: "color 0.5s ease",
            }}>практика</button>
          </div>
        )}

        {/* ПРАВЫЙ УГОЛ: Профиль */}
        {!shouldHideControls && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 31 }}>
            <div style={{ position: "relative" }}>
              <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
              <button
                onClick={toggleAuth}
                style={{
                  background: "transparent", border: "none",
                  color: authOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)",
                  cursor: "pointer", padding: "8px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", zIndex: 32
                }}
                onMouseEnter={(e) => {
                   if (!authOpen) {
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                   }
                }}
                onMouseLeave={(e) => {
                   if (!authOpen) {
                      e.currentTarget.style.color = "rgba(224,224,224,0.5)";
                      e.currentTarget.style.background = "transparent";
                   }
                }}
              >
                <User size={20} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* НИЖНИЙ ЛЕВЫЙ УГОЛ: Настройки + ЯЗЫК */}
      {!shouldHideControls && (
        <div
          style={{
            position: "fixed", bottom: "20px", left: "40px",
            zIndex: 100, display: "flex", gap: "12px", alignItems: "center"
          }}
        >
          {/* Кнопка НАСТРОЙКИ */}
          <div style={{ position: "relative" }}>
            <SettingsDropdown isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} accentColor={accentColor} />
            <button
              onClick={() => { setSettingsOpen(!settingsOpen); setAuthOpen(false); setLangOpen(false); }}
              style={{
                background: "transparent", border: "none",
                color: settingsOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)",
                cursor: "pointer", padding: "8px", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!settingsOpen) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
              onMouseLeave={(e) => { if (!settingsOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }}
            >
              <Settings size={20} />
            </button>
          </div>

          {/* КНОПКА ЯЗЫКА */}
          <div style={{ position: "relative" }}>
            <LangDropdown isOpen={langOpen} onClose={() => setLangOpen(false)} currentLang={currentLang} onLangChange={setCurrentLang} />
            <button
              onClick={() => { setLangOpen(!langOpen); setAuthOpen(false); setSettingsOpen(false); }}
              style={{
                background: "transparent", border: "none",
                color: langOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)",
                cursor: "pointer", padding: "8px", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!langOpen) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
              onMouseLeave={(e) => { if (!langOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }}
              title="Переключить язык"
            >
              <Languages size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}