"use client";

import { useEffect, useState } from "react";

export default function StandingsPage() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [activeTab, setActiveTab] = useState("drivers");

  // Replace with your published Google Sheets CSV link
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1934660296&single=true&output=csv";

  // Parse CSV text into array of objects
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n").map((line) => line.split(","));
    return lines;
  };

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => {
        const rows = parseCSV(text);

        // First row is the header
        const headers = rows[0];
        const allData = rows.slice(1);

        // Drivers = columns A–J
        const driverData = allData
          .map((row) => ({
            position: row[0],
            driver: row[1],
            team: row[2],
            points: row[3],
            wins: row[4],
            podiums: row[5],
            poles: row[6],
            fastestLaps: row[7],
            dnfs: row[8],
            races: row[9],
          }))
          .filter((d) => d.driver); // filter out empty rows

        // Constructors = columns L–S
        const constructorData = allData
          .map((row) => ({
            position: row[11],
            team: row[12],
            points: row[13], // <-- N column (index 13)
            wins: row[14],
            podiums: row[15],
            poles: row[16],
            fastestLaps: row[17],
            dnfs: row[18],
          }))
          .filter((c) => c.team);

        setDrivers(driverData);
        setConstructors(constructorData);
      })
      .catch((err) => console.error(err));
  }, []);

  const tabStyle = (tab) => ({
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    fontWeight: activeTab === tab ? "bold" : "normal",
    backgroundColor: activeTab === tab ? "#6B46C1" : "#E5E5E5",
    color: activeTab === tab ? "#fff" : "#333",
    borderRadius: "0.5rem 0.5rem 0 0",
    marginRight: "0.5rem",
    boxShadow: activeTab === tab ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
  });

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    borderRadius: "0.5rem",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const thStyle = {
    backgroundColor: "#6B46C1",
    color: "#fff",
    padding: "0.5rem",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "0.5rem",
    color: "#000",
  };

  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? "#F7F7F7" : "#fff",
    transition: "background-color 0.2s",
  });

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundColor: "#F9F9F9",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{ color: "#6B46C1", fontSize: "2rem", marginBottom: "1rem" }}
      >
        🏎️ TGC Standings
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <div style={tabStyle("drivers")} onClick={() => setActiveTab("drivers")}>
          Drivers
        </div>
        <div
          style={tabStyle("constructors")}
          onClick={() => setActiveTab("constructors")}
        >
          Constructors
        </div>
      </div>

      {/* Drivers Table */}
      {activeTab === "drivers" && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                "Position",
                "Driver",
                "Team",
                "Points",
                "Wins",
                "Podiums",
                "Poles",
                "Fastest Laps",
                "DNFs",
                "Races",
              ].map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr
                key={i}
                style={getRowStyle(i)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EDEDED")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    getRowStyle(i).backgroundColor)
                }
              >
                <td style={tdStyle}>{d.position}</td>
                <td style={tdStyle}>{d.driver}</td>
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
      )}

      {/* Constructors Table */}
      {activeTab === "constructors" && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                "Position",
                "Team",
                "Points",
                "Wins",
                "Podiums",
                "Poles",
                "Fastest Laps",
                "DNFs",
              ].map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {constructors.map((c, i) => (
              <tr
                key={i}
                style={getRowStyle(i)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EDEDED")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    getRowStyle(i).backgroundColor)
                }
              >
                <td style={tdStyle}>{c.position}</td>
                <td style={tdStyle}>{c.team}</td>
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
      )}
    </main>
  );
}