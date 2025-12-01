"use client";

import { useEffect, useState } from "react";

const BUDGET = 50;
const RED = "#dd3333"; // your preferred red

export default function FantasyPage() {
  const [username, setUsername] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [picks, setPicks] = useState(["", "", ""]);
  const [constructorPick, setConstructorPick] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch drivers & constructors
  useEffect(() => {
    const load = async () => {
      try {
        const [dRes, cRes] = await Promise.all([
          fetch("/api/drivers"),
          fetch("/api/constructors"),
        ]);
        const dJson = await dRes.json();
        const cJson = await cRes.json();
        setDrivers(Array.isArray(dJson) ? dJson : []);
        setConstructors(Array.isArray(cJson) ? cJson : []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();
      setLeaderboard(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute total cost
  const totalCost = (() => {
    let total = 0;
    picks.forEach((pName) => {
      if (!pName) return;
      const d = drivers.find((dr) => dr.name === pName);
      if (d) total += d.price || 0;
    });
    if (constructorPick) {
      const c = constructors.find((co) => co.name === constructorPick);
      if (c) total += c.price || 0;
    }
    return total;
  })();

  const overBudget = totalCost > BUDGET;

  const handlePickChange = (index, value) => {
    setPicks((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const submitPicks = async () => {
    if (!username) {
      setStatus("Please enter a username.");
      return;
    }
    if (picks.some((p) => !p) || !constructorPick) {
      setStatus("Please select 3 drivers and 1 constructor.");
      return;
    }
    if (overBudget) {
      setStatus("Your team is over budget. Max is $50.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          picks,
          constructor: constructorPick,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to save picks");
      }

      setStatus("Picks saved! Leaderboard updated.");
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Error saving picks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: RED,
        fontFamily: "Inter, sans-serif",
        padding: "2rem 1rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#111",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "2.4rem",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          TGC Fantasy League
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            opacity: 0.8,
          }}
        >
          Pick 3 drivers and 1 constructor. Stay under ${BUDGET} and score points
          based on TGC race results.
        </p>

        {/* Username */}
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <label style={{ fontWeight: 600 }}>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your TGC name"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#000",
              color: "#fff",
            }}
          />
        </div>

        {/* Driver picks */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
            Pick 3 Drivers
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {picks.map((value, i) => (
              <select
                key={i}
                value={value}
                onChange={(e) => handlePickChange(i, e.target.value)}
                style={{
                  flex: "1 1 200px",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                  border: "1px solid #333",
                  backgroundColor: "#000",
                  color: "#fff",
                }}
              >
                <option value="">Select driver</option>
                {drivers.map((dr) => (
                  <option key={dr.name} value={dr.name}>
                    {dr.name} — ${dr.price}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* Constructor pick */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
            Pick 1 Constructor
          </h2>
          <select
            value={constructorPick}
            onChange={(e) => setConstructorPick(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#000",
              color: "#fff",
            }}
          >
            <option value="">Select constructor</option>
            {constructors.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} — ${c.price}
              </option>
            ))}
          </select>
        </div>

        {/* Budget info */}
        <div
          style={{
            marginBottom: "1.5rem",
            fontWeight: 600,
            color: overBudget ? "#ff8080" : "#9bff9b",
          }}
        >
          Total cost: ${totalCost.toFixed(1)} / ${BUDGET}{" "}
          {overBudget && " (Over budget!)"}
        </div>

        {/* Status message */}
        {status && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              backgroundColor: "#222",
              border: "1px solid #444",
              fontSize: "0.95rem",
            }}
          >
            {status}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={submitPicks}
          disabled={loading}
          style={{
            width: "100%",
            maxWidth: "260px",
            padding: "0.9rem 1.2rem",
            borderRadius: "999px",
            backgroundColor: loading ? "#333" : "#000",
            color: RED,
            fontWeight: 700,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            display: "block",
            margin: "0 auto 2rem auto",
            transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (loading) return;
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 6px 18px rgba(0,0,0,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {loading ? "Saving..." : "Save Fantasy Team"}
        </button>

        {/* Leaderboard */}
        <section>
          <h2
            style={{
              fontSize: "1.6rem",
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            Leaderboard
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "280px",
                backgroundColor: "#000",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: RED }}>
                  <th style={{ padding: "0.6rem", textAlign: "left" }}>Pos</th>
                  <th style={{ padding: "0.6rem", textAlign: "left" }}>
                    User
                  </th>
                  <th style={{ padding: "0.6rem", textAlign: "right" }}>
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, idx) => (
                  <tr
                    key={row.username}
                    style={{
                      backgroundColor:
                        idx % 2 === 0 ? "#111" : "#181818",
                    }}
                  >
                    <td style={{ padding: "0.6rem" }}>{idx + 1}</td>
                    <td style={{ padding: "0.6rem" }}>{row.username}</td>
                    <td style={{ padding: "0.6rem", textAlign: "right" }}>
                      {row.totalPoints}
                    </td>
                  </tr>
                ))}
                {leaderboard.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ padding: "0.8rem", textAlign: "center" }}
                    >
                      No entries yet. Save your team to get on the board!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
