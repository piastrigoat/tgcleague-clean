"use client";

import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructorPick, setConstructorPick] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const BUDGET = 50;

  // Fetch drivers
  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then((data) => setDrivers(data));
  }, []);

  // Fetch constructors
  useEffect(() => {
    fetch("/api/constructors")
      .then((r) => r.json())
      .then((data) => setConstructors(data));
  }, []);

  // Fetch leaderboard
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

  // Calculate total budget cost
  const totalCost =
    picks.reduce((sum, pick) => {
      const d = drivers.find((dr) => dr[0] === pick);
      return sum + (d ? Number(d[2]) : 0);
    }, 0) +
    (constructorPick
      ? Number(
          constructors.find((c) => c[0] === constructorPick)?.[1] || 0
        )
      : 0);

  const budgetRemaining = BUDGET - totalCost;

  // Submit picks
  const submitPicks = async () => {
    if (totalCost > BUDGET) {
      alert("❌ Your team exceeds the $50 budget!");
      return;
    }

    await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, picks, constructor: constructorPick }),
    });

    alert("✔️ Picks saved!");
    fetchLeaderboard();
  };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#dd3333ff", // RED
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "900",
          textAlign: "center",
          marginBottom: "2rem",
          textShadow: "0 3px 10px rgba(0,0,0,0.4)",
        }}
      >
        🎮 TGC Fantasy League
      </h1>

      {/* Username */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <input
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "8px",
            border: "none",
            width: "280px",
            fontSize: "1.1rem",
            outline: "none",
          }}
        />
      </div>

      {/* BUDGET BAR */}
      <div
        style={{
          background: "#000",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
          Budget: ${totalCost} / $50
        </h2>
        <p
          style={{
            margin: "0.3rem",
            fontSize: "1.1rem",
            color: budgetRemaining < 0 ? "#ffbbbb" : "#bbffbb",
          }}
        >
          Remaining: ${budgetRemaining}
        </p>
      </div>

      {/* Driver Picks */}
      <h2>Pick 3 Drivers</h2>
      {picks.map((p, i) => (
        <select
          key={i}
          value={p}
          onChange={(e) =>
            setPicks((old) => {
              const copy = [...old];
              copy[i] = e.target.value;
              return copy;
            })
          }
          style={{
            padding: "0.8rem",
            width: "100%",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "1.1rem",
            backgroundColor: "#000",
            color: "#fff",
          }}
        >
          <option value="">Select driver</option>

          {drivers.map((dr) => (
            <option key={dr[0]} value={dr[0]}>
              {dr[0]} — ${dr[2]}
            </option>
          ))}
        </select>
      ))}

      {/* Constructor Pick */}
      <h2 style={{ marginTop: "2rem" }}>Pick 1 Constructor</h2>
      <select
        value={constructorPick}
        onChange={(e) => setConstructorPick(e.target.value)}
        style={{
          padding: "0.8rem",
          width: "100%",
          marginBottom: "2rem",
          borderRadius: "8px",
          border: "none",
          fontSize: "1.1rem",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <option value="">Select constructor</option>

        {constructors.map((c) => (
          <option key={c[0]} value={c[0]}>
            {c[0]} — ${c[1]}
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button
        onClick={submitPicks}
        style={{
          width: "100%",
          padding: "1rem",
          backgroundColor: "#000",
          color: "#dd3333ff",
          border: "none",
          borderRadius: "10px",
          fontSize: "1.4rem",
          fontWeight: "800",
          cursor: "pointer",
        }}
      >
        Save Picks
      </button>

      {/* Leaderboard */}
      <h2 style={{ marginTop: "3rem", textAlign: "center" }}>
        🏆 Leaderboard
      </h2>

      <table
        style={{
          width: "100%",
          backgroundColor: "#000",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#222" }}>
            <th style={{ padding: "1rem" }}>User</th>
            <th style={{ padding: "1rem" }}>Points</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((u) => (
            <tr key={u.username}>
              <td style={{ padding: "1rem", textAlign: "center" }}>
                {u.username}
              </td>
              <td style={{ padding: "1rem", textAlign: "center" }}>
                {u.totalPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
