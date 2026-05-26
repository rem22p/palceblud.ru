import { Outlet, Link, useLocation } from "react-router";
import { Keyboard, Trophy, User, Swords, GraduationCap } from "lucide-react";

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-accent font-bold text-lg tracking-tight">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors
                    ${active ? "text-accent bg-accent/10" : "text-text-muted hover:text-text hover:bg-white/5"}`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            to="/profile"
            className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-white/5 transition-colors"
          >
            <User size={18} />
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-text-muted">
        пальцеблуд &copy; {new Date().getFullYear()} &mdash; клавиатурный тренажёр
      </footer>
    </div>
  );
}
