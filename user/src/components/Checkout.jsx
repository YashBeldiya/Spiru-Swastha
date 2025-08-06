

// import React, { useEffect, useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import logo from '../assets/img/spiru_logo.svg';
// import visa from '../assets/img/Payment/visa.svg';
// import master from '../assets/img/Payment/master.svg';
// import upi from '../assets/img/Payment/upi.svg';
// import netbanking from '../assets/img/Payment/netbanking.svg';
// import { FaShoppingBag, FaCheckCircle } from "react-icons/fa";
// import { fetchCart, clearCart } from "../redux/slice/cartSlice"; // Import clearCart
// import { createOrder, resetOrderState } from "../redux/slice/orderSlice";

// const Checkout = () => {
//   const [selectedPayment, setSelectedPayment] = useState("razorpay");
//   const [billingOption, setBillingOption] = useState("same");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
//   const { isLoggedIn, user } = useSelector((state) => state.auth);
//   const { order, loading: orderLoading, error: orderError, success: orderSuccess } = useSelector((state) => state.order);

//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     country: "India",
//     addressLine: "",
//     apartment: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//   });

//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     if (isLoggedIn) {
//       try {
//         const userData = JSON.parse(localStorage.getItem('userData')) || {};
//         setFormData((prev) => ({
//           ...prev,
//           email: userData.email || "",
//           firstName: userData.name || "",
//           lastName: userData.lastName || "",
//         }));
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//       }
//     }
//   }, [isLoggedIn]);

//   useEffect(() => {
//     if (isLoggedIn && user?._id) {
//       dispatch(fetchCart(user._id));
//     }
//   }, [dispatch, isLoggedIn, user]);

//   useEffect(() => {
//     if (orderSuccess) {
//       setShowModal(true);
//       // Clear the cart after successful order
//       if (user?._id) {
//         dispatch(clearCart(user._id));
//       }
//       setTimeout(() => {
//         dispatch(resetOrderState());
//         setShowModal(false);
//         navigate("/"); // Navigate to homepage after order success
//       }, 5000);
//     }
//   }, [orderSuccess, dispatch, user, navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const subtotal = cart?.items?.reduce((acc, item) => {
//     const price = item.variant?.discountPrice || item.variant?.originalPrice || 0;
//     const quantity = item.quantity ?? 1;
//     return acc + price * quantity;
//   }, 0) || 0;

//   const handleCompleteOrder = async () => {
//     if (!formData.city || !formData.state || !formData.country || !formData.addressLine || !formData.pincode) {
//       alert("Please fill in all required address fields.");
//       return;
//     }

//     const orderData = {
//       userId: user._id,
//       items: cart.items.map((item) => ({ productId: item.variant._id })),
//       totalAmount: subtotal,
//       address: [
//         {
//           city: formData.city,
//           pincode: parseInt(formData.pincode),
//           state: formData.state,
//           country: formData.country,
//           addressLine: formData.apartment ? `${formData.addressLine}, ${formData.apartment}` : formData.addressLine,
//         },
//       ],
//     };

//     dispatch(createOrder(orderData));
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     navigate("/");
//   };

//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <svg className="w-12 h-12 mb-3 mx-auto" fill="currentColor" viewBox="0 0 576 512">
//             <path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM48 368V48h480v320H48zm288 80h-96l16-48h64l16 48z"/>
//           </svg>
//           <p className="mb-4 text-gray-600">Please log in to proceed to checkout.</p>
//           <NavLink to="/login">
//             <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">
//               LOG IN
//             </button>
//           </NavLink>
//         </div>
//       </div>
//     );
//   }

