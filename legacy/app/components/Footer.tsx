import { Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  const links = {
    product: [
      { label: "features", href: "#" },
      { label: "changelog", href: "#" },
      { label: "roadmap", href: "#" },
    ],
    community: [
      { label: "discord", href: "#" },
      { label: "leaderboard", href: "#" },
      { label: "blog", href: "#" },
    ],
    legal: [
      { label: "privacy", href: "#" },
      { label: "terms", href: "#" },
      { label: "cookies", href: "#" },
    ],
  };

  return (
    <footer
      style={{
        backgroundColor: "#161616",
        borderTop: "1px solid #222222",
        padding: "48px 40px 32px",
        marginTop: "auto",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#e2b714",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "14px" }}>⌨️</span>
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#d1d0c5",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              >
                typedash
                <span style={{ color: "#e2b714" }}>.io</span>
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#646669",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                maxWidth: "200px",
              }}
            >
              Become a faster, more accurate typist. Built for learners and speed demons alike.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: <Github size={16} />, label: "GitHub" },
                { icon: <Twitter size={16} />, label: "Twitter" },
              ].map((s) => (
                <button
                  key={s.label}
                  style={{
                    background: "none",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    width: "34px",
                    height: "34px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#646669",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  className="hover:!text-[#d1d0c5] hover:!border-[#3a3a3a]"
                  aria-label={s.label}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#3a3a3a",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {section}
              </p>
              <div className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.8rem",
                      color: "#646669",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    className="hover:!text-[#d1d0c5]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "20px",
            borderTop: "1px solid #1e1e1e",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "#3a3a3a",
            }}
          >
            © 2026 typedash.io — all rights reserved
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "#3a3a3a",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            made with{" "}
            <Heart size={11} color="#ca4754" fill="#ca4754" />
            {" "}for typists
          </p>
        </div>
      </div>
    </footer>
  );
}
