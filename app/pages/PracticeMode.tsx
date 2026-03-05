import { useState, useEffect } from "react";
import { RotateCcw, SkipForward, MoreHorizontal, ChevronDown } from "lucide-react";
import { ModeHeader } from "../components/ModeHeader";
import { useTyping, TypingDisplay } from "../components/TypingCore";

// ─── Word bank ─────────────────────────────────────────────────────────────

const WORD_POOL = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
  "practice", "makes", "perfect", "focus", "speed", "accuracy", "type",
  "faster", "every", "session", "builds", "muscle", "memory", "clean",
  "sharp", "crisp", "flow", "press", "each", "key", "with", "intent",
  "breathe", "stay", "calm", "and", "let", "fingers", "move", "freely",
  "across", "keyboard", "words", "form", "beneath", "steady", "hands",
  "rhythm", "pace", "control", "watch", "the", "timer", "count", "down",
  "push", "limits", "break", "record", "reach", "goal", "never", "stop",
];

const TIME_OPTIONS = [15, 30, 60, 120];

function generateText(wordCount = 60) {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  }
  return words.join(" ");
}

// ─── Floating Stat ─────────────────────────────────────────────────────────

interface FloatingStatProps {
  value: string | number;
  label: string;
  color: string;
  labelColor?: string;
  size?: "xl" | "lg" | "md";
  align?: "left" | "right";
  muted?: boolean;
}

function FloatingStat({
  value,
  label,
  color,
  labelColor,
  size = "xl",
  align = "left",
  muted = false,
}: FloatingStatProps) {
  const fontSize =
    size === "xl" ? "5rem" : size === "lg" ? "3.2rem" : "2rem";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "right" ? "flex-end" : "flex-start",
        gap: "2px",
        opacity: muted ? 0.18 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize,
          fontWeight: 200,
          color,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          transition: "color 0.3s",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          color: labelColor || "rgba(224,224,224,0.25)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {label === "wpm" ? "слов/мин" : label === "acc" ? "точн" : label === "sec" ? "сек" : label}
      </span>
    </div>
  );
}

// ─── Result Overlay ────────────────────────────────────────────────────────

interface ResultOverlayProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
}

function ResultOverlay({ wpm, accuracy, onRestart }: ResultOverlayProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        animation: "fadeUp 0.5s ease forwards",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main result row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "60px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "7rem",
              fontWeight: 200,
              color: "#ff6b35",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {wpm}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(255,107,53,0.4)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginTop: "6px",
            }}
          >
            слов/мин
          </div>
        </div>

        <div style={{ textAlign: "center", paddingBottom: "12px" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "3.5rem",
              fontWeight: 200,
              color: "#e0e0e0",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {accuracy}%
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(224,224,224,0.25)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginTop: "6px",
            }}
          >
            точн
          </div>
        </div>
      </div>

      {/* Breakdown row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {[
          {
            label: "чистая",
            value: Math.round(wpm * 1.08),
            color: "rgba(224,224,224,0.4)",
          },
          {
            label: "стабильность",
            value: `${Math.min(99, 80 + Math.floor(Math.random() * 18))}%`,
            color: "rgba(224,224,224,0.4)",
          },
          {
            label: "ошибки",
            value: Math.floor((100 - accuracy) * 0.8),
            color:
              accuracy < 95 ? "rgba(255,107,53,0.6)" : "rgba(224,224,224,0.4)",
          },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "1.3rem",
                fontWeight: 300,
                color: s.color,
                lineHeight: 1,
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

      {/* Restart button */}
      <button
        onClick={onRestart}
        style={{
          background: "none",
          border: "1px solid rgba(255,107,53,0.25)",
          borderRadius: "10px",
          padding: "10px 28px",
          color: "rgba(255,107,53,0.7)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(255,107,53,0.6)";
          (e.currentTarget as HTMLButtonElement).style.color = "#ff6b35";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(255,107,53,0.25)";
          (e.currentTarget as HTMLButtonElement).style.color =
            "rgba(255,107,53,0.7)";
        }}
      >
        <RotateCcw size={13} />
        новый тест
      </button>

      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          color: "rgba(224,224,224,0.12)",
          letterSpacing: "0.15em",
        }}
      >
        tab — заново
      </span>
    </div>
  );
}

// ─── Practice Mode Page ────────────────────────────────────────────────────

