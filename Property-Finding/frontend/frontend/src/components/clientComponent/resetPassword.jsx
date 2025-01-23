import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../index.css';
import '../../App.css';

function ClientResetPassword(props) {
  const [values, setValues] = useState({
    new_password: "",
    confirm_password: "",
    otp: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  useEffect(() => {
    // console.log(`Email: ${email}`);
    console.log(`New password: ${values.new_password}`);
    console.log(`Confirm Password: ${values.confirm_password}`);
    console.log(`OTP: ${values.otp}`);
  }, [values.new_password, values.confirm_password, values.otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (values.new_password && values.confirm_password && values.otp) {
      setLoading(true);
      setValid(true);
      const formData = new FormData();
      formData.append("otp", values.otp);
      formData.append("email", props.email);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/clients/reset-password",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              "new-password": values.new_password,
              "confirm-password": values.confirm_password,
            },
          }
        );
        console.log(response.data);
        console.log("Response:", response.data.message);
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 2000, // Close the toast after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setTimeout(() => {
            navigate("/homepage");
        }, 2000);
        } else {
          console.log("Error");
        }
      } catch (error) {
        setLoading(false);
        console.error(error.response.data.errors);
        notifyError(error.response.data.errors);
      }
    }
  };

  const notifyError = (msg) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // transition: Bounce,
    });
  
  return (
    <div>
      <div className="back-button">
        <button className="golden-back-btn" onClick={props.setValidateFunc}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>
      </div>
      <div className="login-box1">
        <div className="form-box" id="form-box">
          <form
            action="POST"
            onSubmit={handleSubmit}
            className="login-form"
            id="admin"
          >
            <h1 className="my-heading">Reset Password</h1>
            <div className="input-box">
              <label htmlFor="otp" className="input-label">
                OTP
              </label>
              <input
                type="text"
                className="input-field"
                name="otp"
                value={values.otp}
                onChange={handleInputChange}
                required
              />
              {submitted && !values.otp && (
                <div>
                  <span>Please enter 4 digit otp</span>
                  <br />
                </div>
              )}
              <label htmlFor="new_password" className="input-label">
                New Password
              </label>
              <input
                type="password"
                className="input-field"
                name="new_password"
                value={values.new_password}
                onChange={handleInputChange}
                required
              />
              {submitted && !values.new_password && (
                <div>
                  <span>
                    New password should atleast 8 char with minimum 1 uppercase
                    , 1 lowercase, 1 digit, 1 special char.
                  </span>
                  <br />
                </div>
              )}
              <label htmlFor="confirm_password" className="input-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="input-field"
                name="confirm_password"
                value={values.confirm_password}
                onChange={handleInputChange}
                required
              />
              {submitted && !values.confirm_password && (
                <div>
                  <span>Confirm password should be same to new password </span>
                  <br />
                </div>
              )}
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
    // <div className="rp-container">
    //   <div className="rp-title">
    //     <h2>Reset Password</h2>
    //   </div>
    //   <form onSubmit={handleSubmit} action="post">
    //     <input
    //       className="rp-form-field"
    //       type="password"
    //       placeholder="New Password *"
    //       name="new_password"
    //       value={values.new_password}
    //       onChange={handleInputChange}
    //     />
    //     {submitted && !values.new_password && (
    //       <span>Please enter new password</span>
    //     )}
    //     <input
    //       className="rp-form-field"
    //       type="password"
    //       placeholder="Confirm Password *"
    //       name="confirm_password"
    //       value={values.confirm_password}
    //       onChange={handleInputChange}
    //     />
    //     {submitted && !values.confirm_password && (
    //       <span>Please enter confirm password</span>
    //     )}
    //     <input
    //       className="rp-form-field"
    //       type="text"
    //       placeholder="OTP *"
    //       name="otp"
    //       value={values.otp}
    //       onChange={handleInputChange}
    //     />
    //     {submitted && !values.otp && <span>Please enter otp</span>}
    //     <button type="submit" className="rp-btn submit-text">
    //       {loading ? (
    //         <CircularProgress size={20} sx={{ color: "white" }} />
    //       ) : (
    //         "submit"
    //       )}
    //     </button>
    //   </form>
    //   <ToastContainer />
    // </div>
  );
}

export default ClientResetPassword;
