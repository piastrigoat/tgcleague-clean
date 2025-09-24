"use client";

import React, { useEffect, useState } from "react";

export default function StandingsPage() {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [view, setView] = useState("drivers");

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1934660296&single=true&output=csv";

  // Fetching data omitted for brevity, keep your existing fetch logic

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

  const tableWrapper = {
    overflowX: "auto", // ✅ scrollable on mobile
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px", // ensures horizontal scroll on mobile
  };

  const theadStyle = {
    background: "#E9D8FD",
  };

  const thStyle = {
    textAlign: "center",
    padding: "0.5rem",
    color: "#000",
    fontSize: "0.85rem", // smaller for desktop
  };

  const tdStyle = {
    textAlign: "center",
    padding: "0.5rem",
    fontSize: "0.8rem", // slightly smaller on desktop
  };

  const rowHover = { background: "#E6E0F8" };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundColor: "#F9F9F9",
        minHeight: "100dvh",
      }}
    >
      <h1 style={titleStyle}>🏁 Standings</h1>

      {/* View buttons */}
      <div style={{ marginBottom: "1rem" }}>
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
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead style={theadStyle}>
                <tr>
                  {[
                    "Pos","Driver","Team","Points","Wins","Podiums","Poles","FL","DNFs","Races"
                  ].map((h) => (
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
        </div>
      )}

      {/* Constructors */}
      {view === "constructors" && (
        <div style={cardStyle}>
          <div style={tableWrapper}>
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
        </div>
      )}
    </main>
  );
}