"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [data, setData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1247758706&single=true&output=csv"; // Replace with your published Google Sheets CSV link for "Driver Stats"

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

  const drivers = data.map((d) => d["driver"]).filter(Boolean);
  const driverStats = data.find((d) => d["driver"] === selectedDriver);

  const tableStyle = {
    width: "100%",
    maxWidth: "700px",
    margin: "2rem auto",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };

  const thStyle = {
    backgroundColor: "#dd3333ff",
    color: "#fff",
    padding: "0.75rem",
    textAlign: "center",
  };

  const tdStyle = {
    padding: "0.75rem",
    textAlign: "center",
    color: "#000",
  };

  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? "#F7F7F7" : "#fff",
  });

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      <h1 style={{ color: "#6B46C1", fontSize: "2rem", marginBottom: "1.5rem" }}>🏎️ Driver Stats</h1>

      {/* Driver Dropdown */}
      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Select Driver:</label>
      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        style={{
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
          color: "#000",
          backgroundColor: "#fff",
          fontWeight: "bold",
          width: "100%",
          maxWidth: "300px",
          marginBottom: "2rem",
        }}
      >
        <option value="">-- Choose a Driver --</option>
        {drivers.map((driver) => (
          <option key={driver} value={driver}>{driver}</option>
        ))}
      </select>

      {/* Stats Table */}
      {driverStats && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {["Wins", "Podiums", "Poles", "Fastest Laps", "Points", "DNFs"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={getRowStyle(0)}>
              <td style={tdStyle}>{driverStats["wins"]}</td>
              <td style={tdStyle}>{driverStats["podiums"]}</td>
              <td style={tdStyle}>{driverStats["poles"]}</td>
              <td style={tdStyle}>{driverStats["fastest laps"]}</td>
              <td style={tdStyle}>{driverStats["points"]}</td>
              <td style={tdStyle}>{driverStats["dnf's"]}</td>
            </tr>
          </tbody>
        </table>
      )}
    </main>
  );
}