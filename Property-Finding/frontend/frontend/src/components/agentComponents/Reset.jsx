import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AgentReset(props) {
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  const handleReset = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/agent/reset-password', formData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log('Response:', response.data);
        alert("Password reset successfully");
        // onclose();
        navigate('/homepage');
      })
      .catch(error => {
        if (error.response) {
          console.error('Error Response:', error.response.data);
          alert(error.response.data);
        } else {
          console.error('Error Message:', error.message);
        }
      });
  };

  return (
    <div>
      <div className="back-button">
        <button className="golden-back-btn" onClick={props.setValidateFunc}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>
      </div>
      <div className='login-box1'>
        <div className="form-box">
          <form className="login-form" onSubmit={handleReset}>
            <h1 className="my-heading">Reset Password</h1>
            <label htmlFor="email" className="input-label">email</label>
            <input required className="input-field" id="email" name="email" type="text"
              onChange={handleInputChange}
            />
            <label htmlFor="otp" className="input-label">otp</label>
            <input required className="input-field" id="otp" name="otp" type="otp"
              onChange={handleInputChange}
            />
            <label htmlFor="newPassword" className="input-label">password</label>
            <input required className="input-field" id="newPassword" name="newPassword" type="password"
              onChange={handleInputChange}
            />
            <button className="submit-btn" type="submit" >RESET PASSWORD</button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default AgentReset;
