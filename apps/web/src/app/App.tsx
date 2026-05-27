import { BrowserRouter, Routes, Route } from "react-router";
import { Layout } from "./Layout";
import { PracticeMode } from "@/features/practice/PracticeMode";
import { KineticText } from "@/shared/components/KineticText";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="practice" element={<PracticeMode />} />
          <Route path="lessons" element={<PlaceholderPage title="LESSONS" />} />
          <Route path="multiplayer" element={<PlaceholderPage title="BATTLE" />} />
          <Route path="leaderboard" element={<PlaceholderPage title="RANK" />} />
          <Route path="profile" element={<PlaceholderPage title="PROFILE" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        gap: "3rem",
      }}
    >
      {/* Kinetic logo */}
      <KineticText
        text="ПАЛЬЦЕБЛУД"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-hero)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "var(--text)",
        }}
      />

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-xs)",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        }}
      >
        Keyboard Trainer
      </p>

      {/* CTA */}
      <a
        href="/practice"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-size-xs)",
          color: "var(--accent)",
          textDecoration: "none",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          border: "1px solid var(--accent)",
          padding: "0.6rem 2rem",
          transition: "background var(--duration) var(--ease-out), color var(--duration) var(--ease-out)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--accent)";
          e.currentTarget.style.color = "var(--bg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--accent)";
        }}
      >
        START
      </a>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "3rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        {[
          { value: "060", label: "WPM" },
          { value: "99%", label: "ACC" },
          { value: "∞", label: "FREE" },
        ].map(({ value, label }) => (
          <div
            key={label}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
          >
            <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 600, color: "var(--text)" }}>
              {value}
            </span>
            <span
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-size-2xl)",
            fontWeight: 600,
            marginBottom: "1rem",
          }}
        >
          {title}
        </h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
          COMING SOON
        </p>
      </div>
    </div>
  );
}
