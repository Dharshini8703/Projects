import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientResetPassword from "./resetPassword.jsx";
import { Link } from "react-router-dom";
import '../../index.css';
import '../../App.css';

function ClientForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validate, setValidate] = useState(false);
  console.log(`validate: ${validate}`);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/clients/forgot-password",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        console.log("Response:", response.data.message);
        if(response.data.success) {
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
            setValidate(true);
        }, 2000);
        }
        setSubmitted(true);
      } catch (error) {
        setLoading(false);
        console.error(error.response.data.errors);
        notifyError(error.response.data.errors);
      }
      setLoading(false);
    }
  };

  // // const handleBackBtn = () => {
  //   navigate("/login");
  // // };

  const setValidateFunc = () => {
    setValidate(false);
  }

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
      {!validate ? (
        <div>
          <div className="back-button">
          <Link to="/homepage">
              <button className="golden-back-btn">
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
            </Link>
          </div>
          <div className="login-box1">
            <div className="form-box" id="form-box">
              <form
                action="POST"
                onSubmit={handleSubmit}
                className="login-form"
                id="admin"
              >
                <h1 className="my-heading">Forgot Password</h1>
                <div className="input-box">
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {submitted && !email && (
                    <div>
                      <span>Please enter valid email</span>
                      <br />
                    </div>
                  )}
                </div>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <ClientResetPassword setValidateFunc={setValidateFunc} email={email}/>
      )}
      <ToastContainer />
    </div>
    // <div>
    //   {submitted && !loading ? (
    //     <ResetPassword email={email} />
    //   ) : (
    //     <div className="fp-container">
    //       <div>
    //         <button className="back-btn" onClick={handleBackBtn}>
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             width="16"
    //             height="16"
    //             fill="currentColor"
    //             class="bi bi-arrow-left"
    //             viewBox="0 0 16 16"
    //           >
    //             <path
    //               fill-rule="evenodd"
    //               d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
    //             />
    //           </svg>
    //         </button>
    //       </div>
    //       <div className="fp-title">
    //         <h2>Forgot Password</h2>
    //       </div>
    //       <form onSubmit={handleSubmit} action="post">
    //         <input
    //           class="fp-form-field"
    //           type="email"
    //           placeholder="Email *"
    //           name="email"
    //           value={email}
    //           onChange={handleInputChange}
    //         />
    //         {submitted && !values.email && <span>Please enter email</span>}
    //         <button type="submit" className="reset-password-text reset-btn">
    //           {loading ? (
    //             <CircularProgress size={20} sx={{ color: "white" }} />
    //           ) : (
    //             "Reset Password"
    //           )}
    //         </button>
    //       </form>
    //       <div className="note">
    //         <p>
    //           Note: You have to enter your registered email in order to receive
    //           reset password mail!
    //         </p>
    //       </div>
    //     </div>
    //   )}
    //   <ToastContainer />
    // </div>
  );
}

export default ClientForgotPassword;
