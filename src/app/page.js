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
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
        fontFamily: "Inter, sans-serif",
        padding: "2rem",
      }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Torque Gaming Centre Logo"
        style={{
          width: "170px",
          height: "170px",
          objectFit: "contain",
          marginBottom: "1rem",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))",
        }}
      />

      {/* Heading */}
      <h1
        style={{
          color: "#4C1D95",
          fontSize: "3rem",
          fontWeight: "800",
          marginBottom: "2rem",
          textAlign: "center",
          letterSpacing: "-1px",
          textShadow: "0 4px 10px rgba(0,0,0,0.15)",
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
        ].map((btn, i) => (
          <a
            key={i}
            href={btn.href}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              fontWeight: "600",
              borderRadius: "0.75rem",
              background: "#6B46C1",
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(107,70,193,0.4)",
              transition: "all 0.25s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 6px 18px rgba(107,70,193,0.6)";
              e.currentTarget.style.background =
                "linear-gradient(135deg, #6B46C1, #9F7AEA)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(107,70,193,0.4)";
              e.currentTarget.style.background = "#6B46C1";
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
          color: "#333",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: "1.6",
        }}
      >
        Welcome to <strong>TGC</strong> — the home of racing stats, records, and
        history. Dive into live standings, legendary halls of fame, detailed
        track data, and the latest power rankings.
      </p>
    </main>
  );
}