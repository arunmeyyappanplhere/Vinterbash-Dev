import React, { useState } from 'react';
import './SignIn.css';
import axios from '../axios';
import { useStateValue } from '../StateProvider';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/vinterbash_2025_logo.png';
import AnimatedPage from '../templates/AnimatedPage';

function SignIn() {
    const [activeTab, setActiveTab] = useState('school');
    const [schoolName, setSchoolName] = useState('');
    const [password, setPassword] = useState('');
    const [organiserName, setOrganiserName] = useState('');
    const [organiserPassword, setOrganiserPassword] = useState('');
    const [{school}, dispatch] = useStateValue();
    const navigate = useNavigate();

    function schoolSignin(e) {
        e.preventDefault();
        axios.post('/vinterbash/validate', {schoolName, password})
        .then((response) => {
            setSchoolName("");
            setPassword("");
            alert("Logged In");
            dispatch({
                type: 'login',
                schoolName: response.data.schoolName,
                schoolId: response.data.schoolId,
                events: response.data.events
            });
            navigate("/dashboard");
        })
        .catch((error) => {
            console.error(error);
            alert(error.response?.data?.error || "An unknown error occurred");
        });
    }

//     function organiserSignin(e) {
//     e.preventDefault();
//     axios.post('/vinterbash/organiserValidate', {organiserName, password: organiserPassword})
//     .then((response) => {
//         setOrganiserName("");
//         setOrganiserPassword("");
//         alert("Organiser Logged In");
//         dispatch({
//             type: 'organiserLogin',
//             organiserName: response.data.organiserName,
//             organiserId: response.data.organiserId,
//             role: response.data.role
//         });
//         navigate("/OrganiserDashboard");
//     })
//     .catch((error) => {
//         console.error(error);
//         alert(error.response?.data?.error || "An unknown error occurred");
//     });
// }
function organiserSignin(e) {
  e.preventDefault();
  axios.post('/vinterbash/organiserValidate', { organiserName, password: organiserPassword })
    .then((response) => {
      setOrganiserName("");
      setOrganiserPassword("");
      alert("Organiser Logged In");
      dispatch({
        type: 'organiserLogin',
        organiserName: response.data.organiserName,
        organiserId: response.data.organiserId,
        role: response.data.role,
        assignedEvent: response.data.assignedEvents, // ADD THIS
        savedResults: response.data.assignedEvents.savedResults,
      });
      navigate("/OrganiserDashboard");
    })
    .catch((error) => {
      console.error(error);
      alert(error.response?.data?.error || "An unknown error occurred");
    });
}

    return (
        <AnimatedPage>
        <div className='login'>
            <img className='login_logo' src={logo} alt="Logo" onClick={() => navigate('/homepage')}/>

            <div className='login_container'>
                {/* Tabs */}
                <div className='login_tabs'>
                    <button
                        className={`login_tab ${activeTab === 'school' ? 'active' : ''}`}
                        onClick={() => setActiveTab('school')}
                    >
                        School Sign In
                    </button>
                    <button
                        className={`login_tab ${activeTab === 'organiser' ? 'active' : ''}`}
                        onClick={() => setActiveTab('organiser')}
                    >
                        Organiser Sign In
                    </button>
                </div>

                {/* School Sign In */}
                {activeTab === 'school' && (
                    <>
                        <form>
                            <h5>School Name</h5>
                            <input type='text' value={schoolName} onChange={(e) => setSchoolName(e.target.value)}/>
                            <h5>Password</h5>
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <button className='login_signin' type='submit' onClick={schoolSignin}>Sign In</button>
                        </form>
                        <p style={{color:"red"}}>Please paste the exact School Name and Password given</p>
                    </>
                )}

                {/* Organiser Sign In */}
                {activeTab === 'organiser' && (
                    <>
                        <form>
                            <h5>Organiser Name</h5>
                            <input type='text' value={organiserName} onChange={(e) => setOrganiserName(e.target.value)}/>
                            <h5>Password</h5>
                            <input type='password' value={organiserPassword} onChange={(e) => setOrganiserPassword(e.target.value)}/>
                            <button className='login_signin' type='submit' onClick={organiserSignin}>Sign In</button>
                        </form>
                        <p style={{color:"red"}}>Please use your organiser credentials</p>
                    </>
                )}

                <p>By Signing in here you accept to all our term and conditions</p>
                <p>For further queries contact : 7010089170</p>
            </div>
        </div>
        </AnimatedPage>
    );
}

export default SignIn;