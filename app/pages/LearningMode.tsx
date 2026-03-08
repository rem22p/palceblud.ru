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

// ─── Step indicator ────────────────────────────────────────────────────────

interface StepIndicatorProps {
  lessons: Lesson[];
  currentIndex: number;
  onSelect: (i: number) => void;
}

function StepIndicator({ lessons, currentIndex, onSelect }: StepIndicatorProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
      }}
    >
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
                  i < currentIndex
                    ? "#34d399"
                    : "rgba(255,255,255,0.07)",
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

      {/* Key focus */}
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

      {/* Target WPM */}
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

      {/* Result icon */}
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

      {/* Title */}
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

      {/* Score row */}
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

      {/* Actions */}
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

// ─── Learning Mode Page ────────────────────────────────────────────────────

export function LearningMode() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0, 1]);

  const currentLesson = LESSONS[currentIndex];

  const { typed, wpm, accuracy, isActive, isFinished, handleType, reset } =
    useTyping(currentLesson.text, 9999);

  const handleNext = () => {
    setCompletedLessons((prev) =>
      prev.includes(currentIndex) ? prev : [...prev, currentIndex]
    );
    setCurrentIndex((i) => Math.min(i + 1, LESSONS.length - 1));
    reset();
  };

  const handleRetry = () => {
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
        backgroundColor: "#1b1e2e",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        overflowY: "auto",
        transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 15% 40%, rgba(96,165,250,0.05) 0%, transparent 55%), radial-gradient(ellipse at 85% 70%, rgba(52,211,153,0.04) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Floating Stats (ПОДНЯТЫ ВЫШЕ) ─────────────────────────────── */}
      
      {/* WPM — top left */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          left: "clamp(20px, 5vw, 80px)",
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
              color: "rgba(224,224,224,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            слов/мин
          </span>
        </div>
      </div>

      {/* Accuracy — below WPM */}
      <div
        style={{
          position: "fixed",
          top: "180px",
          left: "clamp(20px, 5vw, 80px)",
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
                  ? "rgba(224,224,224,0.5)"
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
              color: "rgba(224,224,224,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            точность
          </span>
        </div>
      </div>

      {/* Tip — под статистикой */}
      <div
        style={{
          position: "fixed",
          top: "260px",
          left: "clamp(20px, 5vw, 80px)",
          zIndex: 10,
          maxWidth: "220px",
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

      {/* Streak — под советом */}
      <div
        style={{
          position: "fixed",
          top: "320px",
          left: "clamp(20px, 5vw, 80px)",
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

      {/* Lesson Card — В ПРАВЫЙ ВЕРХНИЙ УГОЛ */}
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

      {/* ── Main content wrapper (ПОДНЯТ ВЫШЕ) ───────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
          padding: "195px clamp(16px, 4vw, 40px) 160px",
          zIndex: 5,
        }}
      >
        {/* Typing area */}
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
          }}
        >
          {!isFinished ? (
            <>
              {/* Lesson label */}
              <div
                style={{
                  marginBottom: "32px",
                  opacity: isActive ? 0 : 1,
                  transition: "opacity 0.3s",
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

              {/* Typing area */}
              <TypingDisplay
                text={currentLesson.text}
                typed={typed}
                onType={handleType}
                onReset={handleRetry}
                colors={{
                  correct: "rgba(224,224,224,0.88)",
                  error: "#f87171",
                  untyped: "rgba(224,224,224,0.15)",
                  cursor: "#60a5fa",
                  errorBg: "rgba(248,113,113,0.1)",
                }}
                isFinished={isFinished}
                isActive={isActive}
                fontSize="1.3rem"
                lineHeight="2.6rem"
                cursorStyle="underline"
              />

              {/* Hint */}
              {!isActive && (
                <div
                  style={{
                    marginTop: "48px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    color: "rgba(224,224,224,0.1)",
                    letterSpacing: "0.15em",
                  }}
                >
                  click text to begin &nbsp;·&nbsp; tab — restart
                </div>
              )}
            </>
          ) : (
            <LessonComplete
              lesson={currentLesson}
              wpm={wpm}
              accuracy={accuracy}
              onNext={handleNext}
              onRetry={handleRetry}
              isLastLesson={currentIndex === LESSONS.length - 1}
            />
          )}
        </div>
      </div>

      {/* ── Step indicator — ВНИЗУ (поднят выше) ─────────────────────── */}
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

      {/* ── Bottom navigation (поднят выше) ──────────────────────────── */}
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
          onClick={handleRetry}
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