export function PracticeMode() {
  const [timeLimit, setTimeLimit] = useState(60);
  const [text, setText] = useState(() => generateText(70));
  const [showTimeMenu, setShowTimeMenu] = useState(false);

  const { typed, wpm, accuracy, timeLeft, isActive, isFinished, handleType, reset } =
    useTyping(text, timeLimit);

  const handleRestart = () => {
    setText(generateText(70));
    reset();
  };

  // Re-generate on time limit change
  useEffect(() => {
    handleRestart();
  }, [timeLimit]);

  const timerColor = timeLeft <= 5 && isActive ? "#ff4444" : "rgba(224,224,224,0.85)";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#2b2d31",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Subtle noise texture layer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(159,110,250,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <ModeHeader isActive={isActive && !isFinished} />

      {!isFinished ? (
        <>
          {/* ── Floating stats ─────────────────────────────────────────── */}

          {/* WPM — top left */}
          <div
            style={{
              position: "fixed",
              top: "80px",
              left: "clamp(20px, 5vw, 80px)",
              zIndex: 10,
            }}
          >
            <FloatingStat
              value={wpm}
              label="wpm"
              color="#ff6b35"
              labelColor="rgba(255,107,53,0.35)"
              size="xl"
              muted={!isActive}
            />
          </div>

          {/* Accuracy — below WPM */}
          <div
            style={{
              position: "fixed",
              top: "195px",
              left: "clamp(20px, 5vw, 80px)",
              zIndex: 10,
            }}
          >
            <FloatingStat
              value={`${accuracy}%`}
              label="acc"
              color="rgba(224,224,224,0.55)"
              size="lg"
              muted={!isActive}
            />
          </div>

          {/* Timer — top right */}
          <div
            style={{
              position: "fixed",
              top: "80px",
              right: "clamp(20px, 5vw, 80px)",
              zIndex: 10,
            }}
          >
            <FloatingStat
              value={isActive ? timeLeft : timeLimit}
              label="sec"
              color={timerColor}
              size="xl"
              align="right"
              muted={!isActive}
            />
          </div>

          {/* Time selector — below timer */}
          <div
            style={{
              position: "fixed",
              top: "195px",
              right: "clamp(20px, 5vw, 80px)",
              zIndex: 10,
            }}
          >
            <div style={{ position: "relative" }}>
              <button
                onClick={() => !isActive && setShowTimeMenu(!showTimeMenu)}
                style={{
                  background: "none",
                  border: "none",
                  color: isActive
                    ? "transparent"
                    : "rgba(224,224,224,0.2)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.68rem",
                  cursor: isActive ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  letterSpacing: "0.1em",
                  transition: "color 0.2s",
                }}
              >
                {timeLimit}s
                {!isActive && <ChevronDown size={11} />}
              </button>

              {showTimeMenu && !isActive && (
                <>
                  <div
                    onClick={() => setShowTimeMenu(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 20 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      backgroundColor: "#1e2028",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "10px",
                      padding: "4px",
                      zIndex: 30,
                      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                    }}
                  >
                    {TIME_OPTIONS.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeLimit(t);
                          setShowTimeMenu(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "7px 20px",
                          background: "none",
                          border: "none",
                          borderRadius: "6px",
                          color:
                            t === timeLimit ? "#ff6b35" : "rgba(224,224,224,0.4)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          textAlign: "right",
                          backgroundColor:
                            t === timeLimit
                              ? "rgba(255,107,53,0.07)"
                              : "transparent",
                          transition: "all 0.1s",
                        }}
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Center: Borderless typing area ─────────────────────────── */}
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              padding: "0 clamp(16px, 4vw, 40px)",
              zIndex: 5,
            }}
          >
            <TypingDisplay
              text={text}
              typed={typed}
              onType={handleType}
              onReset={handleRestart}
              colors={{
                correct: "rgba(224,224,224,0.9)",
                error: "#ff6b35",
                untyped: "rgba(224,224,224,0.18)",
                cursor: "#ff6b35",
                errorBg: "rgba(255,107,53,0.12)",
              }}
              isFinished={isFinished}
              isActive={isActive}
              fontSize="1.4rem"
              lineHeight="2.7rem"
              maxWidth="760px"
              cursorStyle="underline"
            />
          </div>

          {/* ── Bottom controls ─────────────────────────────────────────── */}
          <div
            style={{
              position: "fixed",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              opacity: isActive ? 0 : 1,
              transition: "opacity 0.3s ease",
              pointerEvents: isActive ? "none" : "auto",
              zIndex: 10,
            }}
          >
            {/* Restart */}
            <button
              onClick={handleRestart}
              title="Перезапустить (Tab)"
              style={{
                background: "none",
                border: "none",
                color: "rgba(224,224,224,0.2)",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,107,53,0.7)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(255,107,53,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(224,224,224,0.2)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <RotateCcw size={17} />
            </button>

            {/* Next */}
            <button
              onClick={() => {
                setText(generateText(70));
                reset();
              }}
              title="Следующий текст"
              style={{
                background: "none",
                border: "none",
                color: "rgba(224,224,224,0.2)",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(224,224,224,0.5)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(224,224,224,0.2)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <SkipForward size={17} />
            </button>

            {/* More */}
            <button
              title="Ещё опции"
              style={{
                background: "none",
                border: "none",
                color: "rgba(224,224,224,0.2)",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(224,224,224,0.5)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(224,224,224,0.2)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <MoreHorizontal size={17} />
            </button>
          </div>

          {/* Tab hint */}
          {!isActive && (
            <div
              style={{
                position: "fixed",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                color: "rgba(224,224,224,0.1)",
                letterSpacing: "0.15em",
                whiteSpace: "nowrap",
              }}
            >
              tab — заново &nbsp;·&nbsp; esc — пауза
            </div>
          )}
        </>
      ) : (
        /* ── Results ──────────────────────────────────────────────── */
        <ResultOverlay
          wpm={wpm}
          accuracy={accuracy}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
