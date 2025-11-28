"use client";
import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructor, setConstructor] = useState("");
  const [picks, setPicks] = useState(["", "", ""]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then(setDrivers);
  }, []);

  const fetchLeaderboard = () => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then(setLeaderboard);
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
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#111",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
        }}
      >
        {/* Title */}
        <h1
          style={{
            textAlign: "center",
            color: "#dd3333ff",
            fontSize: "2.8rem",
            marginBottom: "2rem",
            fontWeight: "900",
            textShadow: "0 4px 10px rgba(0,0,0,0.4)",
          }}
        >
          TGC Fantasy League
        </h1>

        {/* Username */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ fontSize: "1.2rem" }}>Username</label>
          <input
            placeholder="Enter your fantasy name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem",
              marginTop: "0.5rem",
              borderRadius: "0.5rem",
              border: "2px solid #dd3333ff",
              background: "#000",
              color: "#fff",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Pick Drivers */}
        <h2
          style={{
            color: "#dd3333ff",
            fontSize: "1.8rem",
            marginBottom: "1rem",
          }}
        >
          Pick 3 Drivers
        </h2>
        {picks.map((d, i) => (
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
              marginBottom: "1rem",
              borderRadius: "0.5rem",
              background: "#222",
              border: "2px solid #dd3333ff",
              color: "#fff",
            }}
          >
            <option value="">Select driver</option>
            {drivers.map((dr) => (
              <option key={dr[0]}>{dr[0]}</option>
            ))}
          </select>
        ))}

        {/* Constructor */}
        <h2
          style={{
            color: "#dd3333ff",
            fontSize: "1.8rem",
            marginTop: "2rem",
            marginBottom: "1rem",
          }}
        >
          Pick Constructor
        </h2>
        <select
          value={constructor}
          onChange={(e) => setConstructor(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "0.5rem",
            background: "#222",
            border: "2px solid #dd3333ff",
            color: "#fff",
            marginBottom: "1.5rem",
          }}
        >
          <option value="">Select constructor</option>
          {[...new Set(drivers.map((d) => d[1]))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Button */}
        <button
          onClick={submitPicks}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#dd3333ff",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: "700",
            border: "none",
            borderRadius: "0.6rem",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#ff4444")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#dd3333ff")
          }
        >
          Submit Picks
        </button>

        {/* Leaderboard */}
        <h2
          style={{
            color: "#dd3333ff",
            fontSize: "2rem",
            marginTop: "3rem",
            textAlign: "center",
          }}
        >
          Leaderboard
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            background: "#111",
          }}
        >
          <thead>
            <tr style={{ background: "#dd3333ff" }}>
              <th style={{ padding: "0.8rem", textAlign: "left" }}>User</th>
              <th style={{ padding: "0.8rem", textAlign: "left" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u) => (
              <tr
                key={u.username}
                style={{
                  borderBottom: "1px solid #333",
                }}
              >
                <td style={{ padding: "0.8rem" }}>{u.username}</td>
                <td style={{ padding: "0.8rem" }}>{u.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
