import React, { useEffect, useState } from "react";
import axios from "axios";
import CompanyLogout from "./Logout.jsx";
import "bootstrap/dist/css/bootstrap.css";
import "../../index.css";
import eyeFill from "../../assets/eye.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import logoImage from '../../assets/vkr.jpg'

    
function CompanyHome() {
  // const [companyDetails, setCompanyDetails] = useState(null);
 
  const [cmp_id, setCmp_id] = useState("");
  const [cmp_name, setCmp_name] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState("");
  const [proof_id, setProof_id] = useState();
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState("");
  const [error, setError] = useState(null);
  const [validate, setValidate] = useState(false);
  const [logoFile, setLogoFile] = useState("");
  // const [profile, setProfile] = useState(null);

  const [valid, setValid] = useState({
    cmp_id: true,
    cmp_name: true,
    address: true,
    logo: true,
    proof_id: true,
    description: true,
    document: true,
  });

  const [popupUrl, setPopupUrl] = useState('');
  const [popupContent, setPopupContent] = useState(null); // Changed to null for document handling
  const [isLoading, setIsLoading] = useState(false);


  const openPopup = async (url) => {
    setPopupUrl(url);
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const reader = new FileReader();
      reader.onload = () => {
        setPopupContent(reader.result); // Store result as data URL
      };
      reader.readAsDataURL(response.data); // Read blob as data URL
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Error fetching content');
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setPopupUrl('');
    setPopupContent(null); // Reset content on close
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "cmp_name") {
      !value
        ? setValid((prevValid) => ({ ...prevValid, cmp_name: false }))
        : setValid((prevValid) => ({ ...prevValid, cmp_name: true }));
      setCmp_name(value);
    }
    if (name === "address") {
      !value
        ? setValid((prevValid) => ({ ...prevValid, address: false }))
        : setValid((prevValid) => ({ ...prevValid, address: true }));
      setAddress(value);
    }
    if (name === "proof_id") {
      value.length === 12
        ? setValid((prevValid) => ({ ...prevValid, proof_id: false }))
        : setValid((prevValid) => ({ ...prevValid, proof_id: true }));
      setProof_id(value);
    }
    if (name === "description") {
      !value
        ? setValid((prevValid) => ({ ...prevValid, description: false }))
        : setValid((prevValid) => ({ ...prevValid, description: true }));
      setDescription(value);
    }
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (name === "document") {
      console.log(files);
      !files
        ? setValid((prevValid) => ({ ...prevValid, document: false }))
        : setValid((prevValid) => ({ ...prevValid, document: true }));
        const imageUrl = URL.createObjectURL(files[0]);
        setPopupContent(imageUrl)
      setDocument(files[0]);
    }
    if (name === "logo") {
      const file=files[0];
      if(file){
        const imageUrl=URL.createObjectURL(file);
        console.log(imageUrl);
        setLogo(imageUrl);
        setLogoFile(file);
}
 
    }
  };
  
  const handleSubmit = async (e) => {
    const customToastStyle = {
      marginTop: "50px", // Move toast down by 20px
    };
    e.preventDefault();
    const formData = new FormData();
    // formData.append('cmp_id',cmp_id);
    formData.append("cmp_name", cmp_name);
    formData.append("address", address);
    formData.append("proof_id", proof_id);
    formData.append("description", description);
    // formData.append('logo', logo);
    formData.append("document", document);
    // console.log(document);
    if (logoFile) {
        formData.append('logo', logoFile);
    }

    const token = localStorage.getItem("token"); // Assuming you are storing your token in localStorage
    if (!token) {
        console.error("No token provided");
        setError("No token provided");
        return;
    }
    try {
        console.log(formData)
        const res = await axios.patch(
            "http://localhost:3000/api/companyUpdate",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-auth-token": token,
                },
            }
        );
        console.log("Response:", res); // Log the response
        if (res.data.message) {
            toast.success(res.data.message, { 
                position: "top-center",
                autoClose: 2000, // Close the toast after 2 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastClassName: 'custom-toast', // Apply custom class for styling
                bodyClassName: 'custom-toast-body', // Apply custom class for body styling
                style: customToastStyle
            });
        } else {
            toast.success('Updated successfully!', {
                position: "top-center",
                autoClose: 2000, // Close the toast after 2 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastClassName: 'custom-toast', // Apply custom class for styling
                bodyClassName: 'custom-toast-body', // Apply custom class for body styling
                style: customToastStyle
            });
        }
    }
    catch (error) {
        console.error("Error:", error); // Log the error
        toast.error(error.message || "An error occurred", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

  const handleClick = () => {
    setValidate(true);
  }
useEffect(()=>{
      const fetchCompanyDetails = async () => {
        const token = localStorage.getItem("token"); // Assuming you are storing your token in localStorage
        if (!token) {
          console.error("No token provided");
          setError("No token provided");
          return;
        }
    
        try {
          const response = await axios.get(
            "http://localhost:3000/api/getCompanyDetails",
            {
              headers: {
                "Content-Type": "application/json",
                token: token, 
              },
            }
          );
          console.log(response.data);
          setCmp_id(response.data.company.cmp_id);
          setCmp_name(response.data.company.cmp_name);
          setAddress(response.data.company.address);
          setProof_id(response.data.company.proof_id);
          setDocument(response.data.company.proofImage_name);
          setDescription(response.data.company.description);
          console.log("document",response.data.company.proofImage_name);
          const imageUrl = `http://localhost:3000/companyImages/${response.data.company.image_name}`;
          setLogo(imageUrl);
          console.log(imageUrl);
       } 
        catch (error) {
          console.error("Error fetching company details:", error);
          setError("Error fetching company details");
        }};
      fetchCompanyDetails();
    },[])
 

    
  return (
    <div>
      <nav
        className="navbar navbar-expand-md navbar-dark bg-black border-bottom border-white fixed-top navbar-custom"
        aria-label="Fourth navbar example"
      >
        <div className="container-fluid">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            <svg
              className="bi me-2"
              width="40"
              height="32"
              role="img"
              aria-label="Bootstrap"
            >
              <use xlinkHref="#bootstrap"></use>
            </svg>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsExample04"
            aria-controls="navbarsExample04"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="profile1-image-container1">
                    <img src={logoImage} alt="Profile" className="profile1-image" />
                  </div>
          <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Buy
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Rent
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Commercial
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  New Projects
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="dropdown04"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Explore
                </a>
                <ul className="dropdown-menu" aria-labelledby="dropdown04">
                  <li>
                    <a className="dropdown-item" href="#">
                      Property Blog
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Company Insights
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Know Your Rights
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="text-end admin-btn">
            <a
              href="#"
              className="d-flex align-items-center text-white text-decoration-none"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="profile1-image-container">
                    <img src={logo} alt="Profile" className="profile-image" />
                  </div>
             {/* <img
                src={logo}
                width="40"
                height="40"
                className="rounded-circle"
                alt="Profile"
              /> */}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
             {!validate &&
               <li>
               <a className="dropdown-item" href="#" onClick={handleClick}>Company Profile</a>
             </li>
              }
            
              <li>
                <a className="dropdown-item" href="/company/addUser">Add Employee</a>
              </li>
              <li>
                <a className="dropdown-item" href='/company/UserPage' >View employees</a>
              </li>
             
              <li>
                <CompanyLogout/>
              </li>
            </ul>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="login-box">
      <div className="admin-head">
      <h5>Welcome {cmp_name}!!</h5>
      </div>
        {validate &&
             
          // <div className="login-box2">
            <div className="form-box" id="form-box">
              <div className='admin-head'>
            <div className="pro-img">
                        <div className="profile-image">
                            <label htmlFor="profile" className="file-input-label">
                                {logo ? (
                                    <img src={logo} alt="Profile Preview" />
                                ) : (
                                    <span>Upload a profile image</span>
                                )}
                                <input
                                    id="profile"
                                    type="file"
                                    name="logo"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="file-input"
                                />
                            </label>
                        </div>
                    </div>
                <div className='owner-card'>
                    <div className='owner-id'>
                        <h5>{cmp_id} - {cmp_name}</h5>
                    </div>
                </div>
            </div>
          <div className="input-box">
                <label htmlFor="companyname" className="input-label">Company name*</label>
                <input
                  type="text"className="input-field"name="cmp_name"value={cmp_name}onChange={handleInputChange}required />
                {!valid.cmp_name && (
                  <div>
                    <span>Company name cannot be empty. </span>
                    <br />
                  </div>
                )}
                <label htmlFor="address" className="input-label">Location*</label>
                <input type="text"className="input-field"name="address"value={address}onChange={handleInputChange} required/>
                {!valid.address && (
                  <div>
                    <span>location name cannot be empty.</span>
                    <br />
                  </div>
                )}
                <label htmlFor="proof_id" className="input-label">Proof_id*</label>
                <input type="text" className="input-field" name="proof_id" value={proof_id} onChange={handleInputChange} required/>
                {!valid.proof_id && (
                  <div>
                    <span>Proof_id cannot be empty.</span>
                    <br />
                  </div>
                )}
                <label htmlFor="description" className="input-label">
                  Company description*
                </label>
                <textarea className="input-field"name="description"value={description} onChange={handleInputChange} required/>
                <label htmlFor="document" className="input-label">Upload proof*</label>
                <input
                  type="file" className="input-field-img" name="document" onChange={handleImageChange}required/>
                {!valid.document && (
                  <div>
                    <span>Please select image</span>
                    <br />
                  </div>
                )}
                 {document&& 
                 <a className="btn-link" onClick={() => openPopup(`http://localhost:3000/companyImages/${document}`)} >View document</a>
                }
                
                    {popupUrl && (
            <div className="popup">
              <div className="popup-inner">
                <button type="button" className="exit" onClick={closePopup}>x</button>
                <h4 className='docss'>Proof Document</h4>
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div>
                    {popupContent && (
                      <iframe
                        title="Document Preview"
                        width="150%"
                        height="500px"
                        src={popupContent}
                      >
                        
                      </iframe>
                    )}
                  </div>
                )}
                
              </div>
            </div>
          )}
                <div className="confirm">
                  <button
                    type="submit"
                    className="submit-btn"
                    onClick={handleSubmit}
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </div>
          // </div>
        }
      </div>
    </div>
  );
}

export default CompanyHome;
