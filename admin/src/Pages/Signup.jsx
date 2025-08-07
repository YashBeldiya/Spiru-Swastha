import React, { useState } from 'react';
import { FaApple, FaGoogle, FaXTwitter } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role : 'Admin'
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
    
    // Validation
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords don't match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('https://spiru-backend.onrender.com/api/auth/register', 
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role : 'Admin'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data.message || 'Registration failed');
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

  const loginPage = () => navigate('/login');

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#e9f2fb]'>
      <div className="max-w-[500px] rounded-[40px] border-4 border-white bg-gradient-to-b from-white to-[#f4f7fb] p-6 shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)]">
        <h1 className="text-center text-3xl font-black text-[#1089d3]">Sign Up</h1>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-[20px] border-2 border-transparent bg-white px-5 py-3 placeholder:text-gray-400 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none"
          />

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
            minLength="6"
            className="w-full rounded-[20px] border-2 border-transparent bg-white px-5 py-3 placeholder:text-gray-400 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none"
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            required
            value={formData.confirm_password}
            onChange={handleChange}
            minLength="6"
            className="w-full rounded-[20px] border-2 border-transparent bg-white px-5 py-3 placeholder:text-gray-400 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-[20px] bg-gradient-to-r from-[#1089d3] to-[#12b1d1] py-3 font-bold text-white shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6">
          <button 
            type='button' 
            onClick={loginPage} 
            className="mt-4 cursor-pointer mx-auto block text-center text-[12px] text-[#0099ff]"
          >
            Already have an account? Log in
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
              className="grid h-10 w-10 cursor-pointer place-content-center rounded-full border-4 border-white bg-gradient-to-r from-black to-gray-500 p-1 shadow-[0_12px_10px_-8px_rgba(133,189,215,0.88)] transition-transform duration-200 hover:scale-110 active:scale-90"
            >
              <FaXTwitter className='text-white'/>
            </button>
          </div>
        </div>

        <a href="#" className="mt-4 block text-center text-[9px] text-[#0099ff]">
          Learn user licence agreement
        </a>
      </div>
    </div>
  );
};

export default Signup;