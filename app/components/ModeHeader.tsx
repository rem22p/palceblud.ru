import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Settings, User, X, Keyboard, Languages, Trophy, Crown, Medal, Flame } from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { AuthModal } from "../features/auth/components/AuthModal";
import { ProfileMenu } from "../features/auth/components/ProfileMenu";

const GOLD_COLOR = "#D4AF37";
const STREAK_KEY = "palceblud_streak_data";

const MODE_COLORS = {
  learning: "#60a5fa",
  prep: "#0A5F38",
  practice: "#ff6b35"
};

// --- СПИСОК СОВЕТОВ (20 ШТУК) ---
const TIPS = [
  "Держите пальцы на домашней строке между нажатиями.",
  "Не смотри на клавиатуру. Доверься мышечной памяти.",
  "Точность важнее скорости. Ошибки замедляют тебя больше, чем медленная печать.",
  "Используй правильный палец для каждой клавиши. Не жульничай!",
  "Делай микро-паузы между словами, чтобы не сбивать ритм.",
  "Расслабь кисти. Напряжение ведет к усталости и ошибкам.",
  "Следи за осанкой. Прямая спина = лучшее кровообращение = быстрый мозг.",
  "Практикуйся по 15 минут каждый день, а не 2 часа раз в неделю.",
  "Если ошибся, не дави Backspace сразу. Закончи слово, потом исправь.",
  "Читай текст на два слова вперед, пока печатаешь текущее.",
  "Мизинцы слабее остальных? Тренируй их специально, они важны для Shift и Enter.",
  "Скорость придет сама. Сначала поставь технику.",
  "Представь, что твои пальцы — это капли дождя, легко и ритмично.",
  "Используй всю амплитуду движения пальца, не бойся тянуться.",
  "Клавиша пробел нажимается большим пальцем той руки, которая свободна в данный момент.",
  "Не сутультесь! Экран должен быть на уровне глаз.",
  "Попробуй печатать под ритмичную музыку без слов.",
  "Ошибаться — это нормально. Мозг учится именно на ошибках.",
  "Разминка кистей перед началом печати спасет от туннельного синдрома.",
  "Главный секрет мастеров: они не думают о буквах, они думают о словах."
];

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

// --- Компоненты меню ---
function SettingsDropdown({ isOpen, onClose, accentColor }: any) {
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [smoothCaret, setSmoothCaret] = useState(true);
  const [blindMode, setBlindMode] = useState(false);
  if (!isOpen) return null;
  const toggleStyle = (active: boolean) => ({ width: "34px", height: "18px", borderRadius: "9px", backgroundColor: active ? accentColor : "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", position: "relative" as const, transition: "background-color 0.2s", flexShrink: 0 });
  const knobStyle = (active: boolean) => ({ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#fff", position: "absolute" as const, top: "3px", left: active ? "19px" : "3px", transition: "left 0.2s" });
  const options = [{ label: "пунктуация", value: punctuation, set: setPunctuation }, { label: "цифры", value: numbers, set: setNumbers }, { label: "плавный курсор", value: smoothCaret, set: setSmoothCaret }, { label: "слепой режим", value: blindMode, set: setBlindMode }];
  return (<>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
    <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: 0, zIndex: 50, backgroundColor: "#1e2028", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "6px", minWidth: "200px", boxShadow: "0 -24px 48px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 8px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>настройки</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(224,224,224,0.3)", cursor: "pointer", padding: "2px" }}><X size={13} /></button>
      </div>
      {options.map((opt: any) => (
        <div key={opt.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderRadius: "6px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "rgba(224,224,224,0.5)" }}>{opt.label}</span>
          <button onClick={() => opt.set(!opt.value)} style={toggleStyle(opt.value)}><div style={knobStyle(opt.value)} /></button>
        </div>
      ))}
    </div>
  </>);
}

function LangDropdown({ isOpen, onClose, currentLang, onLangChange }: any) {
  if (!isOpen) return null;
  const languages = [{ code: "ru", label: "Русский" }, { code: "en", label: "English" }];
  return (<>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
    <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: 0, zIndex: 50, backgroundColor: "#1e2028", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "6px", minWidth: "140px", boxShadow: "0 -24px 48px rgba(0,0,0,0.4)" }}>
      {languages.map((lang: any) => (
        <button key={lang.code} onClick={() => { onLangChange(lang.code); onClose(); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 14px", borderRadius: "6px", background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: currentLang === lang.code ? "#fff" : "rgba(224,224,224,0.5)", fontWeight: currentLang === lang.code ? 600 : 400 }}>{lang.label}</span>
          {currentLang === lang.code && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: GOLD_COLOR }} />}
        </button>
      ))}
    </div>
  </>);
}

function LeaderboardModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (<>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 90, cursor: "pointer" }} />
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 100, backgroundColor: "#2b2d31", borderRadius: "16px", padding: "0", width: "90%", maxWidth: "520px", boxShadow: "0 24px 64px rgba(0,0,0,0.6)", fontFamily: "'JetBrains Mono', monospace", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, transparent 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(212, 175, 55, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy size={20} color="#D4AF37" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.1rem", color: "#e0e0e0", margin: 0, fontWeight: 600 }}>Рейтинг</h2>
            <p style={{ fontSize: "0.7rem", color: "rgba(224,224,224,0.4)", margin: "2px 0 0 0" }}>Глобальная таблица лидеров</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(224,224,224,0.4)", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "all 0.2s" }} onMouseEnter={(e: any) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = "rgba(224,224,224,0.4)"; e.currentTarget.style.backgroundColor = "transparent"; }}><X size={20} /></button>
      </div>
      
      {/* Table Header */}
      <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 70px 65px 80px", gap: "12px", padding: "14px 24px", backgroundColor: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        <span style={{ color: "rgba(224,224,224,0.4)" }}>#</span>
        <span style={{ color: "rgba(224,224,224,0.4)" }}>Игрок</span>
        <span style={{ color: "rgba(224,224,224,0.4)", textAlign: "right" }}>WPM</span>
        <span style={{ color: "rgba(224,224,224,0.4)", textAlign: "right" }}>Acc</span>
        <span style={{ color: "rgba(224,224,224,0.4)", textAlign: "right" }}>Время</span>
      </div>
      
      {/* Table Body */}
      <div style={{ overflowY: "auto", maxHeight: "380px" }}>
        {LEADERBOARD_DATA.map((user: any, index: number) => (
          <div key={user.rank} style={{ 
            display: "grid", 
            gridTemplateColumns: "50px 1fr 70px 65px 80px", 
            gap: "12px", 
            padding: "16px 24px", 
            borderBottom: index < LEADERBOARD_DATA.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            background: index < 3 ? "linear-gradient(90deg, rgba(212, 175, 55, 0.04) 0%, transparent 100%)" : "transparent",
            transition: "background 0.2s"
          }} 
          className="hover:bg-white/5"
          onMouseEnter={(e: any) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
          onMouseLeave={(e: any) => { e.currentTarget.style.backgroundColor = index < 3 ? "linear-gradient(90deg, rgba(212, 175, 55, 0.04) 0%, transparent 100%)" : "transparent"; }}
          >
            <td style={{ padding: "0", display: "flex", alignItems: "center" }}>
              {user.rank === 1 ? (
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(251, 191, 36, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Crown size={18} color="#fbbf24" />
                </div>
              ) : user.rank === 2 ? (
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(156, 163, 175, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Medal size={18} color="#9ca3af" />
                </div>
              ) : user.rank === 3 ? (
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(180, 83, 9, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Medal size={18} color="#b45309" />
                </div>
              ) : (
                <span style={{ color: "rgba(224,224,224,0.3)", fontSize: "0.85rem", fontWeight: 600 }}>{user.rank}</span>
              )}
            </td>
            <td style={{ padding: "0", display: "flex", alignItems: "center" }}>
              <span style={{ color: "#e0e0e0", fontWeight: 600, fontSize: "0.9rem" }}>{user.name}</span>
            </td>
            <td style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ color: "#34d399", fontWeight: 700, fontSize: "0.95rem" }}>{user.wpm}</span>
            </td>
            <td style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: "0.85rem" }}>{user.accuracy}%</span>
            </td>
            <td style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ color: "rgba(224,224,224,0.35)", fontSize: "0.7rem" }}>{user.date}</span>
            </td>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", backgroundColor: "rgba(0,0,0,0.15)" }}>
        <p style={{ fontSize: "0.7rem", color: "rgba(224,224,224,0.35)", margin: 0 }}>Обновляется каждые 5 минут</p>
      </div>
    </div>
    <style>{`@keyframes slideUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }`}</style>
  </>);
}

interface ModeHeaderProps {
  isFinished?: boolean;
}

