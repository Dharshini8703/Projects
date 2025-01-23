import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../index.css";
import "../../index.css";
const CompanyLogout = () => {
    const navigate = useNavigate();
    
    const notifyError = (msg) => toast.error(msg);

    const handleLogout = async() => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.post('http://localhost:3000/api/logout', {}, {
            headers: {
            'x-auth-token': token 
            }
        });
        toast.success('Logout successful', {
          position: "top-right",
          autoClose: 2000, // Close the toast after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        if (res.data.message) {
          localStorage.removeItem('token');
          setTimeout(() => {
            navigate('/homepage');
          }, 2000);
        } 
    } 
    catch (error) {
      notifyError(error.response.data.error);
    }
};

  return (
    <div>
      
      <a onClick={handleLogout}  className="dropdown-item" >Logout</a>
      <ToastContainer />
    </div>
  );
};

export default CompanyLogout;
