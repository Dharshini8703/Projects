import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; // Ensure you import your CSS file
import logoImage from '../../assets/vkr.jpg'

function AgentLogin(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/agent/login', formData, {
      headers: {
        'Content-Type': 'application/json',
        'username': formData.username,
        'password': formData.password,
      }
    })
    .then(response => {
      console.log('Response:', response.data);
      localStorage.setItem('token', response.data.accessToken);
      alert("Login successfully");
      navigate('/agent/agentHome');
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
    <div className="login-box">
       <nav className="navbar navbar-expand-md navbar-dark bg-black border-bottom border-white fixed-top navbar-custom" aria-label="Fourth navbar example">
                <div className="container-fluid">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"></use></svg>
                    </a>
                    <div className="profile1-image-container1">
                    <img src={logoImage} alt="Profile" className="profile1-image" />
                  </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarsExample04">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Rent</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Buy</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Commercial</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Find Agent</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Upcomming projects</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown" aria-expanded="false">Explore</a>
                                <ul className="dropdown-menu" aria-labelledby="dropdown04">
                                    <li><a className="dropdown-item" href="#">PROPERTY BLOG</a></li>
                                    <li><a className="dropdown-item" href="#">COMPANY INSIGHTS</a></li>
                                    <li><a className="dropdown-item" href="#">KNOW YOUR RIGHTS</a></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="dropdown">
                            <a className="btn btn-secondary dropdown-toggle golden-btn mx-5" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                LOGIN
                            </a>
                            <ul className="dropdown-menu my-3" aria-labelledby="dropdownMenuLink">
                            <li><a className="dropdown-item font-style" href="/admin/login" >ADMIN</a></li>
                                <li><a className="dropdown-item font-style" href="/company/login" >COMPANY</a></li>
                                <li><a className="dropdown-item font-style" href="/owner/login" >PROPERTY OWNER</a></li>
                                <li><a className="dropdown-item font-style" href="/client/login" >CLIENT</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
      <div className="form-box">
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="my-heading">Agent Login</h1>
          <h4 className="sub-heading">We're glad to see you again!</h4>
          <div className="link">
            <p>Don't have an account? <a href="/agent/register" >Click here</a></p>
          </div>
          <label htmlFor="username" className="input-label">Username</label>
          <input required className="input-field" id="username" name="username" type="text"
            onChange={handleInputChange}
          />
          <div><label htmlFor="password" className="input-label">password</label></div>
          <input required className="input-field" id="password" name="password" type="password"
            onChange={handleInputChange}
          />
          <p className="link"><a href="/agent/forgotPassword">Forgot Password?</a></p>
          <button className="submit-btn" type="submit" >Login</button>
        </form>
      </div>
    </div>
  );
}

export default AgentLogin;
