import React from 'react';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { name, email } = userData;

  return (
    <div className=" bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-6xl flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-xl shadow border border-gray-200">
          <ul className="text-sm">
            <li className="border-l-4 border-green-600 bg-green-50 text-green-700 font-medium px-4 py-3 rounded-tl-xl">
              <i className="fas fa-th-large mr-2" />
              Dashboard
            </li>
            <NavLink to='/order-history'>
            <li className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2">
              <i className="fas fa-receipt" />
              Order History
            </li>
            </NavLink>
            <NavLink to='/address'>
            <li className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2">
              <i className="fas fa-map-marker-alt" />
              Addresses (1)
            </li>
            </NavLink>
            <li className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2">
              <i className="fas fa-sign-out-alt" />
              Logout
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <section className="w-3/4 bg-white rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>

          {/* Order Notice */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <i className="fas fa-check-circle text-green-600" />
            <span className="text-green-700 font-medium underline cursor-pointer">
              Make your first order
            </span>
            <span className="text-gray-600">You haven’t placed any orders yet.</span>
          </div>

          {/* Info Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden text-sm">
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="bg-gray-50 p-4 font-medium text-gray-900">Name:</div>
              <div className="p-4 text-gray-700">{name || '-'}</div>
            </div>
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="bg-gray-50 p-4 font-medium text-gray-900">E-mail:</div>
              <div className="p-4 text-gray-700">{email || '-'}</div>
            </div>
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="bg-gray-50 p-4 font-medium text-gray-900">Address:</div>
              <div className="p-4 text-gray-400 italic">Not added</div>
            </div>
            <div className="grid grid-cols-3">
              <div className="bg-gray-50 p-4 font-medium text-gray-900">Address 2:</div>
              <div className="p-4 text-gray-400 italic">Not added</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
