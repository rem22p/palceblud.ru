import { useState } from "react";
import {
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  Star,
  Zap,
  BookOpen,
  RotateCcw,
  Flame,
  Trophy,
  X,
  Crown,
  Medal,
} from "lucide-react";
import { useTyping, TypingDisplay } from "../components/TypingCore";

// ─── Lesson data ───────────────────────────────────────────────────────────

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  keys: string[];
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

// ─── Step indicator ────────────────────────────────────────────────────────

interface StepIndicatorProps {
  lessons: Lesson[];
  currentIndex: number;
  onSelect: (i: number) => void;
}

function StepIndicator({ lessons, currentIndex, onSelect }: StepIndicatorProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {lessons.map((lesson, i) => (
        <div key={lesson.id} style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => onSelect(i)}
            title={lesson.title}
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor:
                  i < currentIndex
                    ? "#34d399"
                    : i === currentIndex
                    ? "#60a5fa"
                    : "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                border:
                  i === currentIndex
                    ? "2px solid rgba(96,165,250,0.4)"
                    : "2px solid transparent",
              }}
            >
              {i < currentIndex ? (
                <CheckCircle size={13} color="#111" strokeWidth={2.5} />
              ) : i === currentIndex ? (
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.62rem",
                    color: "#111",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
              ) : (
                <Circle size={11} color="rgba(224,224,224,0.2)" />
              )}
            </div>
          </button>
          {i < lessons.length - 1 && (
            <div
              style={{
                width: "28px",
                height: "2px",
                backgroundColor:
                  i < currentIndex ? "#34d399" : "rgba(255,255,255,0.07)",
                transition: "background-color 0.3s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Lesson Card ──────────────────────────────────────────────────────────

interface LessonCardProps {
  lesson: Lesson;
}

function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div
      style={{
        backgroundColor: "rgba(96,165,250,0.06)",
        border: "1px solid rgba(96,165,250,0.12)",
        borderRadius: "14px",
        padding: "18px",
        width: "220px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
        }}
      >
        <BookOpen size={13} color="rgba(96,165,250,0.7)" />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            color: "rgba(96,165,250,0.5)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          урок {lesson.id}
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "rgba(224,224,224,0.85)",
          marginBottom: "4px",
          letterSpacing: "-0.01em",
        }}
      >
        {lesson.title}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.75rem",
          color: "rgba(224,224,224,0.3)",
          marginBottom: "18px",
        }}
      >
        {lesson.subtitle}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          marginBottom: "16px",
        }}
      >
        {lesson.keys.slice(0, 8).map((key) => (
          <span
            key={key}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "rgba(96,165,250,0.8)",
              backgroundColor: "rgba(96,165,250,0.1)",
              border: "1px solid rgba(96,165,250,0.15)",
              borderRadius: "5px",
              padding: "2px 6px",
            }}
          >
            {key}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <Zap size={11} color="rgba(52,211,153,0.6)" />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: "rgba(52,211,153,0.6)",
          }}
        >
          цель: {lesson.targetWpm} слов/мин
        </span>
      </div>
    </div>
  );
}

// ─── Completion card ───────────────────────────────────────────────────────

interface LessonCompleteProps {
  lesson: Lesson;
  wpm: number;
  accuracy: number;
  onNext: () => void;
  onRetry: () => void;
  isLastLesson: boolean;
}

