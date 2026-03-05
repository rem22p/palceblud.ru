import { TrendingUp, Target, Clock, Award } from "lucide-react";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  zone: "learning" | "sharpening" | null;
  showResult?: boolean;
}

interface StatItemProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color?: string;
  highlighted?: boolean;
}

function StatItem({ label, value, unit, icon, color = "#646669", highlighted }: StatItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        padding: "16px 24px",
        borderRadius: "12px",
        backgroundColor: highlighted ? "rgba(226,183,20,0.06)" : "#1e1e1e",
        border: highlighted ? "1px solid rgba(226,183,20,0.2)" : "1px solid #2a2a2a",
        minWidth: "100px",
        transition: "all 0.3s",
      }}
    >
      <div style={{ color: "#3a3a3a" }}>{icon}</div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: color,
          lineHeight: 1,
          transition: "color 0.3s",
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#646669", marginLeft: "3px" }}>
            {unit}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          color: "#646669",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function StatsBar({ wpm, accuracy, timeLeft, zone, showResult }: StatsBarProps) {
  const accentColor = zone === "learning" ? "#e2b714" : zone === "sharpening" ? "#4d9ddd" : "#e2b714";

  const getWpmColor = () => {
    if (wpm === 0) return "#646669";
    if (wpm < 40) return "#d1d0c5";
    if (wpm < 80) return accentColor;
    return accentColor;
  };

  const getAccuracyColor = () => {
    if (accuracy >= 98) return "#87c95f";
    if (accuracy >= 90) return "#e2b714";
    return "#ca4754";
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-8">
      {showResult && (
        <div
          style={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Award size={20} color={accentColor} />
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#d1d0c5",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Test complete!
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#646669",
                fontSize: "0.75rem",
              }}
            >
              {wpm >= 80
                ? "Excellent speed! You're in the top percentile."
                : wpm >= 50
                ? "Good speed! Keep practicing to break 80 WPM."
                : "Keep it up! Consistency will boost your score."}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 justify-center">
        <StatItem
          label="wpm"
          value={wpm}
          icon={<TrendingUp size={14} />}
          color={getWpmColor()}
          highlighted={wpm > 0}
        />
        <StatItem
          label="accuracy"
          value={accuracy}
          unit="%"
          icon={<Target size={14} />}
          color={getAccuracyColor()}
        />
        <StatItem
          label="time"
          value={timeLeft}
          unit="s"
          icon={<Clock size={14} />}
          color={timeLeft <= 10 && timeLeft > 0 ? "#ca4754" : "#d1d0c5"}
        />

        {/* Personal best placeholder */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            padding: "16px 24px",
            borderRadius: "12px",
            backgroundColor: "#1e1e1e",
            border: "1px solid #2a2a2a",
            minWidth: "100px",
          }}
        >
          <div style={{ color: "#3a3a3a" }}>
            <Award size={14} />
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#3a3a3a",
              lineHeight: 1,
            }}
          >
            —
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "#3a3a3a",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            best
          </div>
        </div>
      </div>

      {/* Subtle live graph preview */}
      <div className="mt-4 flex justify-center">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "3px",
            height: "32px",
            padding: "0 4px",
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const height = Math.max(4, Math.sin((i / 19) * Math.PI) * 28 + Math.random() * 8);
            const isActive = wpm > 0 && i <= Math.floor((wpm / 200) * 20);
            return (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: `${height}px`,
                  borderRadius: "2px",
                  backgroundColor: isActive ? accentColor : "#2a2a2a",
                  opacity: isActive ? 0.8 : 1,
                  transition: "background-color 0.3s",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
