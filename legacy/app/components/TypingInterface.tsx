import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Play } from "lucide-react";

type Zone = "learning" | "sharpening" | null;

interface TypingInterfaceProps {
  zone: Zone;
  onStatsUpdate: (wpm: number, accuracy: number, timeLeft: number) => void;
  onTestComplete: () => void;
}

const SAMPLE_TEXTS = {
  learning: "the quick brown fox jumps over the lazy dog and the dog barked at the fox as it ran away into the forest beyond the hill",
  sharpening: "practice makes perfect and consistency is the key to mastery in anything you truly wish to become great at in life",
  default: "focus breathe and let your fingers flow across the keys as words form effortlessly beneath your steady hands",
};

const TIME_OPTIONS = [15, 30, 60, 120];

export function TypingInterface({ zone, onStatsUpdate, onTestComplete }: TypingInterfaceProps) {
  const [text, setText] = useState(SAMPLE_TEXTS.default);
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFocused, setIsFocused] = useState(false);
  const [wordMode, setWordMode] = useState<"time" | "words">("time");
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const accentColor = zone === "learning" ? "#e2b714" : zone === "sharpening" ? "#4d9ddd" : "#e2b714";

  const getStats = useCallback(() => {
    const correctChars = typed.split("").filter((c, i) => c === text[i]).length;
    const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
    const minutesElapsed = (timeLimit - timeLeft) / 60;
    const wpm = minutesElapsed > 0 ? Math.round(wordsTyped / minutesElapsed) : 0;
    const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
    return { wpm, accuracy };
  }, [typed, text, timeLimit, timeLeft]);

  useEffect(() => {
    const { wpm, accuracy } = getStats();
    onStatsUpdate(wpm, accuracy, timeLeft);
  }, [typed, timeLeft, getStats, onStatsUpdate]);

  useEffect(() => {
    const newText = zone === "learning"
      ? SAMPLE_TEXTS.learning
      : zone === "sharpening"
      ? SAMPLE_TEXTS.sharpening
      : SAMPLE_TEXTS.default;
    setText(newText);
    resetTest();
  }, [zone]);

  useEffect(() => {
    setTimeLeft(timeLimit);
    resetTest();
  }, [timeLimit]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            onTestComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const resetTest = () => {
    setTyped("");
    setIsActive(false);
    setTimeLeft(timeLimit);
    if (intervalRef.current) clearInterval(intervalRef.current);
    onStatsUpdate(0, 100, timeLimit);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isActive && val.length > 0) {
      setIsActive(true);
    }
    if (val.length <= text.length) {
      setTyped(val);
    }
    if (val.length === text.length) {
      // extend the text (wrap)
      const words = text.split(" ");
      const extended = [...words, ...words].join(" ");
      setText(extended);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Render chars
  const renderText = () => {
    return text.split("").map((char, i) => {
      let charColor = "#3d3d3d"; // untyped
      let bgColor = "transparent";
      let underline = false;

      if (i < typed.length) {
        if (typed[i] === char) {
          charColor = accentColor; // correct
        } else {
          charColor = "#ca4754"; // incorrect
          bgColor = "rgba(202, 71, 84, 0.15)";
        }
      } else if (i === typed.length) {
        charColor = "#d1d0c5"; // current
        underline = true;
      }

      return (
        <span
          key={i}
          style={{
            color: charColor,
            backgroundColor: bgColor,
            borderBottom: underline ? `2px solid ${accentColor}` : "2px solid transparent",
            transition: "color 0.08s",
            position: "relative",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 pb-6">
      {/* Mode selector bar */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "12px 12px 0 0",
          padding: "12px 20px",
          borderBottom: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Word mode tabs */}
        <div className="flex items-center gap-1">
          {(["time", "words"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setWordMode(mode)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                padding: "5px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: wordMode === mode ? "#2a2a2a" : "transparent",
                color: wordMode === mode ? "#d1d0c5" : "#646669",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Divider dot */}
        <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#2a2a2a" }} />

        {/* Time options */}
        {wordMode === "time" && (
          <div className="flex items-center gap-1">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTimeLimit(t)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: timeLimit === t ? "#2a2a2a" : "transparent",
                  color: timeLimit === t ? accentColor : "#646669",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Reset */}
        <button
          onClick={resetTest}
          style={{
            background: "none",
            border: "none",
            color: "#646669",
            padding: "5px 8px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            transition: "all 0.15s",
          }}
          className="hover:!text-[#d1d0c5] hover:!bg-[#2a2a2a]"
        >
          <RotateCcw size={13} />
          reset
        </button>
      </div>

      {/* Timer display */}
      {isActive && (
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "8px 20px",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1.2rem",
              color: timeLeft <= 10 ? "#ca4754" : accentColor,
              fontWeight: 700,
              transition: "color 0.3s",
            }}
          >
            {timeLeft}
          </span>
        </div>
      )}

      {/* Typing area */}
      <div
        onClick={handleContainerClick}
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "0 0 12px 12px",
          padding: "32px 28px",
          cursor: "text",
          position: "relative",
          minHeight: "140px",
          outline: isFocused ? `1px solid ${accentColor}22` : "none",
          transition: "outline 0.2s",
        }}
      >
        {/* Caret focus hint */}
        {!isFocused && !isActive && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(26,26,26,0.7)",
              borderRadius: "0 0 12px 12px",
              zIndex: 5,
              gap: "8px",
              flexDirection: "column",
            }}
          >
            <Play size={20} color="#646669" />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                color: "#646669",
              }}
            >
              click here to start typing
            </span>
          </div>
        )}

        {/* Text display */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.2rem",
            lineHeight: "2rem",
            letterSpacing: "0.02em",
            userSelect: "none",
            wordBreak: "break-word",
          }}
        >
          {renderText()}
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          value={typed}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            top: 0,
            left: 0,
            width: "1px",
            height: "1px",
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="flex justify-center mt-3 gap-6">
        {[
          { key: "tab + enter", label: "restart" },
          { key: "esc", label: "pause" },
        ].map((s) => (
          <span
            key={s.key}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.68rem",
              color: "#3a3a3a",
            }}
          >
            <span style={{ color: "#2a2a2a" }}>[</span>
            <span style={{ color: "#646669" }}>{s.key}</span>
            <span style={{ color: "#2a2a2a" }}>]</span>
            {" "}{s.label}
          </span>
        ))}
      </div>
    </section>
  );
}
