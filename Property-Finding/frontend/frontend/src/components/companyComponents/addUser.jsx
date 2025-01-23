import React, {useState,useEffect} from "react";
import '../../index.css';
import '../../file.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeFill from '../../assets/eye.png';
import eyeSlash from '../../assets/eyeSlash.png';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CompanyLogout from "./Logout";
import logoImage from '../../assets/vkr.jpg'

function AddUser() {
  const navigate= useNavigate()
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhonenumber] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [image, setImage] = useState(null);
  const[image_name,setImage_name]=useState();
  const [valid, setValid] = useState({
    first_name: true,
    last_name: true,
    username: true,
    password: true,
    email: true,
    phone_number: true,
    address: true,
    role: true,
    image: true,
  });

useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getRoles');
        setRoles(Object.values(response.data));
      } catch (error) {
        console.error('Error fetching roles:', error);
      }};     
      fetchRoles();
        },[]);

        const handleInputChange = (e) => {
          const { name, value } = e.target;
          if (name === 'first_name') {
            setValid((prevValid) => ({ ...prevValid, first_name: value.length >= 8 && value.length <= 16 }));
            setFirst_name(value);
          } else if (name === 'last_name') {
            setValid((prevValid) => ({ ...prevValid, last_name: !!value }));
            setLast_name(value);
          } else if (name === 'username') {
            setValid((prevValid) => ({ ...prevValid, username: value.length >= 8 && value.length <= 16 }));
            setUsername(value);
          } else if (name === 'password') {
            const passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");
            setValid((prevValid) => ({ ...prevValid, password: passPattern.test(value) && value.length >= 8 && value.length <= 16 }));
            setPassword(value);
          } else if (name === 'email') {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            setValid((prevValid) => ({ ...prevValid, email: emailPattern.test(value) }));
            setEmail(value);
          } else if (name === 'phone_number') {
            const numPattern = /^\d{10}$/;
            setValid((prevValid) => ({ ...prevValid, phone_number: numPattern.test(value) }));
            setPhonenumber(value);
          } else if (name === 'address') {
            setValid((prevValid) => ({ ...prevValid, address: !!value }));
            setAddress(value);
          } else if (name === 'role') {
            setValid((prevValid) => ({ ...prevValid, role: !!value }));
            setRole(value);
          }
        };
        

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setValid((prevValid) => ({ ...prevValid, image: !!file }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone_number', phone_number);
    formData.append('address', address);
    formData.append('role', role);
    formData.append('image', image);

    const token = localStorage.getItem("token");
     
    try {
      const res = await axios.post('http://localhost:3000/api/createNewCmpUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'password': password,
          'token': token,
        },
      });
      // console.log(res.data);
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/company/UserPage');
    } catch (error) {
      console.error('Error creating user:', error.response.data.error);
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
};

useEffect(()=>{
  const fetchCompanyDetails = async () => {
    const token = localStorage.getItem("token"); // Assuming you are storing your token in localStorage
    if (!token) {
      console.error("No token provided");
      setError("No token provided");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/api/getCompanyDetails",
        {
          headers: {
            "Content-Type": "application/json",
            "token": token, 
          },
        }
      );
       console.log(response.data.company);
      const imageUrl = `http://localhost:3000/companyImages/${response.data.company.image_name}`;
      setImage_name(imageUrl);
      console.log(imageUrl);
   } 
    catch (error) {
      console.error("Error fetching company details:", error);
      setError("Error fetching company details");
    }
  };
  fetchCompanyDetails();
},[])
const openAdduser=()=>{
  navigate('/company/UserPage')
}
  return (
    <div>
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
                                <a className="nav-link active" aria-current="page" href="#">Buy</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Rent</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Commercial</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">New Projects</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown" aria-expanded="false">Explore</a>
                                <ul className="dropdown-menu" aria-labelledby="dropdown04">
                                    <li><a className="dropdown-item" href="#">Property Blog</a></li>
                                    <li><a className="dropdown-item" href="#">Company Insights</a></li>
                                    <li><a className="dropdown-item" href="#">Know Your Rights</a></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="text-end admin-btn">
                        
                      <a href="#" className="d-flex align-items-center text-white text-decoration-none" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      <div className="profile1-image-container">
                    <img src={image_name} alt="Profile" className="profile-image" />
                  </div>
                        {/* <img src={image_name} width="40" height="40" className="rounded-circle" alt="Profile" style={{ border: '2px solid white', padding: '2px' }} /> */}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                      <li>
                      <a className="dropdown-item" href="/company/companyHome">Company Profile</a>
                      </li>
                      <li>
                          <a className="dropdown-item" href='/company/UserPage' >View employees</a>
                        </li>
                        <li>
                          <CompanyLogout/>
                        </li>
                      </ul>
                    </div>
                    </div>
                </div>
            </nav>
          
            <div className = "login-box">
              <div className="form-box" id="form-box">
              <form action="POST" className="login-form" id="admin" method="post" onSubmit={handleSubmit} >
              
           <div className='admin-head'>
                        <h3>CREATE EMPLOYEE</h3>
                        <button className="golden-btn" onClick={openAdduser}>View</button>
              </div>
             
            <div className="input-box">
              
            <label htmlFor="first_name" className="input-label">First name*</label>
              <input type="text" className="input-field" name="first_name" value={first_name} onChange={handleInputChange} required />
                {!valid.first_name && (
                  <div>
                    <span>Firstname name must be atleast 8 char.</span><br />
                  </div>
                )}
                <label htmlFor="lastname" className="input-label">Last name*</label>
              <input type="text" className="input-field" name="last_name" value={last_name} onChange={handleInputChange} required />
                {!valid.last_name && (
                  <div>
                    <span>Last name cannot be empty. </span><br />
                  </div>
                )}
                  <label htmlFor="username" className="input-label">User name*</label>
                <input type="text" className="input-field" name="username" value={username} onChange={handleInputChange} required />
                {!valid.username && (
                  <div>
                  <span>Username must be atleast 8 char. </span><br />
                  </div>
                )}
                <label htmlFor="password" className="input-label">Password*</label>
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
                <label htmlFor="email" className="input-label">Email*</label>
                <input type="text" className="input-field" name="email" value={email} onChange={handleInputChange} required />
                {!valid.email && (
                  <div>
                    <span>Please enter valid email</span><br />
                  </div>
                )}
                <label htmlFor="phone_number" className="input-label">Phone number*</label>
                <input type="text" className="input-field" name="phone_number" value={phone_number} onChange={handleInputChange} required />
                {!valid.phone_number && (
                  <div>
                    <span>Please enter valid Phonenumber </span><br />
                  </div>
                )}
                <label htmlFor="location" className="input-label">Location*</label>
                <input type="text" className="input-field" name="address" value={address} onChange={handleInputChange} required />
                {!valid.address  && (
                  <div>
                    <span>location name cannot be empty.</span><br />
                  </div>
                )}
              <label htmlFor="role" className="input-label">Role*</label>
              <select
                name="role"
                className="input-field custom-select"
                value={role}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select a role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {!valid.role && (
                <div>
                  <span>Role cannot be empty</span><br />
                </div>
              )}
                  {!valid.role && (
                    <div>
                      <span>Role cannot be empty</span><br />
                    </div>
                  )}

                <label htmlFor="image" className="input-label">Profile</label>
                <input type="file" className="input-field-img" name="image" onChange={handleImageChange} required/>
                <button type="submit" className="submit-btn" >CONFIRM</button>
            </div>
            </form>
            </div>
            <ToastContainer/>
         </div>
        </div>
    
  )
}

export default AddUser;