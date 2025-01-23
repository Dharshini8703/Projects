import React, { useState } from "react";
import '../../index.css';
import '../../file.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeFill from '../../assets/eye.png';
import eyeSlash from '../../assets/eyeSlash.png';


function CompanyReset(props) {
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [valid, setValid] = useState({
        otp: true,
        newPassword: true,
        confirmPassword: true
    });
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");
        let numPattern = /^\d+$/;
        if (name === 'otp') {
            (value.length !== 5 || !numPattern.test(otp)) ? setValid((prevValid) => ({ ...prevValid, otp: false })) : setValid((prevValid) => ({ ...prevValid, otp: true }));
            setOtp(value);
        }
        if (name === 'newPassword') {
            (!passPattern.test(value) || value.length < 8 || value.length > 16) ? setValid((prevValid) => ({ ...prevValid, newPassword: false })) : setValid((prevValid) => ({ ...prevValid, newPassword: true }));
            setNewPassword(value);
        }
        if (name === 'confirmPassword') {
            (value !== newPassword) ? setValid((prevValid) => ({ ...prevValid, confirmPassword: false })) : setValid((prevValid) => ({ ...prevValid, confirmPassword: true }));
            setConfirmPassword(value);
        }
    }

    function showNewPassword() {
        var x = document.getElementById("newPasswordInput");
        var y = document.getElementById('eyeImgNew');
        if (x.type === "password") {
          x.type = "text";
          y.src = eyeSlash;
        } else {
          x.type = "password";
          y.src = eyeFill;
        }
    }

    function showConfirmPassword() {
        var x = document.getElementById("confirmPasswordInput");
        var y = document.getElementById('eyeImg');
        if (x.type === "password") {
          x.type = "text";
          y.src = eyeSlash;
        } else {
          x.type = "password";
          y.src = eyeFill;
        }
    }

    const notifyError = (msg) => toast.error(msg);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/reset-password', { otp }, {
                headers: {
                    'newPassword': newPassword ,
                    'confirmPassword': confirmPassword ,
                }
            });
            console.log("response", res);
            toast.success(res.data.message, {
                position: "top-right",
                autoClose: 2000, // Close the toast after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
            if (res.data.message) {
                setTimeout(() => {
                    navigate('/homepage');
                }, 2000);
            }
        } 
        catch (error) {
            notifyError(error.response.data.error)
        }
    };

    return (
        <div>
            <div className="back-button">
                <button className="golden-back-btn" onClick={props.setValidate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
                </button>
            </div>
            <div className="login-box1">
                <div className="form-box" id="form-box">
                    <form action="POST" onSubmit={handleSubmit} className="login-form" id="admin">
                    <h1 className="my-heading">Reset Password</h1>
                    <div className="input-box">
                        <label htmlFor="otp" className="input-label">OTP</label>
                        <input type="text" className="input-field" name="otp" value={otp} onChange={handleInputChange} required />
                        {!valid.otp && (
                            <div>
                            <span>Please enter 5 digit otp</span><br />
                            </div>
                        )}
                        <label htmlFor="newPassword" className="input-label">New Password</label>
                        <div className="input-field-password">
                            <input type="password" className="password-input" id="newPasswordInput" name="newPassword" value={newPassword} onChange={handleInputChange} required />
                            <div className="eye-icon">
                                <img src={eyeFill} alt="eye" id="eyeImgNew" onClick={showNewPassword} />
                            </div>
                        </div>
                        {!valid.newPassword && (
                            <div>
                                <span>New password should atleast 8 char with minimum 1 uppercase , 1 lowercase, 1 digit, 1 special char.</span><br />
                            </div>
                        )}
                        <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                        <div className="input-field-password">
                            <input type="password" className="password-input" id="confirmPasswordInput" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} required />
                            <div className="eye-icon">
                                <img src={eyeFill} alt="eye" id="eyeImg" onClick={showConfirmPassword} />
                            </div>
                        </div>
                        {!valid.confirmPassword && (
                            <div>
                                <span>Confirm password should be same to new password </span><br />
                            </div>
                        )}
                    </div> 
                    <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </div>
    )
}

export default CompanyReset;