
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import HOC from '../Components/HOC';

// const Review = () => {
//   const [reviews, setReviews] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');
//   const [filterRating, setFilterRating] = useState('');
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const statuses = ['Pending', 'Approved', 'Rejected'];
//   const ratings = [1, 2, 3, 4, 5];

//   // Fetch all reviews
//   const fetchReviews = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('http://localhost:3000/api/review/getall');
//       // Map API data to match component's expected structure
//       const mappedReviews = response.data.data.map(review => ({
//         id: review._id, // Use _id directly as it’s the string ID
//         productId: review.product?.$oid || 'N/A',
//         productName: review.productName || 'Unknown Product',
//         customerName: review.displayName || 'Anonymous',
//         customerEmail: review.email || 'N/A',
//         rating: review.count || 0,
//         title: review.title || 'No Title',
//         comment: review.content || 'No Comment',
//         status: review.status || 'Pending',
//         createdAt: review.createdAt?.$date || new Date().toISOString(),
//         helpful: review.helpful || 0,
//         verified: review.isApprove || false
//       }));
//       setReviews(mappedReviews);
//     } catch (err) {
//       setError('Failed to fetch reviews. Please try again.');
//       console.error('Error fetching reviews:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update review status
//   const handleStatusChange = async (reviewId, newStatus) => {
//     console.log('handleStatusChange called with reviewId:', reviewId, 'newStatus:', newStatus); // Debug log
//     if (!reviewId) {
//       setError('Review ID is undefined. Cannot update status.');
//       return;
//     }
//     try {
//       await axios.post(`http://localhost:3000/api/review/update-status/${reviewId}`, { status: newStatus });
//       setReviews(reviews.map(review =>
//         review.id === reviewId ? { ...review, status: newStatus } : review
//       ));
//       if (selectedReview && selectedReview.id === reviewId) {
//         setSelectedReview({ ...selectedReview, status: newStatus });
//       }
//     } catch (err) {
//       setError(`Failed to update review status to ${newStatus}. Please try again.`);
//       console.error('Error updating status:', err.response?.data || err.message);
//     }
//   };

//   // Delete review
//   const handleDelete = async (reviewId) => {
//     console.log('handleDelete called with reviewId:', reviewId); // Debug log
//     if (!reviewId) {
//       setError('Review ID is undefined. Cannot delete review.');
//       return;
//     }
//     if (window.confirm('Are you sure you want to delete this review?')) {
//       try {
//         await axios.delete(`http://localhost:3000/api/review/delete/${reviewId}`);
//         setReviews(reviews.filter(review => review.id !== reviewId));
//         setShowModal(false);
//       } catch (err) {
//         setError('Failed to delete review. Please try again.');
//         console.error('Error deleting review:', err.response?.data || err.message);
//       }
//     }
//   };

//   // Fetch reviews on component mount
//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const handleViewDetails = (review) => {
//     console.log('Viewing details for review:', review); // Debug log
//     setSelectedReview(review);
//     setShowModal(true);
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'approved': return 'bg-green-100 text-green-600';
//       case 'pending': return 'bg-yellow-100 text-yellow-600';
//       case 'rejected': return 'bg-red-100 text-red-600';
//       default: return 'bg-gray-100 text-gray-600';
//     }
//   };

//   const getRatingColor = (rating) => {
//     if (rating >= 4) return 'text-green-600';
//     if (rating >= 3) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
//         ★
//       </span>
//     ));
//   };

//   const filteredReviews = reviews.filter(review => {
//     const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          review.comment.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = !filterStatus || review.status.toLowerCase() === filterStatus.toLowerCase();
//     const matchesRating = !filterRating || review.rating.toString() === filterRating;
    
//     return matchesSearch && matchesStatus && matchesRating;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-lightblue-100 to-sky-100 text-gray-800">
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-sky-700">Review Management</h1>
//             <p className="text-sky-600 mt-2">Manage customer reviews and ratings</p>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center text-sky-600">Loading reviews...</div>
//         )}

