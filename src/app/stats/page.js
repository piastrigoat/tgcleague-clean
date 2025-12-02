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
        obj[header.trim()] = values[i]?.trim() || "";
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

  const drivers = data.map((d) => d["Driver"]).filter(Boolean);
  const driver = data.find((d) => d["Driver"] === selectedDriver);

  // CARD STYLE
  const card = {
    background: "#fff",
    borderRadius: "16px",
    padding: "1.5rem",
    width: "100%",
    maxWidth: "450px",
    margin: "1rem auto",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    border: "2px solid #dd3333ff",
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.6rem 0",
    borderBottom: "1px solid #eee",
    fontSize: "1.1rem",
    color: "#000",
  };

  const label = { fontWeight: "700" };
  const value = { fontWeight: "600" };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f3f3f3",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#dd3333ff",
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
          fontWeight: "800",
        }}
      >
        🔥 Driver Stats
      </h1>

      {/* DRIVER SELECT */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            border: "2px solid #dd3333ff",
            fontWeight: "700",
            fontSize: "1.1rem",
            width: "90%",
            maxWidth: "320px",
            color: "#000",
          }}
        >
          <option value="">-- Select Driver --</option>
          {drivers.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* DRIVER CARD */}
      {driver && (
        <div style={card}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "1rem",
              color: "#dd3333ff",
              fontWeight: "800",
            }}
          >
            {driver["Driver"]}
          </h2>

          <div style={row}>
            <span style={label}>Wins:</span>
            <span style={value}>{driver["Wins"]}</span>
          </div>

          <div style={row}>
            <span style={label}>Podiums:</span>
            <span style={value}>{driver["Podiums"]}</span>
          </div>

          <div style={row}>
            <span style={label}>Poles:</span>
            <span style={value}>{driver["Poles"]}</span>
          </div>

          <div style={row}>
            <span style={label}>Fastest Laps:</span>
            <span style={value}>{driver["Fastest Laps"]}</span>
          </div>

          <div style={row}>
            <span style={label}>Races:</span>
            <span style={value}>{driver["Races"]}</span>
          </div>

          <div style={row}>
            <span style={label}>Driver Championships:</span>
            <span style={value}>{driver["Drivers Championships"]}</span>
          </div>

          <div style={row}>
            <span style={label}>Constructors Championships:</span>
            <span style={value}>{driver["Constructors Championships"]}</span>
          </div>

          <div style={row}>
            <span style={label}>Points:</span>
            <span style={value}>{driver["Points"]}</span>
          </div>

          <div style={row}>
            <span style={label}>DNF's:</span>
            <span style={value}>{driver["DNF's"]}</span>
          </div>
        </div>
      )}
    </main>
  );
}
