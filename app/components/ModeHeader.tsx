import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Keyboard, Languages, Flame, User, Trophy, Settings } from "lucide-react";
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

interface ModeHeaderProps {
  isFinished?: boolean;
  isActive?: boolean;
}

export function ModeHeader({ isFinished = false, isActive = false }: ModeHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");

  const [currentTip, setCurrentTip] = useState(TIPS[0]);
  const [tipKey, setTipKey] = useState(0);
  const [streakCount, setStreakCount] = useState(1);
  const [hasActivityToday, setHasActivityToday] = useState(false);
  const [lastMode, setLastMode] = useState<"learning" | "prep" | "practice">("practice");

  // Получаем последний режим из localStorage или определяем из pathname
  useEffect(() => {
    const saved = localStorage.getItem("palceblud_last_mode") as "learning" | "prep" | "practice" | null;
    if (saved && ["learning", "prep", "practice"].includes(saved)) {
      setLastMode(saved);
    }
  }, []);

  const currentMode = location.pathname === "/learning" ? "learning"
                      : location.pathname === "/prep" ? "prep"
                      : location.pathname === "/practice" ? "practice"
                      : location.pathname === "/settings" ? "settings"
                      : location.pathname === "/leaderboard" ? "leaderboard"
                      : "practice";

  // Для настроек и рейтинга используем последний выбранный режим
  const displayMode = currentMode === "settings" || currentMode === "leaderboard" ? lastMode : currentMode;

  // Сохраняем режим при переключении
  useEffect(() => {
    if (currentMode === "learning" || currentMode === "prep" || currentMode === "practice") {
      setLastMode(currentMode);
      localStorage.setItem("palceblud_last_mode", currentMode);
    }
  }, [currentMode]);

  const accentColor = displayMode === "learning" || displayMode === "prep" || displayMode === "practice"
                      ? MODE_COLORS[displayMode]
                      : "#60a5fa";
  const shouldHideControls = isFinished || isActive;

  // Показывать советы только в режимах обучения, подготовки и практики, и только когда не активно
  const showTips = !shouldHideControls && 
                   currentMode !== "settings" && 
                   currentMode !== "leaderboard";

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

        {/* ЦЕНТР: Настройки + Переключатель + Рейтинг */}
        {!shouldHideControls && (
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center" }}>
            {/* Отсек настроек слева */}
            <div style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "transparent",
              borderRadius: "99px 0 0 99px",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRight: "none",
              zIndex: 30,
              height: "38px",
              padding: "0 4px 0 10px",
              transform: "translateX(5px)"
            }}>
              <button
                onClick={() => navigate("/settings")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(224,224,224,0.5)",
                  cursor: "pointer",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.color = "rgba(224,224,224,0.5)";
                }}
                title="Настройки"
              >
                <Settings size={18} />
              </button>
            </div>

            {/* Основной переключатель режимов */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "99px", padding: "5px", border: "1px solid rgba(255,255,255,0.06)", zIndex: 31, opacity: 1, pointerEvents: "auto", transition: "opacity 0.3s" }}>
              <div style={{ position: "absolute", left: displayMode === "learning" ? "5px" : displayMode === "prep" ? "calc(33.33% + 2.5px)" : "calc(66.66% + 0px)", top: "5px", bottom: "5px", width: "calc(33.33% - 5px)", backgroundColor: accentColor, borderRadius: "99px", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 0 }} />
              <button onClick={() => navigate("/learning")} style={{ position: "relative", zIndex: 1, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.05em", padding: "8px 12px", borderRadius: "99px", border: "none", cursor: "pointer", backgroundColor: "transparent", color: displayMode === "learning" ? "#111" : "rgba(224,224,224,0.35)", fontWeight: displayMode === "learning" ? 700 : 400, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>обучение</button>
              <button onClick={() => navigate("/prep")} style={{ position: "relative", zIndex: 1, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.05em", padding: "8px 12px", borderRadius: "99px", border: "none", cursor: "pointer", backgroundColor: "transparent", color: displayMode === "prep" ? "#111" : "rgba(224,224,224,0.35)", fontWeight: displayMode === "prep" ? 700 : 400, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>подготовка</button>
              <button onClick={() => navigate("/practice")} style={{ position: "relative", zIndex: 1, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.05em", padding: "8px 12px", borderRadius: "99px", border: "none", cursor: "pointer", backgroundColor: "transparent", color: displayMode === "practice" ? "#111" : "rgba(224,224,224,0.35)", fontWeight: displayMode === "practice" ? 700 : 400, transition: "color 0.5s ease", whiteSpace: "nowrap" }}>практика</button>
            </div>

            {/* Отсек рейтинга справа */}
            <div style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "transparent",
              borderRadius: "0 99px 99px 0",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "none",
              zIndex: 30,
              height: "38px",
              padding: "0 10px 0 4px",
              transform: "translateX(-5px)"
            }}>
              <button onClick={() => navigate("/leaderboard")} style={{ background: "transparent", border: "none", color: "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; }} title="Рейтинг"><Trophy size={18} /></button>
            </div>
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
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.color = "rgba(224,224,224,0.5)";
                    }}
                  >
                    <User size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* НИЖНИЙ ЛЕВЫЙ УГОЛ: Язык */}
      {!shouldHideControls && (
        <div style={{ position: "fixed", bottom: "20px", left: "40px", zIndex: 100 }}>
          <div style={{ position: "relative" }}>
            <LangDropdown isOpen={langOpen} onClose={() => setLangOpen(false)} currentLang={currentLang} onLangChange={setCurrentLang} />
            <button onClick={() => { setLangOpen(!langOpen); closeAllMenus(); setLangOpen(true); }} style={{ background: "transparent", border: "none", color: langOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!langOpen) { e.currentTarget.style.color = "#fff"; } }} onMouseLeave={(e: any) => { if (!langOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; } }} title="Переключить язык"><Languages size={20} /></button>
          </div>
        </div>
      )}

      {/* ПРАВЫЙ НИЖНИЙ УГОЛ: СОВЕТЫ */}
      {showTips && (
        <div key={tipKey} style={{
          position: "fixed",
          bottom: "24px",
          right: "40px",
          zIndex: 100,
          maxWidth: "280px",
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
              fontSize: "0.75rem",
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
