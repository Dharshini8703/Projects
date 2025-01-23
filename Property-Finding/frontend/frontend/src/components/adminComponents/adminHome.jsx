import React, { useState } from 'react';
import axios from 'axios';
import AdminLogout from './logout';
import 'bootstrap/dist/css/bootstrap.css';
import '../../App.css';
import '../../index.css';
import logoImage from'../../assets/vkr.jpg'

function AdminHome() {
    const [validate, setValidate] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [image, setImage] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!validate) {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:3000/admin/adminDetails', {
                    headers: {
                        'x-auth-token': token 
                    }
                });
                setAdminId(res.data.admin.admin_id);
                setName(res.data.admin.name);
                setPhoneNumber(res.data.admin.phone_number);
                setEmail(res.data.admin.email);
                setUsername(res.data.admin.username);
                const imageUrl = `http://localhost:3000/adminImages/${res.data.admin.imagename}`;
                setImage(imageUrl);
                setValidate(true);
            }
            catch(error) {
                console.error('Error fetching admin details:', error);
            }
        }
        else {
            setValidate(false);
        }
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
                                <a className="nav-link active" aria-current="page" href="#">Rent</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Buy</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Commercial</a>
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
                        <div className='text-end admin-btn'>
                            <div>
                                <a href="#" onClick={handleSubmit}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                    </svg>
                                </a>
                            </div>
                            <div>
                                {<AdminLogout />}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className = "login-box">
                {!validate ? (
                    <div className='admin-head'>
                        <h1>WELCOME ADMIN</h1>
                    </div>
                ):(
                    <div className='admin-profile'>
                        <h1 className="my-heading">Admin Profile</h1>
                        <div className='pro-img'>
                            <div className='profile-image'>
                                <img src={image} alt="" />
                            </div>
                        </div>
                        <div className='profile-table'>
                            <table>
                                <tr>
                                    <td className='head'>Admin ID</td>
                                    <td className='data'>{adminId}</td>
                                </tr>
                                <tr>
                                    <td className='head'>Name</td>
                                    <td className='data'>{name}</td>
                                </tr>
                                <tr>
                                    <td className='head'>Phone Number</td>
                                    <td className='data'>{phoneNumber}</td>
                                </tr>
                                <tr>
                                    <td className='head'>Email</td>
                                    <td className='data'>{email}</td>
                                </tr>
                                <tr>
                                    <td className='head'>Username</td>
                                    <td className='data'>{username}</td>
                                </tr>
                            </table>
                        </div>
                        <div className='button'>
                            <button type="submit" className="golden-back-btn">Update</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminHome;