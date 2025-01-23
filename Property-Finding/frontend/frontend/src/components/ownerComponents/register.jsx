import React, {useState} from "react";
import '../../index.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeFill from '../../assets/eye.png';
import eyeSlash from '../../assets/eyeSlash.png';
import logoImage from '../../assets/vkr.jpg'

function OwnerRegister(props) {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState(null);
    const [valid, setValid] = useState({
      first_name: true,
      last_name: true,
      phone: true,
      email: true,
      username: true,
      password: true,
      profile: true
    });

    const handleprofileChange = (e) => {
      const {name, files} = e.target;
      if (name === 'profile') {
        (!files) ? setValid((prevValid) => ({ ...prevValid, profile: false })) : setValid((prevValid) => ({ ...prevValid, profile: true }));
        setProfile(files[0]);
      }
      
    };
    
    const handleInputChange = (e) => {
      e.preventDefault();
      const { name, value } = e.target;
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let numPattern = /^\d+$/;
      if (name === 'username') {
        (value.length < 8 || value.length > 16) ? setValid((prevValid) => ({ ...prevValid, username: false })) : setValid((prevValid) => ({ ...prevValid, username: true }));
        setUsername(value);
      }
      if (name === 'password') {
        (!passPattern.test(value) || value.length < 8 || value.length > 16) ? setValid((prevValid) => ({ ...prevValid, password: false })) : setValid((prevValid) => ({ ...prevValid, password: true }));
        setPassword(value);
      }
      if (name === 'phone') {
        (value.length !== 10 || !numPattern.test(value)) ? setValid((prevValid) => ({ ...prevValid, phone: false })) : setValid((prevValid) => ({ ...prevValid, phone: true }));
        setPhone(value);
      }
      if (name === 'email') {
        (!emailPattern.test(value)) ? setValid((prevValid) => ({ ...prevValid, email: false })) : setValid((prevValid) => ({ ...prevValid, email: true }));
        setEmail(value);
      }
      if (name === 'first_name') {
        (!value) ? setValid((prevValid) => ({ ...prevValid, first_name: false })) : setValid((prevValid) => ({ ...prevValid, first_name: true }));
        setFirstName(value);
      }
      if (name === 'last_name') {
        (!value) ? setValid((prevValid) => ({ ...prevValid, last_name: false })) : setValid((prevValid) => ({ ...prevValid, last_name: true }));
        setLastName(value);
      }
    }
    
    function showPassword() {
      var x = document.getElementById("passwordInput");
      var y = document.getElementById('eyeImg');
      if (x.type === "password") {
        x.type = "text";
        y.src = eyeSlash;
      } else {
        x.type = "password";
        y.src = eyeFill;
      }
    }
    
    const customToastStyle = {
      marginTop: "50px", // Move toast down by 20px
    };

    const notifyError = (msg) => toast.error(msg);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('first_name', first_name); 
      formData.append('last_name', last_name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('username', username);
      formData.append('profile', profile);

      try {
        const res = await axios.post('http://localhost:3000/owners/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'password' : password
          }
        });
        console.log('Response:', res);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000, // Close the toast after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastClassName: 'custom-toast', // Apply custom class for styling
          bodyClassName: 'custom-toast-body', // Apply custom class for body styling
          style: customToastStyle
        });
      } 
      catch (error) {
        console.error(error.response.data.error);
        notifyError(error.response.data.error)
      }
    };
    return (
      <div>
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
                                <li><a className="dropdown-item font-style" href="/client/register" >CLIENT</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        <div className="form-box" id="form-box">
          <form action="POST" onSubmit={handleSubmit} className="login-form" id="admin" method="post">
            <h1 className="my-heading">Property Owner Signup</h1>
            <h4 className="sub-heading">Let's create your account!</h4>
            <div className="link">
                <p>Already have an account ? <a href="/owner/login" >Log In!</a></p>
            </div>
            <div >
                <label htmlFor="first_name" className="input-label">First Name *</label>
                <input type="text" className="input-field" name="first_name" value={first_name} onChange={handleInputChange} required />
                {!valid.first_name && (
                  <div>
                    <span>First Name cannot be empty. </span><br />
                  </div>
                )}
                <label htmlFor="last_name" className="input-label">Last Name *</label>
                <input type="text" className="input-field" name="last_name" value={last_name} onChange={handleInputChange} required />
                {!valid.last_name && (
                  <div>
                    <span>Last Name cannot be empty. </span><br />
                  </div>
                )}
                <label htmlFor="phone" className="input-label">Phone Number *</label>
                <input type="text" className="input-field" name="phone" value={phone} onChange={handleInputChange} required />
                {!valid.phone && (
                  <div>
                    <span>Please enter valid Phone Number </span><br />
                  </div>
                )}
                <label htmlFor="email" className="input-label">Email *</label>
                <input type="text" className="input-field" name="email" value={email} onChange={handleInputChange} required />
                {!valid.email && (
                  <div>
                    <span>Please enter valid email</span><br />
                  </div>
                )}
                <label htmlFor="username" className="input-label">User Name *</label>
                <input type="text" className="input-field" name="username" value={username} onChange={handleInputChange} required />
                {!valid.username && (
                  <div>
                  <span>Username must be atleast 8 char. </span><br />
                  </div>
                )}
                <label htmlFor="password" className="input-label">Password *</label>
                <div className="input-field-password">
                  <input type="password" className="password-input" id="passwordInput" name="password" value={password} onChange={handleInputChange} required />
                  <div className="eye-icon">
                      <img src={eyeFill} alt="eye" id="eyeImg" onClick={showPassword} />
                  </div>
                </div>
                {!valid.password && (
                  <div>
                    <span>Password should atleast 8 char with minimum 1 uppercase , 1 lowercase, 1 digit, 1 special char.</span><br />
                  </div>
                )}
                <label htmlFor="profile" className="input-label">Profile</label>
                <input type="file" className="input-field-img" name="profile" onChange={handleprofileChange} />
                {/* {!valid.image && (
                  <div>
                    <span>Please select image</span><br />                   
                  </div>
                )} */}
            </div> 
            <button type="submit" className="submit-btn">Signup</button>
          </form>
        </div>
        <ToastContainer />
        </div>
      </div>
    )
}

export default OwnerRegister;