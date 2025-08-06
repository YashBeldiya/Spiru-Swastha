// import React, { useState } from 'react';
// import HOC from '../Components/HOC';

// const ProfileSetting = () => {
//   const [activeTab, setActiveTab] = useState('profile');

//   const tabs = [
//     { id: 'profile', name: 'Profile', icon: '👤' },
//     { id: 'notifications', name: 'Notifications', icon: '🔔' },
//     { id: 'security', name: 'Security', icon: '🛡️' },
//     { id: 'appearance', name: 'Appearance', icon: '🎨' },
//     { id: 'preferences', name: 'Preferences', icon: '🌐' },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'profile':
//         return (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     defaultValue="John"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     defaultValue="Doe"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     defaultValue="john@example.com"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone
//                   </label>
//                   <input
//                     type="tel"
//                     defaultValue="+1 (555) 123-4567"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Bio
//               </label>
//               <textarea
//                 rows={4}
//                 defaultValue="Product manager with 5+ years of experience in tech startups."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         );

//       case 'notifications':
//         return (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
//               <div className="space-y-4">
//                 {[
//                   { name: 'New user registrations', description: 'Get notified when new users sign up' },
//                   { name: 'Project updates', description: 'Receive updates on project progress' },
//                   { name: 'Security alerts', description: 'Important security notifications' },
//                   { name: 'Weekly reports', description: 'Weekly summary of your dashboard' },
//                 ].map((item, index) => (
//                   <div key={index} className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                       <p className="text-sm text-gray-500">{item.description}</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" defaultChecked />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );

//       case 'security':
//         return (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Password
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm New Password
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <div className="text-center py-12">
//             <p className="text-gray-500">Settings for {activeTab} coming soon...</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
//         <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//         <div className="flex border-b border-gray-200">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
//                 activeTab === tab.id
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               <span className="mr-2">{tab.icon}</span>
//               {tab.name}
//             </button>
//           ))}
//         </div>

//         <div className="p-6">
//           {renderTabContent()}

//           <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
//             <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
//               <span className="mr-2">💾</span>
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HOC(ProfileSetting);


import React, { useState, useEffect } from 'react';
import HOC from '../Components/HOC';
import axios from 'axios';

const ProfileSetting = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '', // Optional, not in schema, can be removed if not needed
    bio: '', // Optional, not in schema, can be removed if not needed
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Axios instance with base URL and token
  const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${document.cookie.split('accessToken=')[1]?.split(';')[0]}`,
    },
  });

  // Fetch user from local storage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('admin')); // Adjust key if different
    if (storedUser) {
      setUser(storedUser);
      setProfileForm({
        name: storedUser.name || '',
        lastName: storedUser.lastName || '',
        email: storedUser.email || '',
        phone: '', // Not in schema, set to empty or remove
        bio: '', // Not in schema, set to empty or remove
      });
    }
  }, []);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Validate profile form
  const validateProfile = () => {
    const newErrors = {};
    if (!profileForm.name.trim()) newErrors.name = 'Name is required';
    if (!profileForm.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePassword = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordForm.newPassword.length < 6) newErrors.newPassword = 'New password must be at least 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (validateProfile()) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await api.put('/profile', {
          name: profileForm.name,
          email: profileForm.email,
          lastName: profileForm.lastName,
        });
        const updatedUser = response.data.data;
        setUser(updatedUser);
        localStorage.setItem('admin', JSON.stringify(updatedUser)); // Update local storage
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to update profile' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Save password changes
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        await api.post('/change-password', {
          oldPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });
        setSuccess('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to change password' });
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'preferences', name: 'Preferences', icon: '🌐' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                rows={4}
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional"
              />
            </div>
          </form>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { name: 'New user registrations', description: 'Get notified when new users sign up' },
                  { name: 'Project updates', description: 'Receive updates on project progress' },
                  { name: 'Security alerts', description: 'Important security notifications' },
                  { name: 'Weekly reports', description: 'Weekly summary of your dashboard' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Settings for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {errors.submit && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {errors.submit}
          <button
            onClick={() => setErrors({ ...errors, submit: '' })}
            className="ml-2 text-red-700 underline"
          >
            Clear
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg">
          {success}
          <button
            onClick={() => setSuccess(null)}
            className="ml-2 text-green-700 underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          {renderTabContent()}

          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={activeTab === 'security' ? handlePasswordSubmit : handleProfileSubmit}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              disabled={loading}
            >
              <span className="mr-2">💾</span>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(ProfileSetting);