import { useState, useEffect, useMemo, useRef } from "react";
import {
  CheckCircle,
  Star,
  BookOpen,
  RotateCcw,
  HelpCircle,
  X,
} from "lucide-react";
import { useTyping, TypingDisplay } from "../components/TypingCore";
import { useSettingsStore } from "../features/settings/store/settingsStore";

// Функция для перемешивания слов в тексте
function shuffleText(text: string): string {
  const words = text.split(' ');
  // Перемешиваем массив слов (алгоритм Фишера-Йетса)
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.join(' ');
}

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
    title: "Пулеметная очередь",
    subtitle: "Указательные пальцы",
    keys: ["а", "п", "р", "о", "в", "ы", "м", "и", "т", "к"],
    tip: "Указательные пальцы — самые сильные. Работайте ритмично, как пулемёт.",
    text: "так так тик тик кот кот ток ток рак мак лак бак сок бок пот топ вот кот там мак мир тих ива мак пар том кот вон рак мак пар кот ива мак пар том вон так тик так тик кот ток кот ток рак мак рак мак сок бок сок бок пот топ пот топ вот кот там мак мир тих ива мак пар том кот вон",
    targetWpm: 120,
    completed: false,
  },
  {
    id: 2,
    title: "Шаги краба",
    subtitle: "Движение вдоль ряда",
    keys: ["ф", "ы", "в", "а", "о", "л", "д", "ж", "с", "м", "р", "к"],
    tip: "Двигайтесь плавно вдоль домашнего ряда, как краб — строго влево или вправо, не отрываясь.",
    text: "олово молоко шалаш какао лава ваза рама папа джаз каша марка парта мама мыла раму папа пил какао дед дал сок ваза стояла на столе мама дала сок папа ел кашу рама была стара лава текла медленно ваза упала и разбилась молоко было свежее каша была вкусная папа читал газету мама шила платье рама окна была белая",
    targetWpm: 140,
    completed: false,
  },
  {
    id: 3,
    title: "Лифт",
    subtitle: "Вертикальное движение",
    keys: ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "р", "о", "л", "д", "ж", "э"],
    tip: "Пальцы — кабинки лифта. Двигайтесь строго вверх и вниз по своим шахтам, не сдвигая запястье.",
    text: "кедр укроп небо цена кит год зонтик утка ель нить куст щит гнев плечо мяч сыр винт арбуз боль юла тень пень борт роль дверь зверь крот рыл норку цапля ела рыбу щука плавала в пруду гном нёс пень куст рос у реки небо ясно кот спал щит висел на стене крот рыл глубокую норку цапля стояла на одной ноге щука быстро плавала в воде гном нашёл гриб в лесу нить была тонкая и крепкая утка плавала в пруду куст цвёл весной небо было ясное и чистое",
    targetWpm: 150,
    completed: false,
  },
  {
    id: 4,
    title: "Аккорды пианиста",
    subtitle: "Синхронизация рук",
    keys: ["вся клавиатура"],
    tip: "Печатайте ритмично, как пианист — левая и правая руки работают согласованно, создавая ровный ритм.",
    text: "топо то папа лапа сала са дерево колоко молоко мир дом лес сад снег град ветер огонь вода земля небо река поле море горы степь пустыня океан остров полуостров программист клавиатура университет чемпионат футболист космонавт преподаватель университет библиотека лаборатория исследование эксперимент технология инновация революция эволюция цивилизация пополам перепел топот деде река дерево колокол молоко топот кокон половодье переполох молоко околомолочный",
    targetWpm: 160,
    completed: false,
  },
  {
    id: 5,
    title: "Грязный трюк",
    subtitle: "Спецсимволы и цифры",
    keys: ["ъ", "ё", "э", "й", "ш", "щ", "ж", "0-9", "Shift", "., ! ? : ; -"],
    tip: "Используйте мизинцы для Shift и спецсимволов. Возвращайте пальцы на базу после каждого удара.",
    text: "подъезд объём съел ёлка эхо пьяный вьюга адъюнкт жжёшь подъём ещё жёсткий шёпот щётка жизнь 2024 год 100% 50/50 ID: 777 tel: 8-900 цена: 1500 руб. ошибка 404 IP: 192.168 привет! как дела? всё супер (работаю). скинь файл на mail@ru. жду! P.S. встреча в 14:00. внимание: скоро 18+ событие! вопрос? ответ: да! 2025-01-15 09:30 утра",
    targetWpm: 140,
    completed: false,
  },
  {
    id: 6,
    title: "Мастер скорости",
    subtitle: "Финальный тест",
    keys: ["полная клавиатура"],
    tip: "Объедините все навыки. Держите ритм, не смотрите на клавиатуру, доверяйте мышечной памяти.",
    text: "практика делает мастера каждое нажатие строит мышечную память которая приведёт к мастерству скорость и точность приходят со временем не сдавайтесь продолжайте тренироваться каждый день и вы достигнете невероятных результатов в слепой печати на клавиатуре",
    targetWpm: 180,
    completed: false,
  },
];

