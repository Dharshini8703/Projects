import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import logoImage from '../assets/vkr.jpg'
import propertyVideo from '../assets/property.mp4';



function Homepage() {
    const backgroundStyle = {
        background: `url(${propertyVideo}) no-repeat center center fixed`,
        WebkitBackgroundSize: 'cover',
        MozBackgroundSize: 'cover',
        OBackgroundSize: 'cover',
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    return (
        <>
            <div style={backgroundStyle}>
                <video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                    <source src={propertyVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
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
                                <li><a className="dropdown-item font-style" href="/agent/login" >AGENT</a></li>
                                <li><a className="dropdown-item font-style" href="/owner/login" >PROPERTY OWNER</a></li>
                                <li><a className="dropdown-item font-style" href="/client/login" >CLIENT</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        </>
    );
}

export default Homepage;
