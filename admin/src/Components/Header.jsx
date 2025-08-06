import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('authToken'); // Remove token
    navigate('/'); // Redirect to root (which will redirect to /login if no token)
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white backdrop-blur-md shadow-md z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Sidebar Toggle & Search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md hover:bg-white/10 transition duration-150"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
              <div className="w-full h-0.5 bg-white"></div>
            </div>
          </button>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">🔍</div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-80 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>
        </div>

        {/* Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md hover:bg-white/10 transition relative"
            >
              <div className="text-white text-lg">🔔</div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-white rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/10 transition"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-semibold shadow-sm">
                👤
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <NavLink to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  ⚙️ Settings
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  🚪 Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
