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

  let headers = data[0].map((header) => {
    const lower = header.toLowerCase();
    const emojiMap: any = {
      championships: "🏆 Championships",
      wins: "🏁 Wins",
      podiums: "🥉 Podiums",
      poles: "📌 Poles",
      "fastest laps": "⏱️ Fastest Laps",
      "race starts": "🏎️ Race Starts",
      points: "💯 Points",
      dnfs: "❌ DNFs",
      "penalty points": "⚠️ Penalty Points",
      "penalty seconds": "⏲️ Penalty Seconds",
      "sprint wins": "🏁 Sprint Wins",
      "sprint podiums": "🥉 Sprint Podiums",
      "sprint poles": "📌 Sprint Poles",
      "sprint fastest laps": "⏱️ Sprint Fastest Laps",
    };
    return emojiMap[lower] || header;
  });

  const rows = data.slice(1);

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#111", // black background
        color: "#fff",
      }}
    >
      <h1
        style={{
          color: "#dd3333ff",
          marginBottom: "2rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "800",
        }}
      >
        🏆 TGC Hall of Fame
      </h1>

      <div
        style={{
          overflowX: "auto",
          borderRadius: "12px",
          padding: "1rem",
        }}
      >
        <table
          style={{
            borderCollapse: "separate",
            borderSpacing: "0",
            width: "100%",
            minWidth: "900px",
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
          }}
        >
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  style={{
                    backgroundColor: "#dd3333ff",
                    color: "#fff",
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    borderBottom: "3px solid #aa2222",
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
                  backgroundColor: i % 2 === 0 ? "#222" : "#2c2c2c",
                  transition: "0.25s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#333")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "#222" : "#2c2c2c")
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "0.9rem 1rem",
                      textAlign: "center",
                      color: "#fff",
                      borderBottom: "1px solid #444",
                    }}
                  >
                    {cell || "-"}
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
