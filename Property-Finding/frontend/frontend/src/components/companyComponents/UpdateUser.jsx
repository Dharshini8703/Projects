import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CompanyLogout from './Logout';
import axios from 'axios';
import "../../index.css";
import '../../file.css';

const UpdateUser = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if location.state.user exists before destructuring
  const { user } = location.state || {};
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    address: '',
    role: '',
    image_name: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [valid, setValid] = useState({
    first_name: true,
    last_name: true,
    username:true,
    email:true,
    phone_number:true,
    address: true,
    role:true
  });

useEffect(() => {
    if (user) {
      setFormData({
       first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        role: user.role,
        image_name: user.image_name
      });
      const imageUrl = `http://localhost:3000/companyImages/${user.image_name}`;
      setImageUrl(imageUrl);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'first_name') {
      setValid((prevValid) => ({ ...prevValid, first_name: value.length >= 8 && value.length <= 16 }));
    } else if (name === 'last_name') {
      setValid((prevValid) => ({ ...prevValid, last_name: !!value }));
    } else if (name === 'username') {
      setValid((prevValid) => ({ ...prevValid, username: value.length >= 8 && value.length <= 16 }));
    } else if (name === 'email') {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setValid((prevValid) => ({ ...prevValid, email: emailPattern.test(value) }));
    } else if (name === 'phone_number') {
      const numPattern = /^\d{10}$/;
      setValid((prevValid) => ({ ...prevValid, phone_number: numPattern.test(value) }));
    } else if (name === 'address') {
      setValid((prevValid) => ({ ...prevValid, address: !!value }));
    } else if (name === 'role') {
      setValid((prevValid) => ({ ...prevValid, role: !!value }));
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setSelectedImage(file);
    }
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('phone_number', formData.phone_number);
    data.append('address', formData.address);
    data.append('role', formData.role);
    if (selectedImage) {
      data.append('image', selectedImage);
    }
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post('http://localhost:3000/api/updateUser', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': token,
        },
      });
     console.log(res.data);
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true, 
        pauseOnHover: true,
        draggable: true,
      });
    } 
    catch (error) {
      console.error('Error updating user:', error);
      if (error.response) {
        toast.error(error.response.data.error, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
       else {
        toast.error('An unexpected error occurred.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  // Check if user is not defined, then maybe navigate back or show a message
  if (!user) {
    // Redirect or handle the case where user is not defined
    navigate('/'); // Example redirect if user is not defined
    return null; // or show loading or error message
  }

  return (
    <>
    <div>
    <nav
        className="navbar navbar-expand-md navbar-dark bg-black border-bottom border-white fixed-top navbar-custom"
        aria-label="Fourth navbar example"
      >
        <div className="container-fluid">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            <svg
              className="bi me-2"
              width="40"
              height="32"
              role="img"
              aria-label="Bootstrap"
            >
              <use xlinkHref="#bootstrap"></use>
            </svg>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample04"
            aria-controls="navbarsExample04"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Buy
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Rent
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Commercial
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  New Projects
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="dropdown04"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Explore
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdown04">
                  <li>
                    <a className="dropdown-item" href="#">
                      Property Blog
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Company Insights
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Know Your Rights
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="text-end admin-btn">
            <a
              href="#"
              className="d-flex align-items-center text-white text-decoration-none"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
             <img
                src={imageUrl}
                width="40"
                height="40"
                className="rounded-circle"
                alt="Profile"
                style={{
                  border: '2px solid white',
                  padding: '2px',
                }}
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            
              <li>
                <a className="dropdown-item" href="/company/addUser">Add Employee</a>
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

    <div className="login-box">
    <div className="login-box2">
      <div className="form-box" id="form-box">
      <div className="admin-head">
                <h5>UPDATE EMPLOYEE INFORMATION</h5>
      </div>
      <div className="input-box">
      <div className="pro-img">
        <div className="profile-image">
          <label htmlFor="image" className="file-input-label">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="rounded-image" />
            ) : (
              <span>Upload a profile image</span>
            )}
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="input-field-imges"
            style={{ display: 'none' }} // Hide the input field
          />
        </div>
      </div>
   <input
        type="text"
        name="first_name"
        className="input-field"
        value={formData.first_name}
        onChange={handleChange}
      />
      {!valid.first_name && (
     <div>
           <span>Firstname name must be atleast 8 char.</span>
          <br/>
       </div>
      )}
      <input
        type="text"
        name="last_name"
        className="input-field"
        value={formData.last_name}
        onChange={handleChange}
      />
      {!valid.last_name && (
     <div>
           <span>Lastname cannot be empty.</span>
          <br/>
       </div>
      )}
      <input
        type="text"
        name="username"
        className="input-field"
        value={formData.username}
        onChange={handleChange}
      />
      {!valid.username && (
          <div>
           <span>Username must be atleast 8 char. </span><br />
              </div>
                )}
      <input
        type="email"
        name="email"
        className="input-field"
        value={formData.email}
        onChange={handleChange}
      />
              {!valid.email && (
                  <div>
                    <span>Please enter valid email</span><br />
                  </div>
                )}
      <input
        type="text"
        name="phone_number"
        className="input-field"
        value={formData.phone_number}
        onChange={handleChange}
      />
      {!valid.phone_number && (
                  <div>
                    <span>Please enter valid Phonenumber </span><br />
                  </div>
                )}
      <input
        type="text"
        name="address"
        className="input-field"
        value={formData.address}
        onChange={handleChange}
      />
       {!valid.address  && (
                  <div>
                    <span>location name cannot be empty.</span><br />
                  </div>
                )}
      <input
        type="text"
        name="role"
        className="input-field"
        value={formData.role}
        onChange={handleChange}
      />
      <input
        type="file"
        name="image"
        className="input-field-imges"
        onChange={handleImageChange}
      />
      <div className="confirm">
<button type="submit"className="submit-btn" onClick={handleSubmit}>UPDATE</button></div>

    </div>
    </div>
    </div>
    </div>
    </div>
    </>

  );

 
 
};

export default UpdateUser;
