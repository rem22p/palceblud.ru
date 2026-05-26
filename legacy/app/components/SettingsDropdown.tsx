import { useState } from "react";
import { X } from "lucide-react";

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export function SettingsDropdown({
  isOpen,
  onClose,
  accentColor,
}: SettingsDropdownProps) {
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [smoothCaret, setSmoothCaret] = useState(true);
  const [blindMode, setBlindMode] = useState(false);

  if (!isOpen) return null;

  const toggleStyle = (active: boolean) => ({
    width: "34px",
    height: "18px",
    borderRadius: "9px",
    backgroundColor: active ? accentColor : "rgba(255,255,255,0.08)",
    border: "none",
    cursor: "pointer",
    position: "relative" as const,
    transition: "background-color 0.2s",
    flexShrink: 0,
  });

  const knobStyle = (active: boolean) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    position: "absolute" as const,
    top: "3px",
    left: active ? "19px" : "3px",
    transition: "left 0.2s",
  });

  const options = [
    { label: "пунктуация", value: punctuation, set: setPunctuation },
    { label: "цифры", value: numbers, set: setNumbers },
    { label: "плавный курсор", value: smoothCaret, set: setSmoothCaret },
    { label: "слепой режим", value: blindMode, set: setBlindMode },
  ];

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 12px)",
          right: 0,
          zIndex: 50,
          backgroundColor: "#1e2028",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "6px",
          minWidth: "200px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px 8px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.68rem",
              color: "rgba(224,224,224,0.3)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            настройки
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(224,224,224,0.3)",
              cursor: "pointer",
              padding: "2px",
            }}
          >
            <X size={13} />
          </button>
        </div>

        {options.map((opt) => (
          <div
            key={opt.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 14px",
              borderRadius: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "rgba(224,224,224,0.5)",
              }}
            >
              {opt.label}
            </span>
            <button
              onClick={() => opt.set(!opt.value)}
              style={toggleStyle(opt.value)}
            >
              <div style={knobStyle(opt.value)} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
