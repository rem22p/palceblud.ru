import { useState, useMemo, useRef, useEffect } from "react";
import { useTyping } from "@/shared/hooks/useTyping";
import { TypingDisplay } from "@/shared/components/TypingDisplay";
import { NumberTicker } from "@/components/ui/number-ticker";
import { EN_LESSONS, RU_LESSONS, type Lesson } from "./lessonData";

const REQUIRE_ACCURACY = 90;
const REQUIRE_WPM = 20;

interface LessonResult {
  lessonId: string;
  wpm: number;
  accuracy: number;
  errors: number;
  passed: boolean;
}

export function LessonMode() {
  const [lang, setLang] = useState<"en" | "ru">("en");
  const [lessonIdx, setLessonIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<Record<string, LessonResult>>({});
  const [key, setKey] = useState(0);

  const lessons = lang === "en" ? EN_LESSONS : RU_LESSONS;
  const lesson = lessons[lessonIdx];
  const step = lesson?.steps[stepIdx] ?? "";
  const isLastStep = stepIdx >= (lesson?.steps.length ?? 0) - 1;
  const isLastLesson = lessonIdx >= lessons.length - 1;

  const { state, reset } = useTyping({ text: step });
  const { typed, currentIndex, errors, wpm, rawWpm, accuracy, isRunning, isFinished } = state;

  const errorIndices = useMemo(() => {
    const a: number[] = [];
    for (let i = 0; i < typed.length; i++) if (typed[i] !== step[i]) a.push(i);
    return a;
  }, [typed, step]);

  const handleNext = () => {
    if (isLastStep) {
      // Complete lesson
      const passed = accuracy >= REQUIRE_ACCURACY && wpm >= REQUIRE_WPM;
      setResults((r) => ({
        ...r,
        [lesson.id]: { lessonId: lesson.id, wpm, accuracy, errors, passed },
      }));
      if (passed && !isLastLesson) {
        setLessonIdx((i) => i + 1);
        setStepIdx(0);
      }
    } else {
      setStepIdx((i) => i + 1);
    }
    reset();
    setKey((k) => k + 1);
  };

  const handleRetry = () => {
    reset();
    setKey((k) => k + 1);
  };

  const handleRestartLesson = () => {
    setStepIdx(0);
    reset();
    setKey((k) => k + 1);
  };

  const result = results[lesson.id];
  const stepProgress = `${stepIdx + 1}/${lesson.steps.length}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "var(--space-md)", paddingTop: "var(--space-md)", flexWrap: "wrap",
      }}>
        {/* Language selector */}
        {!isRunning && !isFinished && (
          <div className="glass" style={{ display: "inline-flex", gap: "0.25rem", padding: "0.4rem" }}>
            {(["en", "ru"] as const).map((l) => (
              <button key={l} onClick={() => { setLang(l); setLessonIdx(0); setStepIdx(0); }}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "var(--font-size-body)",
                  fontWeight: lang === l ? 600 : 400,
                  color: lang === l ? "var(--accent)" : "var(--text-secondary)",
                  background: lang === l ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "none", borderRadius: "12px", padding: "0.35rem 0.85rem",
                  cursor: "pointer", textTransform: "uppercase",
                }}
              >{l === "en" ? "EN" : "RU"}</button>
            ))}
          </div>
        )}

        {/* Stats during typing */}
        {(isRunning || isFinished) && (
          <div className="glass" style={{ display: "inline-flex", gap: "var(--space-md)", padding: "0.75rem 1.5rem" }}>
            {[
              { label: "STEP", value: stepIdx + 1, suffix: `/${lesson.steps.length}`, color: "var(--accent)" },
              { label: "WPM", value: wpm, color: "var(--accent)" },
              { label: "ACC", value: accuracy, suffix: "%", color: accuracy >= REQUIRE_ACCURACY ? "var(--success)" : "var(--error)" },
            ].map(({ label, value, color, suffix }) => (
              <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                <span className="label">{label}</span>
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, color, fontSize: "var(--font-size-large)" }}>
                  <NumberTicker value={value} className="!text-inherit" />
                </span>
                {suffix && (
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "var(--font-size-lead)", color }}>{suffix}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lesson info */}
      {!isRunning && !isFinished && (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "var(--space-md)" }}>
          <div className="glass" style={{ padding: "var(--space-md)", maxWidth: "500px" }}>
            <p className="label" style={{ marginBottom: "0.25rem" }}>
              урок {lessonIdx + 1}/{lessons.length}
            </p>
            <h3 style={{
              fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: "var(--font-size-lead)", marginBottom: "0.25rem",
            }}>
              {lesson.title}
            </h3>
            <p className="mono" style={{ fontSize: "var(--font-size-body)", color: "var(--text-secondary)" }}>
              {lesson.description}
            </p>
            <p className="label" style={{ marginTop: "var(--space-sm)", color: "var(--text-muted)" }}>
              шаг {stepProgress} · точность ≥ {REQUIRE_ACCURACY}% · скорость ≥ {REQUIRE_WPM} WPM
            </p>
          </div>
        </div>
      )}

      {/* Typing area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "900px", width: "100%", padding: "0 var(--space-md)" }}>
          <TypingDisplay text={step} currentIndex={currentIndex} errors={errorIndices} />
        </div>
      </div>

      {/* Results overlay */}
      {isFinished && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-md)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(40px)" }}>
          <div className="glass" style={{ maxWidth: "520px", width: "100%", padding: "var(--space-lg)" }}>
            <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
              {isLastStep ? "урок завершён" : `шаг ${stepProgress}`}
            </p>
            <h2 className="display" style={{ fontSize: "var(--font-size-hero)", color: accuracy >= REQUIRE_ACCURACY && wpm >= REQUIRE_WPM ? "var(--success)" : "var(--accent)", lineHeight: 0.8, marginBottom: "var(--space-md)" }}>
              {wpm}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
              {[
                { label: "точность", value: `${accuracy}%` },
                { label: "raw", value: rawWpm },
                { label: "ошибок", value: errors },
                { label: "требование", value: `≥${REQUIRE_ACCURACY}% · ≥${REQUIRE_WPM}WPM` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="label">{label}</div>
                  <div className="mono" style={{ fontSize: "var(--font-size-lead)", marginTop: "0.25rem" }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              {isLastStep ? (
                accuracy >= REQUIRE_ACCURACY && wpm >= REQUIRE_WPM ? (
                  isLastLesson ? (
                    <span className="mono" style={{ color: "var(--success)", fontSize: "var(--font-size-lead)" }}>
                      все уроки пройдены!
                    </span>
                  ) : (
                    <a onClick={handleNext} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--font-size-lead)", color: "var(--accent)", cursor: "pointer" }}>
                      дальше <span className="cursor" />
                    </a>
                  )
                ) : (
                  <a onClick={handleRestartLesson} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--font-size-lead)", color: "var(--error)", cursor: "pointer" }}>
                    не пройдено · заново <span className="cursor" />
                  </a>
                )
              ) : (
                <a onClick={handleNext} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "var(--font-size-lead)", color: "var(--accent)", cursor: "pointer" }}>
                  дальше <span className="cursor" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
