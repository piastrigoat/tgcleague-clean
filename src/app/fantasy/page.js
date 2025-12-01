"use client";

import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructorPick, setConstructorPick] = useState("");
  const [budgetLeft, setBudgetLeft] = useState(50);

  // Fetch Drivers
  useEffect(() => {
    fetch("/api/drivers")
      .then((res) => res.json())
      .then((values) => {
        const rows = values.slice(1); // skip header row
        const formatted = rows.map((row) => ({
          name: row[0] || "",
          constructor: row[1] || "",
          price: Number(row[2]) || 0,
        }));
        setDrivers(formatted);
      });
  }, []);

  // Fetch Constructors
  useEffect(() => {
    fetch("/api/constructors")
      .then((res) => res.json())
      .then((values) => {
        const rows = values.slice(1); // skip header row
        const formatted = rows.map((row) => ({
          name: row[0] || "",
          price: Number(row[1]) || 0,
        }));
        setConstructors(formatted);
      });
  }, []);

  // Calculate budget
  useEffect(() => {
    let total = 0;

    picks.forEach((pick) => {
      const driver = drivers.find((d) => d.name === pick);
      if (driver) total += driver.price;
    });

    const team = constructors.find((c) => c.name === constructorPick);
    if (team) total += team.price;

    setBudgetLeft(50 - total);
  }, [picks, constructorPick, drivers, constructors]);

  const submitTeam = async () => {
    if (!username) {
      alert("Enter a username");
      return;
    }

    if (budgetLeft < 0) {
      alert("Your selection exceeds the $50 budget!");
      return;
    }

    await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        drivers: picks,
        constructor: constructorPick,
      }),
    });

    alert("Team saved!");
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "700px",
        margin: "auto",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          textAlign: "center",
          marginBottom: "1rem",
          color: "#dd3333ff",
        }}
      >
        TGC Fantasy
      </h1>

      <div
        style={{
          background: "#111",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        <label style={{ fontWeight: "bold" }}>Username</label>
        <input
          style={{
            width: "100%",
            padding: "0.7rem",
            marginTop: "0.5rem",
            marginBottom: "1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
        />

        <h2 style={{ marginBottom: "0.5rem", color: "#dd3333ff" }}>
          Choose 3 Drivers
        </h2>

        {picks.map((pick, index) => (
          <select
            key={index}
            value={pick}
            onChange={(e) => {
              const newPicks = [...picks];
              newPicks[index] = e.target.value;
              setPicks(newPicks);
            }}
            style={{
              width: "100%",
              padding: "0.7rem",
              marginBottom: "1rem",
              borderRadius: "0.5rem",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
            }}
          >
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} - ${d.price}
              </option>
            ))}
          </select>
        ))}

        <h2 style={{ marginTop: "1rem", color: "#dd3333ff" }}>
          Choose 1 Constructor
        </h2>

        <select
          value={constructorPick}
          onChange={(e) => setConstructorPick(e.target.value)}
          style={{
            width: "100%",
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "0.5rem",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
          }}
        >
          <option value="">Select constructor</option>
          {constructors.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} - ${c.price}
            </option>
          ))}
        </select>

        <h3
          style={{
            marginTop: "1rem",
            fontSize: "1.4rem",
            color: budgetLeft < 0 ? "#ff4444" : "#44ff44",
          }}
        >
          Budget Left: ${budgetLeft}
        </h3>

        <button
          onClick={submitTeam}
          style={{
            width: "100%",
            padding: "1rem",
            background: "#dd3333ff",
            border: "none",
            borderRadius: "0.5rem",
            marginTop: "1.5rem",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Save Picks
        </button>
      </div>
    </div>
  );
}
