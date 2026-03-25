import { useNavigate } from "react-router";
import { X, Type, Languages, Palette, MousePointer, Volume2, Check } from "lucide-react";
import { useSettingsStore, FONTS, THEMES, CursorStyle } from "../features/settings/store/settingsStore";

const ACCENT_COLOR = "#60a5fa"; // голубой акцент

export function SettingsPage() {
  const navigate = useNavigate();
  const fontSize = useSettingsStore((state) => state.fontSize);
  const setFontSize = useSettingsStore((state) => state.setFontSize);
  const fontFamily = useSettingsStore((state) => state.fontFamily);
  const setFontFamily = useSettingsStore((state) => state.setFontFamily);
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const accentColor = useSettingsStore((state) => state.accentColor);
  const setAccentColor = useSettingsStore((state) => state.setAccentColor);
  const cursorStyle = useSettingsStore((state) => state.cursorStyle);
  const setCursorStyle = useSettingsStore((state) => state.setCursorStyle);
  const cursorBlink = useSettingsStore((state) => state.cursorBlink);
  const setCursorBlink = useSettingsStore((state) => state.setCursorBlink);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const soundVolume = useSettingsStore((state) => state.soundVolume);
  const setSoundVolume = useSettingsStore((state) => state.setSoundVolume);

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
            Настройки
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
        {/* Информация */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #2a2d31, #2f3237)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #3a3d40",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(96, 165, 250, 0.11))`,
                  border: `1px solid rgba(96, 165, 250, 0.44)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Type size={16} color={ACCENT_COLOR} />
              </div>
              <div>
                <p style={{ fontSize: "0.85rem", color: "rgba(224,224,224,0.7)", margin: 0 }}>
                  Размер: <span style={{ color: ACCENT_COLOR, fontWeight: 600 }}>{fontSize}px</span> • Шрифт: <span style={{ color: ACCENT_COLOR, fontWeight: 600 }}>{fontFamily}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Размер шрифта */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #2a2d31, #2f3237)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #3a3d40",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(96, 165, 250, 0.11))`,
                  border: `1px solid rgba(96, 165, 250, 0.44)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 700, color: ACCENT_COLOR }}>Aa</span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.95rem",
                    color: "#e0e0e0",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  размер шрифта
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "#5a5a5a",
                    marginTop: "3px",
                  }}
                >
                  настройка отображения текста
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "#2a2d31",
                  border: "1px solid #3a3d40",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  color: "#8a8d91",
                  flexShrink: 0,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.borderColor = ACCENT_COLOR;
                  e.currentTarget.style.color = ACCENT_COLOR;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.borderColor = "#3a3d40";
                  e.currentTarget.style.color = "#8a8d91";
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", fontWeight: 300, lineHeight: 1 }}>−</span>
              </button>

              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    background: "rgba(96, 165, 250, 0.15)",
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                  }}
                />
                <style>{`
                  input[type="range"] {
                    background: rgba(96, 165, 250, 0.15) !important;
                  }
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: ${ACCENT_COLOR};
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    transition: transform 0.15s;
                  }
                  input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: ${ACCENT_COLOR};
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  }
                `}</style>
              </div>

              <div
                style={{
                  minWidth: "64px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#2a2d31",
                  border: `1px solid #3a3d40`,
                  textAlign: "center",
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", fontWeight: 700, color: ACCENT_COLOR }}>
                  {fontSize}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#8a8d91", marginLeft: "2px" }}>px</span>
              </div>

              <button
                onClick={() => setFontSize(Math.min(72, fontSize + 1))}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "#2a2d31",
                  border: "1px solid #3a3d40",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  color: "#8a8d91",
                  flexShrink: 0,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.borderColor = ACCENT_COLOR;
                  e.currentTarget.style.color = ACCENT_COLOR;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.borderColor = "#3a3d40";
                  e.currentTarget.style.color = "#8a8d91";
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.2rem", fontWeight: 300, lineHeight: 1 }}>+</span>
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              {[12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: fontSize === size ? "rgba(96, 165, 250, 0.22)" : "transparent",
                    border: fontSize === size ? "1px solid #60a5fa" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    minWidth: "42px",
                  }}
                  onMouseEnter={(e: any) => {
                    if (fontSize !== size) {
                      e.currentTarget.style.backgroundColor = "#2a2a2a";
                      e.currentTarget.style.borderColor = "#3a3a3a";
                    }
                  }}
                  onMouseLeave={(e: any) => {
                    if (fontSize !== size) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: fontSize === size ? ACCENT_COLOR : "#646669", fontWeight: fontSize === size ? 600 : 400 }}>
                    {size}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Шрифт */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #2a2d31, #2f3237)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #3a3d40",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(96, 165, 250, 0.11))`,
                  border: `1px solid rgba(96, 165, 250, 0.44)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Languages size={18} strokeWidth={2.5} color={ACCENT_COLOR} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.95rem",
                    color: "#e0e0e0",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  шрифт
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "#5a5a5a",
                    marginTop: "3px",
                  }}
                >
                  выбор моноширинного шрифта
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {FONTS.map((font) => (
                <button
                  key={font}
                  onClick={() => setFontFamily(font)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    backgroundColor: fontFamily === font ? "rgba(96, 165, 250, 0.15)" : "transparent",
                    border: fontFamily === font ? `1px solid ${ACCENT_COLOR}` : "1px solid #3a3d40",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e: any) => {
                    if (fontFamily !== font) {
                      e.currentTarget.style.backgroundColor = "#2a2d31";
                      e.currentTarget.style.borderColor = "#4a4d50";
                    }
                  }}
                  onMouseLeave={(e: any) => {
                    if (fontFamily !== font) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#3a3d40";
                    }
                  }}
                >
                  <span style={{ 
                    fontFamily: font, 
                    fontSize: "0.9rem", 
                    color: fontFamily === font ? ACCENT_COLOR : "#d1d0c5",
                    fontWeight: fontFamily === font ? 600 : 400,
                  }}>
                    {font}
                  </span>
                  {fontFamily === font && (
                    <span style={{
                      marginLeft: "8px",
                      color: ACCENT_COLOR,
                      fontSize: "0.75rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Тема оформления */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #2a2d31, #2f3237)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #3a3d40",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(96, 165, 250, 0.11))`,
                  border: `1px solid rgba(96, 165, 250, 0.44)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Palette size={18} strokeWidth={2.5} color={ACCENT_COLOR} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.95rem",
                    color: "#e0e0e0",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  тема
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "#5a5a5a",
                    marginTop: "3px",
                  }}
                >
                  цвет акцента интерфейса
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name, t.accent)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    backgroundColor: theme === t.name ? "rgba(96, 165, 250, 0.15)" : "transparent",
                    border: theme === t.name ? `1px solid ${t.accent}` : "1px solid #3a3d40",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e: any) => {
                    if (theme !== t.name) {
                      e.currentTarget.style.backgroundColor = "#2a2d31";
                      e.currentTarget.style.borderColor = "#4a4d50";
                    }
                  }}
                  onMouseLeave={(e: any) => {
                    if (theme !== t.name) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#3a3d40";
                    }
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: t.accent,
                      border: "2px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.75rem",
                    color: theme === t.name ? t.accent : "#8a8d91",
                    fontWeight: theme === t.name ? 600 : 400,
                  }}>
                    {t.label}
                  </span>
                  {theme === t.name && (
                    <Check size={14} color={t.accent} strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>

            {/* Кастомный цвет */}
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #3a3d40" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                  color: "#8a8d91",
                }}>
                  свой цвет:
                </span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.85rem",
                  color: accentColor,
                  fontWeight: 600,
                }}>
                  {accentColor}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Курсор */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #2a2d31, #2f3237)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #3a3d40",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(96, 165, 250, 0.11))`,
                  border: `1px solid rgba(96, 165, 250, 0.44)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MousePointer size={18} strokeWidth={2.5} color={ACCENT_COLOR} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.95rem",
                    color: "#e0e0e0",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  курсор
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "#5a5a5a",
                    marginTop: "3px",
                  }}
                >
                  стиль и поведение курсора
                </div>
              </div>
            </div>

            {/* Стиль курсора */}
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "#8a8d91",
                marginBottom: "10px",
                display: "block",
              }}>
                стиль:
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                {(["line", "block", "underline"] as CursorStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => setCursorStyle(style)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: cursorStyle === style ? "rgba(96, 165, 250, 0.15)" : "transparent",
                      border: cursorStyle === style ? `1px solid ${accentColor}` : "1px solid #3a3d40",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e: any) => {
                      if (cursorStyle !== style) {
                        e.currentTarget.style.backgroundColor = "#2a2d31";
                        e.currentTarget.style.borderColor = "#4a4d50";
                      }
                    }}
                    onMouseLeave={(e: any) => {
                      if (cursorStyle !== style) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor = "#3a3d40";
                      }
                    }}
                  >
                    <div style={{
                      width: "32px",
                      height: "20px",
                      backgroundColor: "#3a3d40",
                      borderRadius: "4px",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {style === "line" && (
                        <div style={{ width: "2px", height: "16px", backgroundColor: accentColor }} />
                      )}
                      {style === "block" && (
                        <div style={{ width: "10px", height: "16px", backgroundColor: accentColor }} />
                      )}
                      {style === "underline" && (
                        <div style={{ width: "16px", height: "2px", backgroundColor: accentColor, position: "absolute", bottom: "2px" }} />
                      )}
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: cursorStyle === style ? accentColor : "#8a8d91",
                      textTransform: "uppercase",
                    }}>
                      {style === "line" ? "линия" : style === "block" ? "блок" : "подчёрк"}
                    </span>
                    {cursorStyle === style && (
                      <Check size={12} color={accentColor} strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Мигание курсора */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "#8a8d91",
              }}>
                мигание курсора
              </span>
              <button
                onClick={() => setCursorBlink(!cursorBlink)}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  backgroundColor: cursorBlink ? accentColor : "#3a3d40",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background-color 0.2s",
                }}
              >
                <div style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: cursorBlink ? "23px" : "3px",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>
          </div>
        </section>

        {/* Звук */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              background: "linear-gradient(145deg, #2a2d31, #2f3237)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #3a3d40",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(96, 165, 250, 0.11))`,
                  border: `1px solid rgba(96, 165, 250, 0.44)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Volume2 size={18} strokeWidth={2.5} color={ACCENT_COLOR} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.95rem",
                    color: "#e0e0e0",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  звук
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "#5a5a5a",
                    marginTop: "3px",
                  }}
                >
                  звуки клавиш и событий
                </div>
              </div>
            </div>

            {/* Вкл/выкл звук */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "#8a8d91",
              }}>
                включить звуки
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  backgroundColor: soundEnabled ? accentColor : "#3a3d40",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background-color 0.2s",
                }}
              >
                <div style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: soundEnabled ? "23px" : "3px",
                  transition: "left 0.2s",
                }} />
              </button>
            </div>

            {/* Громкость */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  color: "#8a8d91",
                }}>
                  громкость
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                  color: accentColor,
                  fontWeight: 600,
                }}>
                  {Math.round(soundVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={soundVolume}
                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "3px",
                  background: "#3a3d40",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  -webkit-appearance: none;
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: ${accentColor};
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  transition: transform 0.15s;
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                }
                input[type="range"]::-moz-range-thumb {
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: ${accentColor};
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                }
              `}</style>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
