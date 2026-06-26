import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterResult.css';

// Dummy Data
const dummyData = {
    eventName: "Drop the Beat",
    schools: [
        {
            schoolId: "1",
            schoolName: "SAV",
            teams: [
                { teamId: "101", teamName: "SAV Team A", participants: ["Vishal", "Arun", "Sundar"] },
                { teamId: "102", teamName: "SAV Team B", participants: ["Karthik", "Priya"] }
            ]
        },
        {
            schoolId: "2",
            schoolName: "RSK",
            teams: [
                { teamId: "103", teamName: "RSK Team A", participants: ["Rahul", "Meena", "Kumar"] }
            ]
        },
        {
            schoolId: "3",
            schoolName: "KNMS",
            teams: [
                { teamId: "104", teamName: "KNMS Team A", participants: ["Anbu", "Selvi"] },
                { teamId: "105", teamName: "KNMS Team B", participants: ["Ravi", "Deepa", "Mani"] }
            ]
        },
        {
            schoolId: "4",
            schoolName: "Vageesha",
            teams: [
                { teamId: "106", teamName: "Vageesha Team A", participants: ["Siva", "Gowri", "Prakash"] }
            ]
        },
        {
            schoolId: "5",
            schoolName: "Alpha Wisdom",
            teams: [
                { teamId: "107", teamName: "Alpha Wisdom Team A", participants: ["Raj", "Nisha"] }
            ]
        },
        {
            schoolId: "6",
            schoolName: "Alpha Global",
            teams: [
                { teamId: "108", teamName: "Alpha Global Team A", participants: ["Dev", "Kavya", "Surya"] }
            ]
        }
    ]
};

function EnterResult() {
    const navigate = useNavigate();
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamResults, setTeamResults] = useState({});
    const [submitted, setSubmitted] = useState(false);

    function handleSchoolSelect(school) {
        setSelectedSchool(school);
        setSelectedTeam(null);
    }

    function handleTeamSelect(team) {
        setSelectedTeam(team);
    }

    function handlePositionChange(teamId, value) {
        setTeamResults(prev => ({
            ...prev,
            [teamId]: value
        }));
    }

    function handleClear() {
        setSelectedSchool(null);
        setSelectedTeam(null);
        setTeamResults({});
        setSubmitted(false);
    }

    function getPositionLabel(pos) {
        switch(pos) {
            case "1": return "🥇 1st Place";
            case "2": return "🥈 2nd Place";
            case "3": return "🥉 3rd Place";
            case "0": return "Did Not Win";
            case "-1": return "❌ Disqualified";
            default: return "Not Set";
        }
    }

    function getPositionClass(pos) {
        switch(pos) {
            case "1": return "gold";
            case "2": return "silver";
            case "3": return "bronze";
            case "-1": return "dq";
            default: return "";
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        console.log("Final Results:", teamResults);
        // TODO: connect to axios when backend is ready
    }

    return (
        <div className='enter_result'>

            {/* Header */}
            <div className='er_header'>
                <h1>🏆 Enter Results</h1>
                <p>Event: <strong>{dummyData.eventName}</strong></p>
            </div>

            {submitted ? (
                // Success Screen
                <div className='er_success'>
                    <h2>✅ Results Submitted!</h2>
                    <table className='er_summary_table'>
                        <thead>
                            <tr>
                                <th>School</th>
                                <th>Team</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyData.schools.map(school =>
                                school.teams.map(team => (
                                    <tr key={team.teamId} className={getPositionClass(teamResults[team.teamId])}>
                                        <td>{school.schoolName}</td>
                                        <td>{team.teamName}</td>
                                        <td>{getPositionLabel(teamResults[team.teamId] || "0")}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <button className='er_clear_btn' onClick={handleClear}>Enter Again</button>
                    <button className='er_back_btn' onClick={() => navigate('/organiserDashboard')}>Back to Dashboard</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className='er_body'>

                        {/* School List */}
                        <div className='er_school_list'>
                            <h3>Select School</h3>
                            {dummyData.schools.map(school => (
                                <div
                                    key={school.schoolId}
                                    className={`er_school_card ${selectedSchool?.schoolId === school.schoolId ? 'active' : ''}`}
                                    onClick={() => handleSchoolSelect(school)}
                                >
                                    {school.schoolName}
                                </div>
                            ))}
                        </div>

                        {/* Teams */}
                        {selectedSchool && (
                            <div className='er_team_list'>
                                <h3>Teams from <span>{selectedSchool.schoolName}</span></h3>
                                {selectedSchool.teams.map(team => (
                                    <div key={team.teamId} className='er_team_card'>
                                        {/* Team Name - clickable */}
                                        <div
                                            className={`er_team_name ${selectedTeam?.teamId === team.teamId ? 'active' : ''}`}
                                            onClick={() => handleTeamSelect(selectedTeam?.teamId === team.teamId ? null : team)}
                                        >
                                            👥 {team.teamName}
                                            <span>{selectedTeam?.teamId === team.teamId ? ' ▲' : ' ▼'}</span>
                                        </div>

                                        {/* Participants + Position Dropdown */}
                                        {selectedTeam?.teamId === team.teamId && (
                                            <div className='er_team_details'>
                                                <div className='er_participants'>
                                                    <strong>Participants:</strong>
                                                    <p>{team.participants.join(", ")}</p>
                                                </div>
                                                <div className='er_position'>
                                                    <strong>Position:</strong>
                                                    <select
                                                        value={teamResults[team.teamId] || "0"}
                                                        onChange={(e) => handlePositionChange(team.teamId, e.target.value)}
                                                    >
                                                        <option value="0">Did Not Win</option>
                                                        <option value="1">🥇 1st Place</option>
                                                        <option value="2">🥈 2nd Place</option>
                                                        <option value="3">🥉 3rd Place</option>
                                                        <option value="-1">❌ Disqualified</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className='er_actions'>
                        <button type='button' className='er_clear_btn' onClick={handleClear}>🔄 Clear</button>
                        <button type='submit' className='er_submit_btn'>✅ Submit Results</button>
                        <button type='button' className='er_back_btn' onClick={() => navigate('/organiserDashboard')}>Back</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default EnterResult;