import React from 'react';
// import withDashboardLayout from '../hoc/withDashboardLayout';
import HOC from '../Components/HOC';

const Analytics = () => {
  const metrics = [
    { name: 'Page Views', value: '145,832', change: '+12.5%', period: 'vs last month' },
    { name: 'Unique Visitors', value: '24,891', change: '+8.2%', period: 'vs last month' },
    { name: 'Bounce Rate', value: '34.2%', change: '-2.1%', period: 'vs last month' },
    { name: 'Avg. Session', value: '4m 32s', change: '+15.3%', period: 'vs last month' },
  ];

  const topPages = [
    { page: '/dashboard', views: 12543, percentage: 28 },
    { page: '/analytics', views: 8921, percentage: 20 },
    { page: '/users', views: 6754, percentage: 15 },
    { page: '/projects', views: 5432, percentage: 12 },
    { page: '/settings', views: 3210, percentage: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your performance and insights</p>
        </div>
        <div className="flex space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
              <span className="text-green-500 text-lg">📈</span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">{metric.change}</span>
                <span className="text-gray-500 ml-2">{metric.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
            <span className="text-gray-400 text-xl">📊</span>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
            <span className="text-gray-400 text-xl">🥧</span>
          </div>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{page.page}</p>
                  <p className="text-xs text-gray-500">{page.views.toLocaleString()} views</p>
                </div>
                <div className="ml-4">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Real-time Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">56</p>
            <p className="text-sm text-gray-600">Page Views/min</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">89%</p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOC(Analytics);
