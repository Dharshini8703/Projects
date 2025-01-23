import React, { useState } from "react";
import '../../index.css';
import '../../App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminResetPassword from './resetPassword';
import { Link } from "react-router-dom";


function AdminForgotPassword() {
    const [email, setEmail] = useState('')
    const [validate, setValidate] = useState(false);
    const [valid, setValid] = useState(true);

    axios.defaults.withCredentials = true;

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (name === 'email') {
            (!emailPattern.test(value)) ? setValid(false) : setValid(true);
            setEmail(value);
        }
    }

    const notifyError = (msg) => toast.error(msg);

    const setValidateFunc = () => {
        setValidate(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setSubmitted(true);
        if (!emailPattern.test(email)){
            setEmail("");
        }
        try {
            const res = await axios.post('http://localhost:3000/admin/forgotPassword', { email });
            console.log(res);
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
                    setValidate(true);
                }, 1500);
            }
        }
        catch (error) {
            notifyError(error.response.data.error)
        }
    };

    return (
        <div>
            {!validate ? (
            <div>
                <div className="back-button">
                    <Link to='/homepage'>
                        <button className="golden-back-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                        </button>
                    </Link>
                </div>
                <div className="login-box1">
                    <div className="form-box" id="form-box">
                        <form action="POST" onSubmit={handleSubmit} className="login-form" id="admin">
                        <h1 className="my-heading">Forgot Password</h1>
                        <div className="input-box">
                            <label htmlFor="email" className="input-label">Email</label>
                            <input type="text" className="input-field" name="email" value={email} onChange={handleInputChange} required />
                            {!valid && (
                                <div>
                                    <span>Please enter valid email</span><br />
                                </div>
                            )}
                        </div> 
                        <button type="submit" className="submit-btn">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            ) : (<AdminResetPassword setValidate = {setValidateFunc}/>)}
            <ToastContainer />
        </div>
    )
}

export default AdminForgotPassword;