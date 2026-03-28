import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { SocialLogin } from './SocialLogin';
import { User, LogIn } from 'lucide-react';
import { useSettingsStore } from '../../settings/store/settingsStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose
}) => {
  const accentColor = useSettingsStore((state) => state.accentColor);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          zIndex: 90,
          cursor: "pointer"
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          backgroundColor: "#2b2d31",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          fontFamily: "'JetBrains Mono', monospace",
          width: "90%",
          maxWidth: "800px",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: `linear-gradient(135deg, ${accentColor}14 0%, transparent 100%)`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: `${accentColor}26`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <User size={20} color={accentColor} />
            </div>
            <div>
              <h2 style={{
                fontSize: "1.2rem",
                color: "#e0e0e0",
                margin: 0,
                fontWeight: 600
              }}>
                Вход и регистрация
              </h2>
              <p style={{
                fontSize: "0.7rem",
                color: "rgba(224,224,224,0.4)",
                margin: "2px 0 0 0"
              }}>
                войдите или создайте аккаунт
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(224,224,224,0.4)",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.color = "rgba(224,224,224,0.4)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <User size={20} style={{ display: "none" }} />
            ✕
          </button>
        </div>

        {/* Две колонки */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 0
        }} className="md:grid">
          {/* Левая колонка - Вход */}
          <div style={{
            padding: "32px",
            borderRight: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: `${accentColor}26`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <LogIn size={20} color={accentColor} />
              </div>
              <h3 style={{
                fontSize: "1.1rem",
                color: "#e0e0e0",
                margin: 0,
                fontWeight: 600
              }}>
                Вход
              </h3>
            </div>

            <SocialLogin />

            <div style={{ margin: "24px 0" }}>
              <LoginForm onSwitch={() => {}} />
            </div>
          </div>

          {/* Правая колонка - Регистрация */}
          <div style={{
            padding: "32px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: `${accentColor}26`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <User size={20} color={accentColor} />
              </div>
              <h3 style={{
                fontSize: "1.1rem",
                color: "#e0e0e0",
                margin: 0,
                fontWeight: 600
              }}>
                Регистрация
              </h3>
            </div>

            <RegisterForm onSwitch={() => {}} />
          </div>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }`}</style>
    </>
  );
};
