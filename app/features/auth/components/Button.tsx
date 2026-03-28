import { useSettingsStore } from '../../settings/store/settingsStore';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const accentColor = useSettingsStore((state) => state.accentColor);

  const variants = {
    primary: {
      background: accentColor,
      color: "#1a1a1a",
      hoverBackground: `${accentColor}CC`
    },
    secondary: {
      background: "#3a3a3a",
      color: "#e0e0e0",
      hoverBackground: "#4a4a4a"
    },
    outline: {
      background: "transparent",
      color: "rgba(224,224,224,0.6)",
      border: `1px solid ${accentColor}4D`,
      hoverBackground: `${accentColor}1F`,
      hoverColor: accentColor
    }
  } as const;

  const currentVariant = variants[variant];

  return (
    <button
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "0.875rem",
        fontFamily: "'JetBrains Mono', monospace",
        border: variant === 'outline' ? (currentVariant as typeof variants.outline).border : 'none',
        backgroundColor: currentVariant.background,
        color: currentVariant.color,
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || isLoading) ? 0.5 : 1,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
      }}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = currentVariant.hoverBackground;
          if (variant === 'outline' && 'hoverColor' in currentVariant) {
            e.currentTarget.style.color = currentVariant.hoverColor;
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = currentVariant.background;
        e.currentTarget.style.color = currentVariant.color;
      }}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin" style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25, cx: 12, cy: 12, r: 10, stroke: "currentColor", strokeWidth: 4 }} fill="none" />
          <path style={{ opacity: 0.75, fill: "currentColor" }} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
