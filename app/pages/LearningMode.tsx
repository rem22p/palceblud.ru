import { useState, useEffect } from "react";
import {
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  Star,
  Zap,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { useTyping, TypingDisplay } from "../components/TypingCore";
import { useSettingsStore } from "../features/settings/store/settingsStore";

// ─── Lesson data ───────────────────────────────────────────────────────────
interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  keys: string[];
  // tip убран из использования, но остался в интерфейсе на всякий случай
  tip: string; 
  text: string;
  targetWpm: number;
  completed: boolean;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Домашняя строка",
    subtitle: "Основные клавиши",
    keys: ["а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и"],
    tip: "Держите пальцы на домашней строке между нажатиями.",
    text: "все они как раз был стал мир дом был лук дар жар пар вар ток сок лук мир стал был все они как раз",
    targetWpm: 25,
    completed: true,
  },
  {
    id: 2,
    title: "Верхний ряд",
    subtitle: "Точные движения",
    keys: ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з"],
    tip: "Тянитесь от домашней строки — не смещайте всю кисть.",
    text: "укеенгшщз йцукеенгшщз зщшгнеук й зщшгнеук йцукеенгшщз укеенгшщз зщшгнеук йцукеен",
    targetWpm: 30,
    completed: true,
  },
  {
    id: 3,
    title: "Нижний ряд",
    subtitle: "Движения вниз",
    keys: ["ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    tip: "Слегка согните пальцы вниз — минимизируйте движение запястья.",
    text: "ывапролджэ ывапролджэ пролджэыва ы пролджэыва ывапролджэ пролджэыва ывапролджэ",
    targetWpm: 28,
    completed: false,
  },
  {
    id: 4,
    title: "Заглавные буквы",
    subtitle: "Управление Shift",
    keys: ["Shift", "Все буквы"],
    tip: "Используйте противоположный Shift от буквы, которую делаете заглавной.",
    text: "Съешь Ещё Этих Мягких Французских Булок Да Выпей Чаю Каждый День Для Здоровья",
    targetWpm: 35,
    completed: false,
  },
  {
    id: 5,
    title: "Частые слова",
    subtitle: "Высокочастотная лексика",
    keys: ["все клавиши"],
    tip: "Эти 200 слов составляют 50% всего текста. Изучите их на ощупь.",
    text: "и в не на я что тот быть этот все для есть один ты как его она так ты мне себя ну",
    targetWpm: 45,
    completed: false,
  },
  {
    id: 6,
    title: "Скоростной тест",
    subtitle: "Без ограничений",
    keys: ["полная клавиатура"],
    tip: "Не замедляйтесь из-за ошибок — постоянство важнее совершенства.",
    text: "практика делает мастера и каждое нажатие клавиши строит мышечную память которая приведёт к мастерству",
    targetWpm: 60,
    completed: false,
  },
];

