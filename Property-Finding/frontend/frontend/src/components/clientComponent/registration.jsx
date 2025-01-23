import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import '../../index.css';
import '../../App.css';
import logoImage from '../../assets/vkr.jpg'

function ClientRegistration(props) {
  const [values, setValues] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    profile: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const notifyError = (msg) => toast.error(msg, {
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

    const notifySuccess = (msg) => toast.success(msg, {
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

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value, files } = event.target;
    if (name === "profile") {
      console.log("file name");
      console.log(files);
      setValues((values) => ({
        ...values,
        [name]: files[0],
      }));
    } else {
      setValues((values) => ({
        ...values,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    console.log(`Loading: ${loading}`);
  }, [loading]);

  const handleSubmit = async (e) => {
    // console.log("Registration page & states");
    // console.log(`valid state: ${valid}`);
    // console.log(`submitted state: ${submitted}`);
    e.preventDefault();
    if (
      values.username &&
      values.password &&
      values.name &&
      values.email &&
      values.phone &&
      values.address &&
      values.profile
    ) {
      setLoading(true);
      setValid(true);
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("profile", values.profile);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/clients/create",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "password": values.password,
            },
          }
        );
        console.log("Response:", response.data);
        setSubmitted(true);
        setLoading(false);
        if (response.data.success) {
          console.log("Verification Email Sent");
          notifySuccess("Client Account created successfully");
          // {props.setShowClientRegisterState}
        } else {
          console.log("Error");
        }
      } catch (error) {
        setLoading(false);
        console.error(error.response.data.errors);
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
                            <li><a className="dropdown-item font-style" href="/admin/register" >ADMIN</a></li>
                                <li><a className="dropdown-item font-style" href="/company/register" >COMPANY</a></li>
                                <li><a className="dropdown-item font-style" href="/agent/register" >AGENT</a></li>
                                <li><a className="dropdown-item font-style" href="/owner/register" >PROPERTY OWNER</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
    <div id="form-container">
      <div className="form-box" id="form-box">
        <form onSubmit={handleSubmit} className="login-form" id="admin" method="post">
          <h1 className="my-heading">Client Register</h1>
          <h4 className="sub-heading">Let's create your account!</h4>
          <div className="link">
            <p>
              Already have an account ?{" "}
              <a href="/client/login" >
                Log In!
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
            <label htmlFor="name" className="input-label">
              Name
            </label>
            <input
              type="text"
              className="input-field"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.name && <span>Please enter valid name</span>}
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="email"
              className="input-field"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.email && <span>Please enter valid email</span>}
            <label htmlFor="phone" className="input-label">
              Phone
            </label>
            <input
              type="text"
              className="input-field"
              name="phone"
              value={values.phone}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.phone && <span>Please enter valid phone</span>}
            <label htmlFor="address" className="input-label">
              Address
            </label>
            <input
              type="text"
              className="input-field"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.address && <span>Please enter valid address</span>}
            <label htmlFor="profile" className="input-label">
              Profile
            </label>              
              <input
              className="input-field-img"
              type="file"
              name="profile"
              onChange={handleInputChange}
              required
            />
            {submitted && !values.profile && <span>Please add profile image</span>}
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
}

export default ClientRegistration;