function StepIndicator({ lessons, currentIndex, onSelect, completedLessons }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {lessons.map((lesson: any, i: number) => {
        const isCompleted = completedLessons.includes(i);
        const isCurrent = i === currentIndex;
        const bgColor = isCompleted ? "#34d399" : (isCurrent ? "#60a5fa" : "rgba(255,255,255,0.06)");
        const borderColor = isCurrent ? "rgba(96,165,250,0.4)" : "transparent";
        const boxShadow = isCurrent ? "0 0 10px rgba(96,165,250,0.4)" : "none";

        return (
          <div key={lesson.id} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              onClick={() => onSelect(i)}
              title={lesson.title}
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease"
              }}
            >
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
                boxShadow: isCurrent ? boxShadow : "none"
              }}>
                {isCompleted ? (
                  <CheckCircle size={14} color="#111" strokeWidth={3} />
                ) : isCurrent ? (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#fff", fontWeight: 700 }}>{i + 1}</span>
                ) : (
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }} />
                )}
              </div>
            </button>
            {i < lessons.length - 1 && (
              <div style={{
                width: "24px",
                height: "2px",
                backgroundColor: completedLessons.includes(i) ? "#34d399" : "rgba(255,255,255,0.07)",
                transition: "background-color 0.3s",
                marginLeft: "2px"
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LessonCard({ lesson, activeKeys }: { lesson: Lesson; activeKeys: Set<string> }) {
  const KEYBOARD_ROWS = [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "."]
  ];

  const isAllKeys = lesson.keys[0] === "вся клавиатура" || lesson.id === 4 || lesson.id === 6;

  return (
    <div style={{ backgroundColor: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.12)", borderRadius: "14px", padding: "12px 16px", width: "220px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <BookOpen size={12} color="rgba(96,165,250,0.7)" />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(96,165,250,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>урок {lesson.id}</span>
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "rgba(224,224,224,0.85)", marginBottom: "4px", letterSpacing: "-0.01em" }}>{lesson.title}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(224,224,224,0.3)", marginBottom: "14px" }}>{lesson.subtitle}</div>

      {isAllKeys ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} style={{ display: "flex", justifyContent: "center", gap: "2px" }}>
              {row.map((key) => {
                const isPressed = activeKeys.has(key);
                return (
                  <div
                    key={key}
                    style={{
                      width: "14px",
                      height: "16px",
                      backgroundColor: isPressed ? "rgba(96,165,250,0.9)" : "rgba(96,165,250,0.15)",
                      border: `1px solid ${isPressed ? "rgba(96,165,250,0.9)" : "rgba(96,165,250,0.2)"}`,
                      borderRadius: "3px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.1s ease-out",
                      transform: isPressed ? "scale(1.15)" : "scale(1)",
                      boxShadow: isPressed ? "0 0 8px rgba(96,165,250,0.6)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "0.5rem", color: isPressed ? "#fff" : "rgba(96,165,250,0.7)", fontWeight: "bold" }}>{key}</span>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "3px" }}>
            <div
              style={{
                width: "50%",
                height: "12px",
                backgroundColor: activeKeys.has(" ") ? "rgba(96,165,250,0.9)" : "rgba(96,165,250,0.15)",
                border: `1px solid ${activeKeys.has(" ") ? "rgba(96,165,250,0.9)" : "rgba(96,165,250,0.2)"}`,
                borderRadius: "3px",
                transition: "all 0.1s ease-out",
                transform: activeKeys.has(" ") ? "scale(1.05, 0.9)" : "scale(1)",
                boxShadow: activeKeys.has(" ") ? "0 0 8px rgba(96,165,250,0.6)" : "none",
              }}
            />
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
          {lesson.keys.slice(0, 8).map((key) => {
            const isPressed = activeKeys.has(key.toLowerCase());
            return (
              <span
                key={key}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: isPressed ? "#fff" : "rgba(96,165,250,0.9)",
                  backgroundColor: isPressed ? "rgba(96,165,250,0.9)" : "rgba(96,165,250,0.15)",
                  border: `1px solid ${isPressed ? "rgba(96,165,250,0.9)" : "rgba(96,165,250,0.2)"}`,
                  borderRadius: "6px",
                  padding: "6px 8px",
                  textAlign: "center",
                  transition: "all 0.1s ease-out",
                  boxShadow: isPressed ? "0 0 8px rgba(96,165,250,0.6)" : "none",
                }}
              >
                {key}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LessonComplete({ wpm, accuracy, onRetry }: any) {
  const targetWpm = 0;
  const targetAccuracy = 0;
  const passed = wpm >= targetWpm && accuracy >= targetAccuracy;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center", animation: "fadeUp 0.5s ease forwards", maxWidth: "440px", width: "100%" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: passed ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", border: `1.5px solid ${passed ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {passed ? <Star size={28} color="#34d399" /> : <RotateCcw size={24} color="rgba(248,113,113,0.7)" />}
      </div>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.4rem", fontWeight: 600, color: "rgba(224,224,224,0.85)", letterSpacing: "-0.02em", marginBottom: "6px" }}>{passed ? "Урок пройден!" : "Нужно лучше!"}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "rgba(224,224,224,0.3)", marginBottom: "8px" }}>
          {passed
            ? `Отлично!`
            : `Цель: ${targetWpm} CPM и ${targetAccuracy}% точности`
          }
        </div>
      </div>
      <div style={{ display: "flex", gap: "40px" }}>
        {[{ label: "CPM", value: wpm, target: targetWpm, color: wpm >= targetWpm ? "#34d399" : "rgba(248,113,113,0.7)" }, { label: "точность", value: `${accuracy}%`, target: `${targetAccuracy}%`, color: accuracy >= targetAccuracy ? "#34d399" : "rgba(248,113,113,0.7)" }].map((s: any) => (
          <div key={s.label}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.5rem", fontWeight: 200, color: s.color, lineHeight: 1, letterSpacing: "-0.04em" }}>{s.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onRetry} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 20px", color: "rgba(224,224,224,0.35)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", transition: "all 0.2s" }}><RotateCcw size={12} />повторить</button>
      </div>
    </div>
  );
}

export function LearningMode() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0); // Для перемешивания при перезапуске
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const fontSize = useSettingsStore((state) => state.fontSize);
  const hasProcessedFinish = useRef(false);

  const currentLesson = LESSONS[currentIndex];

  // Обработка нажатий клавиш для визуализации
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !isFinished) {
        e.preventDefault();
        setShuffleKey(prev => prev + 1);
        return;
      }

      if (e.key.length === 1 || e.key === " ") {
        const key = e.key.toLowerCase();
        setActiveKeys(prev => new Set(prev).add(key));
      }
    };
    const handleKeyUp = () => {
      setActiveKeys(new Set());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Перемешиваем текст урока при смене урока (currentIndex) или перезапуске (shuffleKey)
  const shuffledLessonText = useMemo(() => shuffleText(currentLesson.text), [currentIndex, shuffleKey]);

  // Используем wpm для левой статистики (CPM - символы в минуту)
  const { typed, wpm, rawWpm, accuracy, isActive, isFinished, isPaused, togglePause, handleType, reset } = useTyping(shuffledLessonText, { mode: "words", wordLimit: 9999 });

  // Живая статистика CPM для динамического обновления
  const [liveCpm, setLiveCpm] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // Обновляем liveCpm в реальном времени во время печати
  useEffect(() => {
    if (!isActive || isPaused || isFinished || typed.length === 0) {
      setLiveCpm(0);
      startTimeRef.current = null;
      return;
    }

    // Инициализируем startTime при начале печати
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      const elapsedMin = (Date.now() - startTimeRef.current!) / 60000;
      if (elapsedMin > 0.008) {
        const cpm = Math.round(typed.length / elapsedMin);
        // Плавное обновление - усредняем с предыдущим значением
        setLiveCpm(prev => Math.round(prev * 0.6 + Math.min(cpm, 600) * 0.4));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isPaused, isFinished, typed.length]);

  // Отправка сигнала хедеру при печати (для огонька)
  useEffect(() => {
    if (typed.length > 0 && !isFinished) {
      window.dispatchEvent(new CustomEvent('user-is-typing'));
    }
  }, [typed, isFinished]);
  
  // --- ЛОГИКА ПЕРЕХОДА УРОКОВ ---
  useEffect(() => {
    if (isFinished && !hasProcessedFinish.current) {
      hasProcessedFinish.current = true;

      // Условия: 0 CPM и 0% точности (временно)
      const targetCpm = 0;
      const targetAccuracy = 0;
      const currentCpm = wpm;
      const isGoodAccuracy = accuracy >= targetAccuracy;
      const isFastEnough = currentCpm >= targetCpm;

      if (isGoodAccuracy && isFastEnough) {
        // УСПЕХ - помечаем урок как пройденный
        setCompletedLessons((prev) => [...prev, currentIndex]);
      }
      
      // Сбрасываем флаг
      setTimeout(() => {
        hasProcessedFinish.current = false;
        reset();
      }, 0);
    }

    if (!isFinished) {
      hasProcessedFinish.current = false;
    }
  }, [isFinished, rawWpm, accuracy, currentIndex, reset]);

  const handleSelectLesson = (i: number) => {
    setCurrentIndex(i);
    reset();
  };

  const lessonsWithCompletion = LESSONS.map((l, i) => ({ ...l, completed: completedLessons.includes(i) }));

  return (
    <>
      <div className="page-transition" style={{ minHeight: "100vh", backgroundColor: "#2b2d31", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflowX: "hidden", overflowY: "auto" }}>
      <style>{`::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #555; }`}</style>

      {/* ЛЕВАЯ СТАТИСТИКА (СИМВОЛОВ В МИНУТУ - CPM) */}
      <div style={{ position: "fixed", top: "100px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "5rem", fontWeight: 200, color: liveCpm > 0 ? "#60a5fa" : "rgba(96,165,250,0.3)", lineHeight: 1, letterSpacing: "-0.04em", transition: "color 0.3s" }}>{liveCpm}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(96,165,250,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>CPM</span>
        </div>
      </div>

      <div style={{ position: "fixed", top: "215px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3.2rem", fontWeight: 200, color: accuracy >= 95 ? "#34d399" : accuracy >= 85 ? "rgba(224,224,224,0.55)" : "rgba(248,113,113,0.7)", lineHeight: 1, letterSpacing: "-0.03em", transition: "color 0.3s" }}>{accuracy}%</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>точн</span>
        </div>
      </div>

      {/* Правая сторона: Карточка урока */}
      <div style={{ position: "fixed", top: "80px", right: "clamp(20px, 5vw, 80px)", zIndex: 10 }}>
        <LessonCard lesson={currentLesson} activeKeys={activeKeys} />
      </div>

      {/* Суть задания */}
      <div style={{ position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", maxWidth: "600px", opacity: isActive && !isFinished ? 0 : 1, pointerEvents: isActive && !isFinished ? "none" : "auto", transition: "opacity 0.3s ease" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "rgba(96,165,250,0.8)", letterSpacing: "0.05em", lineHeight: 1.5 }}>
          {currentLesson.tip}
        </div>
      </div>

      {/* СОВЕТЫ УДАЛЕНЫ! Блок с currentLesson.tip удален. */}
      
      {/* Основной контент */}
      <div style={{ width: "1000px", margin: "0 auto", padding: "80px 0 40px 0", zIndex: 5 }}>
        {!isFinished ? (
          <>
            <TypingDisplay
              text={shuffledLessonText}
              typed={typed}
              onType={handleType}
              onReset={reset}
              colors={{ correct: "rgba(224,224,224,0.9)", error: "#ca4754", untyped: "rgba(224,224,224,0.18)", cursor: "#60a5fa", errorBg: "rgba(248,113,113,0.1)" }}
              isFinished={isFinished}
              fontSize={`${fontSize}px`}
              lineHeight={`${fontSize + 32}px`}
              width="1000px"
              paddingRight={40}
              wpm={wpm}
              accuracy={accuracy}
              isActive={isActive}
              isPaused={isPaused}
              togglePause={togglePause}
            />
          </>
        ) : (
          <LessonComplete lesson={currentLesson} wpm={wpm} accuracy={accuracy} onRetry={reset} isLastLesson={currentIndex === LESSONS.length - 1} />
        )}
      </div>

      {/* Индикатор шагов */}
      <div style={{ position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", zIndex: 20, opacity: isActive && !isFinished ? 0 : 1, pointerEvents: isActive && !isFinished ? "none" : "auto", transition: "opacity 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(96,165,250,0.6)", letterSpacing: "0.1em" }}>ДО СЛЕДУЮЩЕГО УРОКА</div>
          <div onClick={() => setIsHelpOpen(true)} style={{ marginLeft: "6px", cursor: "pointer", transition: "transform 0.2s", display: "flex", alignItems: "center", color: "rgba(96,165,250,0.6)" }} onMouseEnter={(e: any) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e: any) => e.currentTarget.style.transform = "scale(1)"}><HelpCircle size={18} /></div>
        </div>
        <StepIndicator lessons={lessonsWithCompletion} currentIndex={currentIndex} onSelect={handleSelectLesson} completedLessons={completedLessons} />
      </div>
      {isFinished ? (
        <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>tab — заново</div>
      ) : (
        <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: isActive ? "rgba(255,255,255,0.8)" : "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap", textShadow: isActive ? "0 0 10px rgba(255,255,255,0.5)" : "none", transition: "all 0.3s ease" }}>tab — заново &nbsp;·&nbsp; esc — пауза</div>
      )}
      
      {/* Help Modal */}
      {isHelpOpen && (
        <>
          <div onClick={() => setIsHelpOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90, cursor: "pointer" }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 100, backgroundColor: "#2b2d31", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", color: "#e0e0e0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><HelpCircle size={20} color="rgba(96,165,250,0.6)" />Условия раздела</h2>
              <button onClick={() => setIsHelpOpen(false)} style={{ background: "none", border: "none", color: "rgba(224,224,224,0.5)", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#aaa", lineHeight: 1.6, marginBottom: "16px" }}>Чтобы перейти к следующему уроку, необходимо пройти текущий урок со скоростью <strong>≥ 150 CPM</strong> (символов в мин.) и точностью <strong>90%</strong>.</p>
            <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.1em" }}>Требования к уроку:</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Скорость (CPM)</span>
              <span style={{ fontSize: "0.9rem", color: "rgba(96,165,250,0.6)", fontWeight: "bold" }}>≥ 150</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
              <span style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Точность</span>
              <span style={{ fontSize: "0.9rem", color: "rgba(96,165,250,0.6)", fontWeight: "bold" }}>≥ 90%</span>
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }`}</style>
    </div>
    </>
  );
}