//   if (!cart?.items?.length) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <svg className="w-12 h-12 mb-3 mx-auto" fill="currentColor" viewBox="0 0 576 512">
//             <path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM48 368V48h480v320H48zm288 80h-96l16-48h64l16 48z"/>
//           </svg>
//           <p className="mb-4 text-gray-600">Your cart is empty.</p>
//           <NavLink to="/">
//             <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">
//               RETURN TO SHOP
//             </button>
//           </NavLink>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full animate-fade-in">
//             <FaCheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-800 mb-2">Order Placed Successfully!</h2>
//             <p className="text-gray-600 mb-6">Thank you for your order. You'll receive a confirmation soon.</p>
//             <button
//               onClick={closeModal}
//               className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//             <img src={logo} alt="Logo" className="h-16" />
//             <div className="flex items-center gap-4">
//               <FaShoppingBag className="h-6 w-6 text-green-700" />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
//             <h2 className="text-xl font-semibold">Contact</h2>
//             {!isLoggedIn && (
//               <NavLink to="/login">
//                 <span className="text-sm text-green-700 hover:underline">
//                   Log in
//                 </span>
//               </NavLink>
//             )}
//           </div>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full mb-4 p-2 border border-gray-400 rounded"
//           />
//           <label className="inline-flex items-center mb-6">
//             <input type="checkbox" className="mr-2" />
//             Email me with news and offers
//           </label>

//           <h2 className="text-xl font-semibold mb-4 mt-6">Delivery</h2>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Country/Region
//             </label>
//             <select
//               name="country"
//               value={formData.country}
//               onChange={handleInputChange}
//               className="p-2 border border-gray-400 rounded w-full"
//             >
//               <option>India</option>
//               <option>USA</option>
//               <option>Canada</option>
//               <option>Australia</option>
//             </select>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               name="firstName"
//               placeholder="First name"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               className="p-2 border border-gray-400 rounded w-full"
//             />
//             <input
//               type="text"
//               name="lastName"
//               placeholder="Last name"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               className="p-2 border border-gray-400 rounded w-full"
//             />
//           </div>
//           <input
//             type="text"
//             name="addressLine"
//             placeholder="Address"
//             value={formData.addressLine}
//             onChange={handleInputChange}
//             className="mb-4 p-2 border border-gray-400 rounded w-full"
//           />
//           <input
//             type="text"
//             name="apartment"
//             placeholder="Apartment, suite, etc. (optional)"
//             value={formData.apartment}
//             onChange={handleInputChange}
//             className="mb-4 p-2 border border-gray-400 rounded w-full"
//           />
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             <input
//               type="text"
//               name="city"
//               placeholder="City"
//               value={formData.city}
//               onChange={handleInputChange}
//               className="p-2 border border-gray-400 rounded w-full"
//             />
//             <div className="relative">
//               <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
//                 State
//               </label>
//               <select
//                 name="state"
//                 value={formData.state}
//                 onChange={handleInputChange}
//                 className="p-2 border border-gray-400 rounded w-full mt-2"
//               >
//                 <option value="">Select State</option>
//                 <option>Gujarat</option>
//                 <option>Maharashtra</option>
//                 <option>Delhi</option>
//               </select>
//             </div>
//             <input
//               type="text"
//               name="pincode"
//               placeholder="PIN code"
//               value={formData.pincode}
//               onChange={handleInputChange}
//               className="p-2 border border-gray-400 rounded w-full"
//             />
//           </div>
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone (optional)"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className="mb-4 p-2 border border-gray-400 rounded w-full"
//           />

//           <label className="inline-flex items-center mb-6">
//             <input type="checkbox" className="mr-2" />
//             Save this information for next time
//           </label>

