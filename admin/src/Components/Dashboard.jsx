import React, { useState } from 'react';
import HOC from './HOC';

const StatCard = ({ title, value, change, changeType, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        <div className={`flex items-center mt-2 text-sm ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="mr-1">
            {changeType === 'increase' ? '↗️' : '↘️'}
          </span>
          <span>{change}</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${
        changeType === 'increase' ? 'bg-green-50' : 'bg-red-50'
      }`}>
        <span className={`text-2xl ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          {icon}
        </span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'increase',
      icon: '💰',
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+15.3%',
      changeType: 'increase',
      icon: '👥',
    },
    {
      title: 'Sales',
      value: '12,234',
      change: '+19%',
      changeType: 'increase',
      icon: '🛒',
    },
    {
      title: 'Growth Rate',
      value: '573',
      change: '-2.1%',
      changeType: 'decrease',
      icon: '📈',
    },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile settings', time: '5 minutes ago' },
    { id: 3, user: 'Mike Johnson', action: 'Completed task #1234', time: '12 minutes ago' },
    { id: 4, user: 'Sarah Wilson', action: 'Added new team member', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-gray-900">$12,426</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="text-sm font-medium text-gray-900">$9,842</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-400 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(Dashboard);
