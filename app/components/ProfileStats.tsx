import { TrendingUp, Flame, Star, Activity } from "lucide-react";

export function ProfileStats() {
  const recentResults = [
    { wpm: 87, acc: 97, mode: "60s", date: "today" },
    { wpm: 92, acc: 95, mode: "60s", date: "today" },
    { wpm: 78, acc: 99, mode: "30s", date: "yesterday" },
    { wpm: 105, acc: 93, mode: "120s", date: "yesterday" },
    { wpm: 83, acc: 98, mode: "60s", date: "mar 3" },
  ];

  const wpmHistory = [72, 75, 78, 80, 82, 87, 85, 90, 88, 92, 87, 95, 92, 98, 94, 100, 97, 102, 99, 105];
  const maxWpm = Math.max(...wpmHistory);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 pb-10">
      <div
        style={{
          backgroundColor: "#1e1e1e",
          border: "1px solid #2a2a2a",
          borderRadius: "14px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity size={16} color="#646669" />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "#646669",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              your progress
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Flame size={14} color="#e2b714" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  color: "#e2b714",
                }}
              >
                7 day streak
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WPM Graph */}
          <div
            className="md:col-span-2"
            style={{
              backgroundColor: "#181818",
              borderRadius: "10px",
              padding: "18px",
              border: "1px solid #222",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#646669", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  wpm over time
                </p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.4rem", color: "#d1d0c5", fontWeight: 700, marginTop: "2px" }}>
                  105 <span style={{ fontSize: "0.7rem", color: "#646669", fontWeight: 400 }}>pb</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} color="#87c95f" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#87c95f" }}>+18 wpm</span>
              </div>
            </div>

            {/* Bar chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
              {wpmHistory.map((wpm, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${(wpm / maxWpm) * 100}%`,
                    borderRadius: "3px 3px 0 0",
                    backgroundColor: i === wpmHistory.length - 1
                      ? "#e2b714"
                      : i >= wpmHistory.length - 5
                      ? "rgba(226,183,20,0.4)"
                      : "#2a2a2a",
                    transition: "height 0.3s, background-color 0.3s",
                  }}
                  title={`${wpm} WPM`}
                />
              ))}
            </div>

            {/* X-axis */}
            <div className="flex justify-between mt-2">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#3a3a3a" }}>20 tests ago</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#3a3a3a" }}>now</span>
            </div>
          </div>

          {/* Recent results */}
          <div
            style={{
              backgroundColor: "#181818",
              borderRadius: "10px",
              padding: "18px",
              border: "1px solid #222",
            }}
          >
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#646669", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>
              recent
            </p>
            <div className="flex flex-col gap-2">
              {recentResults.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    backgroundColor: i === 0 ? "#1e1e1e" : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {i === 0 && <Star size={11} color="#e2b714" fill="#e2b714" />}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#d1d0c5", fontWeight: 600 }}>
                      {r.wpm}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#646669" }}>
                      wpm
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: r.acc >= 98 ? "#87c95f" : "#d1d0c5" }}>
                      {r.acc}%
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#3a3a3a", backgroundColor: "#2a2a2a", padding: "1px 5px", borderRadius: "4px" }}>
                      {r.mode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
