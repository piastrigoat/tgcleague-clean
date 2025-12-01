"use client";

import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructorPick, setConstructorPick] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  // ----------------------------
  // LOAD DRIVERS + CONSTRUCTORS
  // ----------------------------
  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then((raw) => {
        // Skip header row
        const cleaned = raw.slice(1).map((row) => ({
          name: row[0],
          constructor: row[1],
          price: Number(row[2]),
        }));
        setDrivers(cleaned);
      });

    fetch("/api/constructors")
      .then((r) => r.json())
      .then((raw) => {
        // Skip header row
        const cleaned = raw.slice(1).map((row) => ({
          name: row[0],
          price: Number(row[1]),
        }));
        setConstructors(cleaned);
      });
  }, []);

  // ----------------------------
  // LOAD LEADERBOARD
  // ----------------------------
  const fetchLeaderboard = () => {
    fetch("/api/leaderboard").then((r) => r.json()).then(setLeaderboard);
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------
  // SUBMIT PICKS
  // ----------------------------
  const submitPicks = async () => {
    setError("");

    // Calculate budget
    const driverPrices = picks.map((p) => {
      const d = drivers.find((x) => x.name === p);
      return d ? d.price : 0;
    });

    const constructorObj = constructors.find(
      (c) => c.name === constructorPick
    );

    const total =
      driverPrices.reduce((a, b) => a + b, 0) +
      (constructorObj ? constructorObj.price : 0);

    if (total > 50) {
      setError(`❌ Your total budget is $${total}. Limit is $50.`);
      return;
    }

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
        backgroundColor: "#dd3333ff", // TGC red
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
        🎮 TGC Fantasy League
      </h1>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* USERNAME */}
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "8px",
            border: "none",
            marginBottom: "1.5rem",
            fontSize: "1.1rem",
          }}
        />

        {/* DRIVER PICKS */}
        <h2>Select 3 Drivers</h2>

        {picks.map((pick, i) => (
          <select
            key={i}
            value={pick}
            onChange={(e) => {
              const updated = [...picks];
              updated[i] = e.target.value;
              setPicks(updated);
            }}
            style={{
              width: "100%",
              padding: "1rem",
              fontSize: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
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
        <h2>Select Constructor</h2>

        <select
          value={constructorPick}
          onChange={(e) => setConstructorPick(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
          }}
        >
          <option value="">Select constructor</option>

          {constructors.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} – ${c.price}
            </option>
          ))}
        </select>

        {/* ERROR MESSAGE */}
        {error && (
          <p style={{ color: "yellow", fontWeight: "bold", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {/* SUBMIT BUTTON */}
        <button
          onClick={submitPicks}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "8px",
            fontSize: "1.2rem",
            backgroundColor: "black",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "2rem",
          }}
        >
          Save Picks
        </button>

        {/* LEADERBOARD */}
        <h2>Leaderboard</h2>
        <table
          style={{
            width: "100%",
            backgroundColor: "black",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#222" }}>
            <tr>
              <th style={{ padding: "0.75rem" }}>User</th>
              <th style={{ padding: "0.75rem" }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u) => (
              <tr key={u.username}>
                <td style={{ padding: "0.75rem" }}>{u.username}</td>
                <td style={{ padding: "0.75rem" }}>{u.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </main>
  );
}
