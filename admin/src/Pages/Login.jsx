

import React, { useState } from 'react';
import { FaApple, FaGoogle, FaXTwitter } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    setLoading(true);
    
    try {
      // const response = await axios.post('https://spiru-backend.onrender.com/api/auth/admin-login', 
      const response = await axios.post('http://localhost:3000/api/auth/login', 
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        
        const token = response.data.data;
        const user = response.data.user;
        // Decode the token to check the role
        const decodedToken = jwtDecode(token);
        
        if (decodedToken.role !== 'Admin') {
          toast.error('You are not authorized to access this page!');
          setLoading(false);
          return;
        }

        toast.success('Login successful!');
        // Store the token in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('admin',JSON.stringify(user))
        // Redirect to dashboard or home page
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        // No response received
        toast.error('No response from server. Please try again.');
      } else {
        // Request setup error
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const forgotpassword = () => {
    navigate('/emailverify');
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#e9f2fb]'>
      <div className="max-w-[500px] rounded-[40px] border-4 border-white bg-gradient-to-b from-white to-[#f4f7fb] p-6 shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)]">
        <h1 className="text-center text-3xl font-black text-[#1089d3]">Admin Sign In</h1>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-[20px] border-2 border-transparent bg-white px-5 py-3 placeholder:text-gray-400 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-[20px] border-2 border-transparent bg-white px-5 py-3 placeholder:text-gray-400 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none"
          />

          <button 
            type='button' 
            onClick={forgotpassword} 
            className="mx-auto block cursor-pointer text-[12px] text-[#0099ff]"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-[20px] bg-gradient-to-r from-[#1089d3] to-[#12b1d1] py-3 font-bold text-white shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <button 
            type='button' 
            // onClick={signupPage} 
            className="mt-4 mx-auto block cursor-pointer text-center text-[12px] text-[#0099ff]"
          >
            Don't have an account? Sign up
          </button>

          <div className="mt-2 flex justify-center gap-4">
            <button
              type="button"
              className="grid h-10 w-10 place-content-center cursor-pointer rounded-full border-4 border-white bg-gradient-to-r from-black to-gray-500 p-1 shadow-[0_12px_10px_-8px_rgba(133,189,215,0.88)] transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <FaGoogle className='text-white'/>
            </button>

            <button
              type="button"
              className="grid h-10 w-10 place-content-center cursor-pointer rounded-full border-4 border-white bg-gradient-to-r from-black to-gray-500 p-1 shadow-[0_12px_10px_-8px_rgba(133,189,215,0.88)] transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <FaApple className='text-white'/>
            </button>

            <button
              type="button"
              className="grid h-10 w-10 place-content-center cursor-pointer rounded-full border-4 border-white bg-gradient-to-r from-black to-gray-500 p-1 shadow-[0_12px_10px_-8px_rgba(133,189,215,0.88)] transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <FaXTwitter className='text-white'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;