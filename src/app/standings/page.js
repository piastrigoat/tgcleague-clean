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
        obj[header.trim()] = values[i]?.trim();
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
  const stats = data.find((d) => d["Driver"] === selectedDriver);

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
      }}
    >
      <h1
        style={{
          color: "#dd3333ff",
          textAlign: "center",
          fontSize: "2.4rem",
          marginBottom: "2rem",
          textShadow: "0 0 10px rgba(221,51,51,0.4)",
        }}
      >
        🏎️ Driver Stats
      </h1>

      {/* Driver Dropdown */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1.1rem",
            borderRadius: "0.5rem",
            border: "2px solid #dd3333ff",
            backgroundColor: "#000",
            color: "#fff",
            width: "90%",
            maxWidth: "350px",
            cursor: "pointer",
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

      {/* Stats Display */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.2rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            { label: "🏆 Driver Championships", value: stats["Drivers Championships"] },
            { label: "🏆 Constructors Championships", value: stats["Constructors Championships"] },
            { label: "🏁 Wins", value: stats["Wins"] },
            { label: "🥉 Podiums", value: stats["Podiums"] },
            { label: "📌 Poles", value: stats["Poles"] },
            { label: "⏱ Fastest Laps", value: stats["Fastest Laps"] },
            { label: "🏎 Races", value: stats["Races"] },
            { label: "💯 Points", value: stats["Points"] },
            { label: "❌ DNFs", value: stats["DNF's"] },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #dd3333ff",
                borderRadius: "0.75rem",
                padding: "1.2rem",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  fontSize: "1.1rem",
                  opacity: 0.85,
                  marginBottom: "0.5rem",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#dd3333ff",
                  textShadow: "0 0 8px rgba(221,51,51,0.5)",
                }}
              >
                {item.value || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
