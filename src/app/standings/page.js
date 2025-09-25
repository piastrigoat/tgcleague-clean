"use client";

import { useEffect, useState } from "react";

export default function StandingsPage() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("drivers");

  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1934660296&single=true&output=csv"; // <-- your Google Sheets CSV link

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

  useEffect(() => {
    fetch(csvUrl)
      .then((res) => res.text())
      .then((text) => setData(parseCSV(text)))
      .catch((err) => console.error(err));
  }, []);

  // Split data
  const drivers = data.filter((row) => row["driver"]);
  const constructors = data.filter(
    (row) => row["team"] && !row["driver"]
  );

  // Styles
  const tabStyle = (tab) => ({
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    fontWeight: activeTab === tab ? "bold" : "normal",
    backgroundColor: activeTab === tab ? "#6B46C1" : "#E5E5E5",
    color: activeTab === tab ? "#fff" : "#333",
    borderRadius: "0.5rem 0.5rem 0 0",
    marginRight: "0.5rem",
    flex: 1,
    textAlign: "center",
  });

  const tableContainer = {
    width: "100%",
    overflowX: "auto",
    marginTop: "1rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    minWidth: "600px", // forces horizontal scroll on mobile
  };

  const thStyle = {
    backgroundColor: "#6B46C1",
    color: "#fff",
    padding: "0.75rem",
    textAlign: "left",
    fontSize: "0.9rem",
  };

  const tdStyle = {
    padding: "0.75rem",
    color: "#000",
    fontSize: "0.9rem",
    textAlign: "left",
  };

  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? "#F7F7F7" : "#fff",
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
        style={{
          color: "#6B46C1",
          fontSize: "2rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        🏎️ Torque Gaming Centre Standings
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <div
          style={tabStyle("drivers")}
          onClick={() => setActiveTab("drivers")}
        >
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
        <div style={tableContainer}>
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
                <tr key={i} style={getRowStyle(i)}>
                  <td style={tdStyle}>{d["position"]}</td>
                  <td style={tdStyle}>{d["driver"]}</td>
                  <td style={tdStyle}>{d["team"]}</td>
                  <td style={tdStyle}>{d["points"]}</td>
                  <td style={tdStyle}>{d["wins"]}</td>
                  <td style={tdStyle}>{d["podiums"]}</td>
                  <td style={tdStyle}>{d["poles"]}</td>
                  <td style={tdStyle}>{d["fastest laps"]}</td>
                  <td style={tdStyle}>{d["dnfs"]}</td>
                  <td style={tdStyle}>{d["races"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Constructors Table */}
      {activeTab === "constructors" && (
        <div style={tableContainer}>
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
                <tr key={i} style={getRowStyle(i)}>
                  <td style={tdStyle}>{c["position"]}</td>
                  <td style={tdStyle}>{c["team"]}</td>
                  <td style={tdStyle}>{c["points"]}</td>
                  <td style={tdStyle}>{c["wins"]}</td>
                  <td style={tdStyle}>{c["podiums"]}</td>
                  <td style={tdStyle}>{c["poles"]}</td>
                  <td style={tdStyle}>{c["fastest laps"]}</td>
                  <td style={tdStyle}>{c["dnfs"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}