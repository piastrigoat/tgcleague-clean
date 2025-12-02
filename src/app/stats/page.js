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
  const stats = data.find((d) => d["driver"] === selectedDriver);

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#000", // black background
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
          letterSpacing: "-1px",
        }}
      >
        📊 Driver Stats
      </h1>

      {/* Driver Selector */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <label style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Select Driver:
        </label>

        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          style={{
            marginTop: "0.75rem",
            padding: "0.6rem 1rem",
            borderRadius: "0.5rem",
            border: "2px solid #dd3333ff",
            backgroundColor: "#111",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
            outline: "none",
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

      {/* Stats Display */}
      {stats && (
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {[
            { label: "Wins", key: "wins" },
            { label: "Podiums", key: "podiums" },
            { label: "Poles", key: "poles" },
            { label: "Fastest Laps", key: "fastest laps" },
            { label: "Races", key: "races" },
            { label: "Driver Championships", key: "drivers championships" },
            {
              label: "Constructor Championships",
              key: "constructors championships",
            },
            { label: "Points", key: "points" },
            { label: "DNFs", key: "dnf's" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "#1a1a1a",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                borderLeft: "4px solid #dd3333ff",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: "0.5rem",
                  color: "#dd3333ff",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </h3>
              <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: "800" }}>
                {stats[item.key] || "0"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
