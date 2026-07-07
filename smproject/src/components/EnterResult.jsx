// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './EnterResult.css';

// // Dummy Data
// const dummyData = {
//     eventName: "Drop the Beat",
//     schools: [
//         {
//             schoolId: "1",
//             schoolName: "SAV",
//             teams: [
//                 { teamId: "101", teamName: "SAV Team A", participants: ["Vishal", "Arun", "Sundar"] },
//                 { teamId: "102", teamName: "SAV Team B", participants: ["Karthik", "Priya"] }
//             ]
//         },
//         {
//             schoolId: "2",
//             schoolName: "RSK",
//             teams: [
//                 { teamId: "103", teamName: "RSK Team A", participants: ["Rahul", "Meena", "Kumar"] }
//             ]
//         },
//         {
//             schoolId: "3",
//             schoolName: "KNMS",
//             teams: [
//                 { teamId: "104", teamName: "KNMS Team A", participants: ["Anbu", "Selvi"] },
//                 { teamId: "105", teamName: "KNMS Team B", participants: ["Ravi", "Deepa", "Mani"] }
//             ]
//         },
//         {
//             schoolId: "4",
//             schoolName: "Vageesha",
//             teams: [
//                 { teamId: "106", teamName: "Vageesha Team A", participants: ["Siva", "Gowri", "Prakash"] }
//             ]
//         },
//         {
//             schoolId: "5",
//             schoolName: "Alpha Wisdom",
//             teams: [
//                 { teamId: "107", teamName: "Alpha Wisdom Team A", participants: ["Raj", "Nisha"] }
//             ]
//         },
//         {
//             schoolId: "6",
//             schoolName: "Alpha Global",
//             teams: [
//                 { teamId: "108", teamName: "Alpha Global Team A", participants: ["Dev", "Kavya", "Surya"] }
//             ]
//         }
//     ]
// };

// function EnterResult() {
//     const navigate = useNavigate();
//     const [selectedSchool, setSelectedSchool] = useState(null);
//     const [selectedTeam, setSelectedTeam] = useState(null);
//     const [teamResults, setTeamResults] = useState({});
//     const [submitted, setSubmitted] = useState(false);

//     function handleSchoolSelect(school) {
//         setSelectedSchool(school);
//         setSelectedTeam(null);
//     }

//     function handleTeamSelect(team) {
//         setSelectedTeam(team);
//     }

//     function handlePositionChange(teamId, value) {
//         setTeamResults(prev => ({
//             ...prev,
//             [teamId]: value
//         }));
//     }

//     function handleClear() {
//         setSelectedSchool(null);
//         setSelectedTeam(null);
//         setTeamResults({});
//         setSubmitted(false);
//     }

//     function getPositionLabel(pos) {
//         switch(pos) {
//             case "1": return "🥇 1st Place";
//             case "2": return "🥈 2nd Place";
//             case "3": return "🥉 3rd Place";
//             case "0": return "Did Not Win";
//             case "-1": return "❌ Disqualified";
//             default: return "Not Set";
//         }
//     }

//     function getPositionClass(pos) {
//         switch(pos) {
//             case "1": return "gold";
//             case "2": return "silver";
//             case "3": return "bronze";
//             case "-1": return "dq";
//             default: return "";
//         }
//     }

//     function handleSubmit(e) {
//         e.preventDefault();
//         setSubmitted(true);
//         console.log("Final Results:", teamResults);
//         // TODO: connect to axios when backend is ready
//     }

//     return (
//         <div className='enter_result'>

//             {/* Header */}
//             <div className='er_header'>
//                 <h1>🏆 Enter Results</h1>
//                 <p>Event: <strong>{dummyData.eventName}</strong></p>
//             </div>

//             {submitted ? (
//                 // Success Screen
//                 <div className='er_success'>
//                     <h2>✅ Results Submitted!</h2>
//                     <table className='er_summary_table'>
//                         <thead>
//                             <tr>
//                                 <th>School</th>
//                                 <th>Team</th>
//                                 <th>Position</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {dummyData.schools.map(school =>
//                                 school.teams.map(team => (
//                                     <tr key={team.teamId} className={getPositionClass(teamResults[team.teamId])}>
//                                         <td>{school.schoolName}</td>
//                                         <td>{team.teamName}</td>
//                                         <td>{getPositionLabel(teamResults[team.teamId] || "0")}</td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                     <button className='er_clear_btn' onClick={handleClear}>Enter Again</button>
//                     <button className='er_back_btn' onClick={() => navigate('/organiserDashboard')}>Back to Dashboard</button>
//                 </div>
//             ) : (
//                 <form onSubmit={handleSubmit}>
//                     <div className='er_body'>

