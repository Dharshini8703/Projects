import React,{ useState,useEffect } from 'react'
// import '../../index.css';
import '../../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eyeFill from '../../assets/eye.png';
import eyeSlash from '../../assets/eyeSlash.png';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CompanyLogout from './Logout';
import logoImage from '../../assets/vkr.jpg'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';



function UserPage() {
    const navigate=useNavigate()
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhonenumber] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [validate, setValidate] = useState(false);
    const [image_name, setImage_name] = useState("");
    const [image_file, setImageFile] = useState();
    const [users, setUsers] = useState([]);
    const [valid, setValid] = useState({
        first_name: true,
        last_name: true,
        username: true,
        password: true,
        email: true,
        phone_number: true,
        address: true,
        role: true,
        image_name: true,
      });
      useEffect(() => {
        const fetchRoles = async () => {
          try {
            const response = await axios.get('http://localhost:3000/api/getRoles');
            setRoles(Object.values(response.data));
          } catch (error) {
            console.error('Error fetching roles:', error);
          }};
        fetchRoles();
      },[]);
  function showPassword() {
        var x = document.getElementById("passwordInput");
        var y = document.getElementById('eyeImg');
        if (x.type === "password") {
            x.type = "text";
            y.src = eyeSlash;
        } else {
            x.type = "password";
            y.src = eyeFill;
        }
}

const handleImageChange = (e) => {
        const { name, files } = e.target;
       if (name === "image_name") {
          const file=files[0];
          if(file){
            const imageUrl=URL.createObjectURL(file);
            console.log(imageUrl);
            setImage_name(imageUrl);
            setImageFile(file);
    }
}
}
//get company logo
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
              "token": token, 
            },
          }
        );
         console.log(response.data.company);
        const imageUrl = `http://localhost:3000/companyImages/${response.data.company.image_name}`;
        setImage_name(imageUrl);
        console.log(imageUrl);
     } 
      catch (error) {
        console.error("Error fetching company details:", error);
        setError("Error fetching company details");
      }
    };
    fetchCompanyDetails();
  },[])

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
          "http://localhost:3000/api/getCmpUserDetails",
          {
            headers: {
              'token': token,
            },
          }
        );
        setUsers(response.data.cmpUser)
        console.log('hello',response.data);
        setFirst_name(response.data.cmpUser.first_name);
        setLast_name(response.data.cmpUser.last_name);
        setUsername(response.data.cmpUser.username);
        setEmail(response.data.cmpUser.email);
        setAddress(response.data.cmpUser.address);
        setPhonenumber(response.data.cmpUser.phone_number);
        setRole(response.data.role);
        // console.log(response.data.document);
        const imageUrl = `http://localhost:3000/companyImages/${response.data.image_name}`;
        setImage_name(imageUrl);
        console.log(imageUrl);
        
      } 
      catch (error) {
        console.error("Error fetching company details:", error);
        setError("Error fetching company details");
      }
    };
    fetchCompanyDetails();
  },[])

  // const handleClick = () => {
  //   setValidate(true);
  // }
  const handleUpdate=(user)=>{
    navigate('/company/UpdateUser',{state:{user}});
  }
  const openAdduser=()=>{
    navigate('/company/addUser')
}


  return (
    <>
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-black border-bottom border-white fixed-top navbar-custom" aria-label="Fourth navbar example">
          <div className="container-fluid">
            <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
              <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
                <use xlinkHref="#bootstrap"></use>
              </svg>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarsExample04">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <div className="profile1-image-container1">
                    <img src={logoImage} alt="Profile" className="profile1-image" />
                  </div>
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
                  <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown" aria-expanded="false">
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
                <a href="#" className="d-flex align-items-center text-white text-decoration-none" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="profile1-image-container">
                    <img src={image_name} alt="Profile" className="profile-image" />
                  </div>
                  {/* <img src={image_name} width="40" height="40" className="rounded-circle" alt="Profile" style={{ border: '2px solid white', padding: '2px' }} /> */}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                   <a className="dropdown-item" href="/company/companyHome">Company Profile</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/company/addUser">Add Employee</a>
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
          <div className="form-box-home">
            <div className="admin-head">
            <h3>EMPLOYEES LISTS</h3>
            </div>
                <div className="admin-head">
                <div className="pro-img">
                        <div className="profile-image">
                            <label htmlFor="image_name" className="file-input-label">
                                {image_name ? (
                                    <img src={image_name} alt="Profile Preview" />
                                ) : (
                                    <span>Upload a profile image</span>
                                )}
                                <input
                                    id="profile"
                                    type="file"
                                    name="image_name"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="file-input"
                                />
                            </label>
                        </div>
                        </div>
                        <div className='owner-card'>
                    <div className='owner-id'>
                    <button className="golden-btn " onClick={openAdduser}>Add+</button>
                    </div>
                </div>
                    
                    </div>
                {/* <div className="admin-head">
                <h3>EMPLOYEES LISTS</h3>
                </div> */}
                    
      <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'transparent' }}>
      <TableContainer sx={{ maxHeight: 420, backgroundColor: 'transparent'}}>
        <Table  stickyHeader aria-label="sticky table">
          <TableHead >
            <TableRow >
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>User Id</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Username</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Email</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Role</TableCell>
              <TableCell sx={{ backgroundColor: '#333', color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell sx={{ color: 'white' }}>{user.user_id}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{user.username}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{user.role}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <button className="golden-btn" onClick={() => handleUpdate(user)}>
                      Update
                    </button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
      </div>
      </div>
            </div>
    </>
)
}

export default UserPage;