//         {/* Stats Cards */}
//         {!loading && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-sky-600">Total Reviews</p>
//                   <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.length}</p>
//                 </div>
//                 <div className="p-3 rounded-lg bg-sky-100">
//                   <span className="text-2xl text-sky-500">⭐</span>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-sky-600">Pending Reviews</p>
//                   <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.filter(r => r.status.toLowerCase() === 'pending').length}</p>
//                 </div>
//                 <div className="p-3 rounded-lg bg-yellow-100">
//                   <span className="text-2xl text-yellow-500">⏳</span>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-sky-600">Approved Reviews</p>
//                   <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.filter(r => r.status.toLowerCase() === 'approved').length}</p>
//                 </div>
//                 <div className="p-3 rounded-lg bg-green-100">
//                   <span className="text-2xl text-green-500">✅</span>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-sky-600">Average Rating</p>
//                   <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'N/A'}</p>
//                 </div>
//                 <div className="p-3 rounded-lg bg-lightblue-100">
//                   <span className="text-2xl text-lightblue-500">📊</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Controls */}
//         <div className="bg-gradient-to-r from-sky-50 to-lightblue-50 rounded-xl shadow-lg border border-sky-200">
//           <div className="p-6 border-b border-sky-200">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//               <div className="relative flex-1 max-w-md">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500">
//                   🔍
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search reviews..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-full bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-200"
//                 />
//               </div>
//               <div className="flex items-center space-x-3">
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="px-3 py-2 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800 transition-all duration-200"
//                 >
//                   <option value="">All Status</option>
//                   {statuses.map(status => (
//                     <option key={status} value={status}>{status}</option>
//                   ))}
//                 </select>
//                 <select
//                   value={filterRating}
//                   onChange={(e) => setFilterRating(e.target.value)}
//                   className="px-3 py-2 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800 transition-all duration-200"
//                 >
//                   <option value="">All Ratings</option>
//                   {ratings.map(rating => (
//                     <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Reviews Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-sky-100">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
//                     Rating
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-sky-200">
//                 {filteredReviews.map((review) => (
//                   <tr key={review.id} className="hover:bg-sky-50 transition-colors duration-200">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-sky-700">{review.productName}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-sky-800">{review.customerName}</div>
//                         <div className="text-sm text-gray-600">{review.customerEmail}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex mr-2">
//                           {renderStars(review.rating)}
//                         </div>
//                         <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
//                           {review.rating}/5
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
//                         {review.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {new Date(review.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button 
//                           onClick={() => handleViewDetails(review)}
//                           className="p-1 rounded hover:bg-sky-200 transition-colors duration-200"
//                           title="View Details"
//                         >
//                           <span className="text-sky-500 hover:text-sky-700">👁️</span>
//                         </button>
//                         {review.status.toLowerCase() === 'pending' && (
//                           <>
//                             <button 
//                               onClick={() => handleStatusChange(review.id, 'Approved')}
//                               className="p-1 rounded hover:bg-green-200 transition-colors duration-200"
//                               title="Approve"
//                             >
//                               <span className="text-green-500 hover:text-green-700">✅</span>
//                             </button>
//                             <button 
//                               onClick={() => handleStatusChange(review.id, 'Rejected')}
//                               className="p-1 rounded hover:bg-red-200 transition-colors duration-200"
//                               title="Reject"
//                             >
//                               <span className="text-red-500 hover:text-red-700">❌</span>
//                             </button>
//                           </>
//                         )}
//                         {review.status.toLowerCase() !== 'pending' && (
//                           <button 
//                             onClick={() => handleStatusChange(review.id, 'Pending')}
//                             className="p-1 rounded hover:bg-yellow-200 transition-colors duration-200"
//                             title="Mark as Pending"
//                           >
//                             <span className="text-yellow-500 hover:text-yellow-700">⏳</span>
//                           </button>
//                         )}
//                         <button 
//                           onClick={() => handleDelete(review.id)}
//                           className="p-1 rounded hover:bg-red-200 transition-colors duration-200"
//                           title="Delete"
//                         >
//                           <span className="text-red-500 hover:text-red-700">🗑️</span>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Review Details Modal */}
//         {showModal && selectedReview && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-gradient-to-br from-sky-100 to-lightblue-100 rounded-2xl p-8 w-full max-w-2xl mx-4 border border-sky-300 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 hover:scale-105">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-sky-800">Review Details</h2>
//                 <button 
//                   onClick={() => setShowModal(false)}
//                   className="p-2 rounded-full hover:bg-sky-200 transition-colors duration-200"
//                 >
//                   <span className="text-sky-600 hover:text-sky-800 text-lg">✕</span>
//                 </button>
//               </div>
              
