import { useState } from "react";
import { getOAuthUrl, useAuthStore } from "./authStore";

const API = "";

export function AuthButtons() {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const handleEmailAuth = async () => {
    setError("");
    try {
      const endpoint = isRegister
        ? `${API}/api/auth/sign-up/email`
        : `${API}/api/auth/sign-in/email`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Ошибка");
        return;
      }

      await fetchUser();
      setShowEmail(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch {
      setError("Сервер недоступен");
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-mono)" }}>
      {!showEmail ? (
        <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
          <a
            href={getOAuthUrl("github")}
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              padding: "0.35rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "all var(--duration-fast) var(--ease-out)",
            }}
          >
            GitHub
          </a>
          <a
            href={getOAuthUrl("google")}
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              padding: "0.35rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "all var(--duration-fast) var(--ease-out)",
            }}
          >
            Google
          </a>
          <button
            onClick={() => setShowEmail(true)}
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              padding: "0.35rem 0.85rem",
            }}
          >
            Email
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            minWidth: "240px",
          }}
        >
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
            <button
              onClick={() => setIsRegister(false)}
              style={{
                fontSize: "var(--font-size-body)",
                color: !isRegister ? "var(--accent)" : "var(--text-muted)",
                background: "none",
                border: "none",
                borderBottom: !isRegister ? "1px solid var(--accent)" : "1px solid transparent",
                cursor: "pointer",
                textTransform: "uppercase",
                padding: "0.25rem 0.5rem",
              }}
            >
              вход
            </button>
            <button
              onClick={() => setIsRegister(true)}
              style={{
                fontSize: "var(--font-size-body)",
                color: isRegister ? "var(--accent)" : "var(--text-muted)",
                background: "none",
                border: "none",
                borderBottom: isRegister ? "1px solid var(--accent)" : "1px solid transparent",
                cursor: "pointer",
                textTransform: "uppercase",
                padding: "0.25rem 0.5rem",
              }}
            >
              регистрация
            </button>
          </div>

          {isRegister && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="имя"
              style={inputStyle}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="пароль"
            onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
            style={inputStyle}
          />

          {error && (
            <span style={{ fontSize: "var(--font-size-label)", color: "var(--error)" }}>
              {error}
            </span>
          )}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={handleEmailAuth} style={submitStyle}>
              {isRegister ? "создать" : "войти"}
            </button>
            <button onClick={() => setShowEmail(false)} style={cancelStyle}>
              отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-size-body)",
  color: "var(--text)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "0.4rem 0.75rem",
  outline: "none",
  width: "100%",
};

const submitStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-size-body)",
  color: "var(--accent)",
  background: "none",
  border: "1px solid var(--accent)",
  borderRadius: "8px",
  padding: "0.4rem 1rem",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const cancelStyle: React.CSSProperties = {
  ...submitStyle,
  color: "var(--text-muted)",
  border: "1px solid var(--text-dim)",
};
