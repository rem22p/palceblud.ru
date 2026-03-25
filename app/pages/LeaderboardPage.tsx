import { useNavigate } from "react-router";
import { X, Trophy, Medal, Award, Star } from "lucide-react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "SpeedMaster", wpm: 125, accuracy: 99.8, tests: 1247 },
  { rank: 2, name: "KeyboardKing", wpm: 118, accuracy: 98.5, tests: 892 },
  { rank: 3, name: "TypeNinja", wpm: 112, accuracy: 99.1, tests: 1056 },
  { rank: 4, name: "FingerDancer", wpm: 108, accuracy: 97.9, tests: 743 },
  { rank: 5, name: "QuickKeys", wpm: 105, accuracy: 98.2, tests: 621 },
  { rank: 6, name: "VelocityPro", wpm: 102, accuracy: 97.5, tests: 534 },
  { rank: 7, name: "TypewriterX", wpm: 99, accuracy: 98.8, tests: 489 },
  { rank: 8, name: "KeyStrike", wpm: 96, accuracy: 97.2, tests: 412 },
  { rank: 9, name: "FastFingers", wpm: 94, accuracy: 96.8, tests: 378 },
  { rank: 10, name: "TypeRunner", wpm: 91, accuracy: 97.4, tests: 345 },
];

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export function LeaderboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#2b2d31",
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      {/* Header */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#2b2d31",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(224,224,224,0.5)",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.color = "rgba(224,224,224,0.5)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={20} />
          </button>
          <h1 style={{
            fontSize: "1.2rem",
            color: "#e0e0e0",
            margin: 0,
            fontWeight: 600,
            letterSpacing: "-0.02em"
          }}>
            Рейтинг
          </h1>
        </div>
      </div>

      {/* Контент */}
      <div style={{
        paddingTop: "100px",
        paddingBottom: "60px",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "100px 40px 60px"
      }}>
        {/* Топ 3 */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "24px",
          marginBottom: "48px",
          padding: "32px",
          backgroundColor: "rgba(255,255,255,0.02)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)"
        }}>
          {/* 2 место */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            order: 1
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(192, 192, 192, 0.15)",
              border: "2px solid #C0C0C0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Medal size={32} color="#C0C0C0" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", color: "#e0e0e0", fontWeight: 600 }}>{LEADERBOARD_DATA[1].name}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(224,224,224,0.4)" }}>{LEADERBOARD_DATA[1].wpm} WPM</div>
            </div>
          </div>

          {/* 1 место */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            order: 0
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 215, 0, 0.15)",
              border: "2px solid #FFD700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)"
            }}>
              <Trophy size={40} color="#FFD700" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1rem", color: "#FFD700", fontWeight: 700 }}>{LEADERBOARD_DATA[0].name}</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(224,224,224,0.5)" }}>{LEADERBOARD_DATA[0].wpm} WPM</div>
            </div>
          </div>

          {/* 3 место */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            order: 2
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(205, 127, 50, 0.15)",
              border: "2px solid #CD7F32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Award size={32} color="#CD7F32" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.9rem", color: "#e0e0e0", fontWeight: 600 }}>{LEADERBOARD_DATA[2].name}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(224,224,224,0.4)" }}>{LEADERBOARD_DATA[2].wpm} WPM</div>
            </div>
          </div>
        </div>

        {/* Таблица */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {LEADERBOARD_DATA.map((player, index) => {
            const isTopThree = index < 3;
            return (
              <div
                key={player.rank}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 100px 100px 80px",
                  gap: "16px",
                  alignItems: "center",
                  padding: "16px 20px",
                  backgroundColor: isTopThree ? "rgba(255,255,255,0.02)" : "transparent",
                  border: isTopThree ? "1px solid rgba(255,255,255,0.06)" : "none",
                  borderRadius: "12px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e: any) => {
                  if (!isTopThree) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e: any) => {
                  if (!isTopThree) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {/* Ранг */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: index < 3 ? MEDAL_COLORS[index] : "rgba(224,224,224,0.4)"
                }}>
                  {index < 3 ? <Medal size={20} color={MEDAL_COLORS[index]} /> : `#${player.rank}`}
                </div>

                {/* Имя */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: index < 3 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {index < 3 ? <Star size={18} color={MEDAL_COLORS[index]} /> : <span style={{ fontSize: "0.8rem", color: "rgba(224,224,224,0.4)" }}>{player.name[0]}</span>}
                  </div>
                  <span style={{
                    fontSize: "0.95rem",
                    color: "rgba(224,224,224,0.8)",
                    fontWeight: isTopThree ? 600 : 400
                  }}>
                    {player.name}
                  </span>
                </div>

                {/* WPM */}
                <div style={{
                  fontSize: "0.9rem",
                  color: "rgba(224,224,224,0.6)",
                  textAlign: "center",
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {player.wpm} WPM
                </div>

                {/* Точность */}
                <div style={{
                  fontSize: "0.9rem",
                  color: player.accuracy >= 99 ? "#34d399" : player.accuracy >= 97 ? "#60a5fa" : "rgba(224,224,224,0.5)",
                  textAlign: "center",
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {player.accuracy}%
                </div>

                {/* Тесты */}
                <div style={{
                  fontSize: "0.8rem",
                  color: "rgba(224,224,224,0.3)",
                  textAlign: "right",
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {player.tests.toLocaleString()} тестов
                </div>
              </div>
            );
          })}
        </div>

        {/* Сообщение */}
        <div style={{
          marginTop: "32px",
          padding: "20px 24px",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(224,224,224,0.5)", margin: 0 }}>
            Пройди тест в режиме практики, чтобы попасть в рейтинг
          </p>
        </div>
      </div>
    </div>
  );
}
