"use client";

import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructorPick, setConstructorPick] = useState("");
  const [budget, setBudget] = useState(50);
  const [error, setError] = useState("");

  // Load drivers
  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then(setDrivers);
  }, []);

  // Load constructors
  useEffect(() => {
    fetch("/api/constructors")
      .then((r) => r.json())
      .then(setConstructors);
  }, []);

  // Calculate budget
  useEffect(() => {
    let total =
      picks.reduce((sum, p) => {
        const d = drivers.find((x) => x.name === p);
        return sum + (d?.price || 0);
      }, 0) +
      (constructors.find((c) => c.name === constructorPick)?.price || 0);

    setBudget(50 - total);
  }, [picks, constructorPick, drivers, constructors]);

  const submitPicks = async () => {
    if (!username) return setError("Please enter a username!");
    if (budget < 0) return setError("Your team exceeds the $50 budget!");

    await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        picks,
        constructor: constructorPick,
      }),
    });

    alert("Fantasy picks saved!");
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: "#dd3333ff",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        color: "white",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        🎮 TGC Fantasy League
      </h1>

      <div
        style={{
          background: "black",
          padding: "1.5rem",
          borderRadius: "12px",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <input
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <h2>Pick 3 Drivers</h2>

        {picks.map((pick, i) => (
          <select
            key={i}
            value={pick}
            onChange={(e) =>
              setPicks((prev) => {
                prev[i] = e.target.value;
                return [...prev];
              })
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "0.75rem",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          >
            <option value="">Select a driver</option>
            {drivers.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} — ${d.price}
              </option>
            ))}
          </select>
        ))}

        <h2>Select Constructor</h2>
        <select
          value={constructorPick}
          onChange={(e) => setConstructorPick(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            fontSize: "1rem",
          }}
        >
          <option value="">Select constructor</option>
          {constructors.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} — ${c.price}
            </option>
          ))}
        </select>

        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          💰 Budget Remaining:{" "}
          <span
            style={{ color: budget < 0 ? "yellow" : "#00ff99", fontWeight: 700 }}
          >
            ${budget}
          </span>
        </p>

        {error && (
          <p style={{ color: "yellow", marginBottom: "1rem" }}>{error}</p>
        )}

        <button
          onClick={submitPicks}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#222",
            color: "white",
            borderRadius: "8px",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          Save Picks
        </button>
      </div>
    </div>
  );
}
