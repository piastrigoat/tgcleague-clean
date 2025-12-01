"use client";

import { useEffect, useState } from "react";

export default function FantasyPage() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [username, setUsername] = useState("");
  const [picks, setPicks] = useState(["", "", ""]);
  const [teamConstructor, setTeamConstructor] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------
  // FETCH DRIVERS & CONSTRUCTORS
  // ----------------------
  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then((data) =>
        setDrivers(
          data.map((d) => ({
            name: d[0],
            price: Number(d[2]), // Column C
          }))
        )
      );

    fetch("/api/constructors")
      .then((r) => r.json())
      .then((data) =>
        setConstructors(
          data.map((c) => ({
            name: c[0],
            price: Number(c[1]), // Column B
          }))
        )
      );
  }, []);

  // ----------------------
  // FETCH LEADERBOARD
  // ----------------------
  const loadLeaderboard = () => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then(setLeaderboard);
  };

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------
  // TOTAL COST CALC
  // ----------------------
  const totalCost =
    picks.reduce((sum, p) => {
      const d = drivers.find((dr) => dr.name === p);
      return sum + (d?.price || 0);
    }, 0) +
    (constructors.find((c) => c.name === teamConstructor)?.price || 0);

  // ----------------------
  // SUBMIT PICKS
  // ----------------------
  const submitTeam = async () => {
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (picks.includes("") || !teamConstructor) {
      setError("Please select 3 drivers and 1 constructor.");
      return;
    }

    if (totalCost > 50) {
      setError("Your team exceeds the $50 budget.");
      return;
    }

    const res = await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        picks,
        constructor: teamConstructor,
        cost: totalCost,
      }),
    });

    if (res.ok) {
      setSuccess("Team Saved!");
      loadLeaderboard();
    } else {
      setError("Failed to save picks.");
    }
  };

  // ---------------------------------------------------------
  //  UI — RED AND BLACK TGC THEME
  // ---------------------------------------------------------
  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#dd3333ff",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "3rem",
          fontWeight: "900",
          marginBottom: "2rem",
          textShadow: "0 3px 10px rgba(0,0,0,0.4)",
        }}
      >
        🎮 TGC Fantasy League
      </h1>

      <div
        style={{
          background: "black",
          padding: "2rem",
          borderRadius: "1rem",
          maxWidth: "700px",
          margin: "0 auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Enter Username</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Username"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            marginBottom: "1rem",
            fontSize: "1rem",
          }}
        />

        <h2>Pick 3 Drivers</h2>
        {picks.map((p, i) => (
          <select
            key={i}
            value={p}
            onChange={(e) => {
              const copy = [...picks];
              copy[i] = e.target.value;
              setPicks(copy);
            }}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} — ${d.price}
              </option>
            ))}
          </select>
        ))}

        <h2 style={{ marginTop: "1.5rem" }}>Pick 1 Constructor</h2>
        <select
          value={teamConstructor}
          onChange={(e) => setTeamConstructor(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          <option value="">Select Constructor</option>
          {constructors.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} — ${c.price}
            </option>
          ))}
        </select>

        {/* Budget Display */}
        <p
          style={{
            fontSize: "1.2rem",
            marginTop: "1rem",
            fontWeight: "bold",
            color: totalCost > 50 ? "red" : "lime",
          }}
        >
          Total Cost: ${totalCost} / $50
        </p>

        {/* Errors + Success */}
        {error && (
          <p style={{ color: "red", marginTop: "1rem", fontWeight: "bold" }}>
            ❌ {error}
          </p>
        )}
        {success && (
          <p style={{ color: "lime", marginTop: "1rem", fontWeight: "bold" }}>
            ✅ {success}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={submitTeam}
          style={{
            width: "100%",
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            fontSize: "1.2rem",
            background: totalCost > 50 ? "#660000" : "#222",
            color: "white",
            cursor: "pointer",
            border: "2px solid red",
            transition: "0.2s",
          }}
        >
          Save Team
        </button>
      </div>

      {/* Leaderboard */}
      <h2 style={{ marginTop: "3rem", textAlign: "center" }}>🏆 Leaderboard</h2>
      <table
        style={{
          width: "80%",
          margin: "1rem auto",
          background: "black",
          padding: "1rem",
          borderRadius: "0.5rem",
          color: "white",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: "0.5rem" }}>User</th>
            <th style={{ padding: "0.5rem" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((u) => (
            <tr key={u.username}>
              <td style={{ padding: "0.5rem" }}>{u.username}</td>
              <td style={{ padding: "0.5rem" }}>{u.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
