"use client";

import { useEffect, useState } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructorPick, setConstructorPick] = useState("");

  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch drivers + constructors
  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then((data) => {
        // Skip header row
        const clean = data.slice(1).map((row) => ({
          name: row[0],
          constructor: row[1],
          price: Number(row[2]),
        }));
        setDrivers(clean);
      });

    fetch("/api/constructors")
      .then((r) => r.json())
      .then((data) => {
        const clean = data.slice(1).map((row) => ({
          name: row[0],
          price: Number(row[1]),
        }));
        setConstructors(clean);
      });
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

  const submitPicks = async () => {
    await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        picks,
        constructor: constructorPick,
      }),
    });

    fetchLeaderboard();
  };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        background: "#dd3333ff", // red theme
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
        TGC Fantasy League
      </h1>

      {/* USERNAME */}
      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "0.7rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          marginTop: "1rem",
          marginBottom: "2rem",
          width: "250px",
        }}
      />

      {/* DRIVER PICKS */}
      <h2>Pick 3 Drivers</h2>
      {picks.map((p, idx) => (
        <select
          key={idx}
          value={p}
          onChange={(e) => {
            const newPicks = [...picks];
            newPicks[idx] = e.target.value;
            setPicks(newPicks);
          }}
          style={{
            padding: "0.7rem",
            fontSize: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            width: "250px",
          }}
        >
          <option value="">Select driver</option>
          {drivers.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name} – ${d.price}
            </option>
          ))}
        </select>
      ))}

      {/* CONSTRUCTOR PICK */}
      <h2>Pick 1 Constructor</h2>
      <select
        value={constructorPick}
        onChange={(e) => setConstructorPick(e.target.value)}
        style={{
          padding: "0.7rem",
          fontSize: "1rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          width: "250px",
        }}
      >
        <option value="">Select constructor</option>
        {constructors.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name} – ${c.price}
          </option>
        ))}
      </select>

      <br />

      <button
        onClick={submitPicks}
        style={{
          background: "black",
          color: "#dd3333ff",
          padding: "1rem 2rem",
          borderRadius: "8px",
          border: "none",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
      >
        Save Picks
      </button>

      {/* LEADERBOARD */}
      <h2 style={{ marginTop: "3rem" }}>Leaderboard</h2>
      <table
        style={{
          width: "100%",
          background: "black",
          borderRadius: "8px",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: "1rem" }}>User</th>
            <th style={{ padding: "1rem" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((u) => (
            <tr key={u.username}>
              <td style={{ padding: "1rem" }}>{u.username}</td>
              <td style={{ padding: "1rem" }}>{u.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
