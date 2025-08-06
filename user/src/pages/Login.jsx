

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slice/authSlice'; // Adjust path as needed
import { toast } from 'react-toastify';
import bgimg from '../assets/img/login-bg.webp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Login successful!', { position: 'top-right' });
      navigate('/'); // Navigate to homepage after successful login
    } catch (err) {
      toast.error(error || 'Login failed. Please check your credentials.', {
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="relative w-full h-[250px] md:h-[250px] lg:h-[250px]">
          <img
            src={bgimg}
            alt="Category Background"
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 bg-opacity-40" />
          <div className="absolute inset-0 flex flex-col justify-center px-2 md:px-6 lg:px-8 text-white">
            <h1 className="text-xl md:text-xl mb-2">LOGIN</h1>
            <p className="text-sm md:text-base">
              <span className="text-gray-200">Home</span> &gt; <span>LOGIN</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="email"
              placeholder=" "
              className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
              Email *
            </label>
          </div>

          <div className="mb-2 relative">
            <input
              type="password"
              placeholder=" "
              className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-700 bg-white px-1">
              Password *
            </label>
          </div>

          {/* Forgot Password */}
          <div className="text-sm text-gray-600 mb-4">
            <NavLink to="/forgot-password" className="underline hover:text-green-700">
              Forgot your password?
            </NavLink>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 font-semibold tracking-wide hover:bg-green-800 transition mb-4"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'SIGN IN'}
          </button>
        </form>

        {/* Create Account */}
        <div className="text-sm text-gray-600 mb-6">
          New customer?{' '}
          <NavLink to="/signup">
            <span className="underline hover:text-green-700">Create your account</span>
          </NavLink>
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-300" />

        {/* Guest Section */}
        <h3 className="text-lg font-semibold mb-4">CONTINUE AS A GUEST</h3>
        <button
          className="bg-green-700 text-white px-6 py-2 hover:bg-green-700 transition"
          onClick={() => navigate('/')}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default Login;
