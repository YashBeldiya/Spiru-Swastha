import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './sass.scss';

import Login from './Pages/Login';
import Signup from './Pages/Signup';
import EmailVerify from './Pages/EmailVerify';
import OtpVerify from './Pages/OtpVerify';
import NewPassword from './Pages/NewPassword';

import Dashboard from './Components/Dashboard';
import Analytics from './Pages/Analytics';
import Users from './Pages/Users';
import ProfileSetting from './Pages/ProfileSetting';
import Category from './Pages/Category';
import Products from './Pages/Products';
import ContentManagment from './Pages/ContentManagment';
import Media from './Pages/Media';
import Review from './Pages/Review';
import OrderManagement from './Pages/OrderManagement';
import PrivateRoute from './Components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Setting from './Pages/Setting';

function App() {
  const [token, settoken] = useState('');

  useEffect(() => {
    const token1 = localStorage.getItem('authToken');
    settoken(token1);
  }, []);

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/emailverify" element={<EmailVerify />} />
        <Route path="/otpverify" element={<OtpVerify />} />
        <Route path="/newpassword" element={<NewPassword />} />

        {/* Redirect root to login if no token */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfileSetting /></PrivateRoute>} />
        <Route path="/category" element={<PrivateRoute><Category /></PrivateRoute>} />
        <Route path="/product" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/content-manager" element={<PrivateRoute><ContentManagment /></PrivateRoute>} />
        <Route path="/media" element={<PrivateRoute><Media /></PrivateRoute>} />
        <Route path="/reviews" element={<PrivateRoute><Review /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrderManagement /></PrivateRoute>} />
        {/* <Route path="/" element={<PrivateRoute><Setting /></PrivateRoute>} /> */}
      </Routes>
    </BrowserRouter>

    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;

