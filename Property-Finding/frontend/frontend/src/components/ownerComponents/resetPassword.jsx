import React, { useState } from "react";
import '../../index.css';
import '../../App.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeFill from '../../assets/eye.png';
import eyeSlash from '../../assets/eyeSlash.png';


function OwnerResetPassword(props) {
    const [otp, setOtp] = useState('')
    const [new_password, setNew_Password] = useState('');
    const [confirm_password, setConfirm_Password] = useState('');
    const [valid, setValid] = useState({
        otp: true,
        new_password: true,
        confirm_password: true
    });
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");
        let numPattern = /^\d+$/;
        if (name === 'otp') {
            (value.length !== 6 || !numPattern.test(otp)) ? setValid((prevValid) => ({ ...prevValid, otp: false })) : setValid((prevValid) => ({ ...prevValid, otp: true }));
            setOtp(value);
        }
        if (name === 'new_password') {
            (!passPattern.test(value) || value.length < 8 || value.length > 16) ? setValid((prevValid) => ({ ...prevValid, new_password: false })) : setValid((prevValid) => ({ ...prevValid, new_password: true }));
            setNew_Password(value);
        }
        if (name === 'confirm_password') {
            (value !== new_password) ? setValid((prevValid) => ({ ...prevValid, confirm_password: false })) : setValid((prevValid) => ({ ...prevValid, confirm_password: true }));
            setConfirm_Password(value);
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
            const res = await axios.post('http://localhost:3000/owners/reset-password', { otp }, {
                headers: {
                    'new-password': new_password ,
                    'confirm-password': confirm_password ,
                }
            });
            console.log("response", res);
            toast.success(res.data.message, {
                position: "top-center",
                autoClose: 2000,
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
                    <div >
                        <label htmlFor="otp" className="input-label">OTP</label>
                        <input type="text" className="input-field" name="otp" value={otp} onChange={handleInputChange} required />
                        {!valid.otp && (
                            <div>
                            <span>Please enter 6 digit otp</span><br />
                            </div>
                        )}
                        <label htmlFor="new_password" className="input-label">New Password</label>
                        <div className="input-field-password">
                            <input type="password" className="password-input" id="newPasswordInput" name="new_password" value={new_password} onChange={handleInputChange} required />
                            <div className="eye-icon">
                                <img src={eyeFill} alt="eye" id="eyeImgNew" onClick={showNewPassword} />
                            </div>
                        </div>
                        {!valid.new_password && (
                            <div>
                                <span>New password should atleast 8 char with minimum 1 uppercase , 1 lowercase, 1 digit, 1 special char.</span><br />
                            </div>
                        )}
                        <label htmlFor="confirm_password" className="input-label">Confirm Password</label>
                        <div className="input-field-password">
                            <input type="password" className="password-input" id="confirmPasswordInput" name="confirm_password" value={confirm_password} onChange={handleInputChange} required />
                            <div className="eye-icon">
                                <img src={eyeFill} alt="eye" id="eyeImg" onClick={showConfirmPassword} />
                            </div>
                        </div>
                        {!valid.confirm_password && (
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

export default OwnerResetPassword;