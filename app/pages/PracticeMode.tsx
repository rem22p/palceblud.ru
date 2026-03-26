import { useState, useCallback, useEffect } from "react";
import { RotateCcw, SkipForward, MoreHorizontal, ChevronDown } from "lucide-react";
import { useTyping, TypingDisplay } from "../components/TypingCore";
import { ModeHeader } from "../components/ModeHeader";
import { RUSSIAN_WORDS } from "../lib/russianWords";
import { ENGLISH_WORDS } from "../lib/englishWords";

type Language = "ru" | "en";

const WORD_POOLS: Record<Language, string[]> = {
  ru: RUSSIAN_WORDS,
  en: ENGLISH_WORDS,
};

const TIME_OPTIONS = [15, 30, 60, 120];
const WORD_OPTIONS: (number | "infinity")[] = [10, 25, 50, 100, "infinity"];

function generateText(wordPool: string[], wordCount: number) {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
  }
  return words.join(" ");
}

// --- ВНУТРЕННИЕ КОМПОНЕНТЫ ---

interface FloatingStatProps {
  value: string | number;
  label: string;
  color: string;
  labelColor?: string;
  size?: "xl" | "lg" | "md";
  align?: "left" | "right";
  muted?: boolean;
  scale?: number;
}

function FloatingStat({ value, label, color, labelColor, size = "xl", align = "left", muted = false, scale = 1 }: FloatingStatProps) {
  const fontSize = size === "xl" ? "5rem" : size === "lg" ? "3.2rem" : "2rem";
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: align === "right" ? "flex-end" : "flex-start",
      gap: "2px",
      opacity: muted ? 0.5 : 1,
      transition: "opacity 0.4s ease",
      transform: `scale(${scale})`,
      transformOrigin: align === "right" ? "top right" : "top left",
      width: "fit-content"
    }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize, fontWeight: 200, color, lineHeight: 1, letterSpacing: "-0.04em", transition: "color 0.3s" }}>{value}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: labelColor || "rgba(224,224,224,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{label === "wpm" ? "слов/мин" : label === "acc" ? "точн" : label === "sec" ? "сек" : label === "words" ? "слов" : label}</span>
    </div>
  );
}

interface ResultOverlayProps {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  consistency: number;
  errorCount: number;
  onRestart: () => void;
}

function ResultOverlay({ wpm, accuracy, rawWpm, consistency, errorCount, onRestart }: ResultOverlayProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", animation: "fadeUp 0.5s ease forwards" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "60px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7rem", fontWeight: 200, color: "#ff6b35", lineHeight: 1, letterSpacing: "-0.04em" }}>{wpm}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(255,107,53,0.4)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "6px" }}>wpm</div>
        </div>
        <div style={{ textAlign: "center", paddingBottom: "12px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3.5rem", fontWeight: 200, color: "#e0e0e0", lineHeight: 1, letterSpacing: "-0.04em" }}>{accuracy}%</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "6px" }}>acc</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 200, color: "rgba(224,224,224,0.6)", lineHeight: 1 }}>{rawWpm}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>raw</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 200, color: "rgba(224,224,224,0.6)", lineHeight: 1 }}>{consistency}%</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>consistency</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 200, color: "#ff6b35", lineHeight: 1 }}>{errorCount}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(255,107,53,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>errors</div>
        </div>
      </div>
      <button onClick={onRestart} style={{ background: "none", border: "1px solid rgba(255,107,53,0.25)", borderRadius: "10px", padding: "10px 28px", color: "rgba(255,107,53,0.7)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "#ff6b35"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.25)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,107,53,0.7)"; }}>
        <RotateCcw size={13} /> new test
      </button>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.12)", letterSpacing: "0.15em" }}>tab - restart</span>
    </div>
  );
}

function ModeToggle({ mode, onChange, disabled }: { mode: "time" | "words"; onChange: (m: "time" | "words") => void; disabled?: boolean }) {
  return (
    <div style={{ position: "relative", display: "flex", width: "160px", height: "38px", backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "99px", padding: "4px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, userSelect: "none", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "4px", left: mode === "time" ? "4px" : "calc(50% + 0px)", width: "calc(50% - 4px)", height: "30px", backgroundColor: "rgb(255, 107, 53)", borderRadius: "99px", transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 0 }} />
      <div onClick={() => !disabled && onChange("time")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, cursor: "pointer", pointerEvents: disabled ? "none" : "auto" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, color: mode === "time" ? "#171717" : "rgba(255, 255, 255, 0.4)", transition: "color 0.3s ease" }}>время</span>
      </div>
      <div onClick={() => !disabled && onChange("words")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, cursor: "pointer", pointerEvents: disabled ? "none" : "auto" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, color: mode === "words" ? "#171717" : "rgba(255, 255, 255, 0.4)", transition: "color 0.3s ease" }}>слова</span>
      </div>
    </div>
  );
}

