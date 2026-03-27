commit e4bb1a5e3881df612edd1e0587a1ec973cc64a22
Author: veaceslav-tovarov <vvbabenko.2007@gmail.com>
Date:   Sun Mar 22 00:52:13 2026 +0300

    register menu

diff --git a/app/components/ModeHeader.tsx b/app/components/ModeHeader.tsx
index 82c5129..30630ef 100644
--- a/app/components/ModeHeader.tsx
+++ b/app/components/ModeHeader.tsx
@@ -1,9 +1,11 @@
 import { useNavigate, useLocation } from "react-router";
 import { useState, useEffect } from "react";
 import { Settings, User, X, Keyboard, Languages, Trophy, Crown, Medal, Flame } from "lucide-react";
+import { useAuth } from "../features/auth/hooks/useAuth";
+import { AuthModal } from "../features/auth/components/AuthModal";
+import { ProfileMenu } from "../features/auth/components/ProfileMenu";
 
 const GOLD_COLOR = "#D4AF37";
-const GOLD_HOVER = "#C5A028";
 const STREAK_KEY = "palceblud_streak_data";
 
 const MODE_COLORS = {
@@ -12,6 +14,30 @@ const MODE_COLORS = {
   practice: "#ff6b35"
 };
 
+// --- СПИСОК СОВЕТОВ (20 ШТУК) ---
+const TIPS = [
+  "Держите пальцы на домашней строке между нажатиями.",
+  "Не смотри на клавиатуру. Доверься мышечной памяти.",
+  "Точность важнее скорости. Ошибки замедляют тебя больше, чем медленная печать.",
+  "Используй правильный палец для каждой клавиши. Не жульничай!",
+  "Делай микро-паузы между словами, чтобы не сбивать ритм.",
+  "Расслабь кисти. Напряжение ведет к усталости и ошибкам.",
+  "Следи за осанкой. Прямая спина = лучшее кровообращение = быстрый мозг.",
+  "Практикуйся по 15 минут каждый день, а не 2 часа раз в неделю.",
+  "Если ошибся, не дави Backspace сразу. Закончи слово, потом исправь.",
+  "Читай текст на два слова вперед, пока печатаешь текущее.",
+  "Мизинцы слабее остальных? Тренируй их специально, они важны для Shift и Enter.",
+  "Скорость придет сама. Сначала поставь технику.",
+  "Представь, что твои пальцы — это капли дождя, легко и ритмично.",
+  "Используй всю амплитуду движения пальца, не бойся тянуться.",
+  "Клавиша пробел нажимается большим пальцем той руки, которая свободна в данный момент.",
+  "Не сутультесь! Экран должен быть на уровне глаз.",
+  "Попробуй печатать под ритмичную музыку без слов.",
+  "Ошибаться — это нормально. Мозг учится именно на ошибках.",
+  "Разминка кистей перед началом печати спасет от туннельного синдрома.",
+  "Главный секрет мастеров: они не думают о буквах, они думают о словах."
+];
+
 const LEADERBOARD_DATA = [
   { rank: 1, name: "SpeedDemon", wpm: 145, accuracy: 99, date: "2 мин. назад" },
   { rank: 2, name: "KeyboardWarrior", wpm: 138, accuracy: 98, date: "15 мин. назад" },
@@ -25,7 +51,7 @@ const LEADERBOARD_DATA = [
   { rank: 10, name: "TypoKing", wpm: 110, accuracy: 93, date: "3 дня назад" },
 ];
 
-// --- Компоненты меню (без изменений) ---
+// --- Компоненты меню ---
 function SettingsDropdown({ isOpen, onClose, accentColor }: any) {
   const [punctuation, setPunctuation] = useState(false);
   const [numbers, setNumbers] = useState(false);
@@ -71,51 +97,89 @@ function LangDropdown({ isOpen, onClose, currentLang, onLangChange }: any) {
 function LeaderboardModal({ isOpen, onClose }: any) {
   if (!isOpen) return null;
   return (<>
-    <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90, cursor: "pointer" }} />
-    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 100, backgroundColor: "#2b2d31", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "500px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
-      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
-        <h2 style={{ fontSize: "1.2rem", color: "#e0e0e0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><Trophy size={20} color="#fbbf24" />Рейтинг (Глобальный)</h2>
-        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }} onMouseEnter={(e: any) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e: any) => e.currentTarget.style.color = "#666"}><X size={20} /></button>
+    <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", zIndex: 90, cursor: "pointer" }} />
+    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 100, backgroundColor: "#2b2d31", borderRadius: "16px", padding: "0", width: "90%", maxWidth: "520px", boxShadow: "0 24px 64px rgba(0,0,0,0.6)", fontFamily: "'JetBrains Mono', monospace", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
+      {/* Header */}
+      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, transparent 100%)" }}>
+        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
+          <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(212, 175, 55, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
+            <Trophy size={20} color="#D4AF37" />
+          </div>
+          <div>
+            <h2 style={{ fontSize: "1.1rem", color: "#e0e0e0", margin: 0, fontWeight: 600 }}>Рейтинг</h2>
+            <p style={{ fontSize: "0.7rem", color: "rgba(224,224,224,0.4)", margin: "2px 0 0 0" }}>Глобальная таблица лидеров</p>
+          </div>
+        </div>
+        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(224,224,224,0.4)", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "all 0.2s" }} onMouseEnter={(e: any) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }} onMouseLeave={(e: any) => { e.currentTarget.style.color = "rgba(224,224,224,0.4)"; e.currentTarget.style.backgroundColor = "transparent"; }}><X size={20} /></button>
       </div>
-      <div style={{ overflowY: "auto", maxHeight: "400px" }}>
-        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
-          <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#666", textAlign: "left" }}><th style={{ padding: "10px", width: "50px" }}>#</th><th style={{ padding: "10px" }}>Игрок</th><th style={{ padding: "10px", textAlign: "right" }}>WPM</th><th style={{ padding: "10px", textAlign: "right" }}>Acc</th><th style={{ padding: "10px", textAlign: "right", fontSize: "0.75rem" }}>Время</th></tr></thead>
-          <tbody>{LEADERBOARD_DATA.map((user: any) => (<tr key={user.rank} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#e0e0e0" }}><td style={{ padding: "12px 10px" }}>{user.rank === 1 ? <Crown size={16} color="#fbbf24" /> : user.rank === 2 ? <Medal size={16} color="#9ca3af" /> : user.rank === 3 ? <Medal size={16} color="#b45309" /> : <span style={{ color: "#666" }}>{user.rank}</span>}</td><td style={{ padding: "12px 10px", fontWeight: 600 }}>{user.name}</td><td style={{ padding: "12px 10px", textAlign: "right", color: "#34d399" }}>{user.wpm}</td><td style={{ padding: "12px 10px", textAlign: "right", color: "#60a5fa" }}>{user.accuracy}%</td><td style={{ padding: "12px 10px", textAlign: "right", color: "#666", fontSize: "0.75rem" }}>{user.date}</td></tr>))}</tbody>
-        </table>
+      
+      {/* Table Header */}
+      <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 70px 65px 80px", gap: "12px", padding: "14px 24px", backgroundColor: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
+        <span style={{ color: "rgba(224,224,224,0.4)" }}>#</span>
+        <span style={{ color: "rgba(224,224,224,0.4)" }}>Игрок</span>
+        <span style={{ color: "rgba(224,224,224,0.4)", textAlign: "right" }}>WPM</span>
+        <span style={{ color: "rgba(224,224,224,0.4)", textAlign: "right" }}>Acc</span>
+        <span style={{ color: "rgba(224,224,224,0.4)", textAlign: "right" }}>Время</span>
       </div>
-      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.75rem", color: "#666" }}>Обновляется каждые 5 минут</div>
-    </div>
-    <style>{`@keyframes slideUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }`}</style>
-  </>);
-}
-
-function AuthModal({ isOpen, onClose }: any) {
-  if (!isOpen) return null;
-  const [email, setEmail] = useState("");
-  const [password, setPassword] = useState("");
-  const [isLoginMode, setIsLoginMode] = useState(true);
-  const handleRegister = () => { console.log("Register:", email, password); onClose(); };
-  const handleLogin = () => { console.log("Login:", email, password); onClose(); };
-  return (<>
-    <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90, cursor: "pointer" }} />
-    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 100, backgroundColor: "#2b2d31", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
-      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
-        <h2 style={{ fontSize: "1.2rem", color: "#e0e0e0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><User size={20} color="#60a5fa" />{isLoginMode ? "Вход в профиль" : "Регистрация"}</h2>
-        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }} onMouseEnter={(e: any) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e: any) => e.currentTarget.style.color = "#666"}><X size={20} /></button>
+      
+      {/* Table Body */}
+      <div style={{ overflowY: "auto", maxHeight: "380px" }}>
+        {LEADERBOARD_DATA.map((user: any, index: number) => (
+          <div key={user.rank} style={{ 
+            display: "grid", 
+            gridTemplateColumns: "50px 1fr 70px 65px 80px", 
+            gap: "12px", 
+            padding: "16px 24px", 
+            borderBottom: index < LEADERBOARD_DATA.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
+            background: index < 3 ? "linear-gradient(90deg, rgba(212, 175, 55, 0.04) 0%, transparent 100%)" : "transparent",
+            transition: "background 0.2s"
+          }} 
+          className="hover:bg-white/5"
+          onMouseEnter={(e: any) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
+          onMouseLeave={(e: any) => { e.currentTarget.style.backgroundColor = index < 3 ? "linear-gradient(90deg, rgba(212, 175, 55, 0.04) 0%, transparent 100%)" : "transparent"; }}
+          >
+            <td style={{ padding: "0", display: "flex", alignItems: "center" }}>
+              {user.rank === 1 ? (
+                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(251, 191, 36, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
+                  <Crown size={18} color="#fbbf24" />
+                </div>
+              ) : user.rank === 2 ? (
+                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(156, 163, 175, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
+                  <Medal size={18} color="#9ca3af" />
+                </div>
+              ) : user.rank === 3 ? (
+                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(180, 83, 9, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
+                  <Medal size={18} color="#b45309" />
+                </div>
+              ) : (
+                <span style={{ color: "rgba(224,224,224,0.3)", fontSize: "0.85rem", fontWeight: 600 }}>{user.rank}</span>
+              )}
+            </td>
+            <td style={{ padding: "0", display: "flex", alignItems: "center" }}>
+              <span style={{ color: "#e0e0e0", fontWeight: 600, fontSize: "0.9rem" }}>{user.name}</span>
+            </td>
+            <td style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
+              <span style={{ color: "#34d399", fontWeight: 700, fontSize: "0.95rem" }}>{user.wpm}</span>
+            </td>
+            <td style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
+              <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: "0.85rem" }}>{user.accuracy}%</span>
+            </td>
+            <td style={{ padding: "0", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
+              <span style={{ color: "rgba(224,224,224,0.35)", fontSize: "0.7rem" }}>{user.date}</span>
+            </td>
+          </div>
+        ))}
       </div>
-      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
-        <div style={{ textAlign: "left" }}><label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px" }}>Email</label><input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="example@mail.ru" style={{ width: "100%", padding: "10px 12px", backgroundColor: "#1e2028", border: "1px solid #333", borderRadius: "6px", color: "#e0e0e0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} /></div>
-        <div style={{ textAlign: "left" }}><label style={{ display: "block", fontSize: "0.75rem", color: "#888", marginBottom: "6px" }}>Пароль</label><input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px 12px", backgroundColor: "#1e2028", border: "1px solid #333", borderRadius: "6px", color: "#e0e0e0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} /></div>
-        <button onClick={isLoginMode ? handleLogin : handleRegister} style={{ width: "100%", marginTop: "8px", padding: "12px", backgroundColor: GOLD_COLOR, color: "#1a1a1a", border: "none", borderRadius: "6px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>{isLoginMode ? "Войти" : "Зарегистрироваться"}</button>
+      
+      {/* Footer */}
+      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", backgroundColor: "rgba(0,0,0,0.15)" }}>
+        <p style={{ fontSize: "0.7rem", color: "rgba(224,224,224,0.35)", margin: 0 }}>Обновляется каждые 5 минут</p>
       </div>
-      <div style={{ marginTop: "20px", fontSize: "0.8rem", color: "#888", textAlign: "center" }}>{isLoginMode ? (<>Нет аккаунта? <span onClick={() => setIsLoginMode(false)} style={{ color: GOLD_COLOR, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Создать</span></>) : (<>Уже есть аккаунт? <span onClick={() => setIsLoginMode(true)} style={{ color: GOLD_COLOR, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}>Войти</span></>)}</div>
     </div>
     <style>{`@keyframes slideUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }`}</style>
   </>);
 }
 
-// ─── ОСНОВНОЙ HEADER (БЕЗ ОБВОДКИ) ─────────────────────────────────
-
 interface ModeHeaderProps {
   isFinished?: boolean;
 }
@@ -123,14 +187,18 @@ interface ModeHeaderProps {
 export function ModeHeader({ isFinished = false }: ModeHeaderProps) {
   const navigate = useNavigate();
   const location = useLocation();
-  
+  const { isAuthenticated, isLoading } = useAuth();
+  const [showAuthModal, setShowAuthModal] = useState(false);
+
   const [settingsOpen, setSettingsOpen] = useState(false);
-  const [authOpen, setAuthOpen] = useState(false);
   const [langOpen, setLangOpen] = useState(false);
   const [leaderboardOpen, setLeaderboardOpen] = useState(false);
   const [currentLang, setCurrentLang] = useState("ru");
   
-  // Состояния
+  // Состояния для советов
+  const [currentTip, setCurrentTip] = useState(TIPS[0]);
+  const [tipKey, setTipKey] = useState(0);
+
   const [streakCount, setStreakCount] = useState(1);
   const [hasActivityToday, setHasActivityToday] = useState(false);
 
@@ -141,7 +209,13 @@ export function ModeHeader({ isFinished = false }: ModeHeaderProps) {
   const accentColor = MODE_COLORS[currentMode];
   const shouldHideControls = isFinished;
 
-  // Функция проверки и обновления статуса активности
+  // Функция смены совета при смене режима
+  useEffect(() => {
+    const randomIndex = Math.floor(Math.random() * TIPS.length);
+    setCurrentTip(TIPS[randomIndex]);
+    setTipKey(prev => prev + 1);
+  }, [currentMode]);
+
   const checkAndUpdateActivity = (forceUpdate = false) => {
     const today = new Date().toDateString();
     const dataStr = localStorage.getItem(STREAK_KEY);
@@ -187,12 +261,10 @@ export function ModeHeader({ isFinished = false }: ModeHeaderProps) {
     setHasActivityToday(activityToday);
   };
 
-  // 1. Инициализация при загрузке
   useEffect(() => {
     checkAndUpdateActivity(false);
   }, []);
 
-  // 2. Реакция на печать (Зажигаем огонь)
   useEffect(() => {
     const handleActivity = () => {
       if (!hasActivityToday) {
@@ -226,11 +298,9 @@ export function ModeHeader({ isFinished = false }: ModeHeaderProps) {
 
   const closeAllMenus = () => {
     setSettingsOpen(false);
-    setAuthOpen(false);
     setLangOpen(false);
   };
 
-  // Стили
   const flameColor = hasActivityToday ? "#ff6b35" : "#444"; 
   const flameOpacity = hasActivityToday ? 1 : 0.3; 
   const textColor = hasActivityToday ? "#ff6b35" : "#666";
@@ -249,14 +319,13 @@ export function ModeHeader({ isFinished = false }: ModeHeaderProps) {
             <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem", fontWeight: 600, color: "rgba(224,224,224,0.85)", letterSpacing: "-0.02em" }}>пальцеблуд.рф</span>
           </div>
 
-          {/* ОГОНЕК (БЕЗ ОБВОДКИ) */}
+          {/* ОГОНЕК */}
           <div style={{ 
             display: "flex", 
             alignItems: "center", 
             gap: "8px", 
             padding: "6px 10px", 
             borderRadius: "14px", 
-            // Убрал фон, если огонь не горит. Если горит - легкая подложка.
             backgroundColor: hasActivityToday ? "rgba(255,107,53,0.0)" : "transparent", 
             transition: "all 0.3s ease", 
             opacity: shouldHideControls ? 0 : 1, 
@@ -281,34 +350,99 @@ export function ModeHeader({ isFinished = false }: ModeHeaderProps) {
         {!shouldHideControls && (
           <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 31 }}>
             <div style={{ position: "relative" }}>
-              <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
-              <button onClick={() => { setAuthOpen(!authOpen); closeAllMenus(); setAuthOpen(true); }} style={{ background: "transparent", border: "none", color: authOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", zIndex: 32 }} onMouseEnter={(e: any) => { if (!authOpen) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }} onMouseLeave={(e: any) => { if (!authOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }}><User size={20} /></button>
+              {isLoading ? (
+                <div className="w-5 h-5 animate-pulse bg-gray-800 rounded-full" />
+              ) : isAuthenticated ? (
+                <ProfileMenu />
+              ) : (
+                <>
+                  <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
+                  <button
+                    onClick={() => setShowAuthModal(true)}
+                    style={{
+                      background: "transparent",
+                      border: "none",
+                      color: "rgba(224,224,224,0.5)",
+                      cursor: "pointer",
+                      padding: "8px",
+                      borderRadius: "8px",
+                      display: "flex",
+                      alignItems: "center",
+                      transition: "all 0.2s"
+                    }}
+                    className="hover:text-white hover:bg-white/5"
+                  >
+                    <User size={20} />
+                  </button>
+                </>
+              )}
             </div>
           </div>
         )}
       </header>
 
-      {/* НИЖНИЙ ЛЕВЫЙ УГОЛ */}
+      {/* НИЖНИЙ ЛЕВЫЙ УГОЛ (Настройки, Язык, Рейтинг) */}
       {!shouldHideControls && (
         <div style={{ position: "fixed", bottom: "20px", left: "40px", zIndex: 100, display: "flex", gap: "12px", alignItems: "center" }}>
+          {/* Настройки */}
           <div style={{ position: "relative" }}>
             <SettingsDropdown isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} accentColor={accentColor} />
             <button onClick={() => { setSettingsOpen(!settingsOpen); closeAllMenus(); setSettingsOpen(true); }} style={{ background: "transparent", border: "none", color: settingsOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!settingsOpen) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }} onMouseLeave={(e: any) => { if (!settingsOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }}><Settings size={20} /></button>
           </div>
+
+          {/* Язык */}
           <div style={{ position: "relative" }}>
             <LangDropdown isOpen={langOpen} onClose={() => setLangOpen(false)} currentLang={currentLang} onLangChange={setCurrentLang} />
             <button onClick={() => { setLangOpen(!langOpen); closeAllMenus(); setLangOpen(true); }} style={{ background: "transparent", border: "none", color: langOpen ? GOLD_COLOR : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!langOpen) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }} onMouseLeave={(e: any) => { if (!langOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }} title="Переключить язык"><Languages size={20} /></button>
           </div>
+
+          {/* Рейтинг */}
+          <div style={{ position: "relative" }}>
+            <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
+            <button onClick={() => { setLeaderboardOpen(!leaderboardOpen); closeAllMenus(); setLeaderboardOpen(true); }} style={{ background: "transparent", border: "none", color: leaderboardOpen ? "#fbbf24" : "rgba(224,224,224,0.5)", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!leaderboardOpen) { e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.background = "rgba(251,191,36,0.1)"; } }} onMouseLeave={(e: any) => { if (!leaderboardOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }} title="Рейтинг"><Trophy size={20} /></button>
+          </div>
         </div>
       )}
 
-      {/* ПРАВЫЙ НИЖНИЙ УГОЛ */}
+      {/* ПРАВЫЙ НИЖНИЙ УГОЛ: СОВЕТЫ */}
       {!shouldHideControls && (
-        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 100 }}>
-          <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
-          <button onClick={() => { setLeaderboardOpen(!leaderboardOpen); closeAllMenus(); setLeaderboardOpen(true); }} style={{ background: "transparent", border: "none", borderRadius: "8px", padding: "10px", color: leaderboardOpen ? "#fbbf24" : "rgba(224,224,224,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e: any) => { if (!leaderboardOpen) { e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.background = "rgba(251,191,36,0.1)"; } }} onMouseLeave={(e: any) => { if (!leaderboardOpen) { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; e.currentTarget.style.background = "transparent"; } }} title="Рейтинг"><Trophy size={20} /></button>
+        <div key={tipKey} style={{
+          position: "fixed",
+          bottom: "24px",
+          right: "40px",
+          zIndex: 100,
+          maxWidth: "320px",
+          textAlign: "right",
+          animation: "fadeUp 0.5s ease forwards"
+        }}>
+          <div style={{
+            display: "inline-block",
+            padding: "0"
+          }}>
+            <div style={{
+              fontSize: "0.6rem",
+              color: "rgba(255, 255, 255, 0.3)",
+              textTransform: "uppercase",
+              letterSpacing: "0.1em",
+              marginBottom: "4px",
+              fontFamily: "'JetBrains Mono', monospace"
+            }}>
+              Совет
+            </div>
+            <p style={{
+              fontFamily: "'JetBrains Mono', monospace",
+              fontSize: "0.8rem",
+              color: "rgba(224, 224, 224, 0.8)",
+              lineHeight: 1.4,
+              margin: 0
+            }}>
+              {currentTip}
+            </p>
+          </div>
         </div>
       )}
+
+      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
     </>
   );
 }
\ No newline at end of file
