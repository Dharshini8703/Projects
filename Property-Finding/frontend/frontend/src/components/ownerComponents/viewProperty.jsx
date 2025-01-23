import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Carousel from 'react-bootstrap/Carousel';


function ViewProperty() {
  const [formData, setFormData] = useState({ data: [] });
  const [documentPopupUrl, setDocumentPopupUrl] = useState('');
  const [documentPopupContent, setDocumentPopupContent] = useState(null);
  const [videoPopupUrl, setVideoPopupUrl] = useState('');
  const [videoPopupContent, setVideoPopupContent] = useState(null);
  const [imagePopupUrl, setImagePopupUrl] = useState('');
  const [imagePopupContent, setImagePopupContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token provided');
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/owners/all/properties', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        console.log(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        notifyError(error.response.data.error);
      }
    };

    fetchPropertyDetails();
  }, []);

  const openDocumentPopup = async (url) => {
    setDocumentPopupUrl(url);
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const reader = new FileReader();
      reader.onload = () => {
        setDocumentPopupContent(reader.result);
      };
      reader.readAsDataURL(response.data);
    } catch (error) {
      console.error('Error fetching document content:', error);
      setError('Error fetching document content');
    } finally {
      setIsLoading(false);
    }
  };

  const openImagePopup = async (property) => {
    setSelectedProperty(property);
    setIsLoading(true);
    setError('');

    try {
      const fileObject = JSON.parse(property.property_img_name);
      const images = [];

      for (const key in fileObject) {
        if (fileObject.hasOwnProperty(key)) {
          const imageUrl = `http://localhost:3000/propertyImages/${property.property_id}/${fileObject[key]}`;
          images.push(imageUrl);
        }
      } 

      setImagePopupContent(images);
      setImageIndex(0); 
    } catch (error) {
      console.error('Error fetching image content:', error);
      setError('Error fetching image content');
    } finally {
      setIsLoading(false);
    }

    setImagePopupUrl(property);
  };

  const openVideoPopup = async (property) => {
    setIsLoading(true);
    setError('');

    try {
      const videoUrl = `http://localhost:3000/propertyImages/${property.property_id}/${property.property_vdo_name}`;
      setVideoPopupContent(videoUrl);
    } catch (error) {
      console.error('Error fetching video content:', error);
      setError('Error fetching video content');
    } finally {
      setIsLoading(false);
    }

    setVideoPopupUrl(property);
  };

  const closeVideoPopup = () => {
    setVideoPopupContent('');
    setVideoPopupUrl('');
    setError('');
    setIsLoading(false);
  };


  const closeDocumentPopup = () => {
    setDocumentPopupUrl('');
    setDocumentPopupContent(null);
  };

  const closeImagePopup = () => {
    setImagePopupUrl('');
    setImagePopupContent([]);
    setSelectedProperty(null);
  };

  const propertyImage = (property) => {
    if (!property || !property.property_img_name) {
      return null;
    }

    const fileObject = JSON.parse(property.property_img_name);
    const firstImageKey = Object.keys(fileObject)[0];

    if (!firstImageKey) {
      return null;
    }

    const imageUrl = `http://localhost:3000/propertyImages/${property.property_id}/${fileObject[firstImageKey]}`;

    return (

      <img
        src={imageUrl}
        alt={`Image ${firstImageKey}`}
        style={{ maxWidth: '90px', maxHeight: '100px', margin: '5px', cursor: 'pointer' }}
        onClick={() => openImagePopup(property)}
      />
    );
  };
  

  const handleClick = (index) => {
    setImageIndex(index);
  };
  return (
    <div>
      <div className='login-box'>
        <h2 className='admin-head'>Property Details</h2>
      <Paper sx={{ width: '90%', overflow: 'hidden', backgroundColor: 'transparent' }}>
      <TableContainer sx={{ maxHeight: 420, backgroundColor: 'transparent'}}>
        <Table  stickyHeader aria-label="sticky table">
          <TableHead >
            <TableRow >
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Property Id</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Location</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Property Type</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Beds & Baths</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Service type</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Price</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Title</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Description</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Amenities</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Available From</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Document</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Property Images</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Property video</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

         
          <TableBody>
            {formData.data.map((owner) =>
              owner.properties.map((property) => (
                <TableRow key={property.property_id}>
                  <TableCell sx={{ color: 'white' }}>{property.property_id}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.location}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.property_type}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{`${property.bedroom} & ${property.bathroom}`}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.service_type}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.price}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.title}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.description}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.facilities.amenities}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{property.facilities.availability}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <a className="btn-link" onClick={() => openDocumentPopup(`http://localhost:3000/propertyImages/${property.property_id}/${property.property_doc_name}`)}>
                      Property Document
                    </a>
                  </TableCell>
                  
                  <TableCell sx={{ color: 'white' }}>{propertyImage(property)}</TableCell>
                  <TableCell sx={{ color: 'white' }}><a className="btn-link" onClick={() => openVideoPopup(property)}>Property Video</a></TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <button className="golden-btn" onClick={() => handleUpdate(property.property_id)}>
                      Update
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>

        {documentPopupUrl && (
            <div className="popup">
              <div className="popup-inner">
                <button type="button" className="exit" onClick={closeDocumentPopup}>X</button>
                <h4 className='docss'>Property Document</h4>
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div>
                    {documentPopupContent && (
                      <iframe
                        title="Document Preview"
                        width="100%"
                        height="500px"
                        src={documentPopupContent}
                      ></iframe>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {imagePopupUrl && (
            <div className="popup">
              <div className="popup-inner">
                <button type="button" className="exit" onClick={closeImagePopup}>X</button>
                <h4 className='docss'>Property Images</h4>
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div className="document-preview">
                  <Carousel className="custom-carousel" activeIndex={imageIndex} onSelect={(index) => setImageIndex(index)}>
                    {imagePopupContent.map((imageUrl, index) => (
                      <Carousel.Item key={index} className="carousel-item">
                        <img
                          src={imageUrl}
                          alt={`Image ${index }`}
                          className="carousel-image"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  {imagePopupContent.map((imageUrl, index) => ( 
                    
                      <img 
                        key={index}
                        src={imageUrl}
                        alt={`Image ${index }`}
                        onClick={()=> handleClick(index)}
                        style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                      />
             
                    ))}
                    
                </div>
                )}
              </div>
            </div>
          )}

          {videoPopupUrl && (
            <div className="popup">
              <div className="popup-inner">
                <button type="button" className="exit" onClick={closeVideoPopup}>X</button>
                <h4 className='docss'>Property video</h4>
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div className="document-preview">
                    {videoPopupContent && (
                      <video controls autoPlay muted style={{ width: '100%', height: '100%' }}>
                        <source src={videoPopupContent} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default ViewProperty;