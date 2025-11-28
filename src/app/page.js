"use client";

export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#dd3333ff", // solid red background
        fontFamily: "Inter, sans-serif",
        padding: "2rem",
        color: "#fff", // default text color
      }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Torque Gaming Centre Logo"
        style={{
          width: "200px",
          height: "200px",
          objectFit: "contain",
          marginBottom: "1rem",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))",
        }}
      />

      {/* Heading */}
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "800",
          marginBottom: "2rem",
          textAlign: "center",
          letterSpacing: "-1px",
          textShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        Torque Gaming Centre
      </h1>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {[
          { label: "🏁 Standings", href: "/standings" },
          { label: "🏆 Hall of Fame", href: "/halloffame" },
          { label: "📍 Track Data", href: "/trackdata" },
          { label: "📊 Stats", href: "/stats" },
          { label: "🔮 Fantasy", href: "/fantasy" },
        ].map((btn, i) => (
          <a
            key={i}
            href={btn.href}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              fontWeight: "600",
              borderRadius: "0.75rem",
              background: "#000000", // black button
              color: "#ffffffff", // red text
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              transition: "all 0.25s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.7)";
              e.currentTarget.style.background = "#333"; // slightly lighter black
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
              e.currentTarget.style.background = "#000";
            }}
          >
            {btn.label}
          </a>
        ))}
      </div>

      {/* Welcome text */}
      <p
        style={{
          marginTop: "3rem",
          fontSize: "1.2rem",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: "1.6",
        }}
      >
        Welcome to the <strong>TGC</strong> website — Your hub for all things TGC!
      </p>
    </main>
  );
}