//           <div className="mt-1">
//             <h2 className="text-xl font-semibold mb-4">Payment</h2>
//             <div className="space-y-4">
//               <label
//                 className={`block border border-gray-400 rounded cursor-pointer ${
//                   selectedPayment === "razorpay"
//                     ? "border-green-600"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div
//                   className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4"
//                   onClick={() => setSelectedPayment("razorpay")}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="radio"
//                       name="payment"
//                       checked={selectedPayment === "razorpay"}
//                       onChange={() => setSelectedPayment("razorpay")}
//                       className="mr-3"
//                     />
//                     <span className="font-medium text-green-700">
//                       Razorpay Secure (UPI, Cards, Wallets, NetBanking)
//                     </span>
//                   </div>
//                   <div className="flex flex-wrap gap-1 items-center">
//                     <img src={upi} alt="UPI" className="w-12 h-12" />
//                     <img src={visa} alt="Visa" />
//                     <img src={master} alt="MasterCard" />
//                     <img src={netbanking} alt="NetBanking" />
//                     <span className="text-xs font-semibold">+11</span>
//                   </div>
//                 </div>
//                 {selectedPayment === "razorpay" && (
//                   <div className="bg-gray-100 p-6 text-center">
//                     <img
//                       src="https://img.icons8.com/ios-filled/50/000000/internet.png"
//                       alt="Redirect"
//                       className="mx-auto mb-2"
//                     />
//                     <p className="text-md text-gray-700">
//                       After clicking “Pay now”, you will be redirected to <br />
//                       Razorpay Secure (UPI, Cards, Wallets, NetBanking) to <br />
//                       complete your purchase securely.
//                     </p>
//                   </div>
//                 )}
//               </label>

//               <label className="flex items-center p-4 border border-gray-400 rounded cursor-pointer">
//                 <input
//                   type="radio"
//                   name="payment"
//                   checked={selectedPayment === "cod"}
//                   onChange={() => setSelectedPayment("cod")}
//                   className="mr-3"
//                 />
//                 <span className="font-medium">Cash on Delivery (COD)</span>
//               </label>
//             </div>
//           </div>

//           <div className="mt-6 border-t pt-4">
//             <h2 className="text-xl font-semibold mb-2">Billing address</h2>
//             <div className="mb-4">
//               <label className="block mb-2">
//                 <input
//                   type="radio"
//                   name="billing"
//                   value="same"
//                   checked={billingOption === "same"}
//                   onChange={() => setBillingOption("same")}
//                   className="mr-2"
//                 />
//                 Same as shipping address
//               </label>
//               <label className="block mb-2">
//                 <input
//                   type="radio"
//                   name="billing"
//                   value="different"
//                   checked={billingOption === "different"}
//                   onChange={() => setBillingOption("different")}
//                   className="mr-2"
//                 />
//                 Use a different billing address
//               </label>
//             </div>

//             {billingOption === "different" && (
//               <div className="p-4 rounded-md space-y-4">
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleInputChange}
//                   className="p-2 border border-gray-400 rounded w-full"
//                 >
//                   <option>India</option>
//                   <option>USA</option>
//                   <option>Canada</option>
//                 </select>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="First name"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     className="p-2 border border-gray-400 rounded w-full"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Last name"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     className="p-2 border border-gray-400 rounded w-full"
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   name="addressLine"
//                   placeholder="Address"
//                   value={formData.addressLine}
//                   onChange={handleInputChange}
//                   className="p-2 border border-gray-400 rounded w-full"
//                 />
//                 <input
//                   type="text"
//                   name="apartment"
//                   placeholder="Apartment, suite, etc. (optional)"
//                   value={formData.apartment}
//                   onChange={handleInputChange}
//                   className="p-2 border border-gray-400 rounded w-full"
//                 />
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     className="p-2 border border-gray-400 rounded w-full"
//                   />
//                   <div className="relative">
//                     <select
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       className="peer p-4 pt-6 border border-gray-300 rounded w-full appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
//                     >
//                       <option value="">Select State</option>
//                       <option>Gujarat</option>
//                       <option>Maharashtra</option>
//                       <option>Delhi</option>
//                     </select>
//                     <label className="absolute left-4 top-1 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white peer-focus:px-1">
//                       State
//                     </label>
//                   </div>
//                   <input
//                     type="text"
//                     name="pincode"
//                     placeholder="PIN code"
//                     value={formData.pincode}
//                     onChange={handleInputChange}
//                     className="p-2 border border-gray-400 rounded w-full"
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   name="phone"
//                   placeholder="Phone (optional)"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="p-2 border border-gray-400 rounded w-full"
//                 />
//               </div>
//             )}
//           </div>

