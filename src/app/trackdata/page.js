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
    backgroundColor: "#dd3333ff",
    color: "#fff",
    padding: "0.75rem",
    textAlign: "left",
    fontSize: "0.95rem",
  };

  const tdStyle = {
    padding: "0.75rem",
    color: "#000",
    fontSize: "0.9rem",
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
        minHeight: "100dvh", // mobile-safe viewport height
      }}
    >
      <h1
        style={{
          color: "#6B46C1",
          fontSize: "2rem",
          marginBottom: "1rem",
        }}
      >
        🏁 Track Data
      </h1>

      {/* Wrap the table in a scrollable container for mobile */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "0.5rem",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            minWidth: "600px", // ensures table scrolls nicely on mobile
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
                "Track Record Holder",
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
