import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import '../../index.css';
import '../../App.css';
import logoImage from '../../assets/vkr.jpg'

function ClientLogin(props) {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const notifyError = (msg) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.username && values.password) {
      setLoading(true);
      setValid(true);
      const formData = new FormData();
      formData.append("username", values.username);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/clients/login",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              password: values.password,
            },
          }
        );
        console.log(response.data);
        localStorage.setItem("token", response.data.accessToken);
        setMessage("Login successful");
        setSubmitted(true);
        setLoading(false);
        if (response.data.success) {
          let data = response.data.client;
          // navigate("/home", { state: { data } });
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 2000, // Close the toast after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setTimeout(() => {
            navigate('/client/clientHome');
        }, 2000);
        } else {
          console.log("Error");
        }
        console.log("Response:", response.data.message);
      } catch (error) {
        setLoading(false);
        console.error(error);
        notifyError(error.response.data.errors);
      }
    }
    setSubmitted(true);
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
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
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
                                <li><a className="dropdown-item font-style" href="/agent/login" >AGENT</a></li>
                                <li><a className="dropdown-item font-style" href="/owner/login" >PROPERTY OWNER</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
    <div className="form-container" id="form-container">
      <div className="form-box" id="form-box">
        <form onSubmit={handleSubmit} className="login-form" id="admin">
          <h1 className="my-heading">Client Login</h1>
          <h4 className="sub-heading">We're glad to see you again!</h4>
          <div className="link">
            <p>
              Don't have an account ?{" "}
              <a href="/client/register" >
                Click here
              </a>
            </p>
          </div>
          <div className="input-box">
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              type="text"
              className="input-field"
              name="username"
              value={values.username}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.username && <span>Please enter valid username</span>}
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              className="input-field"
              name="password"
              value={values.password}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.password && <span>Please enter valid password</span>}
          </div>
          <div className="link">
            <a href="/client/forgotPassword">Forgot password</a>
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
</div>
  );
}

export default ClientLogin;