//           {orderError && (
//             <p className="text-red-500 text-sm mt-4">Order Error: {orderError}</p>
//           )}
//           {cartError && (
//             <p className="text-red-500 text-sm mt-4">Cart Error: {cartError}</p>
//           )}
//           <button
//             onClick={handleCompleteOrder}
//             disabled={orderLoading || cartLoading}
//             className={`mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition ${
//               orderLoading || cartLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {orderLoading || cartLoading ? "Processing..." : "Complete Order"}
//           </button>

//           <div className="mt-8 text-sm text-center text-green-700 flex flex-wrap justify-center gap-4">
//             <a href="#" className="hover:underline">
//               Refund policy
//             </a>
//             <a href="#" className="hover:underline">
//               Shipping policy
//             </a>
//             <a href="#" className="hover:underline">
//               Privacy policy
//             </a>
//             <a href="#" className="hover:underline">
//               Terms of service
//             </a>
//             <a href="#" className="hover:underline">
//               Contact information
//             </a>
//           </div>
//         </div>

//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//           {cartError && <p className="text-red-500 text-sm mb-3">{cartError}</p>}
//           <div className="space-y-4">
//             {cart?.items?.map((item) => {
//               const variant = item.variant;
//               const imageUrl = variant?.productImage?.[0] || "https://via.placeholder.com/80?text=No+Image";
//               const quantity = item.quantity ?? 1;
//               return (
//                 <div key={`${item._id}-${variant._id}`} className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-3">
//                     <img
//                       src={imageUrl}
//                       alt={item.productName}
//                       className="w-14 h-14 rounded object-contain"
//                       onError={(e) => {
//                         e.target.src = "https://via.placeholder.com/80?text=Image+Not+Found";
//                       }}
//                     />
//                     <div>
//                       <p className="font-medium">{item.productName}</p>
//                       <p className="text-sm text-gray-500">Quantity: {quantity}</p>
//                     </div>
//                   </div>
//                   <span className="font-medium">₹{(variant?.discountPrice || variant?.originalPrice || 0) * quantity}</span>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mb-4 flex flex-col sm:flex-row gap-2">
//             <input
//               type="text"
//               placeholder="Discount code"
//               className="p-2 border border-gray-400 rounded w-full"
//             />
//             <button className="bg-gray-200 text-sm px-4 rounded hover:bg-gray-300">
//               Apply
//             </button>
//           </div>

//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span className="text-gray-500">Enter shipping address</span>
//             </div>
//             <div className="border-t pt-2 flex justify-between font-semibold text-lg">
//               <span>Total</span>
//               <span>₹{subtotal.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from '../assets/img/spiru_logo.svg';
import visa from '../assets/img/Payment/visa.svg';
import master from '../assets/img/Payment/master.svg';
import upi from '../assets/img/Payment/upi.svg';
import netbanking from '../assets/img/Payment/netbanking.svg';
import { FaShoppingBag, FaCheckCircle } from "react-icons/fa";
import { fetchCart, clearCart } from "../redux/slice/cartSlice";
import { createOrder, resetOrderState } from "../redux/slice/orderSlice";

