export interface WordCountOption {
  value: number | "infinity";
  label: string;
}

export const WORD_COUNT_OPTIONS: WordCountOption[] = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: "infinity", label: "∞" },
];

interface WordCountSelectorProps {
  selected: number | "infinity";
  onChange: (value: number | "infinity") => void;
  disabled?: boolean;
}

export function WordCountSelector({
  selected,
  onChange,
  disabled = false,
}: WordCountSelectorProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
      }}
    >
      {WORD_COUNT_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        
        return (
          <button
            key={String(option.value)}
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            style={{
              padding: "8px 20px",
              fontSize: "0.95rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? "#ffffff" : "#888888",
              backgroundColor: isSelected ? "#3a3a3a" : "transparent",
              border: "2px solid " + (isSelected ? "#e2b714" : "transparent"),
              borderRadius: "6px",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              opacity: disabled ? 0.5 : 1,
              minWidth: "60px",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}