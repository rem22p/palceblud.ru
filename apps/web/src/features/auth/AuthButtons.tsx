import { getOAuthUrl } from "./authStore";

export function AuthButtons() {
  return (
    <div style={{ display: "flex", gap: "var(--space-sm)", fontFamily: "var(--font-mono)" }}>
      <a
        href={getOAuthUrl("github")}
        style={{
          fontSize: "var(--font-size-body)",
          color: "var(--text-secondary)",
          textDecoration: "none",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          padding: "0.35rem 0.85rem",
          borderRadius: "var(--radius-sm, 10px)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "all var(--duration-fast) var(--ease-out)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color = "var(--text-secondary)";
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
          borderRadius: "var(--radius-sm, 10px)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "all var(--duration-fast) var(--ease-out)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
      >
        Google
      </a>
    </div>
  );
}
