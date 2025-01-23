import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import success from "../../assets/success.png";
import { useNavigate, Link } from "react-router-dom";
import "../../App.css";

const OwnerEmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:3000/owners/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log("Email verification response:", data);
        setValidUrl(true);
      } catch (error) {
        console.error(error);
      }
    };
    verifyEmailUrl();
  }, [param.id, param.token]);

  return (
    <div className="login-box">
      {validUrl && (
        <div className="verify-email">
          {/* <img src={success} alt="success_img" className="success" /> */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              fill="currentColor"
              className="bi bi-check2-circle"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>
          </div>
          <h1>Email verified successfully</h1>
          <div className="button">
            <Link to="/owner/login">
              <button className="golden-btn">LOGIN</button>
            </Link>
          </div>
        </div>
      )}
      {!validUrl && <h1>404 Not Found</h1>}
    </div>
  );
};

export default OwnerEmailVerify;
