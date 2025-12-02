"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8dnVwFjNW0DW7zViYvDy7MlyhAB7Sr31cb3iumxBztD3fAhbNqBcj0vRSB8o0ZrcaWXwtX4JUe7gs/pub?gid=1900333362&single=true&output=csv";

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const rows = text.split("\n").map((row) => row.split(","));
        setData(rows);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!data.length)
    return (
      <p className="p-4" style={{ fontFamily: "sans-serif", color: "#fff" }}>
        Loading...
      </p>
    );

  // Extract headers and rows
  let headers = data[0];
  headers = headers.map((header) => {
    switch (header.toLowerCase()) {
      case "championships":
        return "🏆 Championships";
      case "wins":
        return "🏁 Wins";
      case "podiums":
        return "🥉 Podiums";
      case "poles":
        return "📌 Poles";
      case "fastest laps":
        return "⏱️ Fastest Laps";
      case "race starts":
        return "🏎️ Race Starts";
      case "points":
        return "💯 Points";
      case "dnfs":
        return "❌ DNFs";
      case "penalty points":
        return "⚠️ Penalty Points";
      case "penalty seconds":
        return "⏲️ Penalty Seconds";
      case "sprint wins":
        return "🏁 Sprint Wins";
      case "sprint podiums":
        return "🥉 Sprint Podiums";
      case "sprint poles":
        return "📌 Sprint Poles";
      case "sprint fastest laps":
        return "⏱️ Sprint Fastest Laps";
      default:
        return header;
    }
  });

  const rows = data.slice(1);

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        background: "#111",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1
        style={{
          color: "#dd3333ff",
          marginBottom: "2rem",
          textShadow: "1px 1px 3px black",
          textAlign: "center",
          fontSize: "2.8rem",
          fontWeight: "800",
        }}
      >
        🏆 TGC Hall of Fame
      </h1>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "separate",
            borderSpacing: "0",
            width: "100%",
            minWidth: "900px",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#1a1a1a",
          }}
        >
          <thead style={{ backgroundColor: "#dd3333ff" }}>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  style={{
                    color: "#fff",
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    borderBottom: "2px solid #000",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: i % 2 === 0 ? "#111" : "#1a1a1a",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dd3333aa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "#111" : "#1a1a1a")
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "center",
                      borderBottom: "1px solid #333",
                      fontSize: "0.95rem",
                      color: "#fff",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
