"use client";

import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructor, setConstructor] = useState("");
  const [picks, setPicks] = useState(["", "", ""]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("/api/drivers").then((r) => r.json()).then(setDrivers);
  }, []);

  const fetchLeaderboard = () => {
    fetch("/api/leaderboard").then((r) => r.json()).then(setLeaderboard);
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const submitPicks = async () => {
    await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, picks, constructor }),
    });
    fetchLeaderboard();
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          backgroundColor: "#111",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 0 30px rgba(221,51,51,0.4)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#dd3333ff",
            fontSize: "2.6rem",
            fontWeight: "800",
            marginBottom: "1.5rem",
            letterSpacing: "-1px",
          }}
        >
          🔮 TGC Fantasy
        </h1>

        {/* Username */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600" }}>Username</label>
          <input
            placeholder="Enter your fantasy name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem",
              marginTop: "0.5rem",
              borderRadius: "8px",
              border: "2px solid #dd3333ff",
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Pick Drivers */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#dd3333ff", marginBottom: "0.5rem" }}>
            Drivers
          </h2>

          {picks.map((_, i) => (
            <select
              key={i}
              value={picks[i]}
              onChange={(e) =>
                setPicks((p) => {
                  p[i] = e.target.value;
                  return [...p];
                })
              }
              style={{
                width: "100%",
                padding: "0.8rem",
                marginTop: "0.7rem",
                borderRadius: "8px",
                backgroundColor: "#000",
                color: "#fff",
                border: "2px solid #dd3333ff",
              }}
            >
              <option value="">Select driver</option>
              {drivers.map((dr) => (
                <option key={dr[0]}>{dr[0]}</option>
              ))}
            </select>
          ))}
        </div>

        {/* Pick Constructor */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#dd3333ff", marginBottom: "0.5rem" }}>
            Constructor
          </h2>

          <select
            value={constructor}
            onChange={(e) => setConstructor(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "8px",
              backgroundColor: "#000",
              color: "#fff",
              border: "2px solid #dd3333ff",
            }}
          >
            <option value="">Select constructor</option>
            {[...new Set(drivers.map((d) => d[1]))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={submitPicks}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "10px",
            backgroundColor: "#dd3333ff",
            border: "none",
            color: "#fff",
            fontWeight: "700",
            fontSize: "1.2rem",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b02020";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#dd3333ff";
          }}
        >
          Submit Picks
        </button>

        {/* Leaderboard */}
        <h2
          style={{
            marginTop: "3rem",
            color: "#dd3333ff",
            fontWeight: "700",
            fontSize: "1.8rem",
          }}
        >
          Leaderboard
        </h2>

        <table
          style={{
            width: "100%",
            marginTop: "1rem",
            borderCollapse: "collapse",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#dd3333ff", color: "#fff" }}>
              <th style={{ padding: "0.8rem", textAlign: "left" }}>User</th>
              <th style={{ padding: "0.8rem", textAlign: "right" }}>Points</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((u) => (
              <tr
                key={u.username}
                style={{
                  backgroundColor: "#111",
                  borderBottom: "1px solid #333",
                }}
              >
                <td style={{ padding: "0.8rem" }}>{u.username}</td>
                <td style={{ padding: "0.8rem", textAlign: "right" }}>
                  {u.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
