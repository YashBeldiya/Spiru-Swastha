// import React, { useState } from "react";
// import { NavLink, } from "react-router-dom";
// import bgimg from '../assets/img/login-bg.webp'

// const Signup = () => {
//   return (
//     <>
//       <div className="w-full">
//         <div className="relative w-full h-[220px] md:h-[220px] lg:h-[220px]">
//           <img
//             src={bgimg}
//             alt="Category Background"
//             className="w-full h-[220px] object-cover"
//           />
//           <div className="absolute inset-0 bg-black/40 bg-opacity-40" />
//           <div
//             className="absolute inset-0 flex flex-col justify-center px-2 md:px-6 lg:px-8
//                      text-white"
//           >
//             <h1 className="text-xl md:text-xl mb-2">REGISTER</h1>
//             <p className="text-sm md:text-base">
//               <span className="text-gray-200">Home</span> &gt;{" "}
//               <span>REGISTER</span>
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-md mx-auto px-4 py-10">
//         {/* First Name */}
//         <div className="mb-4 relative">
//           <input
//             type="text"
//             placeholder=" "
//             className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
//             required
//           />
//           <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
//             First Name
//           </label>
//         </div>

//         {/* Last Name */}
//         <div className="mb-4 relative">
//           <input
//             type="text"
//             placeholder=" "
//             className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
//             required
//           />
//           <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
//             Last Name
//           </label>
//         </div>

//         {/* Email */}
//         <div className="mb-4 relative">
//           <input
//             type="email"
//             placeholder=" "
//             className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
//             required
//           />
//           <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
//             Email *
//           </label>
//         </div>

//         {/* Password */}
//         <div className="mb-6 relative">
//           <input
//             type="password"
//             placeholder=" "
//             className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
//             required
//           />
//           <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
//             Password *
//           </label>
//         </div>

//         {/* Privacy Notice */}
//         <p className="text-sm text-gray-700 mb-6 leading-relaxed">
//           Your personal data will be used to support your experience throughout
//           this website, to manage access to your account, and for other purposes
//           described in our privacy policy.
//         </p>

//         {/* Register Button */}
//         <button className="w-full bg-green-700 text-white py-3 font-semibold tracking-wide hover:bg-green-800 transition mb-6">
//           REGISTER
//         </button>

//         {/* Link to Login */}
//         <div className="text-sm text-gray-600">
//           Already have an account?{" "}
//           <NavLink to="/login">
//             <span href="#" className="underline hover:text-green-700">
//               Login here
//             </span>
//           </NavLink>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slice/authSlice'; // Adjust path as needed
import { toast } from 'react-toastify';
import bgimg from '../assets/img/login-bg.webp';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        registerUser({
          firstName,
          lastName,
          email,
          password,
        })
      ).unwrap();
      toast.success('Registration successful! Please log in.', { position: 'top-right' });
      navigate('/login'); // Navigate to login page after successful registration
    } catch (err) {
      toast.error(error || 'Registration failed. Please try again.', {
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="relative w-full h-[220px] md:h-[220px] lg:h-[220px]">
          <img
            src={bgimg}
            alt="Category Background"
            className="w-full h-[220px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 bg-opacity-40" />
          <div className="absolute inset-0 flex flex-col justify-center px-2 md:px-6 lg:px-8 text-white">
            <h1 className="text-xl md:text-xl mb-2">REGISTER</h1>
            <p className="text-sm md:text-base">
              <span className="text-gray-200">Home</span> &gt; <span>REGISTER</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder=" "
              className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
              First Name
            </label>
          </div>

          {/* Last Name */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder=" "
              className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
              Last Name
            </label>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="mb-6 relative">
            <input
              type="password"
              placeholder=" "
              className="peer w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:border-green-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-600 bg-white px-1">
              Password *
            </label>
          </div>

          {/* Privacy Notice */}
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            Your personal data will be used to support your experience throughout
            this website, to manage access to your account, and for other purposes
            described in our privacy policy.
          </p>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 font-semibold tracking-wide hover:bg-green-800 transition mb-6"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'REGISTER'}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-sm text-gray-600">
          Already have an account?{' '}
          <NavLink to="/login">
            <span className="underline hover:text-green-700">Login here</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Signup;
