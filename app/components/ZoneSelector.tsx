import { BookOpen, Zap, ChevronRight, CheckCircle, Clock, Target, GraduationCap } from "lucide-react";

type Zone = "learning" | "sharpening" | null;

interface ZoneSelectorProps {
  selectedZone: Zone;
  onSelectZone: (zone: "learning" | "sharpening") => void;
}

const learningFeatures = [
  { icon: <BookOpen size={13} />, text: "Structured lesson paths" },
  { icon: <CheckCircle size={13} />, text: "Progress tracking & XP" },
  { icon: <GraduationCap size={13} />, text: "Beginner to advanced courses" },
];

const sharpeningFeatures = [
  { icon: <Zap size={13} />, text: "Raw speed time trials" },
  { icon: <Clock size={13} />, text: "15s / 30s / 60s / 120s modes" },
  { icon: <Target size={13} />, text: "Competitive leaderboards" },
];

export function ZoneSelector({ selectedZone, onSelectZone }: ZoneSelectorProps) {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-10">
      {/* Label */}
      <div className="text-center mb-8">
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "#646669",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          choose your zone
        </p>
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#d1d0c5",
            fontSize: "1.8rem",
            fontWeight: 600,
            marginTop: "6px",
            letterSpacing: "-0.02em",
          }}
        >
          How do you want to type today?
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Learning Path */}
        <button
          onClick={() => onSelectZone("learning")}
          style={{
            background: selectedZone === "learning"
              ? "linear-gradient(135deg, rgba(226,183,20,0.12) 0%, rgba(226,183,20,0.05) 100%)"
              : "#1e1e1e",
            border: selectedZone === "learning"
              ? "1.5px solid rgba(226,183,20,0.5)"
              : "1.5px solid #2a2a2a",
            borderRadius: "16px",
            padding: "28px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.25s ease",
            position: "relative",
            overflow: "hidden",
          }}
          className="hover:!border-[rgba(226,183,20,0.4)] hover:!bg-[rgba(226,183,20,0.06)] group"
        >
          {/* Glow */}
          {selectedZone === "learning" && (
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(226,183,20,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Icon badge */}
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: selectedZone === "learning" ? "rgba(226,183,20,0.2)" : "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
              transition: "background-color 0.25s",
            }}
          >
            <BookOpen
              size={24}
              color={selectedZone === "learning" ? "#e2b714" : "#646669"}
              strokeWidth={1.8}
            />
          </div>

          <div className="flex items-start justify-between mb-2">
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                color: selectedZone === "learning" ? "#e2b714" : "#d1d0c5",
                fontSize: "1.25rem",
                fontWeight: 600,
                transition: "color 0.2s",
              }}
            >
              Learning Path
            </h3>
            <ChevronRight
              size={18}
              color={selectedZone === "learning" ? "#e2b714" : "#3a3a3a"}
              style={{ marginTop: "4px", transition: "color 0.2s" }}
            />
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#646669",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            Structured lessons and guided courses that take you from hunt-and-peck to 100+ WPM, step by step.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-2.5">
            {learningFeatures.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#4a4a4a",
                }}
              >
                <span style={{ color: selectedZone === "learning" ? "#e2b714" : "#3a3a3a" }}>
                  {f.icon}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.82rem",
                    color: "#7a7a7a",
                  }}
                >
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar preview */}
          <div className="mt-5">
            <div className="flex justify-between mb-1.5">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#646669",
                }}
              >
                lesson 4 / 12
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: selectedZone === "learning" ? "#e2b714" : "#646669",
                }}
              >
                33%
              </span>
            </div>
            <div
              style={{
                height: "4px",
                backgroundColor: "#2a2a2a",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "33%",
                  height: "100%",
                  backgroundColor: "#e2b714",
                  borderRadius: "99px",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* CTA button */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: selectedZone === "learning" ? "#e2b714" : "transparent",
              border: `1.5px solid ${selectedZone === "learning" ? "#e2b714" : "#2a2a2a"}`,
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                color: selectedZone === "learning" ? "#1a1a1a" : "#646669",
                fontWeight: 600,
              }}
            >
              {selectedZone === "learning" ? "selected ✓" : "start learning"}
            </span>
          </div>
        </button>

        {/* Sharpening Zone */}
        <button
          onClick={() => onSelectZone("sharpening")}
          style={{
            background: selectedZone === "sharpening"
              ? "linear-gradient(135deg, rgba(77,157,221,0.12) 0%, rgba(77,157,221,0.05) 100%)"
              : "#1e1e1e",
            border: selectedZone === "sharpening"
              ? "1.5px solid rgba(77,157,221,0.5)"
              : "1.5px solid #2a2a2a",
            borderRadius: "16px",
            padding: "28px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.25s ease",
            position: "relative",
            overflow: "hidden",
          }}
          className="hover:!border-[rgba(77,157,221,0.4)] hover:!bg-[rgba(77,157,221,0.06)] group"
        >
          {/* Glow */}
          {selectedZone === "sharpening" && (
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(77,157,221,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Icon badge */}
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: selectedZone === "sharpening" ? "rgba(77,157,221,0.2)" : "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
              transition: "background-color 0.25s",
            }}
          >
            <Zap
              size={24}
              color={selectedZone === "sharpening" ? "#4d9ddd" : "#646669"}
              strokeWidth={1.8}
            />
          </div>

          <div className="flex items-start justify-between mb-2">
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                color: selectedZone === "sharpening" ? "#4d9ddd" : "#d1d0c5",
                fontSize: "1.25rem",
                fontWeight: 600,
                transition: "color 0.2s",
              }}
            >
              Sharpening Zone
            </h3>
            <ChevronRight
              size={18}
              color={selectedZone === "sharpening" ? "#4d9ddd" : "#3a3a3a"}
              style={{ marginTop: "4px", transition: "color 0.2s" }}
            />
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "#646669",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            No limits, no hand-holding. Pure speed practice with time trials, custom word lists, and competitive rankings.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-2.5">
            {sharpeningFeatures.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: selectedZone === "sharpening" ? "#4d9ddd" : "#3a3a3a" }}>
                  {f.icon}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.82rem",
                    color: "#7a7a7a",
                  }}
                >
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          {/* Speed display */}
          <div
            className="mt-5 flex items-center gap-3"
            style={{ padding: "12px 14px", backgroundColor: "#1a1a1a", borderRadius: "10px" }}
          >
            <div className="text-center">
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.5rem",
                  color: selectedZone === "sharpening" ? "#4d9ddd" : "#646669",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                142
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#646669" }}>
                wpm
              </div>
            </div>
            <div
              style={{ width: "1px", height: "32px", backgroundColor: "#2a2a2a" }}
            />
            <div className="text-center">
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.5rem",
                  color: "#d1d0c5",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                98%
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#646669" }}>
                acc
              </div>
            </div>
            <div
              style={{ width: "1px", height: "32px", backgroundColor: "#2a2a2a" }}
            />
            <div className="text-center">
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.5rem",
                  color: "#d1d0c5",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                60s
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#646669" }}>
                mode
              </div>
            </div>
          </div>

          {/* CTA button */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: selectedZone === "sharpening" ? "#4d9ddd" : "transparent",
              border: `1.5px solid ${selectedZone === "sharpening" ? "#4d9ddd" : "#2a2a2a"}`,
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                color: selectedZone === "sharpening" ? "#1a1a1a" : "#646669",
                fontWeight: 600,
              }}
            >
              {selectedZone === "sharpening" ? "selected ✓" : "start sharpening"}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