function LessonComplete({
  lesson,
  wpm,
  accuracy,
  onNext,
  onRetry,
  isLastLesson,
}: LessonCompleteProps) {
  const passed = wpm >= lesson.targetWpm && accuracy >= 90;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        textAlign: "center",
        animation: "fadeUp 0.5s ease forwards",
        maxWidth: "440px",
        width: "100%",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: passed
            ? "rgba(52,211,153,0.1)"
            : "rgba(248,113,113,0.1)",
          border: `1.5px solid ${passed ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {passed ? (
          <Star size={28} color="#34d399" />
        ) : (
          <RotateCcw size={24} color="rgba(248,113,113,0.7)" />
        )}
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 600,
            color: "rgba(224,224,224,0.85)",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          {passed ? "Урок завершён!" : "Почти готово!"}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.82rem",
            color: "rgba(224,224,224,0.3)",
          }}
        >
          {passed
            ? `Вы набрали ${wpm} слов/мин с точностью ${accuracy}%`
            : `Цель: ${lesson.targetWpm} слов/мин — вы набрали ${wpm} слов/мин`}
        </div>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>
        {[
          {
            label: "слов/мин",
            value: wpm,
            target: lesson.targetWpm,
            color: wpm >= lesson.targetWpm ? "#34d399" : "rgba(248,113,113,0.7)",
          },
          {
            label: "точность",
            value: `${accuracy}%`,
            target: "90%",
            color:
              accuracy >= 90 ? "#34d399" : "rgba(248,113,113,0.7)",
          },
        ].map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "2.5rem",
                fontWeight: 200,
                color: s.color,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                color: "rgba(224,224,224,0.2)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={onRetry}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "10px 20px",
            color: "rgba(224,224,224,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            transition: "all 0.2s",
          }}
        >
          <RotateCcw size={12} />
          повторить
        </button>

        {!isLastLesson && passed && (
          <button
            onClick={onNext}
            style={{
              background: "linear-gradient(135deg, #60a5fa, #34d399)",
              border: "none",
              borderRadius: "10px",
              padding: "10px 24px",
              color: "#111",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              transition: "opacity 0.2s",
            }}
          >
            следующий урок
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Leaderboard Modal Component ──────────────────────────────────────────

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 90,
          cursor: "pointer",
        }}
      />
      
      {/* Modal Content */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          backgroundColor: "#2b2d31",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          fontFamily: "'JetBrains Mono', monospace",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.2rem", color: "#e0e0e0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Trophy size={20} color="#fbbf24" />
            Рейтинг (Глобальный)
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "400px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#666", textAlign: "left" }}>
                <th style={{ padding: "10px", width: "50px" }}>#</th>
                <th style={{ padding: "10px" }}>Игрок</th>
                <th style={{ padding: "10px", textAlign: "right" }}>WPM</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Acc</th>
                <th style={{ padding: "10px", textAlign: "right", fontSize: "0.75rem" }}>Время</th>
              </tr>
            </thead>
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
        
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.75rem", color: "#666" }}>
          Обновляется каждые 5 минут
        </div>
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

// ─── Learning Mode Page ────────────────────────────────────────────────────

export function LearningMode() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0, 1]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const currentLesson = LESSONS[currentIndex];

  const { typed, wpm, accuracy, isActive, isFinished, handleType, reset } =
    useTyping(currentLesson.text, { mode: "words", wordLimit: 9999 });

  const handleNext = () => {
    setCompletedLessons((prev) =>
      prev.includes(currentIndex) ? prev : [...prev, currentIndex]
    );
    setCurrentIndex((i) => Math.min(i + 1, LESSONS.length - 1));
    reset();
  };


  const handleSelectLesson = (i: number) => {
    setCurrentIndex(i);
    reset();
  };

  const lessonsWithCompletion = LESSONS.map((l, i) => ({
    ...l,
    completed: completedLessons.includes(i),
  }));

  return (
    <div
      className="page-transition"
      style={{
        minHeight: "100vh",
        backgroundColor: "#2b2d31",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Фон убран (чистый цвет) */}

      {/* Стили для скроллбара (без рамок) */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      {/* ── ЛЕВАЯ СТОРОНА: Статистика ─────────────────────── */}
      
      {/* WPM */}
      <div
        style={{
          position: "fixed",
          top: "100px",
          left: "80px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "5rem",
              fontWeight: 200,
              color: wpm > 0 ? "#60a5fa" : "rgba(96,165,250,0.3)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              transition: "color 0.3s",
            }}
          >
            {wpm}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(96,165,250,0.35)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            слов/мин
          </span>
        </div>
      </div>

      {/* Accuracy */}
      <div
        style={{
          position: "fixed",
          top: "215px",
          left: "80px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "3.2rem",
              fontWeight: 200,
              color:
                accuracy >= 95
                  ? "#34d399"
                  : accuracy >= 85
                  ? "rgba(224,224,224,0.55)"
                  : "rgba(248,113,113,0.7)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              transition: "color 0.3s",
            }}
          >
            {accuracy}%
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(224,224,224,0.25)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            точность
          </span>
        </div>
      </div>

      {/* ── ПРАВАЯ СТОРОНА: Карточка и Серия ─────────────────────── */}

      {/* Lesson Card */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "clamp(20px, 5vw, 80px)",
          zIndex: 10,
        }}
      >
        <LessonCard lesson={currentLesson} />
      </div>

      {/* Streak */}
      <div
        style={{
          position: "fixed",
          top: "22px",
          right: "140px", 
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <Flame size={13} color="rgba(52,211,153,0.5)" />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: "rgba(52,211,153,0.5)",
          }}
        >
          7 дней подряд
        </span>
      </div>

      {/* Совет */}
      <div
        style={{
          position: "fixed",
          bottom: "140px",
          right: "80px",
          zIndex: 10,
          maxWidth: "220px",
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            color: "rgba(224,224,224,0.4)",
            lineHeight: 1.6,
          }}
        >
          {currentLesson.tip}
        </div>
      </div>

      {/* Кнопка Рейтинга (Правый нижний угол, БЕЗ РАМКИ) */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setShowLeaderboard(true)}
          style={{
            background: "transparent",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            color: "rgba(224,224,224,0.5)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fbbf24";
            e.currentTarget.style.background = "rgba(251,191,36,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(224,224,224,0.5)";
            e.currentTarget.style.background = "transparent";
          }}
          title="Рейтинг"
        >
          <Trophy size={20} />
        </button>
      </div>

      {/* Модальное окно рейтинга */}
      <LeaderboardModal 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />

      {/* ── Main content wrapper ───────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          width: "100%",
          margin: "0 auto",
          padding: "70px clamp(16px, 4vw, 40px) 160px", 
          zIndex: 5,
          boxSizing: "border-box",
        }}
      >
        {!isFinished ? (
          <>
            {/* ИЗМЕНЕНИЕ ЗДЕСЬ: Сдвиг заголовка вправо (marginLeft: 240px) */}
            <div
              style={{
                marginBottom: "32px",
                opacity: isActive ? 0 : 1,
                transition: "opacity 0.3s",
                marginLeft: "-800px", 
              
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  color: "rgba(96,165,250,0.4)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                урок {currentIndex + 1} · {currentLesson.subtitle}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "rgba(224,224,224,0.7)",
                  letterSpacing: "-0.02em",
                }}
              >
                {currentLesson.title}
              </div>
            </div>

            <TypingDisplay
              text={currentLesson.text}
              typed={typed}
              onType={handleType}
              onReset={reset}
              colors={{
                correct: "rgba(224,224,224,0.9)",
                error: "#ff6b35",
                untyped: "rgba(224,224,224,0.18)",
                cursor: "#60a5fa",
                errorBg: "rgba(248,113,113,0.1)",
              }}
              isFinished={isFinished}
              fontSize="36px"
              lineHeight="40px"
              maxWidth="1200px"
            />
          </>
        ) : (
          <LessonComplete
            lesson={currentLesson}
            wpm={wpm}
            accuracy={accuracy}
            onNext={handleNext}
            onRetry={reset}
            isLastLesson={currentIndex === LESSONS.length - 1}
          />
        )}
      </div>

      {/* ── Step indicator ─────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 20,
          opacity: isActive && !isFinished ? 0.2 : 1,
          transition: "opacity 0.4s ease",
        }}
      >
        <StepIndicator
          lessons={lessonsWithCompletion}
          currentIndex={currentIndex}
          onSelect={handleSelectLesson}
        />
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.58rem",
            color: "rgba(224,224,224,0.15)",
            letterSpacing: "0.15em",
          }}
        >
          урок {currentIndex + 1} из {LESSONS.length} — {currentLesson.title}
        </div>
      </div>

      {/* ── Bottom navigation ──────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          opacity: isActive && !isFinished ? 0 : 1,
          transition: "opacity 0.3s",
          pointerEvents: isActive && !isFinished ? "none" : "auto",
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          style={{
            background: "none",
            border: "none",
            color:
              currentIndex === 0
                ? "rgba(224,224,224,0.06)"
                : "rgba(224,224,224,0.2)",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            padding: "8px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
        >
          <ChevronLeft size={14} />
          prev
        </button>

        <button
          onClick={reset}
          style={{
            background: "none",
            border: "none",
            color: "rgba(224,224,224,0.18)",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
        >
          <RotateCcw size={13} />
          restart
        </button>

        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, LESSONS.length - 1))
          }
          disabled={currentIndex === LESSONS.length - 1}
          style={{
            background: "none",
            border: "none",
            color:
              currentIndex === LESSONS.length - 1
                ? "rgba(224,224,224,0.06)"
                : "rgba(224,224,224,0.2)",
            cursor:
              currentIndex === LESSONS.length - 1 ? "not-allowed" : "pointer",
            padding: "8px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
        >
          next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}