import React, { useState, useEffect } from "react";
import axios from "axios";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/vinterbash/cummulativeScores");
      setScores(res.data.scores);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#F37D00" }}> Leaderboard</h1>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <button
          onClick={fetchScores}
          style={{
            backgroundColor: "#F37D00",
            color: "white",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
           Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <table style={{ width: "100%", maxWidth: "600px", margin: "0 auto", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FEC000" }}>
              <th style={th}>Rank</th>
              <th style={th}>School</th>
              <th style={th}>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((row, index) => (
              <tr key={row.schoolname} style={{ backgroundColor: index % 2 === 0 ? "#fff8ee" : "white" }}>
                <td style={td}>{index + 1}</td>
                <td style={td}>{row.schoolname}</td>
                <td style={td}>{row.cumulativescore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = { padding: "0.75rem", textAlign: "left", fontWeight: "bold", border: "1px solid #ddd" };
const td = { padding: "0.75rem", border: "1px solid #ddd" };

export default Leaderboard;