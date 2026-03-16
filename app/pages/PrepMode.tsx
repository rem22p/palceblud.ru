import { useState, useEffect, useCallback, useMemo } from "react";
import { useTyping, TypingDisplay } from "../components/TypingCore";
import { Lock, RotateCcw, SkipForward, MoreHorizontal } from "lucide-react";

// --- КОНФИГУРАЦИЯ ---
const ACCENT_COLOR = "#0A5F38"; // Зеленый цвет подготовки

// Порядок открытия букв
const KEY_PROGRESSION = [
  "E", "T", "O", "A", "H", // Старт
  "I", "N", "S", "R", "L",
  "D", "C", "U", "M", "W",
  "F", "G", "Y", "P", "B",
  "V", "K", "X", "J", "Q", "Z"
];

const LESSONS_PER_LEVEL = 5;

// Генератор псевдо-слов
function generatePhoneticWord(availableKeys: string[], length: number): string {
  const vowels = availableKeys.filter(k => "AEIOU".includes(k));
  const consonants = availableKeys.filter(k => !"AEIOU".includes(k));
  if (vowels.length === 0 || consonants.length === 0) return "";

  let word = "";
  let lastWasVowel = Math.random() > 0.5;

  for (let i = 0; i < length; i++) {
    if (lastWasVowel) {
      const pool = consonants.length > 0 ? consonants : vowels;
      word += pool[Math.floor(Math.random() * pool.length)];
      lastWasVowel = false;
    } else {
      const pool = vowels.length > 0 ? vowels : consonants;
      word += pool[Math.floor(Math.random() * pool.length)];
      lastWasVowel = true;
    }
  }
  return word.toLowerCase();
}

