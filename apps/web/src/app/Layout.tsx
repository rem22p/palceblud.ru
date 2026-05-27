import { Outlet, Link, useLocation } from "react-router";

export function Layout() {
  const location = useLocation();

  const links = [
    { to: "/practice", label: "Практика", num: "01" },
    { to: "/lessons", label: "Обучение", num: "02" },
    { to: "/battle", label: "Битва", num: "03" },
    { to: "/rank", label: "Рейтинг", num: "04" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-md)",
        position: "relative",
      }}
    >
      {/* Navigation — glass pill, top-right */}
      <nav
        className="glass"
        style={{
          position: "fixed",
          top: "var(--space-md)",
          right: "var(--space-md)",
          zIndex: 100,
          display: "flex",
          gap: "0.25rem",
          padding: "0.4rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        {/* Logo inside glass */}
        <Link
          to="/"
          style={{
            fontSize: "var(--font-size-body)",
            fontWeight: 600,
            color: "var(--accent)",
            textDecoration: "none",
            padding: "0.3rem 0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          пальцеблуд
        </Link>

        {/* Separator */}
        <span style={{ width: 1, background: "var(--glass-border)", margin: "0.25rem 0.25rem" }} />

        {/* Links */}
        {links.map(({ to, label, num }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: "var(--font-size-body)",
                color: active ? "var(--accent)" : "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.3rem 0.75rem",
                borderRadius: "12px",
                background: active ? "rgba(255,255,255,0.06)" : "transparent",
                transition: "all var(--duration-fast) var(--ease-out)",
              }}
            >
              <span style={{ color: "var(--text-muted)", marginRight: "0.35rem" }}>{num}</span>
              {label}
            </Link>
          );
        })}

        {/* Profile link — simple, always visible */}
        <Link
          to="/profile"
          style={{
            fontSize: "var(--font-size-body)",
            color: location.pathname === "/profile" ? "var(--accent)" : "var(--text-secondary)",
            textDecoration: "none",
            padding: "0.3rem 0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          PROFILE
        </Link>
      </nav>

      {/* Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </main>

      {/* Footer — bottom left, minimal */}
      <footer
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-label)",
          color: "var(--text-dim)",
          marginTop: "auto",
          paddingTop: "var(--space-lg)",
        }}
      >
        пальцеблуд &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