// --- ГЛАВНЫЙ КОМПОНЕНТ ---

export function PracticeMode() {
  const [mode, setMode] = useState<"time" | "words">("time");
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("palceblud_language") as Language;
    return saved || "ru";
  });
  const [timeLimit, setTimeLimit] = useState(60);
  const [wordLimit, setWordLimit] = useState<number | "infinity">("infinity");
  const [showMenu, setShowMenu] = useState(false);
  const [text, setText] = useState(() => generateText(WORD_POOLS[language], 1000));

  // Следим за изменением языка в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("palceblud_language") as Language;
      const newLang = saved || "ru";
      if (newLang !== language) {
        setLanguage(newLang);
        const count = wordLimit === "infinity" ? 1000 : (typeof wordLimit === 'number' ? wordLimit : 25);
        setText(generateText(WORD_POOLS[newLang], count));
        reset();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Также проверяем при монтировании и при изменении language в хедере
    const interval = setInterval(() => {
      const saved = localStorage.getItem("palceblud_language") as Language;
      const newLang = saved || "ru";
      if (newLang !== language) {
        setLanguage(newLang);
        const count = wordLimit === "infinity" ? 1000 : (typeof wordLimit === 'number' ? wordLimit : 25);
        setText(generateText(WORD_POOLS[newLang], count));
        reset();
      }
    }, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [language, wordLimit]);

  const { typed, wpm, accuracy, rawWpm, consistency, errorCount, timeLeft, wordsLeft, isActive, isFinished, isPaused, togglePause, handleType, reset } = useTyping(text, { mode, timeLimit, wordLimit: wordLimit === "infinity" ? 999999 : wordLimit });

  const handleTypeWithExpand = useCallback((val: string) => {
    handleType(val);
    if (val.length > text.length * 0.8 && wordLimit === "infinity") {
      const newWords = generateText(WORD_POOLS[language], 100);
      setText((prev) => prev + " " + newWords);
    }
  }, [handleType, text.length, wordLimit, language]);

  const handleRestart = () => {
    const count = wordLimit === "infinity" ? 1000 : (typeof wordLimit === 'number' ? wordLimit : 25);
    setText(generateText(WORD_POOLS[language], count));
    reset();
  };

  const handleModeChange = (newMode: "time" | "words") => {
    const count = newMode === "words" && typeof wordLimit === 'number' ? wordLimit : 1000;
    setText(generateText(WORD_POOLS[language], count));
    setMode(newMode);
    reset();
  };

  const handleTimeChange = (s: number) => {
    setText(generateText(WORD_POOLS[language], 200));
    setTimeLimit(s);
    setShowMenu(false);
    reset();
  };

  const handleWordChange = (w: number | "infinity") => {
    setText(generateText(WORD_POOLS[language], w === "infinity" ? 1000 : w));
    setWordLimit(w);
    setShowMenu(false);
    reset();
  };

  const timerColor = mode === "time" && timeLeft <= 5 && isActive ? "#ff4444" : "rgba(224,224,224,0.85)";
  const currentOptions = mode === "time" ? TIME_OPTIONS : WORD_OPTIONS;
  const currentValue = mode === "time" ? timeLimit : wordLimit;

  return (
    <>
      <ModeHeader isFinished={isFinished} isActive={isActive} />
      <div style={{ minHeight: "100vh", backgroundColor: "#2b2d31", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "40px" }}>
      {!isFinished ? (
        <>
          {/* Верхняя панель - скрыта во время печати */}
          <div style={{ position: "fixed", top: "11px", right: "150px", display: "flex", alignItems: "center", gap: "8px", zIndex: 50, opacity: isActive ? 0 : 1, pointerEvents: isActive ? "none" : "auto", transition: "opacity 0.3s ease" }}>
            <ModeToggle mode={mode} onChange={handleModeChange} disabled={isActive} />

            <div style={{ display: "flex", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "99px", padding: "4px 12px", cursor: isActive ? "not-allowed" : "pointer", opacity: isActive ? 0.5 : 1, gap: "8px", height: "38px", minWidth: "90px", justifyContent: "space-between", flexShrink: 0 }} onClick={() => !isActive && setShowMenu(!showMenu)}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, color: "rgba(224,224,224,0.6)", minWidth: "50px", textAlign: "right" }}>{mode === "time" ? `${timeLimit}s` : wordLimit === "infinity" ? "∞" : `${wordLimit}`}</span>
              <ChevronDown size={14} style={{ color: "rgba(224,224,224,0.3)", flexShrink: 0 }} />
            </div>
            {showMenu && !isActive && (
              <>
                <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 60 }} />
                <div style={{ position: "absolute", top: "100%", right: "0", backgroundColor: "#1e2028", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "6px", zIndex: 61, minWidth: "120px" }}>
                  {currentOptions.map((opt) => (
                    <button key={String(opt)} onClick={() => mode === "time" ? handleTimeChange(opt as number) : handleWordChange(opt as number | "infinity")} style={{ display: "block", width: "100%", padding: "8px 16px", background: "none", border: "none", borderRadius: "6px", color: opt === currentValue ? "#ff6b35" : "rgba(224,224,224,0.4)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", cursor: "pointer", textAlign: "right", backgroundColor: opt === currentValue ? "rgba(255,107,53,0.07)" : "transparent" }}>
                      {mode === "time" ? `${opt}s` : opt === "infinity" ? "∞" : opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Статистика слева */}
          <div style={{ position: "fixed", top: "100px", left: "80px", zIndex: 10 }}>
            <FloatingStat
              value={Math.round(rawWpm)}
              label="wpm"
              color="#ff6b35"
              labelColor="rgba(255,107,53,0.35)"
              size="xl"
              muted={!isActive}
            />
          </div>
          <div style={{ position: "fixed", top: "215px", left: "80px", zIndex: 10 }}>
            <FloatingStat
              value={`${accuracy}%`}
              label="acc"
              color="rgba(224,224,224,0.55)"
              size="lg"
              muted={!isActive}
            />
          </div>

          {/* Статистика СПРАВА */}
          <div style={{ position: "fixed", top: "100px", right: "80px", zIndex: 10 }}>
            <FloatingStat
              value={mode === "time" ? (isActive ? timeLeft : timeLimit) : (wordLimit === "infinity" ? "∞" : wordsLeft)}
              label={mode === "time" ? "сек" : "слов"}
              color={timerColor}
              size="xl"
              align="right"
              muted={!isActive}
              scale={1.8}
            />
          </div>

          {/* Текст */}
          <div style={{ width: "1000px", margin: "0 auto", padding: "0", zIndex: 5, marginTop: "20px" }}>
            <TypingDisplay
              text={text}
              typed={typed}
              onType={handleTypeWithExpand}
              onReset={handleRestart}
              colors={{
                correct: "rgba(224,224,224,0.9)",
                error: "#ca4754",
                untyped: "rgba(224,224,224,0.18)",
                cursor: "#ff6b35",
                errorBg: "rgba(255,107,53,0.12)"
              }}
              isFinished={isFinished}
              wpm={wpm}
              accuracy={accuracy}
              isActive={isActive}
              isPaused={isPaused}
              togglePause={togglePause}
              paddingRight={40}
            />
          </div>

          {/* Кнопки внизу */}
          <div style={{ position: "fixed", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "20px", opacity: isActive ? 0 : 1, transition: "opacity 0.3s ease", pointerEvents: isActive ? "none" : "auto", zIndex: 10 }}>
            <button onClick={handleRestart} title="Перезапустить (Tab)" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><RotateCcw size={17} /></button>
            <button onClick={() => { setText(generateText(WORD_POOLS[language], typeof wordLimit === 'number' ? wordLimit : 25)); reset(); }} title="Следующий текст" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><SkipForward size={17} /></button>
            <button title="Ещё опции" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><MoreHorizontal size={17} /></button>
          </div>
          {isFinished ? (
            <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>tab — заново</div>
          ) : (
            <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: isActive ? "rgba(255,255,255,0.8)" : "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap", textShadow: isActive ? "0 0 10px rgba(255,255,255,0.5)" : "none", transition: "all 0.3s ease" }}>tab — заново &nbsp;·&nbsp; esc — пауза</div>
          )}
        </>
      ) : (
        // Результат
        <ResultOverlay
          wpm={Math.round(rawWpm)}
          accuracy={accuracy}
          rawWpm={wpm}
          consistency={consistency}
          errorCount={errorCount}
          onRestart={handleRestart}
        />
      )}
    </div>
    </>
  );
}
