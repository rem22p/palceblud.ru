export const TIME_OPTIONS: number[] = [15, 30, 60, 120];

interface TimeSelectorProps {
  selected: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function TimeSelector({
  selected,
  onChange,
  disabled = false,
}: TimeSelectorProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
      }}
    >
      {TIME_OPTIONS.map((seconds) => {
        const isSelected = selected === seconds;
        
        return (
          <button
            key={seconds}
            onClick={() => !disabled && onChange(seconds)}
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
            {seconds}
          </button>
        );
      })}
    </div>
  );
}