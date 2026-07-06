import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";

function Leaderboard() {
  const [scores, setScores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/vinterbash/leaderboard",
      );
      console.log(res.data.scores);
      // setScores(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#F37D00" }}>Leaderboard</h1>

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
        <table
          style={{
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#FEC000" }}>
              <th style={th}>Rank</th>
              <th style={th}>School</th>
              <th style={th}>Total Points</th>
              <th style={{ ...th, width: "60px", textAlign: "center" }}></th>
            </tr>
          </thead>

          <tbody>
            {scores.map((row, index) => (
              <React.Fragment key={row.school_name}>
                {/* Main Row */}
                <tr
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff8ee" : "white",
                  }}
                >
                  <td style={td}>{index + 1}</td>
                  <td style={td}>{row.school_name}</td>
                  <td style={td}>{row.total_points}</td>

                  <td
                    style={{
                      ...td,
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => toggleRow(index)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                        padding: "4px",
                      }}
                    >
                      {expandedRow === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown
                          size={20}
                          style={{
                            transform:
                              expandedRow === index
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.25s ease",
                          }}
                        />
                      )}
                    </button>
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRow === index && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "15px",
                        background: "#fffdf7",
                        border: "1px solid #ddd",
                      }}
                    >
                      {row.event_results.length === 0 ? (
                        <p
                          style={{
                            margin: 0,
                            textAlign: "center",
                            color: "#777",
                          }}
                        >
                          No event results available.
                        </p>
                      ) : (
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                background: "#FFE08A",
                              }}
                            >
                              <th style={th}>Event</th>
                              <th style={th}>Position</th>
                            </tr>
                          </thead>

                          <tbody>
                            {row.event_results.map((event, i) => (
                              <tr key={i}>
                                <td style={td}>{event.event_name}</td>
                                <td style={td}>
                                  {event.position}
                                  {event.position === 1
                                    ? " 🥇"
                                    : event.position === 2
                                      ? " 🥈"
                                      : event.position === 3
                                        ? " 🥉"
                                        : ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: "0.75rem",
  textAlign: "left",
  fontWeight: "bold",
  border: "1px solid #ddd",
};

const td = {
  padding: "0.75rem",
  border: "1px solid #ddd",
};

export default Leaderboard;
