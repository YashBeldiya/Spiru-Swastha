import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Analytics', href: '/analytics', icon: '📊' },
  { name: 'Category', href: '/category', icon: '🗓️' },
  { name: 'Products', href: '/product', icon: '🗓️' },
  { name: 'Content', href: '/content-manager', icon: '📝' },
  { name: 'Media', href: '/media', icon: '🖼️' },
  { name: 'Reviews', href: '/reviews', icon: '⭐' },
  { name: 'Orders', href: '/orders', icon: '🛒' },
  { name: 'Users', href: '/users', icon: '👥' },
  { name: 'Settings', href: '/profile', icon: '⚙️' },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 text-white transition-all duration-300 ease-in-out z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6">
          <div className="px-3 mb-6">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
              {!collapsed && (
                <h2 className="text-lg font-bold">Dashboard</h2>
              )}
              <button
                onClick={() => onToggle(!collapsed)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <div className="w-4 h-4">
                  {collapsed ? '▶️' : '◀️'}
                </div>
              </button>
            </div>
          </div>

          <nav className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : 'hover:bg-white/10 text-white/80'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <span 
                    className={`text-lg ${
                      isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                    } ${collapsed ? '' : 'mr-3'}`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/20">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-semibold">
              💎
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Premium Plan</p>
                <p className="text-xs text-white/70 truncate">14 days remaining</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
