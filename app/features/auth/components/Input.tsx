import { forwardRef } from 'react';
import { useSettingsStore } from '../../settings/store/settingsStore';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  const accentColor = useSettingsStore((state) => state.accentColor);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        display: "block",
        fontSize: "0.75rem",
        color: "rgba(224,224,224,0.5)",
        fontWeight: 500,
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        {label}
      </label>
      <input
        ref={ref}
        style={{
          width: "100%",
          padding: "12px 14px",
          backgroundColor: "#1e2028",
          border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: "8px",
          color: "#e0e0e0",
          fontSize: "0.875rem",
          fontFamily: "'JetBrains Mono', monospace",
          outline: "none",
          transition: "all 0.2s",
          boxSizing: "border-box"
        }}
        className="focus:border-[#D4AF37]"
        onFocus={(e) => {
          e.target.style.borderColor = accentColor;
          e.target.style.boxShadow = `0 0 0 2px ${accentColor}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.1)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <p style={{
          fontSize: "0.7rem",
          color: "#ef4444",
          margin: 0,
          fontFamily: "'JetBrains Mono', monospace"
        }}>{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
