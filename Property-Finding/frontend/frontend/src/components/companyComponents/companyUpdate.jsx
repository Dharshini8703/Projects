import React, { useState } from 'react';
import axios from 'axios';
import CompanyLogout from './Logout.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import '../../index.css';
import eyeFill from '../../assets/eye.png';
import { useNavigate } from 'react-router-dom';


function CompanyUpdate() {
    const navigate=useNavigate();
    const[cmp_id,setCompanyId]=useState('');
    const [image, setImage] = useState();
    const [cmp_name, setCmp_name] = useState('');
    const [address, setAddress] = useState('');
    const [proof_id, setProof_id] = useState('');
    const [proof, setProof] = useState('');
    const [description, setDescription] = useState();
    const [valid, setValid] = useState({
        image: true,
        cmp_name: true,
        address :true,
        proof_id:true,
        proof:true,
        description:true
      });
    
const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name === 'cmp_name') {
          (!value) ? setValid((prevValid) => ({ ...prevValid, cmp_name: false })) : setValid((prevValid) => ({ ...prevValid, cmp_name: true }));
          setCmp_name(value);
        }
        if (name === 'address') {
          (!value) ? setValid((prevValid) => ({ ...prevValid, address: false })) : setValid((prevValid) => ({ ...prevValid, address: true }));
          setAddress(value);
        }
        if (name === 'proof_id') {
            (value.length===12) ? setValid((prevValid) => ({ ...prevValid, proof_id: false })) : setValid((prevValid) => ({ ...prevValid, proof_id: true }));
            setProof_id(value);
        }
        if (name === 'description') {
            (!value) ? setValid((prevValid) => ({ ...prevValid, description: false })) : setValid((prevValid) => ({ ...prevValid, description: true }));
            setDescription(value);
          }
        
      }
const handleImageChange = (e) => {
        const {name, files} = e.target;
        if (name === 'image') {
          (!files) ? setValid((prevValid) => ({ ...prevValid, image: false })) : setValid((prevValid) => ({ ...prevValid, image: true }));
          setImage(files[0]);
        }
        
      };
    const handleProofChange = (e) => {
        const {name, files} = e.target;
        if (name === 'proof') {
          (!files) ? setValid((prevValid) => ({ ...prevValid, proof: false })) : setValid((prevValid) => ({ ...prevValid, proof: true }));
          setProof(files[0]);
        }
        
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('cmp_name', cmp_name);
        formData.append('address', address);
        formData.append('image', image);
        formData.append('proof_id', proof_id);
        formData.append('proof', proof);
        formData.append('description', description);
     try {
          const res = await axios.post('http://localhost:3000/api/createNewCmpUser', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
 }
          });
          console.log('Response:', res);
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 2000, // Close the toast after 3 seconds
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
        catch (error) {
          console.error(error.response.data.error);
          notifyError(error.response.data.error)
        }
      };
   
    return (
        <div>
  <nav className="navbar navbar-expand-md navbar-dark bg-black border-bottom border-white fixed-top navbar-custom" aria-label="Fourth navbar example">
    <div className="container-fluid">
        <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"></use></svg>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Buy</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Rent</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Commercial</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">New Projects</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown" aria-expanded="false">Explore</a>
                    <ul className="dropdown-menu" aria-labelledby="dropdown04">
                        <li><a className="dropdown-item" href="#">Property Blog</a></li>
                        <li><a className="dropdown-item" href="#">Company Insights</a></li>
                        <li><a className="dropdown-item" href="#">Know Your Rights</a></li>
                    </ul>
                </li>
            </ul>
            <div className="links">
                <a href="/company/addUser">Add User+</a>
            </div>
            <div className='text-end admin-btn'>
                <div>
                    <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                        </svg>
                    </a>
                </div>
                <div>
                    <CompanyLogout />
                </div>
            </div>
        </div>
    </div>
</nav>
           <div className='pro-img'>
               <div className='profile-image'>
                     <img src={image} alt="" />
                            </div>
                        </div>
        <div className = "login-box2">
          <div className="form-box" id="form-box">
           <div className='admin-head'>
                        <h5>UPDATE COMPANY INFORMATION</h5>
                    </div>
         <div className="input-box">
         <div className="admin-head">
                        <p >UniqueId {cmp_id} - Company {cmp_name}</p>
                   </div> 
            <label htmlFor="companyname" className="input-label">Company name*</label>
              <input type="text" className="input-field" name="cmp_name" value={cmp_name} onChange={handleInputChange} required />
                {!valid.cmp_name && (
                  <div>
                    <span>Company name cannot be empty. </span><br />
                  </div>
                )}
                <label htmlFor="address" className="input-label">Location*</label>
                <input type="text" className="input-field" name="address" value={address} onChange={handleInputChange} required />
                {!valid.address && (
                  <div>
                    <span>location name cannot be empty.</span><br />
                  </div>
                )}
                <label htmlFor="proof_id" className="input-label">Proof_id*</label>
                <input type="text" className="input-field" name="proof_id" value={proof_id} onChange={handleInputChange} required />
                {!valid.proof_id && (
                  <div>
                    <span>ORN digits must be 12</span><br />
                  </div>
                )}
                <label htmlFor="description" className="input-label">Company description*</label>
                <textarea className="input-field1"  name="description" value={description} onChange={handleInputChange} required />
                {!valid.description && (
                  <div>
                    <span>Description cannot be empty</span><br />
                  </div>
                )}
               <label htmlFor="proof" className="input-label">Upload proof*</label>
                <input type="file" className="input-field-img" name="proof"  onChange={handleProofChange} required/>
                {!valid.proof && (
                  <div>
                    <span>Please select image</span><br />                   
                  </div>
                )}
                <div className="confirm">
                <button type="submit" className="submit-btn" onClick={handleSubmit}>CONFIRM</button>
                </div>
               
            </div>
            </div>
                    
                
            </div>
        </div>
    )
}

export default CompanyUpdate;