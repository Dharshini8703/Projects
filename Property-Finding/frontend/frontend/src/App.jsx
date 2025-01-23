import React from 'react'
import OwnerForgotPassword from './components/ownerComponents/forgotPassword'
import OwnerResetPassword from './components/ownerComponents/resetPassword'
import OwnerLogout from './components/ownerComponents/logout'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Homepage from './components/homepage';
import './index.css';
import AdminForgotPassword from './components/adminComponents/forgotPassword'
import AdminResetPassword from './components/adminComponents/resetPassword'
import AdminLogout from './components/adminComponents/logout'
import AdminHome from './components/adminComponents/adminHome';
import AdminEmailVerify from './components/adminComponents/emailVerify';
import ClientResetPassword from './components/clientComponent/resetPassword';
import ClientForgotPassword from './components/clientComponent/forgotPassword';
import ClientLogout from './components/clientComponent/clientLogout';
import ClientHome from './components/clientComponent/clientHome';
import ClientEmailVerify from './components/clientComponent/emailVerify'
import AgentReset from './components/agentComponents/Reset';
import AgentForgot from './components/agentComponents/Forgot';
import AgentVerifyEmail from './components/agentComponents/VerifyEmail';
import AgentHome from './components/agentComponents/agentHome';
import OwnerHome from './components/ownerComponents/ownerHome';
import OwnerEmailVerify from './components/ownerComponents/emailVerify';
import AddProperty from './components/ownerComponents/addProperty';
import OwnerLogin from './components/ownerComponents/login';
import AgentLogin from './components/agentComponents/Login';
import ClientLogin from './components/clientComponent/login';
import AdminLogin from './components/adminComponents/login';
import OwnerRegister from './components/ownerComponents/register';
import AgentRegister from './components/agentComponents/Register';
import ClientRegistration from './components/clientComponent/registration';
import AdminRegister from './components/adminComponents/register';
import AddUser from './components/companyComponents/addUser.jsx';
import MainPage from './components/companyComponents/mainPage.jsx';
import VerifyEmail from './components/companyComponents/VerifyEmail.jsx';
import CompanyUpdate from './components/companyComponents/companyUpdate.jsx';
import UserPage from './components/companyComponents/UserPage.jsx';
import UpdateUser from './components/companyComponents/UpdateUser.jsx';
import CompanyLogin from './components/companyComponents/Login.jsx';
import CompanyRegister from './components/companyComponents/Register.jsx';
import CompanyForgot from './components/companyComponents/forgotPassword.jsx';
import CompanyHome from './components/companyComponents/companyHome.jsx';
 
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element= { <Navigate to = "/homepage" />}/>
          <Route path='/homepage' element = { <Homepage /> } />
          <Route path='/admin/login' element = { <AdminLogin /> } />
          <Route path='/admin/register' element = { <AdminRegister /> } />
          <Route path='/admin/forgotPassword' element = { <AdminForgotPassword /> } />
          <Route path='/admin/resetPassword' element = { <AdminResetPassword /> } />
          <Route path='/admin/logout' element = { <AdminLogout /> } />
          <Route path='/admin/adminHome' element = { <AdminHome /> } />
          <Route path="/admin/:id/verify/:token" element = { <AdminEmailVerify />} />
          <Route path='/client/login' element = { <ClientLogin /> } />
          <Route path='/client/register' element = { <ClientRegistration /> } />
          <Route path="/client/resetPassword" element = { <ClientResetPassword />} />
          <Route path='/client/forgotPassword' element = { <ClientForgotPassword />} />
          <Route path='/client/logout' element = { <ClientLogout /> } />
          <Route path='/client/clientHome' element = { <ClientHome /> } />
          <Route path="/api/clients/:id/verify/:token" element = { <ClientEmailVerify />} />
          <Route path='/agent/login' element = { <AgentLogin /> } />
          <Route path='/agent/register' element = { <AgentRegister /> } />
          <Route path="/agent/resetPassword" element = { <AgentReset />} />
          <Route path='/agent/forgotPassword' element = { <AgentForgot />} />
          <Route path='/agent/agentHome' element = { <AgentHome /> } />
          <Route path="/agent/verifyEmail/:id/verify/:token" element = { <AgentVerifyEmail />} />
          <Route path='/company/login' element = { <CompanyLogin /> } />
           <Route path='/company/Register' element = { <CompanyRegister /> } />
           <Route path='/company/forgotPassword' element = { <CompanyForgot />} />
           <Route path='/company/companyHome' element = { <CompanyHome /> } />
           <Route path='/company/addUser' element={<AddUser/>}/>
           <Route path='/company/mainpage' element={<MainPage/>}/>
           {/* Company verify */}
           <Route path='/company/:id/verify/:token' element = { <VerifyEmail />} />
           <Route path='/company/companyUpdate' element = { <CompanyUpdate /> } />
           <Route path='/company/UserPage' element = { <UserPage /> } />
           <Route path='/company/UpdateUser' element = { <UpdateUser /> } />
          <Route path='/owner/forgotPassword' element = { <OwnerForgotPassword /> } />
          <Route path='/owner/login' element = { <OwnerLogin /> } />
          <Route path='/owner/register' element = { <OwnerRegister /> } />
          <Route path='/owner/resetPassword' element = { <OwnerResetPassword /> } />
          <Route path='/owner/logout' element = { <OwnerLogout /> } />
          <Route path='/owner/ownerHome' element = { <OwnerHome /> } />
          <Route path="/owners/:id/verify/:token" element = { <OwnerEmailVerify />} />
          <Route path="/owner/property" element = { <AddProperty />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
