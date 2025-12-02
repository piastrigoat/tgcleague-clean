"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [data, setData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1247758706&single=true&output=csv";

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

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#111", // black background
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1
        style={{
          color: "#dd3333ff",
          fontSize: "2.5rem",
          marginBottom: "2rem",
          textAlign: "center",
          fontWeight: "800",
          textShadow: "0 3px 8px rgba(0,0,0,0.4)",
        }}
      >
        🏎️ Driver Stats
      </h1>

      {/* Driver Dropdown */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          Select a Driver:
        </label>

        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          style={{
            padding: "0.7rem",
            borderRadius: "0.5rem",
            border: "2px solid #dd3333ff",
            color: "#000",
            backgroundColor: "#fff",
            fontWeight: "bold",
            width: "100%",
            maxWidth: "300px",
            cursor: "pointer",
          }}
        >
          <option value="">-- Choose a Driver --</option>
          {drivers.map((driver) => (
            <option key={driver} value={driver}>
              {driver}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Table */}
      {driverStats && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto",
              borderCollapse: "collapse",
              backgroundColor: "#222",
              borderRadius: "1rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                {[
                  "Wins",
                  "Podiums",
                  "Poles",
                  "Fastest Laps",
                  "Points",
                  "DNFs",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      backgroundColor: "#dd3333ff",
                      color: "#fff",
                      padding: "1rem",
                      textAlign: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr
                style={{
                  backgroundColor: "#111",
                  height: "60px",
                }}
              >
                <td style={cellStyle}>{driverStats["wins"]}</td>
                <td style={cellStyle}>{driverStats["podiums"]}</td>
                <td style={cellStyle}>{driverStats["poles"]}</td>
                <td style={cellStyle}>{driverStats["fastest laps"]}</td>
                <td style={cellStyle}>{driverStats["points"]}</td>
                <td style={cellStyle}>{driverStats["dnf's"]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const cellStyle = {
  padding: "1rem",
  textAlign: "center",
  color: "#fff",
  fontSize: "1.1rem",
  borderBottom: "1px solid #333",
};