//                         {/* School List */}
//                         <div className='er_school_list'>
//                             <h3>Select School</h3>
//                             {dummyData.schools.map(school => (
//                                 <div
//                                     key={school.schoolId}
//                                     className={`er_school_card ${selectedSchool?.schoolId === school.schoolId ? 'active' : ''}`}
//                                     onClick={() => handleSchoolSelect(school)}
//                                 >
//                                     {school.schoolName}
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Teams */}
//                         {selectedSchool && (
//                             <div className='er_team_list'>
//                                 <h3>Teams from <span>{selectedSchool.schoolName}</span></h3>
//                                 {selectedSchool.teams.map(team => (
//                                     <div key={team.teamId} className='er_team_card'>
//                                         {/* Team Name - clickable */}
//                                         <div
//                                             className={`er_team_name ${selectedTeam?.teamId === team.teamId ? 'active' : ''}`}
//                                             onClick={() => handleTeamSelect(selectedTeam?.teamId === team.teamId ? null : team)}
//                                         >
//                                             👥 {team.teamName}
//                                             <span>{selectedTeam?.teamId === team.teamId ? ' ▲' : ' ▼'}</span>
//                                         </div>

//                                         {/* Participants + Position Dropdown */}
//                                         {selectedTeam?.teamId === team.teamId && (
//                                             <div className='er_team_details'>
//                                                 <div className='er_participants'>
//                                                     <strong>Participants:</strong>
//                                                     <p>{team.participants.join(", ")}</p>
//                                                 </div>
//                                                 <div className='er_position'>
//                                                     <strong>Position:</strong>
//                                                     <select
//                                                         value={teamResults[team.teamId] || "0"}
//                                                         onChange={(e) => handlePositionChange(team.teamId, e.target.value)}
//                                                     >
//                                                         <option value="0">Did Not Win</option>
//                                                         <option value="1">🥇 1st Place</option>
//                                                         <option value="2">🥈 2nd Place</option>
//                                                         <option value="3">🥉 3rd Place</option>
//                                                         <option value="-1">❌ Disqualified</option>
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Actions */}
//                     <div className='er_actions'>
//                         <button type='button' className='er_clear_btn' onClick={handleClear}>🔄 Clear</button>
//                         <button type='submit' className='er_submit_btn'>✅ Submit Results</button>
//                         <button type='button' className='er_back_btn' onClick={() => navigate('/organiserDashboard')}>Back</button>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );
// }