function StepIndicator({ lessons, currentIndex, onSelect }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {lessons.map((lesson: any, i: number) => (
        <div key={lesson.id} style={{ display: "flex", alignItems: "center" }}>
          <button onClick={() => onSelect(i)} title={lesson.title} style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: i < currentIndex ? "#34d399" : i === currentIndex ? "#60a5fa" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", border: i === currentIndex ? "2px solid rgba(96,165,250,0.4)" : "2px solid transparent" }}>
              {i < currentIndex ? <CheckCircle size={13} color="#111" strokeWidth={2.5} /> : i === currentIndex ? <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#111", fontWeight: 700 }}>{i + 1}</span> : <Circle size={11} color="rgba(224,224,224,0.2)" />}
            </div>
          </button>
          {i < lessons.length - 1 && <div style={{ width: "28px", height: "2px", backgroundColor: i < currentIndex ? "#34d399" : "rgba(255,255,255,0.07)", transition: "background-color 0.3s" }} />}
        </div>
      ))}
    </div>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <div style={{ backgroundColor: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.12)", borderRadius: "14px", padding: "18px", width: "220px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <BookOpen size={13} color="rgba(96,165,250,0.7)" />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(96,165,250,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>урок {lesson.id}</span>
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "rgba(224,224,224,0.85)", marginBottom: "4px", letterSpacing: "-0.01em" }}>{lesson.title}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(224,224,224,0.3)", marginBottom: "18px" }}>{lesson.subtitle}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "16px" }}>
        {lesson.keys.slice(0, 8).map((key) => (
          <span key={key} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(96,165,250,0.8)", backgroundColor: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "5px", padding: "2px 6px" }}>{key}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Zap size={11} color="rgba(52,211,153,0.6)" />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(52,211,153,0.6)" }}>цель: {lesson.targetWpm} CPM</span>
      </div>
    </div>
  );
}

function LessonComplete({ lesson, wpm, accuracy, onNext, onRetry, isLastLesson }: any) {
  const passed = wpm >= lesson.targetWpm && accuracy >= 90;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center", animation: "fadeUp 0.5s ease forwards", maxWidth: "440px", width: "100%" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: passed ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1.5px solid ${passed ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {passed ? <Star size={28} color="#34d399" /> : <RotateCcw size={24} color="rgba(248,113,113,0.7)" />}
      </div>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.4rem", fontWeight: 600, color: "rgba(224,224,224,0.85)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{passed ? "Урок завершён!" : "Почти готово!"}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "rgba(224,224,224,0.3)" }}>{passed ? `Вы набрали ${wpm} CPM с точностью ${accuracy}%` : `Цель: ${lesson.targetWpm} CPM — вы набрали ${wpm} CPM`}</div>
      </div>
      <div style={{ display: "flex", gap: "40px" }}>
        {[{ label: "CPM", value: wpm, target: lesson.targetWpm, color: wpm >= lesson.targetWpm ? "#34d399" : "rgba(248,113,113,0.7)" }, { label: "точность", value: `${accuracy}%`, target: "90%", color: accuracy >= 90 ? "#34d399" : "rgba(248,113,113,0.7)" }].map((s: any) => (
          <div key={s.label}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.5rem", fontWeight: 200, color: s.color, lineHeight: 1, letterSpacing: "-0.04em" }}>{s.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onRetry} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 20px", color: "rgba(224,224,224,0.35)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", transition: "all 0.2s" }}><RotateCcw size={12} />повторить</button>
        {!isLastLesson && passed && <button onClick={onNext} style={{ background: "linear-gradient(135deg, #60a5fa, #34d399)", border: "none", borderRadius: "10px", padding: "10px 24px", color: "#111", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", transition: "opacity 0.2s" }}>следующий урок<ChevronRight size={13} /></button>}
      </div>
    </div>
  );
}

export function LearningMode() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0, 1]);
  const fontSize = useSettingsStore((state) => state.fontSize);

  const currentLesson = LESSONS[currentIndex];
  // Используем rawWpm для левой статистики (Слова в минуту)
  const { typed, wpm, rawWpm, accuracy, isActive, isFinished, handleType, reset } = useTyping(currentLesson.text, { mode: "words", wordLimit: 9999 });

  // Отправка сигнала хедеру при печати (для огонька)
  useEffect(() => {
    if (typed.length > 0 && !isFinished) {
      window.dispatchEvent(new CustomEvent('user-is-typing'));
    }
  }, [typed, isFinished]);

  const handleNext = () => {
    setCompletedLessons((prev) => prev.includes(currentIndex) ? prev : [...prev, currentIndex]);
    setCurrentIndex((i) => Math.min(i + 1, LESSONS.length - 1));
    reset();
  };

  const handleSelectLesson = (i: number) => {
    setCurrentIndex(i);
    reset();
  };

  const lessonsWithCompletion = LESSONS.map((l, i) => ({ ...l, completed: completedLessons.includes(i) }));

  return (
    <div className="page-transition" style={{ minHeight: "100vh", backgroundColor: "#2b2d31", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflowX: "hidden", overflowY: "auto" }}>
      <style>{`::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #555; }`}</style>

      {/* ЛЕВАЯ СТАТИСТИКА (СЛОВА В МИНУТУ - rawWpm) */}
      <div style={{ position: "fixed", top: "100px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "5rem", fontWeight: 200, color: rawWpm > 0 ? "#60a5fa" : "rgba(96,165,250,0.3)", lineHeight: 1, letterSpacing: "-0.04em", transition: "color 0.3s" }}>{Math.round(rawWpm)}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(96,165,250,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>слов/мин</span>
        </div>
      </div>
      
      <div style={{ position: "fixed", top: "215px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3.2rem", fontWeight: 200, color: accuracy >= 95 ? "#34d399" : accuracy >= 85 ? "rgba(224,224,224,0.55)" : "rgba(248,113,113,0.7)", lineHeight: 1, letterSpacing: "-0.03em", transition: "color 0.3s" }}>{accuracy}%</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>точн</span>
        </div>
      </div>

      {/* Правая сторона: Карточка урока */}
      <div style={{ position: "fixed", top: "80px", right: "clamp(20px, 5vw, 80px)", zIndex: 10 }}><LessonCard lesson={currentLesson} /></div>
      
      {/* СОВЕТЫ УДАЛЕНЫ! Блок с currentLesson.tip удален. */}
      
      {/* Основной контент */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          width: "100%",
          margin: "0 auto",
          padding: "160px clamp(16px, 4vw, 40px) 160px", 
          zIndex: 5,
          boxSizing: "border-box",
        }}
      >
        {!isFinished ? (
          <>
            <TypingDisplay
              text={currentLesson.text}
              typed={typed}
              onType={handleType}
              onReset={reset}
              colors={{ correct: "rgba(224,224,224,0.9)", error: "#ca4754", untyped: "rgba(224,224,224,0.18)", cursor: "#60a5fa", errorBg: "rgba(248,113,113,0.1)" }}
              isFinished={isFinished}
              fontSize={`${fontSize}px`}
              lineHeight={`${fontSize + 32}px`}
              maxWidth="1200px"
              
              wpm={wpm}
              accuracy={accuracy}
              isActive={isActive}
            />
          </>
        ) : (
          <LessonComplete lesson={currentLesson} wpm={wpm} accuracy={accuracy} onNext={handleNext} onRetry={reset} isLastLesson={currentIndex === LESSONS.length - 1} />
        )}
      </div>

      {/* Индикатор шагов */}
      <div style={{ position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 20, opacity: isActive && !isFinished ? 0.2 : 1, transition: "opacity 0.4s ease" }}>
        <StepIndicator lessons={lessonsWithCompletion} currentIndex={currentIndex} onSelect={handleSelectLesson} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.15)", letterSpacing: "0.15em" }}>урок {currentIndex + 1} из {LESSONS.length} — {currentLesson.title}</div>
      </div>

      {/* Навигация */}
      <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "16px", opacity: isActive && !isFinished ? 0 : 1, transition: "opacity 0.3s", pointerEvents: isActive && !isFinished ? "none" : "auto", zIndex: 20 }}>
        <button onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))} disabled={currentIndex === 0} style={{ background: "none", border: "none", color: currentIndex === 0 ? "rgba(224,224,224,0.06)" : "rgba(224,224,224,0.2)", cursor: currentIndex === 0 ? "not-allowed" : "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "5px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", transition: "color 0.2s" }}><ChevronLeft size={14} />prev</button>
        <button onClick={reset} style={{ background: "none", border: "none", color: "rgba(224,224,224,0.18)", cursor: "pointer", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", transition: "color 0.2s" }}><RotateCcw size={13} />restart</button>
        <button onClick={() => setCurrentIndex((i) => Math.min(i + 1, LESSONS.length - 1))} disabled={currentIndex === LESSONS.length - 1} style={{ background: "none", border: "none", color: currentIndex === LESSONS.length - 1 ? "rgba(224,224,224,0.06)" : "rgba(224,224,224,0.2)", cursor: currentIndex === LESSONS.length - 1 ? "not-allowed" : "pointer", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "5px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", transition: "color 0.2s" }}>next<ChevronRight size={14} /></button>
      </div>
    </div>
  );
}