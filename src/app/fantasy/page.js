"use client";
import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructorPick, setConstructorPick] = useState("");

  useEffect(() => {
    fetch("/api/drivers").then((r) => r.json()).then(setDrivers);
    fetch("/api/constructors").then((r) => r.json()).then(setConstructors);
  }, []);

  return (
    <main style={{ padding: "2rem", background: "#dd3333ff", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "2rem" }}>
        TGC Fantasy League
      </h1>

      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem",
            marginBottom: "2rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "1.1rem"
          }}
        />

        <h2>Pick 3 Drivers</h2>
        {picks.map((_, i) => (
          <select
            key={i}
            value={picks[i]}
            onChange={(e) => {
              const newPicks = [...picks];
              newPicks[i] = e.target.value;
              setPicks(newPicks);
            }}
            style={{
              width: "100%",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              fontSize: "1.1rem"
            }}
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} (${d.price})
              </option>
            ))}
          </select>
        ))}

        <h2>Pick Constructor</h2>
        <select
          value={constructorPick}
          onChange={(e) => setConstructorPick(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem",
            marginBottom: "2rem",
            borderRadius: "8px",
            fontSize: "1.1rem"
          }}
        >
          <option value="">Select Constructor</option>
          {constructors.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} (${c.price})
            </option>
          ))}
        </select>

        <button
          style={{
            width: "100%",
            padding: "1rem",
            background: "#000",
            color: "#dd3333ff",
            fontSize: "1.3rem",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Submit Picks
        </button>
      </div>
    </main>
  );
}
