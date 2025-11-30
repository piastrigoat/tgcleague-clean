"use client";
import { useState, useEffect } from "react";

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructor, setConstructor] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const BUDGET = 50;

  useEffect(() => {
    fetch("/api/drivers").then(r => r.json()).then(setDrivers);
    fetch("/api/constructors").then(r => r.json()).then(setConstructors);
  }, []);

  const fetchLeaderboard = () => {
    fetch("/api/leaderboard").then(r => r.json()).then(setLeaderboard);
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total cost
  const getTotalCost = () => {
    let total = 0;
    picks.forEach(p => {
      const d = drivers.find(dr => dr[0] === p);
      if (d) total += Number(d[2]) || 0;
    });
    const c = constructors.find(x => x[0] === constructor);
    if (c) total += Number(c[1]) || 0;
    return total;
  };

  const totalCost = getTotalCost();
  const overBudget = totalCost > BUDGET;

  const submitPicks = async () => {
    if (!username) return alert("Please enter a username!");
    if (overBudget) return alert("Your picks exceed the $50 budget!");

    await fetch("/api/picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, picks, constructor })
    });

    fetchLeaderboard();
    alert("Fantasy picks saved!");
  };

  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "Inter, sans-serif",
      background: "#dd3333ff",
      minHeight: "100vh",
      color: "white"
    }}>
      
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Fantasy Racing League</h1>

      <div style={{ 
        maxWidth: "600px",
        margin: "0 auto",
        padding: "1.5rem",
        background: "black",
        borderRadius: "12px"
      }}>

        <input 
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "none"
          }}
        />

        <h2>Pick 3 Drivers</h2>
        {picks.map((p, i) => (
          <select
            key={i}
            value={p}
            onChange={e => setPicks(prev => { prev[i] = e.target.value; return [...prev]; })}
            style={{
              width: "100%",
              padding: "0.7rem",
              marginBottom: "0.7rem",
              borderRadius: "8px"
            }}
          >
            <option value="">Select driver</option>
            {drivers.map(d => (
              <option key={d[0]} value={d[0]}>
                {d[0]} — ${d[2]}
              </option>
            ))}
          </select>
        ))}

        <h2>Pick Constructor</h2>
        <select
          value={constructor}
          onChange={e => setConstructor(e.target.value)}
          style={{
            width: "100%",
            padding: "0.7rem",
            marginBottom: "1rem",
            borderRadius: "8px"
          }}
        >
          <option value="">Select constructor</option>
          {constructors.map(c => (
            <option key={c[0]} value={c[0]}>
              {c[0]} — ${c[1]}
            </option>
          ))}
        </select>

        <h3 style={{ marginTop: "1rem" }}>
          Total Cost: <strong>${totalCost}</strong> / ${BUDGET}
        </h3>

        {overBudget && (
          <p style={{ color: "yellow" }}>❗ Your team is over budget!</p>
        )}

        <button
          onClick={submitPicks}
          disabled={overBudget}
          style={{
            width: "100%",
            padding: "1rem",
            marginTop: "1rem",
            fontWeight: "600",
            borderRadius: "8px",
            background: overBudget ? "#444" : "#dd3333",
            cursor: overBudget ? "not-allowed" : "pointer",
            color: "white",
            border: "none"
          }}
        >
          Save Picks
        </button>
      </div>

      <h2 style={{ marginTop: "3rem", textAlign: "center" }}>Leaderboard</h2>
      <table style={{ 
        width: "90%", 
        margin: "0 auto",
        background: "black",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        <thead>
          <tr style={{ background: "#222" }}>
            <th style={{ padding: "1rem" }}>User</th>
            <th style={{ padding: "1rem" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((u, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#111" : "#222" }}>
              <td style={{ padding: "1rem" }}>{u.username}</td>
              <td style={{ padding: "1rem" }}>{u.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
