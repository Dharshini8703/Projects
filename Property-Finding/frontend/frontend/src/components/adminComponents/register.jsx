import React, {useState} from "react";
import '../../index.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeFill from '../../assets/eye.png';
import eyeSlash from '../../assets/eyeSlash.png';
import logoImage from '../../assets/vkr.jpg'

function AdminRegister(props) {
    const [name, setName] = useState('');
    const [phone_number, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [valid, setValid] = useState({
      name: true,
      phone_number: true,
      email: true,
      username: true,
      password: true,
      image: true
    });

    const handleImageChange = (e) => {
      const {name, files} = e.target;
      if (name === 'image') {
        (!files) ? setValid((prevValid) => ({ ...prevValid, image: false })) : setValid((prevValid) => ({ ...prevValid, image: true }));
        setImage(files[0]);
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
      if (name === 'phone_number') {
        (value.length !== 10 || !numPattern.test(value)) ? setValid((prevValid) => ({ ...prevValid, phone_number: false })) : setValid((prevValid) => ({ ...prevValid, phone_number: true }));
        setPhonenumber(value);
      }
      if (name === 'email') {
        (!emailPattern.test(value)) ? setValid((prevValid) => ({ ...prevValid, email: false })) : setValid((prevValid) => ({ ...prevValid, email: true }));
        setEmail(value);
      }
      if (name === 'name') {
        (!value) ? setValid((prevValid) => ({ ...prevValid, name: false })) : setValid((prevValid) => ({ ...prevValid, name: true }));
        setName(value);
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
      formData.append('name', name);
      formData.append('phone_number', phone_number);
      formData.append('email', email);
      formData.append('username', username);
      formData.append('image', image);

      try {
        const res = await axios.post('http://localhost:3000/admin/adminRegister', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'password' : password
          }
        });
        console.log('Response:', res);
        toast.success(res.data.message, {
          position: "top-right",
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
                                    <li><a className="dropdown-item" href="#">Property blog</a></li>
                                    <li><a className="dropdown-item" href="#">Company rights</a></li>
                                    <li><a className="dropdown-item" href="#">Know your rights</a></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="dropdown">
                            <a className="btn btn-secondary dropdown-toggle golden-btn mx-5" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                LOGIN
                            </a>
                            <ul className="dropdown-menu my-3" aria-labelledby="dropdownMenuLink">
                                <li><a className="dropdown-item font-style" href="/company/register" >COMPANY</a></li>
                                <li><a className="dropdown-item font-style" href="/agent/register" >AGENT</a></li>
                                <li><a className="dropdown-item font-style" href="/owner/register" >PROPERTY OWNER</a></li>
                                <li><a className="dropdown-item font-style" href="/client/register" >CLIENT</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        <div className="form-box" id="form-box">
          <form action="POST" onSubmit={handleSubmit} className="login-form" id="admin" method="post">
            <h1 className="my-heading">Admin Signup</h1>
            <h4 className="sub-heading">Let's create your account!</h4>
            <div className="link">
                <p>Already have an account ? <a href="/admin/login" >Log In!</a></p>
            </div>
            <div className="input-box">
                <label htmlFor="name" className="input-label">Name</label>
                <input type="text" className="input-field" name="name" value={name} onChange={handleInputChange} required />
                {!valid.name && (
                  <div>
                    <span>Name cannot be empty. </span><br />
                  </div>
                )}
                <label htmlFor="phone_number" className="input-label">Phone Number</label>
                <input type="text" className="input-field" name="phone_number" value={phone_number} onChange={handleInputChange} required />
                {!valid.phone_number && (
                  <div>
                    <span>Please enter valid Phonenumber </span><br />
                  </div>
                )}
                <label htmlFor="email" className="input-label">Email</label>
                <input type="text" className="input-field" name="email" value={email} onChange={handleInputChange} required />
                {!valid.email && (
                  <div>
                    <span>Please enter valid email</span><br />
                  </div>
                )}
                <label htmlFor="username" className="input-label">User Name</label>
                <input type="text" className="input-field" name="username" value={username} onChange={handleInputChange} required />
                {!valid.username && (
                  <div>
                  <span>Username must be atleast 8 char. </span><br />
                  </div>
                )}
                <label htmlFor="password" className="input-label">Password</label>
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
                <label htmlFor="image" className="input-label">Profile</label>
                <input type="file" className="input-field-img" name="image" onChange={handleImageChange} required/>
                {!valid.image && (
                  <div>
                    <span>Please select image</span><br />                   
                  </div>
                )}
            </div> 
            <button type="submit" className="submit-btn">Signup</button>
          </form>
        </div>
        <ToastContainer />
      </div>
    )
}

export default AdminRegister;