export function ModeHeader({ isFinished = false }: ModeHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");
  
  // Состояния для советов
  const [currentTip, setCurrentTip] = useState(TIPS[0]);
  const [tipKey, setTipKey] = useState(0);

  const [streakCount, setStreakCount] = useState(1);
  const [hasActivityToday, setHasActivityToday] = useState(false);

  const currentMode = location.pathname === "/learning" ? "learning"
                      : location.pathname === "/prep" ? "prep"
                      : "practice";

  const accentColor = MODE_COLORS[currentMode];
  const shouldHideControls = isFinished;

  // Функция смены совета при смене режима
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    setCurrentTip(TIPS[randomIndex]);
    setTipKey(prev => prev + 1);
  }, [currentMode]);

  const checkAndUpdateActivity = (forceUpdate = false) => {
    const today = new Date().toDateString();
    const dataStr = localStorage.getItem(STREAK_KEY);
    let count = 1;
    let activityToday = false;

    if (dataStr) {
      const data = JSON.parse(dataStr);
      const lastVisit = data.date;
      
      if (lastVisit === today) {
        count = data.count;
        activityToday = true;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisit === yesterday.toDateString()) {
          count = data.count + 1;
          activityToday = false; 
          if (forceUpdate) {
             localStorage.setItem(STREAK_KEY, JSON.stringify({ date: today, count }));
             activityToday = true;
          }
        } else {
          count = 1;
          if (forceUpdate) {
            localStorage.setItem(STREAK_KEY, JSON.stringify({ date: today, count }));
            activityToday = true;
          } else {
            activityToday = false;
          }
        }
      }
    } else {
      if (forceUpdate) {
        localStorage.setItem(STREAK_KEY, JSON.stringify({ date: today, count: 1 }));
        activityToday = true;
      }
    }
    
    setStreakCount(count);
    setHasActivityToday(activityToday);
  };

  useEffect(() => {
    checkAndUpdateActivity(false);
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      if (!hasActivityToday) {
        const today = new Date().toDateString();
        const dataStr = localStorage.getItem(STREAK_KEY);
        let count = 1;
        
        if (dataStr) {
          const data = JSON.parse(dataStr);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (data.date === yesterday.toDateString()) {
            count = data.count + 1;
          } else if (data.date !== today) {
            count = 1;
          } else {
            count = data.count;
          }
        }
        
        localStorage.setItem(STREAK_KEY, JSON.stringify({ date: today, count }));
        setStreakCount(count);
        setHasActivityToday(true);
      }
    };

    window.addEventListener('user-is-typing', handleActivity);
    return () => window.removeEventListener('user-is-typing', handleActivity);
  }, [hasActivityToday]);

  const closeAllMenus = () => {
    setSettingsOpen(false);
    setLangOpen(false);
  };

  const flameColor = hasActivityToday ? "#ff6b35" : "#444"; 
  const flameOpacity = hasActivityToday ? 1 : 0.3; 
  const textColor = hasActivityToday ? "#ff6b35" : "#666";
  const glowEffect = hasActivityToday ? "drop-shadow(0 0 10px rgba(255,107,53,0.8))" : "none";

  return (
    <>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: "60px", opacity: shouldHideControls ? 1 : 1, transition: "opacity 0.4s ease", pointerEvents: "auto", backgroundColor: "transparent" }}>
        
        {/* ЛЕВАЯ ЧАСТЬ: Логотип + ОГОНЕК */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", zIndex: 31, opacity: shouldHideControls ? 0 : 1, pointerEvents: shouldHideControls ? "none" : "auto", transition: "opacity 0.3s" }} onClick={() => navigate("/")}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", backgroundColor: accentColor, display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              <Keyboard size={15} color="#111" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem", fontWeight: 600, color: "rgba(224,224,224,0.85)", letterSpacing: "-0.02em" }}>пальцеблуд.рф</span>
          </div>

          {/* ОГОНЕК */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "6px 10px", 
            borderRadius: "14px", 
            backgroundColor: hasActivityToday ? "rgba(255,107,53,0.0)" : "transparent", 
            transition: "all 0.3s ease", 
            opacity: shouldHideControls ? 0 : 1, 
            pointerEvents: "none" 
          }}>
            <Flame size={24} fill={hasActivityToday ? "#ff6b35" : "none"} color={flameColor} style={{ opacity: flameOpacity, filter: glowEffect, transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)", transform: hasActivityToday ? "scale(1.15)" : "scale(1)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: textColor, opacity: flameOpacity, transition: "all 0.3s ease", minWidth: "16px", textAlign: "center" }}>{streakCount}</span>
          </div>
        </div>

        {/* ЦЕНТР: Переключатель */}
        {!shouldHideControls && (
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "99px", padding: "5px", border: "1px solid rgba(255,255,255,0.06)", zIndex: 31, opacity: 1, pointerEvents: "auto", transition: "opacity 0.3s" }}>
            <div style={{ position: "absolute", left: currentMode === "learning" ? "5px" : currentMode === "prep" ? "calc(33.33% + 2.5px)" : "calc(66.66% + 0px)", top: "5px", bottom: "5px", width: "calc(33.33% - 5px)", backgroundColor: accentColor, borderRadius: "99px", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 0 }} />
            <button onClick={() => navigate("/learning")} style={{ position: "relative", zIndex: 1, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.05em", padding: "8px 12px", borderRadius: "99px", border: "none", cursor: "pointer", backgroundColor: "transparent", color: currentMode === "learning" ? "#111" : "rgba(224,224,224,0.35)", fontWeight: currentMode === "learning" ? 700 : 400, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>обучение</button>
            <button onClick={() => navigate("/prep")} style={{ position: "relative", zIndex: 1, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.05em", padding: "8px 12px", borderRadius: "99px", border: "none", cursor: "pointer", backgroundColor: "transparent", color: currentMode === "prep" ? "#111" : "rgba(224,224,224,0.35)", fontWeight: currentMode === "prep" ? 700 : 400, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>подготовка</button>
            <button onClick={() => navigate("/practice")} style={{ position: "relative", zIndex: 1, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.05em", padding: "8px 12px", borderRadius: "99px", border: "none", cursor: "pointer", backgroundColor: "transparent", color: currentMode === "practice" ? "#111" : "rgba(224,224,224,0.35)", fontWeight: currentMode === "practice" ? 700 : 400, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>практика</button>
          </div>
        )}

        {/* ПРАВЫЙ УГОЛ: Профиль */}
        {!shouldHideControls && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 31 }}>
            <div style={{ position: "relative" }}>
              {isLoading ? (
                <div className="w-5 h-5 animate-pulse bg-gray-800 rounded-full" />
              ) : isAuthenticated ? (
                <ProfileMenu />
              ) : (
                <>
                  <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
                  <button
                    onClick={() => setShowAuthModal(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(224,224,224,0.5)",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.2s"
                    }}
                    className="hover:text-white hover:bg-white/5"
                  >
                    <User size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* НИЖНИЙ ЛЕВЫЙ УГОЛ (Настройки, Язык, Рейтинг) */}
      {!shouldHideControls && (
        <div style={{ position: "fixed", bottom: "20px", left: "40px", zIndex: 100, display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Настройки */}
          <div style={{ position: "relative" }}>
            <SettingsDropdown isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} accentColor={accentColor} />
            <button onClick={() => { setSettingsOpen(!settingsOpen); closeAllMenus(); setSettingsOpen(true); }} style={{ background: "transparent", border: "none", color: settingsOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!settingsOpen) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }} onMouseLeave={(e: any) => { if (!settingsOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }}><Settings size={20} /></button>
          </div>

          {/* Язык */}
          <div style={{ position: "relative" }}>
            <LangDropdown isOpen={langOpen} onClose={() => setLangOpen(false)} currentLang={currentLang} onLangChange={setCurrentLang} />
            <button onClick={() => { setLangOpen(!langOpen); closeAllMenus(); setLangOpen(true); }} style={{ background: "transparent", border: "none", color: langOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!langOpen) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }} onMouseLeave={(e: any) => { if (!langOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }} title="Переключить язык"><Languages size={20} /></button>
          </div>

          {/* Рейтинг */}
          <div style={{ position: "relative" }}>
            <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
            <button onClick={() => { setLeaderboardOpen(!leaderboardOpen); closeAllMenus(); setLeaderboardOpen(true); }} style={{ background: "transparent", border: "none", color: leaderboardOpen ? "#fbbf24" : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!leaderboardOpen) { e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.background = "rgba(251,191,36,0.1)"; } }} onMouseLeave={(e: any) => { if (!leaderboardOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }} title="Рейтинг"><Trophy size={20} /></button>
          </div>
        </div>
      )}

      {/* ПРАВЫЙ НИЖНИЙ УГОЛ: СОВЕТЫ */}
      {!shouldHideControls && (
        <div key={tipKey} style={{
          position: "fixed",
          bottom: "24px",
          right: "40px",
          zIndex: 100,
          maxWidth: "320px",
          textAlign: "right",
          animation: "fadeUp 0.5s ease forwards"
        }}>
          <div style={{
            display: "inline-block",
            padding: "0"
          }}>
            <div style={{
              fontSize: "0.6rem",
              color: "rgba(255, 255, 255, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              Совет
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.8rem",
              color: "rgba(224, 224, 224, 0.8)",
              lineHeight: 1.4,
              margin: 0
            }}>
              {currentTip}
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}