const Checkout = () => {
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [billingOption, setBillingOption] = useState("same");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { order, loading: orderLoading, error: orderError, success: orderSuccess } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "India",
    addressLine: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      try {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        setFormData((prev) => ({
          ...prev,
          email: userData.email || "",
          firstName: userData.name || "",
          lastName: userData.lastName || "",
        }));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, isLoggedIn, user]);

  useEffect(() => {
    if (orderSuccess) {
      setShowModal(true);
      if (user?._id) {
        dispatch(clearCart(user._id));
      }
      setTimeout(() => {
        dispatch(resetOrderState());
        setShowModal(false);
        navigate("/");
      }, 5000);
    }
  }, [orderSuccess, dispatch, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cart?.items?.reduce((acc, item) => {
    const price = item.variant?.discountPrice || item.variant?.originalPrice || 0;
    const quantity = item.quantity ?? 1;
    return acc + price * quantity;
  }, 0) || 0;

  const handleCompleteOrder = async () => {
    if (!formData.city || !formData.state || !formData.country || !formData.addressLine || !formData.pincode) {
      alert("Please fill in all required address fields.");
      return;
    }

    if (!cart?.items?.length) {
      alert("Your cart is empty. Please add items to proceed.");
      return;
    }

    const orderData = {
      userId: user._id,
      items: cart.items.map((item) => ({
        productId: item.variant._id,
        quantity: item.quantity ?? 1, // Include quantity from cart
      })),
      totalAmount: subtotal,
      address: [
        {
          city: formData.city,
          pincode: parseInt(formData.pincode),
          state: formData.state,
          country: formData.country,
          addressLine: formData.apartment ? `${formData.addressLine}, ${formData.apartment}` : formData.addressLine,
        },
      ],
    };

    dispatch(createOrder(orderData));
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <svg className="w-12 h-12 mb-3 mx-auto" fill="currentColor" viewBox="0 0 576 512">
            <path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM48 368V48h480v320H48zm288 80h-96l16-48h64l16 48z"/>
          </svg>
          <p className="mb-4 text-gray-600">Please log in to proceed to checkout.</p>
          <NavLink to="/login">
            <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">
              LOG IN
            </button>
          </NavLink>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <svg className="w-12 h-12 mb-3 mx-auto" fill="currentColor" viewBox="0 0 576 512">
            <path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM48 368V48h480v320H48zm288 80h-96l16-48h64l16 48z"/>
          </svg>
          <p className="mb-4 text-gray-600">Your cart is empty.</p>
          <NavLink to="/">
            <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">
              RETURN TO SHOP
            </button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full animate-fade-in">
            <FaCheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for your order. You'll receive a confirmation soon.</p>
            <button
              onClick={closeModal}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <img src={logo} alt="Logo" className="h-16" />
            <div className="flex items-center gap-4">
              <FaShoppingBag className="h-6 w-6 text-green-700" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold">Contact</h2>
            {!isLoggedIn && (
              <NavLink to="/login">
                <span className="text-sm text-green-700 hover:underline">
                  Log in
                </span>
              </NavLink>
            )}
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border border-gray-400 rounded"
          />
          <label className="inline-flex items-center mb-6">
            <input type="checkbox" className="mr-2" />
            Email me with news and offers
          </label>

          <h2 className="text-xl font-semibold mb-4 mt-6">Delivery</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country/Region
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded w-full"
            >
              <option>India</option>
              <option>USA</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded w-full"
            />
          </div>
          <input
            type="text"
            name="addressLine"
            placeholder="Address"
            value={formData.addressLine}
            onChange={handleInputChange}
            className="mb-4 p-2 border border-gray-400 rounded w-full"
          />
          <input
            type="text"
            name="apartment"
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.apartment}
            onChange={handleInputChange}
            className="mb-4 p-2 border border-gray-400 rounded w-full"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded w-full"
            />
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="p-2 border border-gray-400 rounded w-full mt-2"
              >
                <option value="">Select State</option>
                <option>Gujarat</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
              </select>
            </div>
            <input
              type="text"
              name="pincode"
              placeholder="PIN code"
              value={formData.pincode}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded w-full"
            />
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleInputChange}
            className="mb-4 p-2 border border-gray-400 rounded w-full"
          />

          <label className="inline-flex items-center mb-6">
            <input type="checkbox" className="mr-2" />
            Save this information for next time
          </label>

          <div className="mt-1">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="space-y-4">
              <label
                className={`block border border-gray-400 rounded cursor-pointer ${
                  selectedPayment === "razorpay"
                    ? "border-green-600"
                    : "border-gray-200"
                }`}
              >
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4"
                  onClick={() => setSelectedPayment("razorpay")}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === "razorpay"}
                      onChange={() => setSelectedPayment("razorpay")}
                      className="mr-3"
                    />
                    <span className="font-medium text-green-700">
                      Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 items-center">
                    <img src={upi} alt="UPI" className="w-12 h-12" />
                    <img src={visa} alt="Visa" />
                    <img src={master} alt="MasterCard" />
                    <img src={netbanking} alt="NetBanking" />
                    <span className="text-xs font-semibold">+11</span>
                  </div>
                </div>
                {selectedPayment === "razorpay" && (
                  <div className="bg-gray-100 p-6 text-center">
                    <img
                      src="https://img.icons8.com/ios-filled/50/000000/internet.png"
                      alt="Redirect"
                      className="mx-auto mb-2"
                    />
                    <p className="text-md text-gray-700">
                      After clicking “Pay now”, you will be redirected to <br />
                      Razorpay Secure (UPI, Cards, Wallets, NetBanking) to <br />
                      complete your purchase securely.
                    </p>
                  </div>
                )}
              </label>

              <label className="flex items-center p-4 border border-gray-400 rounded cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === "cod"}
                  onChange={() => setSelectedPayment("cod")}
                  className="mr-3"
                />
                <span className="font-medium">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Billing address</h2>
            <div className="mb-4">
              <label className="block mb-2">
                <input
                  type="radio"
                  name="billing"
                  value="same"
                  checked={billingOption === "same"}
                  onChange={() => setBillingOption("same")}
                  className="mr-2"
                />
                Same as shipping address
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="billing"
                  value="different"
                  checked={billingOption === "different"}
                  onChange={() => setBillingOption("different")}
                  className="mr-2"
                />
                Use a different billing address
              </label>
            </div>

            {billingOption === "different" && (
              <div className="p-4 rounded-md space-y-4">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-400 rounded w-full"
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>Canada</option>
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-400 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-400 rounded w-full"
                  />
                </div>
                <input
                  type="text"
                  name="addressLine"
                  placeholder="Address"
                  value={formData.addressLine}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-400 rounded w-full"
                />
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-400 rounded w-full"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-400 rounded w-full"
                  />
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="peer p-4 pt-6 border border-gray-300 rounded w-full appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select State</option>
                      <option>Gujarat</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                    </select>
                    <label className="absolute left-4 top-1 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-white peer-focus:px-1">
                      State
                    </label>
                  </div>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN code"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-400 rounded w-full"
                  />
                </div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-400 rounded w-full"
                />
              </div>
            )}
          </div>

          {orderError && (
            <p className="text-red-500 text-sm mt-4">Order Error: {orderError}</p>
          )}
          {cartError && (
            <p className="text-red-500 text-sm mt-4">Cart Error: {cartError}</p>
          )}
          <button
            onClick={handleCompleteOrder}
            disabled={orderLoading || cartLoading}
            className={`mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition ${
              orderLoading || cartLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {orderLoading || cartLoading ? "Processing..." : "Complete Order"}
          </button>

          <div className="mt-8 text-sm text-center text-green-700 flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:underline">
              Refund policy
            </a>
            <a href="#" className="hover:underline">
              Shipping policy
            </a>
            <a href="#" className="hover:underline">
              Privacy policy
            </a>
            <a href="#" className="hover:underline">
              Terms of service
            </a>
            <a href="#" className="hover:underline">
              Contact information
            </a>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartError && <p className="text-red-500 text-sm mb-3">{cartError}</p>}
          <div className="space-y-4">
            {cart?.items?.map((item) => {
              const variant = item.variant;
              const imageUrl = variant?.productImage?.[0] || "https://via.placeholder.com/80?text=No+Image";
              const quantity = item.quantity ?? 1;
              return (
                <div key={`${item._id}-${variant._id}`} className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={imageUrl}
                      alt={item.productName}
                      className="w-14 h-14 rounded object-contain"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=Image+Not+Found";
                      }}
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">₹{(variant?.discountPrice || variant?.originalPrice || 0) * quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Discount code"
              className="p-2 border border-gray-400 rounded w-full"
            />
            <button className="bg-gray-200 text-sm px-4 rounded hover:bg-gray-300">
              Apply
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-gray-500">Enter shipping address</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;