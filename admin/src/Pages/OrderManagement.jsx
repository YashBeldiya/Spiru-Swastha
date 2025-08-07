import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HOC from '../Components/HOC';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const orderStatuses = ['Approved', 'Dispatch', 'Out Of Delivery', 'Cancelled'];

  // Fetch orders using Axios
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://spiru-backend.onrender.com/api/order/get');
      setOrders(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Update order status using Axios
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(`https://spiru-backend.onrender.com/api/order/update-status/${orderId}`, { status: newStatus });
      if (response.data.success) {
        setOrders(orders.map(order =>
          order._id === orderId
            ? { ...order, status: response.data.data.status, updatedAt: new Date().toISOString() }
            : order
        ));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: response.data.data.status, updatedAt: new Date().toISOString() });
        }
        setError(null);
      } else {
        setError(response.data.message || 'Failed to update order status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order._id?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-400';
      case 'Dispatch': return 'bg-blue-500/20 text-blue-400';
      case 'Out Of Delivery': return 'bg-skyblue-500/20 text-skyblue-400';
      case 'Cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatusProgress = (status) => {
    const statusOrder = ['Approved', 'Dispatch', 'Out Of Delivery'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  const calculateOrderTotal = (order) => {
    if (!order?.items?.length) return '0.00';
    return order.items.reduce((total, item) => {
      const discountPrice = item.productDetail?.discountPrice || item.productDetail?.originalPrice || 0;
      return total + (discountPrice * (item.quantity || 1));
    }, 0).toFixed(2);
  };

  const calculateTotalRevenue = () => {
    return orders
      .filter(o => o.status === 'Out Of Delivery')
      .reduce((sum, o) => {
        if (!o?.items?.length) return sum;
        const orderTotal = o.items.reduce((total, item) => {
          const discountPrice = item.productDetail?.discountPrice || item.productDetail?.originalPrice || 0;
          return total + (discountPrice * (item.quantity || 1));
        }, 0);
        return sum + orderTotal;
      }, 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-lightblue-100 to-skyblue-100">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600 mt-2">Manage customer orders, shipping, and returns</p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-skyblue-500 text-white px-4 py-2 rounded-lg hover:bg-skyblue-600 transition"
          >
            Refresh Orders
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-sky-50 to-skyblue-50 rounded-xl p-6 shadow-xl border border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{orders.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-skyblue-500/20">
                <span className="text-2xl text-skyblue-400">📦</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-skyblue-50 rounded-xl p-6 shadow-xl border border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{orders.filter(o => o.status === 'Approved').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <span className="text-2xl text-green-400">⏳</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-skyblue-50 rounded-xl p-6 shadow-xl border border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out Of Delivery</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{orders.filter(o => o.status === 'Out Of Delivery').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-skyblue-500/20">
                <span className="text-2xl text-skyblue-400">✅</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-skyblue-50 rounded-xl p-6 shadow-xl border border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{orders.filter(o => o.status === 'Cancelled').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/20">
                <span className="text-2xl text-red-400">❌</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-skyblue-50 rounded-xl p-6 shadow-xl border border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">₹{calculateTotalRevenue()}</p>
              </div>
              <div className="p-3 rounded-lg bg-lightblue-500/20">
                <span className="text-2xl text-lightblue-400">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-sky-50 to-skyblue-50 rounded-xl shadow-xl border border-sky-200">
          <div className="p-6 border-b border-sky-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-skyblue-400">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue-500 text-gray-800"
                >
                  <option value="">All Status</option>
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="w-full">
            {loading && <div className="p-6 text-center text-skyblue-500">Loading...</div>}
            {error && <div className="p-6 text-center text-red-500">{error}</div>}
            {!loading && !error && filteredOrders.length === 0 && (
              <div className="p-6 text-center text-gray-600">No orders found</div>
            )}
            <table className="w-full table-fixed">
              <thead className="bg-sky-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[15%]">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[15%]">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[20%]">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[10%]">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[15%]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[15%]">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[10%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-sky-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-normal break-words">
                      <div>
                        {console.log(order)}
                        <div className="text-sm font-medium text-gray-800">{order._id}</div>
                        <div className="text-sm text-gray-600">Order Date: {formatDate(order.orderDate)}</div>
                        {order.status === 'Cancelled' && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full mt-1">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{order.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{order.user?.email || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{order.user?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words">
                      <div className="max-w-full">
                        <div className="text-sm text-gray-700">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {order.items?.slice(0, 2).map((item, index) => (
                            <div key={index}>{item.productName || 'Unknown Product'} (x{item.quantity || 1})</div>
                          ))}
                          {order.items?.length > 2 && (
                            <div className="text-gray-500">+{order.items?.length - 2} more...</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words">
                      <div className="text-sm font-medium text-skyblue-500">₹{calculateOrderTotal(order)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        {order.status !== 'Cancelled' && (
                          <div className="w-full bg-sky-200 rounded-full h-1">
                            <div 
                              className="bg-gradient-to-r from-skyblue-500 to-lightblue-500 h-1 rounded-full transition-all duration-300" 
                              style={{ width: `${getOrderStatusProgress(order.status)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-600">
                      <div>Ordered: {formatDate(order.orderDate)}</div>
                      {order.dispatchDate && (
                        <div className="text-xs text-gray-500">Dispatched: {formatDate(order.dispatchDate)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="p-1 rounded hover:bg-sky-200 transition-colors duration-200"
                          title="View Details"
                        >
                          <span className="text-gray-600 hover:text-skyblue-500">👁️</span>
                        </button>
                        <div className="relative group">
                          <button className="p-1 rounded hover:bg-sky-200 transition-colors duration-200">
                            <span className="text-gray-600 hover:text-skyblue-500">⚙️</span>
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-sky-200 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                            <div className="px-3 py-1 text-xs text-gray-600 border-b border-sky-200 mb-2">Change Status</div>
                            {orderStatuses.map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(order._id, status)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-sky-50 transition-colors duration-200 ${
                                  order.status === status ? 'text-skyblue-500' : 'text-gray-800'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-sky-50 to-skyblue-50 rounded-xl p-6 w-full max-w-4xl mx-4 border border-sky-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Order Details - {selectedOrder._id}</h2>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="p-1 rounded hover:bg-sky-200 transition-colors duration-200"
                >
                  <span className="text-gray-600 hover:text-gray-800">✕</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4 border border-sky-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Order Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="text-gray-800 font-mono">{selectedOrder._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="text-skyblue-500 font-semibold">₹{calculateOrderTotal(selectedOrder)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="text-gray-800">{formatDate(selectedOrder.orderDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dispatch Date:</span>
                        <span className="text-gray-800">{formatDate(selectedOrder.dispatchDate) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white rounded-lg p-4 border border-sky-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="text-gray-800">{selectedOrder.user?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-800">{selectedOrder.user?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-800">{selectedOrder.user?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="text-gray-800 font-mono">{selectedOrder.user?._id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items and Addresses */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div className="bg-white rounded-lg p-4 border border-sky-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-sky-50 rounded-lg">
                          <div>
                            <div className="text-gray-800 font-medium">{item.productName || 'Unknown Product'}</div>
                            <div className="text-gray-600 text-sm">SKU: {item.sku || 'N/A'}</div>
                            <div className="text-gray-600 text-sm">Quantity: {item.quantity || 1}</div>
                            <div className="text-gray-600 text-sm">
                              Price: ₹{(item.productDetail?.discountPrice || item.productDetail?.originalPrice || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-skyblue-500 font-semibold">
                            ₹{(item.quantity * (item.productDetail?.discountPrice || item.productDetail?.originalPrice || 0)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-lg p-4 border border-sky-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Shipping Address</h3>
                    {selectedOrder.address?.length > 0 ? (
                      <div className="text-gray-800">
                        <div>{selectedOrder.address[0]?.addressLine || 'N/A'}</div>
                        <div>{selectedOrder.address[0]?.city || 'N/A'}, {selectedOrder.address[0]?.state || 'N/A'}</div>
                        <div>{selectedOrder.address[0]?.country || 'N/A'} - {selectedOrder.address[0]?.pincode || 'N/A'}</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No shipping address provided</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-sky-200">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">Update Order Status:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="px-3 py-2 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue-500 text-gray-800"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-sky-200 text-gray-800 rounded-lg hover:bg-sky-300 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(OrderManagement);