// export default EnterResult;
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useStateValue } from '../StateProvider';
import {
  Box, Button, Divider, Grid, IconButton,
  InputLabel, MenuItem, Paper, Select, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './EnterResult.css';

const POSITION_POINTS = { 1: 10, 2: 7, 3: 5 };

export default function EnterResult() {
  const [{ assignedEvent }] = useStateValue();

  // assignedEvent = { eventId, eventName, particpants: [...] }
  const eventId   = assignedEvent?.eventId   || '';
  const eventName = assignedEvent?.eventName || '';

  const [schoolOptions, setSchoolOptions]             = useState([]);
  const [selectedSchoolId, setSelectedSchoolId]       = useState('');
  const [teams, setTeams]                             = useState([]);
  const [selectedTeamId, setSelectedTeamId]           = useState('');
  const [position, setPosition]                       = useState(1);
  const [rows, setRows]                               = useState([]);
  const [message, setMessage]                         = useState('');
  const [loading, setLoading]                         = useState(false);

  // Load schools registered for this organiser's event on mount
  useEffect(() => {
    if (!eventId) return;
    axios.post('/vinterbash/schoolsForEvent', { eventId })
      .then((res) => setSchoolOptions(res.data?.schools || []))
      .catch((err) => {
        console.error(err);
        setMessage('Could not load schools for this event');
      });
  }, [eventId]);

  // When school changes, load that school's teams for this event
  useEffect(() => {
    setTeams([]);
    setSelectedTeamId('');
    if (!selectedSchoolId || !eventId) return;

    axios.post('/vinterbash/teamsForSchoolEvent', { schoolId: selectedSchoolId, eventId })
      .then((res) => setTeams(res.data?.teams || []))
      .catch((err) => {
        console.error(err);
        setMessage('Could not load teams for this school');
      });
  }, [selectedSchoolId, eventId]);

  const selectedTeam   = teams.find((t) => t.teamId === selectedTeamId) || null;
  const selectedSchool = schoolOptions.find((s) => s.schoolId === selectedSchoolId) || null;

  const addRow = () => {
    if (!selectedTeamId) {
      setMessage('Select a school and team first');
      return;
    }
    // Prevent duplicate team entries
    if (rows.find((r) => r.teamId === selectedTeamId)) {
      setMessage('This team is already in the list');
      return;
    }
    setRows((prev) => [
      ...prev,
      {
        eventId,
        eventName,
        schoolId:   selectedSchoolId,
        schoolName: selectedSchool?.schoolName || '',
        teamId:     selectedTeam.teamId,
        teamName:   selectedTeam.teamName,
        members:    selectedTeam.participants.map((p) => p.participantName),
        position,
        points:     POSITION_POINTS[position],
      },
    ]);
    setMessage('');
  };

  const removeRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!rows.length) {
      setMessage('Add at least one result before saving');
      return;
    }
    try {
      setLoading(true);
      await Promise.all(
        rows.map((r) =>
          axios.post('/vinterbash/enterResults', {
            event_id: r.eventId,
            team_id:  r.teamId,
            position: r.position,
          })
        )
      );
      setMessage('Results saved successfully');
      setRows([]);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (!assignedEvent) {
    return (
      <Box className="enter-results-page">
        <Typography>No event assigned. Please sign in as an organiser.</Typography>
      </Box>
    );
  }

  return (
    <Box className="enter-results-page">
      <Typography variant="h4" gutterBottom className="enter-results-title">
        Enter Results
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} className="enter-results-card">

            {/* Locked event banner */}
            <Box className="event-banner">
              <Typography variant="subtitle2" className="event-banner-label">Your event</Typography>
              <Typography variant="h6" className="event-banner-name">{eventName}</Typography>
            </Box>

            <Divider className="section-divider" />

            <Typography variant="h6" gutterBottom className="section-title">
              Result entry
            </Typography>

            <Box component="form" onSubmit={handleSubmit} className="enter-results-form">
              <Grid container spacing={2}>

                {/* School dropdown */}
                <Grid item xs={12} sm={6}>
                  <InputLabel className="input-label">School</InputLabel>
                  <Select
                    fullWidth
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    displayEmpty
                    size="small"
                    className="input-select"
                  >
                    <MenuItem value="">Select school</MenuItem>
                    {schoolOptions.map((s) => (
                      <MenuItem key={s.schoolId} value={s.schoolId}>
                        {s.schoolName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {/* Team dropdown */}
                <Grid item xs={12} sm={6}>
                  <InputLabel className="input-label">Team / Participant</InputLabel>
                  <Select
                    fullWidth
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    displayEmpty
                    size="small"
                    className="input-select"
                    disabled={!selectedSchoolId}
                  >
                    <MenuItem value="">
                      {selectedSchoolId ? 'Select team' : 'Select a school first'}
                    </MenuItem>
                    {teams.map((t) => (
                      <MenuItem key={t.teamId} value={t.teamId}>
                        {t.teamName}
                        {t.participants.length === 1
                          ? ` — ${t.participants[0].participantName}`
                          : ` (${t.participants.length} members)`}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              {/* Show members when a team is selected */}
              {selectedTeam && selectedTeam.participants.length > 1 && (
                <Box className="members-preview">
                  <Typography variant="caption" className="members-label">Members:</Typography>
                  <Typography variant="body2">
                    {selectedTeam.participants.map((p) => p.participantName).join(', ')}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} sm={3}>
                  <InputLabel className="input-label">Position</InputLabel>
                  <Select
                    fullWidth
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    size="small"
                    className="input-select"
                  >
                    <MenuItem value={1}>🥇 1st — 10 pts</MenuItem>
                    <MenuItem value={2}>🥈 2nd — 7 pts</MenuItem>
                    <MenuItem value={3}>🥉 3rd — 5 pts</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    onClick={addRow}
                    size="small"
                    className="primary-button"
                    disabled={!selectedTeamId}
                    sx={{ mt: 3.5 }}
                  >
                    Add to list
                  </Button>
                </Grid>
              </Grid>

              <Divider className="section-divider" />

              <Box className="section-header">
                <Typography variant="subtitle1" className="section-label">
                  Pending results ({rows.length})
                </Typography>
                <Typography variant="subtitle2">
                  {rows.reduce((s, r) => s + r.points, 0)} total pts
                </Typography>
              </Box>

              {rows.length === 0 ? (
                <Typography className="empty-state">
                  Use the dropdowns above to add results to the list.
                </Typography>
              ) : (
                rows.map((r, i) => (
                  <Paper key={`${r.teamId}-${i}`} variant="outlined" className="participant-card">
                    <Grid container spacing={2} alignItems="center" className="participant-grid">
                      <Grid item xs={12} sm={5}>
                        <Typography variant="body2" fontWeight={600}>{r.teamName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.schoolName}
                        </Typography>
                        {r.members.length > 1 && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {r.members.join(', ')}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2">
                          {r.position === 1 ? '🥇' : r.position === 2 ? '🥈' : '🥉'} {r.position === 1 ? '1st' : r.position === 2 ? '2nd' : '3rd'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <Typography variant="body2" className="points-label">
                          {r.points} pts
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={2} className="delete-cell">
                        <IconButton color="error" onClick={() => removeRow(i)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}

              <Box className="form-actions">
                <Button
                  variant="outlined"
                  onClick={() => setRows([])}
                  size="small"
                  className="secondary-button"
                >
                  Clear all
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !rows.length}
                  className="primary-button"
                >
                  {loading ? 'Saving...' : 'Save results'}
                </Button>
              </Box>

              {message && (
                <Typography
                  className={message.toLowerCase().includes('fail') || message.toLowerCase().includes('error')
                    ? 'message-error' : 'message-success'}
                >
                  {message}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}