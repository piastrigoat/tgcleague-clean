"use client";

import { useEffect, useState } from "react";

export default function StandingsPage() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("drivers"); // default tab

  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1934660296&single=true&output=csv"; // replace with your published Google Sheets CSV link

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");
    return lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, i) => {
        obj[header.trim()] = values[i] || "";
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

  // Drivers table: columns A-J
  const drivers = data.map((row) => ({
    position: row["Position"] || row["A"],
    driver: row["Driver"] || row["B"],
    team: row["Team"] || row["C"],
    points: row["Points"] || row["D"],
    wins: row["Wins"] || row["E"],
    podiums: row["Podiums"] || row["F"],
    poles: row["Poles"] || row["G"],
    fastestLaps: row["Fastest Laps"] || row["H"],
    dnfs: row["DNFs"] || row["I"],
    races: row["Races"] || row["J"],
  }));

  // Constructors table: columns L-S
  const constructors = data.map((row) => ({
    position: row["L"],
    team: row["M"],
    wins: row["O"],
    podiums: row["P"],
    poles: row["Q"],
    fastestLaps: row["R"],
    dnfs: row["S"],
  })).filter(c => c.position); // only rows that exist

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
    backgroundColor: "#dd3333ff",
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
    <main style={{ padding: "2rem", fontFamily: "sans-serif", backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      <h1 style={{ color: "#6B46C1", fontSize: "2rem", marginBottom: "1rem" }}> TGC Standings</h1>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <div style={tabStyle("drivers")} onClick={() => setActiveTab("drivers")}>Drivers</div>
        <div style={tabStyle("constructors")} onClick={() => setActiveTab("constructors")}>Constructors</div>
      </div>

      {/* Drivers Table */}
      {activeTab === "drivers" && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {["Position","Driver","Team","Points","Wins","Podiums","Poles","Fastest Laps","DNFs","Races"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr key={i} style={getRowStyle(i)} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EDEDED"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = getRowStyle(i).backgroundColor}>
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
              {["Position","Team","Wins","Podiums","Poles","Fastest Laps","DNFs"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {constructors.map((c, i) => (
              <tr key={i} style={getRowStyle(i)} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#EDEDED"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = getRowStyle(i).backgroundColor}>
                <td style={tdStyle}>{c.position}</td>
                <td style={tdStyle}>{c.team}</td>
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