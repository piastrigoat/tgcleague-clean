"use client";

import React, { useEffect, useState } from "react";

export default function StandingsPage() {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [view, setView] = useState("drivers");

  // <<-- REPLACE this with your published CSV URL:
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1934660296&single=true&output=csv";
  // ------------------------------------------------------

  // CSV parser that handles quoted fields with commas
  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim() !== "");
    const rows = lines.map((line) =>
      line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((cell) =>
        cell.replace(/^"(.*)"$/, "$1").trim()
      )
    );
    return rows;
  }

  function toNumber(value) {
    if (value === undefined || value === null) return 0;
    const s = value.toString().replace(/[^0-9.\-]/g, "");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const rows = parseCSV(text);

        // remove a header row if it exists (if first row has "Position" or "position")
        const rowsNoHeader = rows.filter(
          (r, idx) =>
            !(
              idx === 0 &&
              r[0] &&
              typeof r[0] === "string" &&
              r[0].trim().toLowerCase().includes("position")
            )
        );

        // Drivers: columns A-J => indices 0..9
        const drivers = rowsNoHeader
          .filter((r) => (r[0] || "").toString().trim() !== "" && (r[1] || "").toString().trim() !== "")
          .map((r) => ({
            position: r[0] || "",
            driver: r[1] || "",
            team: r[2] || "",
            points: r[3] || "",
            wins: r[4] || "",
            podiums: r[5] || "",
            poles: r[6] || "",
            fastestLaps: r[7] || "",
            dnfs: r[8] || "",
            races: r[9] || "",
          }));

        // Constructors: columns L-S => indices 11..18
        const constructors = rowsNoHeader
          .filter((r) => (r[11] || "").toString().trim() !== "" && (r[12] || "").toString().trim() !== "")
          .map((r) => ({
            position: r[11] || "",
            team: r[12] || "",
            points: r[13] || "", // N column -> index 13
            wins: r[14] || "",
            podiums: r[15] || "",
            poles: r[16] || "",
            fastestLaps: r[17] || "",
            dnfs: r[18] || "",
          }));

        // sort by points (numeric) desc
        drivers.sort((a, b) => toNumber(b.points) - toNumber(a.points));
        constructors.sort((a, b) => toNumber(b.points) - toNumber(a.points));

        if (!mounted) return;
        setDriverStandings(drivers);
        setConstructorStandings(constructors);
      } catch (err) {
        console.error("Failed to load standings CSV:", err);
        if (mounted) {
          setDriverStandings([]);
          setConstructorStandings([]);
        }
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [csvUrl]);

  // --- styles (inline to avoid external CSS needs) ---
  const pageStyle = {
    padding: "2rem",
    fontFamily: "Segoe UI, Roboto, sans-serif",
    background: "#F3F0FF",
    minHeight: "100vh",
    color: "#000",
  };
  const titleStyle = {
    color: "#6B46C1",
    fontSize: "2.25rem",
    marginBottom: "0.75rem",
  };
  const buttonBase = {
    padding: "0.5rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #6B46C1",
    fontWeight: 600,
    marginRight: "0.6rem",
  };
  const activeBtn = {
    background: "#6B46C1",
    color: "#fff",
  };
  const inactiveBtn = {
    background: "#fff",
    color: "#6B46C1",
  };
  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    overflow: "hidden",
    marginTop: "1rem",
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };
  const theadStyle = {
    background: "#E9D8FD",
  };
  const thStyle = {
    textAlign: "center",
    padding: "0.75rem",
    color: "#000",
    fontWeight: 700,
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  };
  const tdStyle = {
    textAlign: "center",
    padding: "0.6rem",
    borderBottom: "1px solid rgba(0,0,0,0.04)",
  };
  const rowHover = { background: "#F7F6FF" };

  return (
    <main style={pageStyle}>
      <h1 style={titleStyle}>🏎️ TGC Standings</h1>

      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{ ...buttonBase, ...(view === "drivers" ? activeBtn : inactiveBtn) }}
          onClick={() => setView("drivers")}
        >
          Drivers
        </button>
        <button
          style={{ ...buttonBase, ...(view === "constructors" ? activeBtn : inactiveBtn) }}
          onClick={() => setView("constructors")}
        >
          Constructors
        </button>
      </div>

      {/* Drivers */}
      {view === "drivers" && (
        <div style={cardStyle}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                {["Pos","Driver","Team","Points","Wins","Podiums","Poles","FL","DNFs","Races"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {driverStandings.map((d, i) => (
                <tr
                  key={i}
                  style={i % 2 === 0 ? {} : { background: "#FBF7FF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = rowHover.background)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "" : "#FBF7FF")}
                >
                  <td style={tdStyle}>{d.position}</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{d.driver}</td>
                  <td style={tdStyle}>{d.team}</td>
                  <td style={tdStyle}>{d.points}</td>
                  <td style={tdStyle}>{d.wins}</td>
                  <td style={tdStyle}>{d.podiums}</td>
                  <td style={tdStyle}>{d.poles}</td>
                  <td style={tdStyle}>{d.fastestLaps}</td>
                  <td style={tdStyle}>{d.dnfs}</td>
                  <td style={tdStyle}>{d.races}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Constructors */}
      {view === "constructors" && (
        <div style={cardStyle}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                {["Pos","Team","Points","Wins","Podiums","Poles","FL","DNFs"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {constructorStandings.map((c, i) => (
                <tr
                  key={i}
                  style={i % 2 === 0 ? {} : { background: "#FBF7FF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = rowHover.background)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "" : "#FBF7FF")}
                >
                  <td style={tdStyle}>{c.position}</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{c.team}</td>
                  <td style={tdStyle}>{c.points}</td>
                  <td style={tdStyle}>{c.wins}</td>
                  <td style={tdStyle}>{c.podiums}</td>
                  <td style={tdStyle}>{c.poles}</td>
                  <td style={tdStyle}>{c.fastestLaps}</td>
                  <td style={tdStyle}>{c.dnfs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}