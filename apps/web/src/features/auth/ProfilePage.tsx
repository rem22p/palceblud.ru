import { useState } from "react";
import { useAuthStore } from "./authStore";
import { AuthButtons } from "./AuthButtons";

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [username, setUsername] = useState(user?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? "");
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "var(--space-xl)" }}>
        <span className="label">loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-md)",
          paddingTop: "var(--space-xl)",
        }}
      >
        <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
          войдите чтобы продолжить
        </p>
        <AuthButtons />
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:8000/api/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username || null, image: avatarUrl || null }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // API not available — save locally
      useAuthStore.setState({
        user: { ...user, username: username || null, image: avatarUrl || null },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        paddingTop: "var(--space-xl)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="label">профиль</p>
          <h1
            className="display"
            style={{ fontSize: "var(--font-size-large)", marginTop: "0.25rem" }}
          >
            {user.username || user.name}
          </h1>
        </div>
        <button
          onClick={logout}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-size-label)",
            color: "var(--text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          выйти
        </button>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--bg-elevated)",
            flexShrink: 0,
          }}
        >
          {(avatarUrl || user.image) ? (
            <img
              src={(avatarUrl || user.image) ?? ""}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: "var(--font-size-large)",
                color: "var(--text-muted)",
              }}
            >
              {(user.username || user.name)[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label
            className="label"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            аватар (URL, можно GIF)
          </label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            style={{
              width: "100%",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-size-body)",
              color: "var(--text)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "0.5rem 0.75rem",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Username */}
      <div>
        <label className="label" style={{ display: "block", marginBottom: "0.25rem" }}>
          никнейм
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={user.name}
          maxLength={24}
          style={{
            width: "100%",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-size-body)",
            color: "var(--text)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "0.5rem 0.75rem",
            outline: "none",
          }}
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-body)",
          color: saved ? "var(--success)" : "var(--accent)",
          background: "none",
          border: `1px solid ${saved ? "var(--success)" : "var(--accent)"}`,
          padding: "0.5rem 1.5rem",
          borderRadius: "8px",
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          alignSelf: "flex-start",
          transition: "all var(--duration-fast) var(--ease-out)",
        }}
      >
        {saved ? "сохранено" : "сохранить"}
      </button>
    </div>
  );
}
