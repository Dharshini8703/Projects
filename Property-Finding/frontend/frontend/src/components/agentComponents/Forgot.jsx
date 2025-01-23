import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../App.css';
import '../../index.css';
import AgentReset from './Reset';

function AgentForgot({ onClose,onResetOpen,onForgotOpen }) {
  const [formData, setFormData] = useState({});
  const [submit, setSubmit] = useState('');
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const [validate, setValidate] = useState(false);

  const setValidateFunc = () => {
    setValidate(false);
  }

  const handleForgot = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/agent/forgot-password', formData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log('Forgot Response:', response.data);
      alert("Reset email sent to mail");
      setSubmit(true);
      setTimeout(() => {
        setValidate(true);
    }, 2000);
    })
    .catch(error => {
      if (error.response) {
        console.error('Error Response:', error.response.data);
        setSubmit(false);
        alert(error.response.data.message);
      } else {
        console.error('Error Message:', error.message);
        setSubmit(false);
      }
    });
  };

  return (
    <div>
      {!validate ? (
      <div>
        <div className="back-button">
            <Link to="/homepage">
                <button className="golden-back-btn">
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
              </Link>
            </div>
            <div className='login-box'>
        <div className="form-box">
          <form className="login-form" onSubmit={handleForgot}>
            <h1 className="my-heading">Forgot Password</h1>
            <label htmlFor="email" className="input-label">email</label>
            <input required className="input-field" id="email" name="email" type="email"
              onChange={handleInputChange}
            />
            <button className="submit-btn" type="submit">SUBMIT</button>
            {/* {submit==true && 
              onResetOpen()
            } */}
          </form>
        </div>
      </div>
      </div>
    ):(<AgentReset setValidateFunc={setValidateFunc}/>)}
    </div>
  );
}

export default AgentForgot;
