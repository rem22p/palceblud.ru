import { Outlet, Link, useLocation } from "react-router";
import { Keyboard, Trophy, Swords, GraduationCap, User } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { to: "/practice", icon: Keyboard, label: "Практика" },
    { to: "/lessons", icon: GraduationCap, label: "Обучение" },
    { to: "/multiplayer", icon: Swords, label: "Битва" },
    { to: "/leaderboard", icon: Trophy, label: "Рейтинг" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Liquid glass header */}
      <header className="sticky top-0 z-50 glass border-b border-white/[0.04]">
        <div
          className="max-w-5xl mx-auto px-5 flex items-center justify-between"
          style={{ height: "var(--header-h)" }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="text-base font-semibold tracking-tight transition-colors duration-200"
            style={{ fontFamily: "var(--font-sans)", color: "var(--accent)" }}
          >
            пальцеблуд
          </Link>

          {/* Nav */}
          <nav className="flex gap-1">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm transition-all duration-200
                    ${active
                      ? "bg-white/[0.06]"
                      : "text-text-muted hover:text-text hover:bg-white/[0.03]"
                    }`}
                  style={{
                    color: active ? "var(--accent)" : undefined,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile */}
          <Link
            to="/profile"
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-white/[0.04] transition-all duration-200"
          >
            <User size={17} strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="py-6 text-center text-xs transition-colors duration-200"
        style={{ color: "var(--text-dim)" }}
      >
        пальцеблуд &copy; {new Date().getFullYear()} &mdash; клавиатурный тренажёр
      </footer>
    </div>
  );
}
