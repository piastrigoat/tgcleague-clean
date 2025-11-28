"use client";


import { useState, useEffect } from 'react';

export default function FantasyPage() {
  const [username, setUsername] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [constructorPick, setConstructorPick] = useState('');
  const [picks, setPicks] = useState(['', '', '']);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('/api/drivers').then(r => r.json()).then(setDrivers).catch(console.error);
  }, []);

  const fetchLeaderboard = () => {
    fetch('/api/leaderboard').then(r => r.json()).then(setLeaderboard).catch(console.error);
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const submitPicks = async () => {
    if (!username) return alert('Please enter a username!');
    if (picks.some(p => !p)) return alert('Please select all 3 drivers!');
    if (!constructorPick) return alert('Please select a constructor!');

    const res = await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, picks, constructor: constructorPick }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('Error: ' + (err.error || res.statusText));
    } else {
      alert('Picks submitted!');
      fetchLeaderboard();
    }
  };

  // remember username locally
  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('tgc_username');
    if (saved) setUsername(saved);
  }, []);
  useEffect(() => {
    if (username) localStorage.setItem('tgc_username', username);
  }, [username]);

  return (
    <div style={{
      maxWidth: 900,
      margin: '20px auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 20,
      backgroundColor: '#f4f4f9',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#1a202c' }}>🏎 Fantasy Racing League 🏁</h1>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <input
          placeholder='Enter your username'
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: 10, fontSize: 16, width: 300, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#2d3748' }}>Pick 3 Drivers</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {picks.map((d, i) => (
            <select
              key={i}
              value={picks[i]}
              onChange={e => setPicks(p => { p[i] = e.target.value; return [...p]; })}
              style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', minWidth: 200 }}
            >
              <option value=''>Select driver</option>
              {drivers.map(dr => <option key={dr[0]} value={dr[0]}>{dr[0]} ({dr[1]})</option>)}
            </select>
          ))}
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#2d3748' }}>Pick 1 Constructor</h2>
        <select value={constructorPick} onChange={e => setConstructorPick(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', minWidth: 220 }}>
          <option value=''>Select constructor</option>
          {[...new Set(drivers.map(d => d[1]))].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button onClick={submitPicks} style={{
          backgroundColor: '#3182ce', color: 'white', padding: '10px 30px', fontSize: 16,
          border: 'none', borderRadius: 6, cursor: 'pointer'
        }}>Submit Picks</button>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ color: '#2d3748', textAlign: 'center' }}>Leaderboard</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
          <thead>
            <tr style={{ backgroundColor: '#e2e8f0' }}>
              <th style={{ border: '1px solid #cbd5e0', padding: 10 }}>User</th>
              <th style={{ border: '1px solid #cbd5e0', padding: 10 }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(u => (
              <tr key={u.username} style={{ textAlign: 'center' }}>
                <td style={{ border: '1px solid #cbd5e0', padding: 10 }}>{u.username}</td>
                <td style={{ border: '1px solid #cbd5e0', padding: 10 }}>{u.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
