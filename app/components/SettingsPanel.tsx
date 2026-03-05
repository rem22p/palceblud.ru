import { X, Palette, Type, Keyboard, Monitor, Volume2 } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = [
  { name: "default dark", bg: "#1a1a1a", accent: "#e2b714" },
  { name: "midnight", bg: "#0d1117", accent: "#58a6ff" },
  { name: "forest", bg: "#141d14", accent: "#7ec8a4" },
  { name: "rose", bg: "#1a1015", accent: "#f28b82" },
  { name: "ocean", bg: "#0d1b2a", accent: "#56cfe1" },
];

const FONTS = ["JetBrains Mono", "Roboto Mono", "Fira Code", "Source Code Pro", "Courier New"];

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  accent: string;
}

function Toggle({ checked, onChange, accent }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      style={{
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        backgroundColor: checked ? accent : "#2a2a2a",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          top: "3px",
          left: checked ? "19px" : "3px",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

import { useState } from "react";

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);
  const [settings, setSettings] = useState({
    soundFeedback: false,
    showLiveWPM: true,
    showKeyboard: false,
    smoothCaret: true,
    blindMode: false,
    quickRestart: true,
  });

  if (!isOpen) return null;

  const accent = THEMES[selectedTheme].accent;

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: "360px",
          maxWidth: "90vw",
          height: "100%",
          backgroundColor: "#181818",
          borderLeft: "1px solid #2a2a2a",
          overflowY: "auto",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: "#181818",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#d1d0c5",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            settings
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#646669",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
            }}
            className="hover:!text-[#d1d0c5] hover:!bg-[#2a2a2a]"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Theme section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={14} color="#646669" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#646669",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                theme
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {THEMES.map((theme, i) => (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: selectedTheme === i ? "#222" : "transparent",
                    border: selectedTheme === i ? "1px solid #2a2a2a" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: theme.bg, border: "1px solid #3a3a3a" }} />
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: theme.accent }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      color: selectedTheme === i ? "#d1d0c5" : "#646669",
                    }}
                  >
                    {theme.name}
                  </span>
                  {selectedTheme === i && (
                    <span style={{ marginLeft: "auto", color: accent, fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Type size={14} color="#646669" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#646669",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                font family
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {FONTS.map((font, i) => (
                <button
                  key={font}
                  onClick={() => setSelectedFont(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 14px",
                    borderRadius: "8px",
                    backgroundColor: selectedFont === i ? "#222" : "transparent",
                    border: selectedFont === i ? "1px solid #2a2a2a" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: `'${font}', monospace`,
                      fontSize: "0.82rem",
                      color: selectedFont === i ? "#d1d0c5" : "#646669",
                    }}
                  >
                    {font}
                  </span>
                  {selectedFont === i && (
                    <span style={{ color: accent, fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Keyboard size={14} color="#646669" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#646669",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                behavior
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {[
                { key: "soundFeedback" as const, label: "sound feedback", icon: <Volume2 size={13} /> },
                { key: "showLiveWPM" as const, label: "show live wpm", icon: <Monitor size={13} /> },
                { key: "showKeyboard" as const, label: "show keyboard", icon: <Keyboard size={13} /> },
                { key: "smoothCaret" as const, label: "smooth caret", icon: null },
                { key: "blindMode" as const, label: "blind mode", icon: null },
                { key: "quickRestart" as const, label: "quick restart", icon: null },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "8px",
                  }}
                  className="hover:bg-[#222]"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <span style={{ color: "#3a3a3a" }}>{item.icon}</span>}
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.78rem",
                        color: "#646669",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <Toggle
                    checked={settings[item.key]}
                    onChange={() => toggle(item.key)}
                    accent={accent}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
