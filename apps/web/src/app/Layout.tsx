import { Outlet, Link, useLocation } from "react-router";

export function Layout() {
  const location = useLocation();

  const links = [
    { to: "/practice", label: "PRACTICE" },
    { to: "/lessons", label: "LESSONS" },
    { to: "/multiplayer", label: "BATTLE" },
    { to: "/leaderboard", label: "RANK" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar — 099 brutalist */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "var(--header-h)",
          padding: "0 1rem",
          background: "var(--bg)",
          borderBottom: "1px solid var(--text-dim)",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-size-sm)",
            fontWeight: 600,
            color: "var(--accent)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          ПАЛЬЦЕБЛУД
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: "1.25rem" }}>
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--font-size-xs)",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "0.25rem 0",
                  borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
                  transition: "color var(--duration) var(--ease-out), border-color var(--duration) var(--ease-out)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <Link
          to="/profile"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-size-xs)",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          PROFILE
        </Link>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: "960px", width: "100%", margin: "0 auto", padding: "2rem 1rem" }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "1.5rem",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-xs)",
          color: "var(--text-dim)",
        }}
      >
        PALCEBLUD &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
