import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerLogout from './logout';
import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css';
import '../../index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoImage from '../../assets/vkr.jpg'
import { useNavigate } from 'react-router-dom';

function OwnerHome() {
    const [validate, setValidate] = useState(false);
    const [ownerId, setOwnerId] = useState('');
    const [first_name, setFirst_Name] = useState(''); 
    const [last_name, setLast_Name] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [profile, setProfile] = useState(null);
    const [profileFile, setProfileFile] = useState(null);
    const navigate = useNavigate();
    const [valid, setValid] = useState({
        ownerId:true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        username: true,
        profile: true
      });
      useEffect(() => {
    const handleClick = async () =>{
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token provided');
            setError('No token provided');
            return;
          }
    
          try {
            const res = await axios.get('http://localhost:3000/owners/details', {
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
              }
            });
            setOwnerId(res.data.owner.propertyOwner_id);
            setFirst_Name(res.data.owner.first_name);
            setLast_Name(res.data.owner.last_name);
            setPhoneNumber(res.data.owner.phone);
            setEmail(res.data.owner.email);
            setAddress(res.data.owner.address);
            setUsername(res.data.owner.username);
            const imageUrl = `http://localhost:3000/propertyOwnerImages/${res.data.owner.profile}`;
            setProfile(imageUrl);
            // setValidate(true);
          } catch (error) {
            console.error('Error fetching prop owner details:', error);
            // setError('Error fetching company details');
            // setValidate(false);
          }
    }
    handleClick();
}, []);
    const handleOpen = () =>{
        setValidate(true)
    }
    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (name === 'profile') {
            const file = files[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                console.log("imageUrl", imageUrl);
                setProfile(imageUrl);
                setProfileFile(file);
            }
        }
    };
    const notifyError = (msg) => toast.error(msg);
    const customToastStyle = {
        marginTop: "50px", // Move toast down by 20px
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('username', username);
        formData.append('address', address);
        if (profileFile) {
            formData.append('profile', profileFile);
        }
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token provided');
            setError('No token provided');
            return;
        }
        console.log(formData)
        try {
            const res = await axios.patch('http://localhost:3000/owners/details/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
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
        } catch (error) {
            console.error('Error updating profile:', error);
            // console.error(error.response.data.error);
            notifyError(error)
        }
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let numPattern = /^\d+$/;
        if (name === 'username') {
          (value.length < 8 || value.length > 16) ? setValid((prevValid) => ({ ...prevValid, username: false })) : setValid((prevValid) => ({ ...prevValid, username: true }));
          setUsername(value);
        }
        if (name === 'phone') {
          (value.length !== 10 || !numPattern.test(value)) ? setValid((prevValid) => ({ ...prevValid, phone: false })) : setValid((prevValid) => ({ ...prevValid, phone: true }));
          setPhoneNumber(value);
        }
        if (name === 'email') {
          (!emailPattern.test(value)) ? setValid((prevValid) => ({ ...prevValid, email: false })) : setValid((prevValid) => ({ ...prevValid, email: true }));
          setEmail(value);
        }
        if (name === 'first_name') {
          (!value) ? setValid((prevValid) => ({ ...prevValid, first_name: false })) : setValid((prevValid) => ({ ...prevValid, first_name: true }));
          setFirst_Name(value);
        }
        if (name === 'last_name') {
          (!value) ? setValid((prevValid) => ({ ...prevValid, last_name: false })) : setValid((prevValid) => ({ ...prevValid, last_name: true }));
          setLast_Name(value);
        }
        if (name === 'address') {
            (!value) ? setValid((prevValid) => ({ ...prevValid, address: false })) : setValid((prevValid) => ({ ...prevValid, address: true }));
            setAddress(value);
          }
      }

      const handleView = () => {
        navigate('/owner/property')
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
                                <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown" 
                                aria-expanded="false">Explore</a>
                                <ul className="dropdown-menu" aria-labelledby="dropdown04">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>
                        {validate && <a className="btn btn-secondary golden-btn mx-5" href="#" role="button" onClick={handleView} aria-expanded="false">
                            VIEW PROPERTY
                            </a>}
                        <div className='text-end admin-btn'>
                            <div className="dropdown">
                                <a className="btn bi bi-person-circle mx-5" href="#" role="button"
                                id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" >
                                <div className="profile1-image-container">
                                    <img src={profile} alt="Profile" className="profile1-image" />
                                </div>
                                </a>
                                <ul className="dropdown-menu my-3" aria-labelledby="dropdownMenuLink">
                                    {!validate && <li><a className="dropdown-item font-style" href="#" onClick={handleOpen}>Profile</a></li>}
                                    <li><a className="dropdown-item font-style" href="/owner/property" >View property</a></li>
                                    <li><OwnerLogout/></li>
                                </ul>
                            </div>
                        </div> 
                    </div>
                </div>
            </nav>
            <div className="login-box">
    {!validate ? (
        <h1>Welcome</h1>
    ) : (
        <div className="form-box-home">
            
            <div className='admin-head'>
            <div className="pro-img">
                        <div className="profile-image">
                            <label htmlFor="profile" className="file-input-label">
                                {profile ? (
                                    <img src={profile} alt="Profile Preview" />
                                ) : (
                                    <span>Upload a profile image</span>
                                )}
                                <input
                                    id="profile"
                                    type="file"
                                    name="profile"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="file-input"
                                />
                            </label>
                        </div>
                    </div>
                <div className='owner-card'>
                    <div className='owner-id'>
                        <h5>{ownerId} - {first_name}</h5>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form" id="admin">
                <div className='direction'>
                    <div className='input-box'>
                        <label htmlFor="username" className="input-label">User Name *</label>
                        <input type="text" className="input-field" name="username" value={username} onChange={handleInputChange} required />
                        {!valid.username && (
                            <div>
                                <span>Username must be at least 8 characters.</span><br />
                            </div>
                        )}
                        <label htmlFor="first_name" className="input-label">First Name *</label>
                        <input type="text" className="input-field" name="first_name" value={first_name} onChange={handleInputChange} required />
                        {!valid.first_name && (
                            <div>
                                <span>First Name cannot be empty.</span><br />
                            </div>
                        )}
                        <label htmlFor="phone" className="input-label">Contact *</label>
                        <input type="text" className="input-field" name="phone" value={phone} onChange={handleInputChange} required />
                        {!valid.phone && (
                            <div>
                                <span>Please enter a valid Phone Number.</span><br />
                            </div>
                        )}
                    </div>
                    <div className='input-box1'>
                        <label htmlFor="email" className="input-label">Email ID *</label>
                        <input type="text" className="input-field" name="email" value={email} onChange={handleInputChange} required />
                        {!valid.email && (
                            <div>
                                <span>Please enter a valid Email.</span><br />
                            </div>
                        )}
                        <label htmlFor="last_name" className="input-label">Last Name *</label>
                        <input type="text" className="input-field" name="last_name" value={last_name} onChange={handleInputChange} required />
                        {!valid.last_name && (
                            <div>
                                <span>Last Name cannot be empty.</span><br />
                            </div>
                        )}
                        <label htmlFor="address" className="input-label">Address</label>
                        <input type="text" className="input-field" name="address" value={address} onChange={handleInputChange} />
                    </div>
                </div>
                {/* <div className='button'> */}
                    <button type="submit" className="submit-btn">Update</button>
                {/* </div> */}
            </form>
        </div>
    )}
</div>
<ToastContainer />
        </div>
    )
}

export default OwnerHome;