//               <div className="space-y-6">
//                 {/* Review Header */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-sky-800 mb-2">{selectedReview.title}</h3>
//                     <div className="flex items-center space-x-4 mb-4">
//                       <div className="flex items-center">
//                         <div className="flex mr-2">
//                           {renderStars(selectedReview.rating)}
//                         </div>
//                         <span className={`text-sm font-medium ${getRatingColor(selectedReview.rating)}`}>
//                           {selectedReview.rating}/5
//                         </span>
//                       </div>
//                       <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReview.status)}`}>
//                         {selectedReview.status}
//                       </span>
//                       {selectedReview.verified && (
//                         <span className="inline-flex items-center px-3 py-1 text-xs bg-teal-100 text-teal-600 rounded-full">
//                           ✓ Verified Purchase
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Customer Info */}
//                 <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-200">
//                   <h4 className="text-sm font-medium text-sky-700 mb-3">Customer Information</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-xs text-gray-500">Name:</span>
//                       <p className="text-sm text-sky-800 font-medium">{selectedReview.customerName}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs text-gray-500">Email:</span>
//                       <p className="text-sm text-sky-800 font-medium">{selectedReview.customerEmail}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs text-gray-500">Product:</span>
//                       <p className="text-sm text-sky-800 font-medium">{selectedReview.productName}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs text-gray-500">Review Date:</span>
//                       <p className="text-sm text-sky-800 font-medium">{new Date(selectedReview.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Review Content */}
//                 <div>
//                   <h4 className="text-sm font-medium text-sky-700 mb-3">Review Content</h4>
//                   <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-200">
//                     <p className="text-gray-800 leading-relaxed">{selectedReview.comment}</p>
//                   </div>
//                 </div>

