import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AgentVerifyEmail() {
  const [validUrl, setValidUrl] = useState('');
  const param = useParams();
  const handleLogin = () => { 
  axios.get(`http://localhost:3000/agent/verifyEmail/${param.id}/verify/${param.token}`)
  .then(response => {
  // console.log('Response:', response.data);
  console.log("Email verification response:", response.data);
  setValidUrl(true);
  })
  .catch(error => {
  if (error.response) {
    console.error("Error verifying email:", error.response.data);
    setValidUrl(false);
    alert(error.response.data.message);
  }else {
    console.error('Error Message:', error.message);
    setValidUrl(false);
    }
  }); 
}
  return (
    <div >
    <button onClick={handleLogin} className='activate-btn'>Activate</button>
    {validUrl===true && (
		<div>
			<h1 className='write'>Email verified successfully</h1>
      <p className='p'>Click here to <a href='/agent/login'>Log in</a></p>
      </div>
		)} 
        {validUrl===false && (
			<h1 className='write'>404 Not Found</h1>
		)}
    </div>
  )
}

export default AgentVerifyEmail;