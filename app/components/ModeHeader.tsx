import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { Settings, User, X, Keyboard, Languages, Trophy, Crown, Medal } from "lucide-react";

// --- КОНСТАНТЫ ---
const GOLD_COLOR = "#D4AF37";
const GOLD_HOVER = "#C5A028";

// Цвета для разных режимов
const MODE_COLORS = {
  learning: "#60a5fa",  // Синий (теперь первый)
  prep: "#0A5F38",      // Зеленый (теперь второй)
  practice: "#ff6b35"   // Оранжевый (третий)
};

// ─── Mock Leaderboard Data ─────────────────────────────────────────────────
const LEADERBOARD_DATA = [
  { rank: 1, name: "SpeedDemon", wpm: 145, accuracy: 99, date: "2 мин. назад" },
  { rank: 2, name: "KeyboardWarrior", wpm: 138, accuracy: 98, date: "15 мин. назад" },
  { rank: 3, name: "TypeMaster", wpm: 132, accuracy: 100, date: "1 час назад" },
  { rank: 4, name: "FingerNinja", wpm: 128, accuracy: 97, date: "3 часа назад" },
  { rank: 5, name: "QuickKeys", wpm: 125, accuracy: 96, date: "5 часов назад" },
  { rank: 6, name: "ClickClack", wpm: 120, accuracy: 98, date: "Вчера" },
  { rank: 7, name: "FlowState", wpm: 118, accuracy: 95, date: "Вчера" },
  { rank: 8, name: "NoErrors", wpm: 115, accuracy: 100, date: "2 дня назад" },
  { rank: 9, name: "FastFingers", wpm: 112, accuracy: 94, date: "2 дня назад" },
  { rank: 10, name: "TypoKing", wpm: 110, accuracy: 93, date: "3 дня назад" },
];

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

// --- КОМПОНЕНТ РЕЙТИНГА (Leaderboard) ---
interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90, cursor: "pointer" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 100, backgroundColor: "#2b2d31", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "500px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#e0e0e0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Trophy size={20} color="#fbbf24" /> Рейтинг (Глобальный)
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e) => e.currentTarget.style.color = "#666"}><X size={20} /></button>
        </div>
        <div style={{ overflowY: "auto", maxHeight: "400px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#666", textAlign: "left" }}>
              <th style={{ padding: "10px", width: "50px" }}>#</th>
              <th style={{ padding: "10px" }}>Игрок</th>
              <th style={{ padding: "10px", textAlign: "right" }}>WPM</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Acc</th>
              <th style={{ padding: "10px", textAlign: "right", fontSize: "0.75rem" }}>Время</th>
            </tr></thead>
            <tbody>
              {LEADERBOARD_DATA.map((user) => (
                <tr key={user.rank} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#e0e0e0" }}>
                  <td style={{ padding: "12px 10px" }}>
                    {user.rank === 1 ? <Crown size={16} color="#fbbf24" /> : 
                     user.rank === 2 ? <Medal size={16} color="#9ca3af" /> : 
                     user.rank === 3 ? <Medal size={16} color="#b45309" /> : 
                     <span style={{ color: "#666" }}>{user.rank}</span>}
                  </td>
                  <td style={{ padding: "12px 10px", fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", color: "#34d399" }}>{user.wpm}</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", color: "#60a5fa" }}>{user.accuracy}%</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", color: "#666", fontSize: "0.75rem" }}>{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.75rem", color: "#666" }}>Обновляется каждые 5 минут</div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }`}</style>
    </>
  );
}

// --- КОМПОНЕНТ АВТОРИЗАЦИИ ---
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleRegister = () => {
    console.log("Register:", email, password);
    onClose();
  };

  const handleLogin = () => {
    console.log("Login:", email, password);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90, cursor: "pointer" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 100, backgroundColor: "#2b2d31", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px", padding: "32px", width: "90%", maxWidth: "400px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#e0e0e0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <User size={20} color="#60a5fa" />
            {isLoginMode ? "Вход в профиль" : "Регистрация"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e) => e.currentTarget.style.color = "#666"}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.ru" style={{ width: "100%", padding: "10px 12px", backgroundColor: "#1e2028", border: "1px solid #333", borderRadius: "6px", color: "#e0e0e0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }} onFocus={(e) => { e.target.style.borderColor = GOLD_COLOR; e.target.style.boxShadow = "0 0 0 2px rgba(212, 175, 55, 0.2)"; }} onBlur={(e) => { e.target.style.borderColor = "#333"; e.target.style.boxShadow = "none"; }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px" }}>Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px 12px", backgroundColor: "#1e2028", border: "1px solid #333", borderRadius: "6px", color: "#e0e0e0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" }} onFocus={(e) => { e.target.style.borderColor = GOLD_COLOR; e.target.style.boxShadow = "0 0 0 2px rgba(212, 175, 55, 0.2)"; }} onBlur={(e) => { e.target.style.borderColor = "#333"; e.target.style.boxShadow = "none"; }} />
          </div>
          <button onClick={isLoginMode ? handleLogin : handleRegister} style={{ width: "100%", marginTop: "8px", padding: "12px", backgroundColor: GOLD_COLOR, color: "#1a1a1a", border: "none", borderRadius: "6px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", opacity: (!email || !password) ? 0.7 : 1 }} onMouseEnter={(e) => { if (email && password) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD_HOVER; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; } }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = GOLD_COLOR; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
            {isLoginMode ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>

        <div style={{ marginTop: "20px", fontSize: "0.8rem", color: "#888", textAlign: "center" }}>
          {isLoginMode ? (<>Нет аккаунта? <span onClick={() => setIsLoginMode(false)} style={{ color: GOLD_COLOR, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Создать</span></>) : (<>Уже есть аккаунт? <span onClick={() => setIsLoginMode(true)} style={{ color: GOLD_COLOR, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Войти</span></>)}
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }`}</style>
    </>
  );
}

// --- ОСНОВНОЙ КОМПОНЕНТ HEADER ---
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
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");

  // Определение текущего режима
  const currentMode = location.pathname === "/learning" ? "learning"
                      : location.pathname === "/prep" ? "prep"
                      : "practice";

  const accentColor = MODE_COLORS[currentMode];

  const shouldHideControls = isFinished;

  const closeAllMenus = () => {
    setSettingsOpen(false);
    setAuthOpen(false);
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

        {/* Переключатель режимов (ЦЕНТР) - НОВЫЙ ПОРЯДОК */}
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
            {/* Плавающий фон (активный элемент) */}
            <div
              style={{
                position: "absolute",
                // Новая логика позиционирования: Learning (0%), Prep (50%), Practice (100%)
                left: currentMode === "learning" ? "5px" : currentMode === "prep" ? "calc(33.33% + 2.5px)" : "calc(66.66% + 0px)",
                top: "5px", bottom: "5px",
                width: "calc(33.33% - 5px)",
                backgroundColor: accentColor,
                borderRadius: "99px",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 0,
              }}
            />
            
            {/* Кнопка 1: ОБУЧЕНИЕ */}
            <button onClick={() => navigate("/learning")} style={{
              position: "relative", zIndex: 1, flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.80rem", letterSpacing: "0.05em",
              padding: "8px 12px", borderRadius: "99px",
              border: "none", cursor: "pointer",
              backgroundColor: "transparent",
              color: currentMode === "learning" ? "#111" : "rgba(224,224,224,0.35)",
              fontWeight: currentMode === "learning" ? 700 : 400,
              transition: "color 0.5s ease",
              whiteSpace: "nowrap"
            }}>обучение</button>
            
            {/* Кнопка 2: ПОДГОТОВКА */}
            <button onClick={() => navigate("/prep")} style={{
              position: "relative", zIndex: 1, flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.80rem", letterSpacing: "0.05em",
              padding: "8px 12px", borderRadius: "99px",
              border: "none", cursor: "pointer",
              backgroundColor: "transparent",
              color: currentMode === "prep" ? "#111" : "rgba(224,224,224,0.35)",
              fontWeight: currentMode === "prep" ? 700 : 400,
              transition: "color 0.5s ease",
              whiteSpace: "nowrap"
            }}>подготовка</button>
            
            {/* Кнопка 3: ПРАКТИКА */}
            <button onClick={() => navigate("/practice")} style={{
              position: "relative", zIndex: 1, flex: 1,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.80rem", letterSpacing: "0.05em",
              padding: "8px 12px", borderRadius: "99px",
              border: "none", cursor: "pointer",
              backgroundColor: "transparent",
              color: currentMode === "practice" ? "#111" : "rgba(224,224,224,0.35)",
              fontWeight: currentMode === "practice" ? 700 : 400,
              transition: "color 0.5s ease",
              whiteSpace: "nowrap"
            }}>практика</button>
          </div>
        )}

        {/* ПРАВЫЙ УГОЛ: Профиль */}
        {!shouldHideControls && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 31 }}>
            <div style={{ position: "relative" }}>
              <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
              <button
                onClick={() => { setAuthOpen(!authOpen); closeAllMenus(); setAuthOpen(true); }}
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
              onClick={() => { setSettingsOpen(!settingsOpen); closeAllMenus(); setSettingsOpen(true); }}
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
              onClick={() => { setLangOpen(!langOpen); closeAllMenus(); setLangOpen(true); }}
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

      {/* ПРАВЫЙ НИЖНИЙ УГОЛ: Рейтинг */}
      {!shouldHideControls && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 100,
          }}
        >
          <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
          <button
            onClick={() => { setLeaderboardOpen(!leaderboardOpen); closeAllMenus(); setLeaderboardOpen(true); }}
            style={{
              background: "transparent",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
              color: leaderboardOpen ? "#fbbf24" : "rgba(224,224,224,0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!leaderboardOpen) {
                e.currentTarget.style.color = "#fbbf24";
                e.currentTarget.style.background = "rgba(251,191,36,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!leaderboardOpen) {
                e.currentTarget.style.color = "rgba(224,224,224,0.5)";
                e.currentTarget.style.background = "transparent";
              }
            }}
            title="Рейтинг"
          >
            <Trophy size={20} />
          </button>
        </div>
      )}
    </>
  );
}