//                 {/* Review Stats */}
//                 <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-200">
//                   <h4 className="text-sm font-medium text-sky-700 mb-3">Review Statistics</h4>
//                   <div className="flex items-center space-x-6">
//                     <div>
//                       <span className="text-xs text-gray-500">Helpful Votes:</span>
//                       <p className="text-sm text-sky-800 font-medium">{selectedReview.helpful}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs text-gray-500">Verified Purchase:</span>
//                       <p className="text-sm text-sky-800 font-medium">{selectedReview.verified ? 'Yes' : 'No'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex items-center space-x-3 pt-4 border-t border-sky-200">
//                   {selectedReview.status.toLowerCase() === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => handleStatusChange(selectedReview.id, 'Approved')}
//                         className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-lg hover:from-green-300 hover:to-teal-300 transition-all duration-200 font-semibold shadow-md"
//                       >
//                         ✅ Approve Review
//                       </button>
//                       <button
//                         onClick={() => handleStatusChange(selectedReview.id, 'Rejected')}
//                         className="flex-1 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:from-red-300 hover:to-pink-300 transition-all duration-200 font-semibold shadow-md"
//                       >
//                         ❌ Reject Review
//                       </button>
//                     </>
//                   )}
//                   {selectedReview.status.toLowerCase() !== 'pending' && (
//                     <button
//                       onClick={() => handleStatusChange(selectedReview.id, 'Pending')}
//                       className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 font-semibold shadow-md"
//                     >
//                       ⏳ Mark as Pending
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDelete(selectedReview.id)}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold shadow-md"
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HOC(Review);


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HOC from '../Components/HOC';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statuses = ['Pending', 'Approved', 'Rejected'];
  const ratings = [1, 2, 3, 4, 5];

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/review/getall');
      // Map API data to match component's expected structure
      const mappedReviews = response.data.data.map(review => ({
        id: review._id,
        productId: review.product?.$oid || 'N/A',
        productName: review.productName || 'Unknown Product',
        customerName: review.displayName || 'Anonymous',
        customerEmail: review.email || 'N/A',
        rating: review.count || 0,
        title: review.title || 'No Title',
        comment: review.content || 'No Comment',
        status: review.status ? review.status.charAt(0).toUpperCase() + review.status.slice(1).toLowerCase() : 'Pending', // Normalize status
        createdAt: review.createdAt?.$date || new Date().toISOString(),
        helpful: review.helpful || 0,
        verified: review.isApprove || false
      }));
      setReviews(mappedReviews);
    } catch (err) {
      setError('Failed to fetch reviews. Please try again.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update review status
  const handleStatusChange = async (reviewId, newStatus) => {
    console.log('handleStatusChange called with reviewId:', reviewId, 'newStatus:', newStatus);
    if (!reviewId) {
      setError('Review ID is undefined. Cannot update status.');
      return;
    }
    // Send lowercase 'pending' to backend, keep 'Approved' and 'Rejected' as is
    const apiStatus = newStatus === 'Pending' ? 'pending' : newStatus;
    console.log('Sending status to API:', apiStatus); // Debug log
    try {
      await axios.post(`http://localhost:3000/api/review/update-status/${reviewId}`, { status: apiStatus });
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      ));
      if (selectedReview && selectedReview.id === reviewId) {
        setSelectedReview({ ...selectedReview, status: newStatus });
      }
    } catch (err) {
      setError(`Failed to update review status to ${newStatus}. Please try again.`);
      console.error('Error updating status:', err.response?.data || err.message);
    }
  };

  // Delete review
  const handleDelete = async (reviewId) => {
    console.log('handleDelete called with reviewId:', reviewId);
    if (!reviewId) {
      setError('Review ID is undefined. Cannot delete review.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:3000/api/review/delete/${reviewId}`);
        setReviews(reviews.filter(review => review.id !== reviewId));
        setShowModal(false);
      } catch (err) {
        setError('Failed to delete review. Please try again.');
        console.error('Error deleting review:', err.response?.data || err.message);
      }
    }
  };

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleViewDetails = (review) => {
    console.log('Viewing details for review:', review);
    setSelectedReview(review);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || review.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesRating = !filterRating || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightblue-100 to-sky-100 text-gray-800">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sky-700">Review Management</h1>
            <p className="text-sky-600 mt-2">Manage customer reviews and ratings</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center text-sky-600">Loading reviews...</div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-sky-100">
                  <span className="text-2xl text-sky-500">⭐</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.filter(r => r.status.toLowerCase() === 'pending').length}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-100">
                  <span className="text-2xl text-yellow-500">⏳</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600">Approved Reviews</p>
                  <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.filter(r => r.status.toLowerCase() === 'approved').length}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <span className="text-2xl text-green-500">✅</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-sky-200 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600">Average Rating</p>
                  <p className="text-2xl font-bold text-sky-800 mt-2">{reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-lightblue-100">
                  <span className="text-2xl text-lightblue-500">📊</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gradient-to-r from-sky-50 to-lightblue-50 rounded-xl shadow-lg border border-sky-200">
          <div className="p-6 border-b border-sky-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-200"
                />
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800 transition-all duration-200"
                >
                  <option value="">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-3 py-2 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800 transition-all duration-200"
                >
                  <option value="">All Ratings</option>
                  {ratings.map(rating => (
                    <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sky-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-200">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-sky-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-sky-700">{review.productName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-sky-800">{review.customerName}</div>
                        <div className="text-sm text-gray-600">{review.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(review)}
                          className="p-1 rounded hover:bg-sky-200 transition-colors duration-200"
                          title="View Details"
                        >
                          <span className="text-sky-500 hover:text-sky-700">👁️</span>
                        </button>
                        {review.status.toLowerCase() === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(review.id, 'Approved')}
                              className="p-1 rounded hover:bg-green-200 transition-colors duration-200"
                              title="Approve"
                            >
                              <span className="text-green-500 hover:text-green-700">✅</span>
                            </button>
                            <button 
                              onClick={() => handleStatusChange(review.id, 'Rejected')}
                              className="p-1 rounded hover:bg-red-200 transition-colors duration-200"
                              title="Reject"
                            >
                              <span className="text-red-500 hover:text-red-700">❌</span>
                            </button>
                          </>
                        )}
                        {review.status.toLowerCase() !== 'pending' && (
                          <button 
                            onClick={() => handleStatusChange(review.id, 'Pending')}
                            className="p-1 rounded hover:bg-yellow-200 transition-colors duration-200"
                            title="Mark as Pending"
                          >
                            <span className="text-yellow-500 hover:text-yellow-700">⏳</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="p-1 rounded hover:bg-red-200 transition-colors duration-200"
                          title="Delete"
                        >
                          <span className="text-red-500 hover:text-red-700">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Details Modal */}
        {showModal && selectedReview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-sky-100 to-lightblue-100 rounded-2xl p-8 w-full max-w-2xl mx-4 border border-sky-300 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-sky-800">Review Details</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-sky-200 transition-colors duration-200"
                >
                  <span className="text-sky-600 hover:text-sky-800 text-lg">✕</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-sky-800 mb-2">{selectedReview.title}</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(selectedReview.rating)}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(selectedReview.rating)}`}>
                          {selectedReview.rating}/5
                        </span>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReview.status)}`}>
                        {selectedReview.status}
                      </span>
                      {selectedReview.verified && (
                        <span className="inline-flex items-center px-3 py-1 text-xs bg-teal-100 text-teal-600 rounded-full">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-200">
                  <h4 className="text-sm font-medium text-sky-700 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Name:</span>
                      <p className="text-sm text-sky-800 font-medium">{selectedReview.customerName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Email:</span>
                      <p className="text-sm text-sky-800 font-medium">{selectedReview.customerEmail}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Product:</span>
                      <p className="text-sm text-sky-800 font-medium">{selectedReview.productName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Review Date:</span>
                      <p className="text-sm text-sky-800 font-medium">{new Date(selectedReview.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="text-sm font-medium text-sky-700 mb-3">Review Content</h4>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-200">
                    <p className="text-gray-800 leading-relaxed">{selectedReview.comment}</p>
                  </div>
                </div>

                {/* Review Stats */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-200">
                  <h4 className="text-sm font-medium text-sky-700 mb-3">Review Statistics</h4>
                  <div className="flex items-center space-x-6">
                    <div>
                      <span className="text-xs text-gray-500">Helpful Votes:</span>
                      <p className="text-sm text-sky-800 font-medium">{selectedReview.helpful}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Verified Purchase:</span>
                      <p className="text-sm text-sky-800 font-medium">{selectedReview.verified ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4 border-t border-sky-200">
                  {selectedReview.status.toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedReview.id, 'Approved')}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-lg hover:from-green-300 hover:to-teal-300 transition-all duration-200 font-semibold shadow-md"
                      >
                        ✅ Approve Review
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedReview.id, 'Rejected')}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:from-red-300 hover:to-pink-300 transition-all duration-200 font-semibold shadow-md"
                      >
                        ❌ Reject Review
                      </button>
                    </>
                  )}
                  {selectedReview.status.toLowerCase() !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedReview.id, 'Pending')}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 font-semibold shadow-md"
                    >
                      ⏳ Mark as Pending
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedReview.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold shadow-md"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(Review);

