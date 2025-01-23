/* We change this file */

import { Box, Button, Container, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import {useParams ,useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


function AgentDetails() {
    const navigate = useNavigate()
    const [formData,setFormData] = useState([])
    const [validUrl, setValidUrl] = useState('');
    const [details,setDetails] = useState([]);

    const param = useParams();
    const handleLogout = async() => {
        const token = localStorage.getItem('token'); 
        try {
          const res = await axios.post('http://localhost:3000/agent/logout', {}, {
            headers: {
              'x-auth-token': token 
            }
          });
          setFormData(res.data.msg);
          localStorage.removeItem('token'); 
          alert("click ok to logout")
          navigate('/')
        } catch (err) {
          setFormData(err.response.data.error);
        }
      };
      const handleDetails = async() => {
        const token = localStorage.getItem('token'); 
        try {
          const res = await axios.get('http://localhost:3000/agent/getagent',  {
            headers: {
              'x-auth-token': token 
            }
          });
          setValidUrl(true)
          console.log(res.data)
          setDetails(res.data);
        } catch (err) {
          setValidUrl(false)
        }
      };
  return (
    <>
      <nav className='nav'>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography  > LOGO </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>Home</Button>
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>Property</Button>
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>Deal type</Button>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {/* <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleDetails}>profile</Button> */}
              <Avatar onClick={handleDetails} style={{ cursor: 'pointer' }} className='avatar'><AccountCircleIcon className='avatar-icon'/></Avatar>
              <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleLogout}>Logout</Button>
            </Box> 
          </Toolbar>
        </Container> 
        </nav>
        
        
        {
          validUrl==true && 
          <h1 className='write'>Welcome to Login Page, {details.agent.name} !! <img  src={details.agent.filename} alt="Agent Image" /></h1>  
        } 
    </>
  )
}

export default AgentDetails;