import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchOrdersByUserId } from "../redux/slice/orderSlice";
import { logout, clearError } from "../redux/slice/authSlice";
import { resetCart } from "../redux/slice/cartSlice";
import { FaCheckCircle, FaTruck, FaBoxOpen, FaTimesCircle } from "react-icons/fa";
import { useWishlist } from "./WhishlistContext";

const orderStages = [
  { name: "Approved", icon: <FaCheckCircle />, percentage: 25 },
  { name: "Dispatch", icon: <FaTruck />, percentage: 50 },
  { name: "Out Of Delivery", icon: <FaBoxOpen />, percentage: 75 },
  { name: "Cancelled", icon: <FaTimesCircle />, percentage: 100 },
];

const OrderHistory = ({ userId }) => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { clearWishlist } = useWishlist();
  const [retryCount, setRetryCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const effectiveUserId = userId || user?._id;
    console.log('Effective User ID:', effectiveUserId);
    console.log('Is Logged In:', isLoggedIn);
    console.log('Current Orders State:', orders);

    if (effectiveUserId && isLoggedIn) {
      dispatch(fetchOrdersByUserId(effectiveUserId))
        .unwrap()
        .then((response) => {
          console.log('Fetch Orders Response:', response);
        })
        .catch((err) => {
          console.error('Fetch orders error:', err);
          if (retryCount < 3) {
            setTimeout(() => setRetryCount(retryCount + 1), 2000);
          }
        });
    } else {
      console.warn('No valid userId or not logged in:', { effectiveUserId, isLoggedIn });
    }
  }, [userId, user, isLoggedIn, dispatch, retryCount]);

  useEffect(() => {
    if (isLoginOpen) {
      dispatch(clearError());
    }
  }, [isLoginOpen, dispatch]);

  const calculateOrderTotal = (order) => {
    if (!order?.items?.length) return '0.00';
    return order.items.reduce((total, item) => {
      const discountPrice = item.productDetail?.discountPrice || item.productDetail?.originalPrice || 0;
      return total + (discountPrice * (item.quantity || 1));
    }, 0).toFixed(2);
  };

  const normalizeStatus = (status) => {
    if (!status) return "Unknown";
    const statusMap = {
      approved: "Approved",
      dispatch: "Dispatch",
      "out of delivery": "Out Of Delivery",
      cancelled: "Cancelled",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getProgressPercentage = (currentStatus) => {
    const normalizedStatus = normalizeStatus(currentStatus);
    if (normalizedStatus === "Cancelled") return 100;
    const currentStage = orderStages.find((stage) => stage.name === normalizedStatus);
    return currentStage ? currentStage.percentage : 0;
  };

  const getStageStatus = (stage, currentStatus) => {
    const normalizedStatus = normalizeStatus(currentStatus);
    if (normalizedStatus === "Cancelled" && stage !== "Cancelled") return false;
    if (stage === "Cancelled" && normalizedStatus !== "Cancelled") return false;
    const currentIndex = orderStages.findIndex((s) => s.name === normalizedStatus);
    const stageIndex = orderStages.findIndex((s) => s.name === stage);
    return stageIndex <= currentIndex;
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = () => {
    dispatch(loginUser(loginForm)).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        setIsLoginOpen(false);
        setLoginForm({ email: '', password: '' });
      }
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    clearWishlist();
    setIsLoginOpen(true);
  };

  return (
    <div className="bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-6xl flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white rounded-xl shadow border border-gray-200">
          <ul className="text-sm">
            <NavLink to="/dashboard">
              <li className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2">
                <i className="fas fa-th-large" />
                Dashboard
              </li>
            </NavLink>
            <li className="border-l-4 border-green-600 bg-green-50 text-green-700 font-medium px-4 py-3">
              <i className="fas fa-receipt mr-2" />
              Order History
            </li>
            <NavLink to="/address">
              <li className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2">
                <i className="fas fa-map-marker-alt" />
                Addresses (1)
              </li>
            </NavLink>
            <li
              className="px-4 py-3 hover:bg-gray-100 text-gray-800 cursor-pointer flex items-center gap-2"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt" />
              Logout
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <section className="w-3/4 bg-white rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-3xl font-bold mb-8 text-green-800">Your Order History</h2>
          {loading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
              Error: {error} {retryCount < 3 && "(Retrying...)"}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-green-100"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                      <span className="font-semibold text-green-700">Order ID: </span>
                      <span className="text-sm text-green-600">{order._id || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-green-700">Total Amount: </span>
                      <span className="text-lg font-medium text-green-600">
                        ₹{order.totalAmount || calculateOrderTotal(order)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="relative w-full h-2 bg-green-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-500 ease-in-out ${
                          normalizeStatus(order.status) === "Cancelled" ? "bg-red-500" : ""
                        }`}
                        style={{ width: `${getProgressPercentage(order.status)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-green-600 mt-2 text-center">
                      Status: <span className="font-semibold">{normalizeStatus(order.status)}</span>
                    </p>
                  </div>

                  <div className="relative">
                    <div className="hidden md:grid md:grid-cols-4 gap-4">
                      {orderStages.map((stage, i) => (
                        <div
                          key={stage.name}
                          className="flex flex-col items-center text-center relative"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                              getStageStatus(stage.name, order.status)
                                ? normalizeStatus(order.status) === "Cancelled" && stage.name === "Cancelled"
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white"
                                : "bg-green-100 text-green-400"
                            }`}
                          >
                            {stage.icon}
                          </div>
                          <p className="mt-2 text-sm font-medium text-green-600">{stage.name}</p>
                          {i < orderStages.length - 1 && (
                            <div
                              className={`absolute top-5 left-1/2 w-full h-1 transform translate-x-1/2 ${
                                getStageStatus(orderStages[i + 1].name, order.status)
                                  ? normalizeStatus(order.status) === "Cancelled"
                                    ? "bg-red-200"
                                    : "bg-green-300"
                                  : "bg-green-100"
                              }`}
                            ></div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="md:hidden flex overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100">
                      {orderStages.map((stage, i) => (
                        <div key={stage.name} className="flex items-center gap-2 min-w-[120px]">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                              getStageStatus(stage.name, order.status)
                                ? normalizeStatus(order.status) === "Cancelled" && stage.name === "Cancelled"
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white"
                                : "bg-green-100 text-green-400"
                            }`}
                          >
                            {stage.icon}
                            {stage.name}
                          </div>
                          {i < orderStages.length - 1 && (
                            <div
                              className={`w-6 h-1 rounded-full ${
                                getStageStatus(orderStages[i + 1].name, order.status)
                                  ? normalizeStatus(order.status) === "Cancelled"
                                    ? "bg-red-200"
                                    : "bg-green-300"
                                  : "bg-green-100"
                              }`}
                            ></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                      onClick={() => openOrderDetails(order)}
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow border border-green-100">
              <h3 className="text-xl font-medium text-green-700">No orders found.</h3>
              <p className="text-green-600 mt-2">
                {isLoggedIn ? "Start shopping to see your order history here!" : "Please log in to view your order history."}
              </p>
            </div>
          )}
        </section>

        {/* Order Details Modal */}
        {selectedOrder && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeOrderDetails}></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-green-800">Order Details</h3>
                <button
                  className="text-2xl text-gray-600 hover:text-gray-800"
                  onClick={closeOrderDetails}
                >
                  &times;
                </button>
              </div>
              <div className="border border-gray-200 rounded-2xl overflow-hidden text-sm">
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="bg-gray-50 p-4 font-medium text-gray-900">Order ID:</div>
                  <div className="p-4 text-gray-700 col-span-2">{selectedOrder._id || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="bg-gray-50 p-4 font-medium text-gray-900">Order Date:</div>
                  <div className="p-4 text-gray-700 col-span-2">
                    {selectedOrder.orderDate ? formatDate(selectedOrder.orderDate) : 'N/A'}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="bg-gray-50 p-4 font-medium text-gray-900">Status:</div>
                  <div className="p-4 text-green-600 col-span-2">
                    {normalizeStatus(selectedOrder.status)}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="bg-gray-50 p-4 font-medium text-gray-900">Total Amount:</div>
                  <div className="p-4 text-gray-700 col-span-2">
                    ₹{selectedOrder.totalAmount || calculateOrderTotal(selectedOrder)}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="bg-gray-50 p-4 font-medium text-gray-900">Items:</div>
                  <div className="p-4 text-gray-700 col-span-2">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedOrder.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.productName}</span>
                            <span>
                              {item.quantity || 1} x ₹{item.productDetail?.discountPrice || item.productDetail?.originalPrice || 0}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">No items</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="bg-gray-50 p-4 font-medium text-gray-900">Shipping Address:</div>
                  <div className="p-4 text-gray-700 col-span-2">
                    {selectedOrder.address && selectedOrder.address.length > 0 ? (
                      <div>
                        <p>{selectedOrder.address[0].addressLine}</p>
                        <p>
                          {selectedOrder.address[0].city}, {selectedOrder.address[0].state}, {selectedOrder.address[0].pincode}, {selectedOrder.address[0].country}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                  onClick={closeOrderDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* Login Modal */}
        {isLoginOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsLoginOpen(false)}
            ></div>
            <div className="fixed top-0 right-0 h-full w-85 max-w-full bg-white z-50 shadow-lg transition-transform duration-300 transform translate-x-0">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">LOGIN</h2>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="text-2xl transition-transform duration-750 hover:rotate-[180deg]"
                >
                  <HiX />
                </button>
              </div>
              <div className="px-6 py-6 space-y-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    required
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="peer w-full px-3 pt-6 pb-2 border border-gray-300 text-sm placeholder-transparent focus:border-green-700 focus:outline-none"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-3 pb-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-700"
                  >
                    Email *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder=" "
                    required
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="peer w-full px-3 pt-6 pb-2 border border-gray-300 text-sm placeholder-transparent focus:border-green-700 focus:outline-none"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-700"
                  >
                    Password *
                  </label>
                </div>
                <a href="#" className="text-sm text-gray-500 underline">Forgot your password?</a>
                <button
                  className="w-full bg-green-700 text-white py-2 mt-2 hover:bg-green-800 transition disabled:bg-gray-400"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;