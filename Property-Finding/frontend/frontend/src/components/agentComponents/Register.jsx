import React, { useState } from 'react';
import axios from 'axios';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
import '../../App.css';
import logoImage from '../../assets/vkr.jpg'

function AgentRegister(props) {
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    setFormData({ ...formData, filename: event.target.files[0] });
  };

  // const handlePhoneChange = (value, country) => {
  //   setFormData({
  //     ...formData,
  //     phone: value,
  //     country: country.name
  //   });
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    axios.post('http://localhost:3000/agent/register', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      console.log('Register Response:', response.data);
      alert("Email verification sent to mail");
    })
    .catch(error => {
      if (error.response) {
        console.error('Error Response:', error.response.data);
        alert(error.response.data.message);
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
                    <div className="profile1-image-container">
                    <img src={logoImage} alt="Profile" className="profile1-image" />
                  </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarsExample04">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#">rent</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">buy</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">commercial</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">find agent</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">upcomming projects</a>
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
                            <li><a className="dropdown-item font-style" href="/admin/register" >ADMIN</a></li>
                                <li><a className="dropdown-item font-style" href="/company/register" >COMPANY</a></li>
                                <li><a className="dropdown-item font-style" href="/owner/register" >PROPERTY OWNER</a></li>
                                <li><a className="dropdown-item font-style" href="/client/register" >CLIENT</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
      <div className="form-box">
        <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="my-heading">Agent Register</h1>
        <h4 className="sub-heading">Let's create your account!</h4>
        <div className="link">
          <p>Already have an account ? <a href="/agent/login" >Log In!</a></p>
        </div>
        <label htmlFor="username" className="input-label">Username</label>
        <input required className="input-field" id="username" name="username" type="text"  
          onChange={handleInputChange}
        />
        <label htmlFor="password" className="input-label">password</label>
        <input required className="input-field" id="password" name="password" type="password"
            onChange={handleInputChange}
          />
          <label htmlFor="email" className="input-label">email</label>
          <input required className="input-field" id="email" name="email" type="email" 
            onChange={handleInputChange}
          />
          <label htmlFor="name" className="input-label">name</label>
          <input required
            className="input-field" id="name" name="name" type="text"
            onChange={handleInputChange}
          />
          <label htmlFor="phone" className="input-label">Phone number</label>
          <input
            required
            className="input-field" id="phone" name="phone" type="text"
            onChange={handleInputChange}
          />
          {/* <PhoneInput className="input-field" id="phone"
          country={'in'}
          value={formData.phone}
          onChange={handlePhoneChange}
        /> */}
          <label htmlFor="company" className="input-label">company</label> 
          <input required className="input-field" id="company" name="company" type="text"
             onChange={handleInputChange}
          />
          <label htmlFor="position" className="input-label">position</label>
          <input required className="input-field" id="position" name="position" type="text"
             onChange={handleInputChange}
          />
          <input type="file" name="filename" className="input-field-img"
            onChange={handleImageChange}
          />
          <button className="submit-btn" type="submit">REGISTER</button>
        </form>
      </div>
    </div>
  );
}

export default AgentRegister;
