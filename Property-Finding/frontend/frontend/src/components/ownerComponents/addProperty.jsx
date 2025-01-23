import axios from 'axios';
import React, { useEffect, useState } from 'react';
import OwnerLogout from './logout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import ViewProperty from './viewProperty';
import logoImage from '../../assets/vkr.jpg'
import { useNavigate } from 'react-router-dom';

function AddProperty() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState('');
  const [first_name, setFirst_Name] = useState('');
  const [last_name, setLast_Name] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState()
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [profile, setProfile] = useState(null);
  const [validate, setValidate] = useState(false);
  const [formData, setFormData] = useState({ });
  const setValidateFunc = () => {
    setValidate(false);
};
  useEffect(() => {
    const ownerDetails = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.error('No token provided');
        // Handle error or redirect to login
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/owners/details', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        const owner = res.data.owner;
        setOwnerId(owner.propertyOwner_id);
        setFirst_Name(owner.first_name);
        setLast_Name(owner.last_name);
        setPhoneNumber(owner.phone);
        setEmail(owner.email);
        setAddress(owner.address);
        setUsername(owner.username);
        const imageUrl = `http://localhost:3000/propertyOwnerImages/${owner.profile}`;
        setProfile(imageUrl);
      } catch (error) {
        // console.error('Error fetching prop owner details:', error);
        console.error(error.response.data.error);
        notifyError(error.response.data.error)
      }
    };
    ownerDetails();
  }, []);

  const [images, setImages] = useState([]);
  const [document, setDocument] = useState(null);
  const [video, setVideo] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    console.log("image" , files)
  };
  const handleVideoChange = (e) => {
    // const files = Array.from(e.target.files);
    setVideo(e.target.files[0]);
    console.log("videos" , e.target.files[0])
  };

  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]);
  };
  const handleDateChange = (e) => {
    const [year, date,month] = e.target.value.split('-');
    const formattedDate = `${year}-${date}-${month}`;
    setFormData({...formData, availability:formattedDate});
    console.log('formData -->', formData);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();

    if (video) {
      formDataToSend.append(`video`, video);
    }
    // Append images to formDataToSend
    images.forEach((image, index) => {
      formDataToSend.append(`images`, image); 
    });

    // Append document to formDataToSend
    if (document) {
      formDataToSend.append('document', document);
    }

    // Append other form data fields
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token provided');
        // Handle error or redirect to login
        return;
      }

      const res = await axios.post('http://localhost:3000/property/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });

      console.log('Response:', res.data);
      // Handle success case, show toast or update UI
      toast.success(res.data.message, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding property:', error);
      // Display the exact error message from the server
      if (error.response) {
        console.error('Server Error:', error.response.data);
        notifyError(error.response.data.error); // Show error message to the user
      } else {
        console.error('Network Error:', error.message);
        notifyError('Network error. Please try again.'); // Handle network errors
      }
    }
  };

  const notifyError = (msg) => toast.error(msg);

  const handleAdd = () => {
    setOpen(true);
  };
  
  return (
    <div>
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
                <a className="nav-link" href="#">{ownerId}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">{first_name}</a>
              </li>
            </ul>
            {!open && <a className="btn btn-secondary golden-btn mx-5" href="#" role="button" onClick={handleAdd} aria-expanded="false">
              ADD PROPERTY
            </a>}
            {open && <a className="btn btn-secondary golden-btn mx-5" href="/owner/property" role="button"  aria-expanded="false">
              VIEW PROPERTY
            </a>}
            <div className='text-end admin-btn'>
              <div className="dropdown">
                <a className="btn bi bi-person-circle mx-5" href="#" role="button"
                  id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" >
                  <div className="profile1-image-container">
                    <img src={profile} alt="Profile" className="profile1-image" />
                  </div>
                </a>
                <ul className="dropdown-menu my-3" aria-labelledby="dropdownMenuLink">
                <li><a className="dropdown-item font-style" href="/owner/ownerHome" >Profile</a></li>
                  {open && <li><a className="dropdown-item font-style" href="/owner/property" >View property</a></li>}
                  <li><OwnerLogout /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className='login-box'>
      {open ?(
        
          <div className="form-box-home" id="form-box-home">
            <h1 className="my-heading">Add property</h1> 
            <h4 className="sub-heading">Let's create your Property!</h4>
            <form onSubmit={handleSubmit} className="login-form" id="admin">
              <div className='direction'>
                <div className='input-box'>
                  <label htmlFor="property_type" className="input-label">Property Type *</label>
                  <select className="input-field" name="property_type" value={formData.property_type} onChange={handleInputChange} required>
                    <option value="" className='black'>Select property type</option>
                    <option value="Town House" className='black'>Town House</option>
                    <option value="Villa" className='black'>Villa</option>
                    <option value="Apartment" className='black'>Apartment</option>
                  </select>

                  <label htmlFor="location" className="input-label">Location</label>
                  <input type="text" className="input-field" name="location" value={formData.location} onChange={handleInputChange} required />

                  <label htmlFor="square_feet" className="input-label">Property Square Feet</label>
                  <input type="text" className="input-field" name="square_feet" value={formData.square_feet} onChange={handleInputChange} required />

                  <label htmlFor="service_type" className="input-label">Service Type *</label>
                  <select className="input-field" name="service_type" value={formData.service_type} onChange={handleInputChange} required>
                    <option value="" className='black'>Select service type</option>
                    <option value="Rent" className='black'>Rent</option>
                    <option value="Buy" className='black'>Buy</option>
                    <option value="Commercial Buy" className='black'>Commercial Buy</option>
                    <option value="Commercial Rent" className='black'>Commercial Rent</option>
                  </select>

                  <label htmlFor="video" className="input-label">Property Video</label>
                  <input type="file" name="video" className="input-field-img" onChange={handleVideoChange} required />

                  
                </div>

                <div className='input-box1'>
                <label htmlFor="bedroom" className="input-label">Beds</label>
                <input type="text" className="input-field" name="bedroom" value={formData.bedroom} onChange={handleInputChange} required />

                  <label htmlFor="bathroom" className="input-label">Baths</label>
                  <input type="text" className="input-field" name="bathroom" value={formData.bathroom} onChange={handleInputChange} required />

                  <label htmlFor="availability" className="input-label">Property Available From</label>
                  <input type="date" name="availability" value={formData.availability} onChange={handleDateChange} className="form-control input-field " />
                  
                  <label htmlFor="amenities" className="input-label">Amenities</label>
                  <select className="input-field" name="amenities" value={formData.amenities} onChange={handleInputChange} required>
                    <option value="" className='black'>Select amenities</option>
                    <option value="Furnished" className='black'>Furnished</option>
                    <option value="Semi Furnished" className='black'>Semi Furnished</option>
                    <option value="Pet Allowed" className='black'>Pets Allowed</option>
                    <option value="Security" className='black'>Security</option>
                  </select>


                  <label htmlFor="images" className="input-label">Property Images</label>
                  <input type="file" multiple name="images" className="input-field-img" onChange={handleImagesChange} required />
                </div>

                <div className='input-box1'>

                <label htmlFor="price" className="input-label">Price</label>
                <input type="text" className="input-field" name="price" value={formData.price} onChange={handleInputChange} required />

                  <label htmlFor="permit_number" className="input-label">Permit Number</label>
                  <input type="text" className="input-field" name="permit_number" value={formData.permit_number} onChange={handleInputChange} required />

                  <label htmlFor="description" className="input-label">Property description</label>
                  <input type="text" className="input-field" name="description" value={formData.description} onChange={handleInputChange} />

                  <label htmlFor="title" className="input-label">Property title</label>
                  <input type="text" className="input-field" name="title" value={formData.title} onChange={handleInputChange} required />

                  <label htmlFor="document" className="input-label">Property Document</label>
                  <input type="file" name="document" className="input-field-img" onChange={handleDocumentChange} />
                </div>
              </div>
              <button type="submit" className="submit-btn">Add</button>
            </form>
          </div>
        
      ) : (
        <ViewProperty setValidate = {setValidateFunc}/>
      )}
      
     
  <ToastContainer />
    
  </div> 
    </div>
  );
}

export default AddProperty;
