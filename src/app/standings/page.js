"use client";

import React, { useEffect, useState } from "react";

export default function StandingsPage() {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [view, setView] = useState("drivers");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch CSV from Google Sheets
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1934660296&single=true&output=csv";

  useEffect(() => {
    const parseCSV = (csvText) => {
      const lines = csvText.trim().split("\n");
      const headers = lines[0].split(",");
      return lines.slice(1).map((line) => {
        const values = line.split(",");
        return headers.reduce((obj, header, i) => {
          obj[header.trim().toLowerCase()] = values[i]?.trim();
          return obj;
        }, {});
      });
    };

    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => {
        const data = parseCSV(text);

        // split into drivers and constructors if your sheet has both in same file
        setDriverStandings(data.filter((row) => row.type === "driver"));
        setConstructorStandings(data.filter((row) => row.type === "constructor"));
      })
      .catch((err) => console.error(err));
  }, []);

  // Styles
  const titleStyle = { color: "#6B46C1", fontSize: "2.25rem", marginBottom: "0.75rem" };
  const buttonBase = {
    padding: "0.5rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #6B46C1",
    fontWeight: 600,
    marginRight: "0.6rem",
  };
  const activeBtn = { background: "#6B46C1", color: "#fff" };
  const inactiveBtn = { background: "#fff", color: "#6B46C1" };
  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    overflow: "hidden",
    marginTop: "1rem",
  };
  const tableWrapper = { overflowX: isMobile ? "auto" : "visible" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "700px" : "auto" };
  const theadStyle = { background: "#E9D8FD" };
  const thStyle = { textAlign: "center", padding: "0.75rem", color: "#000" };
  const tdStyle = { textAlign: "center", padding: "0.75rem" };
  const rowHover = { background: "#E6E0F8" };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", backgroundColor: "#F9F9F9", minHeight: "100dvh" }}>
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
                    <td style={tdStyle}>{d.fastestlaps}</td>
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
                    <td style={tdStyle}>{c.fastestlaps}</td>
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