function generateLessonText(availableKeys: string[], wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const len = Math.floor(Math.random() * 4) + 3;
    words.push(generatePhoneticWord(availableKeys, len));
  }
  return words.join(" ");
}

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
export function PrepMode() {
  const [unlockedCount, setUnlockedCount] = useState<number>(5);
  const [streak, setStreak] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  const currentKeys = useMemo(() => KEY_PROGRESSION.slice(0, unlockedCount), [unlockedCount]);
  const nextKey = KEY_PROGRESSION[unlockedCount];

  const lessonText = useMemo(() => generateLessonText(currentKeys, 25), [currentKeys]);

  const { typed, wpm, accuracy, isFinished, handleType, reset } = useTyping(lessonText, { mode: "words", wordLimit: 25 });

  // Логика завершения урока
  useEffect(() => {
    if (isFinished) {
      if (accuracy === 100) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        if (newStreak >= LESSONS_PER_LEVEL && unlockedCount < KEY_PROGRESSION.length) {
          setUnlockedCount(prev => prev + 1);
          setStreak(0);
          setNotification(`Открыта новая буква: ${nextKey}!`);
          setTimeout(() => setNotification(null), 4000);
        }
      } else {
        setStreak(0);
      }
    }
  }, [isFinished, accuracy, streak, unlockedCount, nextKey]);

  return (
    // СТРУКТУРА КОНТЕЙНЕРА КАК В PRACTICEMODE
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#2b2d31", 
      color: "#e0e0e0", 
      fontFamily: "'JetBrains Mono', monospace", 
      position: "relative", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      paddingTop: "40px" // ЭТОТ ОТСТУП ВАЖЕН ДЛЯ ЦЕНТРИРОВАНИЯ
    }}>
      
      {/* ЛЕВАЯ СТАТИСТИКА (FIXED POSITION КАК В PRACTICE) */}
      <div style={{ position: "fixed", top: "100px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", opacity: (!isFinished && typed.length === 0) ? 0.18 : 1, transition: "opacity 0.4s" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "5rem", fontWeight: 200, color: ACCENT_COLOR, lineHeight: 1, letterSpacing: "-0.04em" }}>{wpm}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(10, 95, 56, 0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>слов/мин</span>
        </div>
      </div>
      
      <div style={{ position: "fixed", top: "215px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", opacity: (!isFinished && typed.length === 0) ? 0.18 : 1, transition: "opacity 0.4s" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3.2rem", fontWeight: 200, color: accuracy === 100 ? ACCENT_COLOR : "#ef4444", lineHeight: 1, letterSpacing: "-0.04em" }}>{accuracy}%</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>точн</span>
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ: МАЛЕНЬКИЙ АЛФАВИТ (FIXED POSITION) */}
      <div style={{ position: "fixed", top: "100px", right: "80px", zIndex: 10 }}>
         <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxWidth: "220px", justifyContent: "flex-end" }}>
          {KEY_PROGRESSION.map((key, index) => {
            const isUnlocked = index < unlockedCount;
            const isNext = index === unlockedCount;
            return (
              <div key={key} style={{
                width: "28px", height: "28px",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                backgroundColor: isUnlocked ? ACCENT_COLOR : "rgba(255,255,255,0.05)",
                color: isUnlocked ? "#fff" : "#444",
                border: isNext ? `2px dashed ${ACCENT_COLOR}` : "none",
                opacity: isUnlocked ? 1 : 0.5,
                position: "relative",
                transition: "all 0.3s ease"
              }}>
                {key}
                {!isUnlocked && <Lock size={8} style={{ position: "absolute", top: "2px", right: "2px", opacity: 0.5 }} />}
              </div>
            );
          })}
        </div>
        {/* Инфо о уровне под алфавитом */}
        <div style={{ textAlign: "right", marginTop: "10px", fontSize: "0.75rem", color: "#666" }}>
           Ур. {unlockedCount} / {KEY_PROGRESSION.length}
           {nextKey && <span style={{ color: ACCENT_COLOR, marginLeft: "6px" }}>• След: {nextKey}</span>}
        </div>
      </div>

      {/* ЦЕНТР: СПИДОМЕТР И ТЕКСТ (STRUCTURE LIKE PRACTICE) */}
      {/* Убраны лишние padding/margin, чтобы TypingDisplay сам себя центрировал */}
      <div style={{ width: "100%", maxWidth: "2000px", padding: "0 40px", zIndex: 5, marginTop: "20px", margin: "0 auto" }}>
        
        {/* Уведомление */}
        {notification && (
          <div style={{ marginBottom: "20px", padding: "10px 20px", backgroundColor: "rgba(10, 95, 56, 0.2)", color: ACCENT_COLOR, border: `1px solid ${ACCENT_COLOR}`, borderRadius: "8px", fontWeight: "bold", textAlign: "center", animation: "fadeUp 0.3s ease" }}>
            🎉 {notification}
          </div>
        )}

        <TypingDisplay
          text={lessonText}
          typed={typed}
          onType={handleType}
          onReset={reset}
          colors={{
            correct: "#e0e0e0",
            error: "#ef4444",
            untyped: "rgba(255,255,255,0.1)",
            cursor: ACCENT_COLOR,
            errorBg: "rgba(239, 68, 68, 0.1)"
          }}
          isFinished={isFinished}
          isActive={!isFinished && typed.length > 0}
          wpm={wpm}
          accuracy={accuracy}
          progress={0}
          // fontSize и lineHeight по умолчанию как в практике
        />
      </div>

      {/* НИЖНИЕ КНОПКИ (КАК В PRACTICE) */}
      {!isFinished && (
        <div style={{ position: "fixed", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "20px", opacity: typed.length > 0 ? 0 : 1, transition: "opacity 0.3s ease", pointerEvents: typed.length > 0 ? "none" : "auto", zIndex: 10 }}>
          <button onClick={reset} title="Перезапустить (Tab)" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><RotateCcw size={17} /></button>
          <button onClick={() => { reset(); }} title="Следующий урок" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><SkipForward size={17} /></button>
          <button title="Опции" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><MoreHorizontal size={17} /></button>
        </div>
      )}
      
      {!isFinished && typed.length === 0 && (
        <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
          tab — заново &nbsp;·&nbsp; esc — пауза
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}