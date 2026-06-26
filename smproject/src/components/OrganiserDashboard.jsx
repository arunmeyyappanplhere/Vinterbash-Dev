import React from 'react';
import { useStateValue } from '../StateProvider';
import { useNavigate } from 'react-router-dom';
import './OrganiserDashboard.css';

// Dummy data for now
const dummyEvent = {
    eventId: "cu1",
    eventName: "Drop the Beat",
    teams: [
        {
            teamId: "101",
            schoolName: "KNMS",
            participants: [
                { studentId: 1, studentName: "Student 1" },
                { studentId: 2, studentName: "Student 2" }
            ]
        },
        {
            teamId: "102",
            schoolName: "Vageesha",
            participants: [
                { studentId: 3, studentName: "Student 3" }
            ]
        }
    ]
};

function OrganiserDashboard() {
    const [{ organiserName }] = useStateValue();
    const navigate = useNavigate();

    return (
        <div className='organiser_dashboard'>
            <h1>Welcome, {organiserName || "Organiser"}!</h1>
            <h2>Your Event: {dummyEvent.eventName}</h2>

            <div className='organiser_options'>
                <button
                    className='organiser_btn'
                    onClick={() => navigate('/enterResult')}
                >
                    Enter Results
                </button>
            </div>

            <div className='organiser_teams'>
                <h3>Registered Teams:</h3>
                {dummyEvent.teams.map((team) => (
                    <div key={team.teamId} className='organiser_team_card'>
                        <h4>{team.schoolName}</h4>
                        <ul>
                            {team.participants.map((p) => (
                                <li key={p.studentId}>{p.studentName}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrganiserDashboard;