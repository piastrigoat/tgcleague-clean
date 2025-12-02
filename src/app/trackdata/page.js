"use client";

import { useEffect, useState } from "react";

export default function TrackDataPage() {
  const [data, setData] = useState([]);

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1639274782&single=true&output=csv";

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

  const thStyle = {
    backgroundColor: "#dd3333ff", // red
    color: "#fff",
    padding: "0.75rem",
    textAlign: "left",
    fontSize: "0.95rem",
    borderBottom: "2px solid #000",
  };

  const tdStyle = {
    padding: "0.75rem",
    color: "#000",
    fontSize: "0.9rem",
    borderBottom: "1px solid #ddd",
  };

  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? "#111" : "#1a1a1a",
  });

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#111", // black background
        minHeight: "100dvh",
        color: "#fff",
      }}
    >
      <h1
        style={{
          color: "#dd3333ff",
          fontSize: "2.4rem",
          marginBottom: "1.5rem",
          fontWeight: "800",
          textAlign: "center",
          textShadow: "0 4px 10px rgba(0,0,0,0.4)",
        }}
      >
        🏁 Track Data
      </h1>

      {/* Scroll container */}
      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr>
              {[
                "Track",
                "Most Wins",
                "",
                "Most Podiums",
                "",
                "Most Poles",
                "",
                "Record Holder",
                "Track Record",
              ].map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={getRowStyle(i)}>
                <td style={tdStyle}>{row["track"]}</td>
                <td style={tdStyle}>{row["wins driver"]}</td>
                <td style={tdStyle}>{row["wins count"]}</td>
                <td style={tdStyle}>{row["podiums driver"]}</td>
                <td style={tdStyle}>{row["podiums count"]}</td>
                <td style={tdStyle}>{row["poles driver"]}</td>
                <td style={tdStyle}>{row["poles count"]}</td>
                <td style={tdStyle}>{row["track record driver"]}</td>
                <td style={tdStyle}>{row["track record lap time"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
