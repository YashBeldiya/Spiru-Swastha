
// import React, { useEffect } from 'react';
// import { SwiperSlide } from 'swiper/react';
// import { useWishlist } from './WhishlistContext';
// import { useCart } from './CartContext';
// import bgimg from '../assets/img/whishlist-bg.webp';
// import { useSelector } from 'react-redux';

// const Wishlist = () => {
//   const { wishlist, removeFromWishlist, loading, error, fetchUserWishlist } = useWishlist();
//   const { addToCart } = useCart();
//   const { user, isLoggedIn } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (user?._id) {
//       fetchUserWishlist();
//     }
//   }, []);

//   return (
//     <>
//       <div
//         className="relative py-30"
//         style={{ background: `url(${bgimg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
//       >
//         <div className="absolute inset-0 bg-black/40 z-0"></div>
//         <h1 className="relative z-10 text-xl mb-2 ms-10 text-white">Wishlist</h1>
//         <p className="relative z-10 text-md ms-10 text-white">
//           Home <span className="mx-1">{'>'}</span> Wishlist
//         </p>
//       </div>
//       <div className="wishlist-page p-6">
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//         {loading && <p className="text-center mb-4">Loading wishlist...</p>}
//         {wishlist.length === 0 ? (
//           <div className="flex flex-col items-center justify-center text-center py-20">
//             <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
//             <div className="text-gray-300 mb-6">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-24 w-24"
//                 viewBox="0 0 512 512"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="24"
//               >
//                 <path
//                   d="M256 448l-35.3-32.2C117.4 312.5 48 248.6 48 160 48 97.3 97.3 48 160 48c39.7 0 77.3 23.1 96 58.5C274.7 71.1 312.3 48 352 48c62.7 0 112 49.3 112 112 0 88.6-69.4 152.5-172.7 255.8L256 448z"
//                   fill="none"
//                 />
//                 <circle cx="360" cy="360" r="100" stroke="currentColor" strokeWidth="24" fill="none" />
//                 <line x1="328" y1="328" x2="392" y2="392" stroke="currentColor" strokeWidth="24" />
//                 <line x1="392" y1="328" x2="328" y2="392" stroke="currentColor" strokeWidth="24" />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-semibold mb-2">Wishlist is empty.</h2>
//             <p className="text-gray-500 text-sm max-w-sm">
//               You don’t have any products in the wishlist yet. <br />
//               You will find a lot of interesting products on our <span className="font-medium text-black">"Shop"</span> page.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {wishlist.map((product) => (
//               <SwiperSlide key={product._id}>
//                 <div className="bg-white shadow-md rounded-md overflow-hidden relative group hover:shadow-lg transition flex flex-col h-full">
//                   <div className="w-full aspect-[4/4] relative overflow-hidden group">
//                     {product.discount && (
//                       <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded z-30 shadow-md">
//                         {product.discount}
//                       </span>
//                     )}
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         removeFromWishlist(product._id);
//                       }}
//                       className="absolute top-2 right-2 z-30 bg-white text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-300 rounded-full p-2 border border-red-500 group/delete"
//                       disabled={loading}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 group-hover/delete:scale-110 transition-transform duration-200"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M6 7h12M10 11v6m4-6v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12H5zM9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z"
//                         />
//                       </svg>
//                     </button>
//                     <img
//                       src={product.variants[0].productImage[0]}
//                       alt={product.productName}
//                       className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10"
//                     />
//                     <img
//                       src={product.variants[0].productImage[1]}
//                       alt={product.productName}
//                       className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-in-out z-20"
//                     />
//                   </div>
//                   <div className="flex flex-col justify-between flex-1">
//                     <div className="p-4">
//                       <h3 className="text-md font-bold mb-2">{product.productName}</h3>
//                       <div>
//                         {product.variants[0].originalPrice && (
//                           <span className="line-through text-gray-400 mr-2">
//                             ₹{product.variants[0].originalPrice}.00
//                           </span>
//                         )}
//                         <span className="text-green-600 font-semibold">
//                           {typeof product.variants[0].discountPrice === 'number'
//                             ? `₹${product.variants[0].discountPrice}.00`
//                             : product.variants[0].discountPrice}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           addToCart(product);
//                         }}
//                         className="w-1/2 bg-gray-900 hover:bg-black text-white text-lg py-2 transition"
//                       >
//                         <i className="fas fa-shopping-cart"></i>
//                       </button>
//                       <button
//                         onClick={(e) => e.preventDefault()}
//                         className="w-1/2 bg-green-700 hover:bg-green-800 text-white text-lg py-2"
//                       >
//                         BUY NOW
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Wishlist;
import React, { useEffect } from 'react';
import { SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, fetchCart } from '../redux/slice/cartSlice';
import { fetchWishlist, toggleWishlistItem } from '../redux/slice/whishlistSlice';
import { useNavigate } from 'react-router-dom';
import bgimg from '../assets/img/whishlist-bg.webp';

const Wishlist = () => {
  const { wishlist, loading: wishlistLoading, error: wishlistError } = useSelector((state) => state.wishlist);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      dispatch(fetchWishlist(user._id));
    }
  }, [dispatch, isLoggedIn, user]);

  const handleToggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || !user?._id) {
      alert('Please log in to manage your wishlist.');
      return;
    }
    dispatch(toggleWishlistItem({ userId: user._id, productId }));
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || !user?._id) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      await dispatch(
        addToCart({
          userId: user._id,
          productId: product._id,
          variantId: product.variants[0]._id,
          quantity: 1,
        })
      ).unwrap();
      dispatch(fetchCart(user._id));
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleBuyNow = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || !user?._id) {
      alert('Please log in to proceed to checkout.');
      return;
    }
    try {
      await dispatch(
        addToCart({
          userId: user._id,
          productId: product._id,
          variantId: product.variants[0]._id,
          quantity: 1,
        })
      ).unwrap();
      dispatch(fetchCart(user._id));
      navigate('/checkout');
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  return (
    <>
      <div
        className="relative py-30"
        style={{ background: `url(${bgimg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <h1 className="relative z-10 text-xl mb-2 ms-10 text-white">Wishlist</h1>
        <p className="relative z-10 text-md ms-10 text-white">
          Home <span className="mx-1">{'>'}</span> Wishlist
        </p>
      </div>
      <div className="wishlist-page p-6">
        {wishlistError && <p className="text-red-500 text-center mb-4">{wishlistError}</p>}
        {wishlistLoading && <p className="text-center mb-4">Loading wishlist...</p>}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
            <div className="text-gray-300 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                viewBox="0 0 512 512"
                fill="none"
                stroke="currentColor"
                strokeWidth="24"
              >
                <path
                  d="M256 448l-35.3-32.2C117.4 312.5 48 248.6 48 160 48 97.3 97.3 48 160 48c39.7 0 77.3 23.1 96 58.5C274.7 71.1 312.3 48 352 48c62.7 0 112 49.3 112 112 0 88.6-69.4 152.5-172.7 255.8L256 448z"
                  fill="none"
                />
                <circle cx="360" cy="360" r="100" stroke="currentColor" strokeWidth="24" fill="none" />
                <line x1="328" y1="328" x2="392" y2="392" stroke="currentColor" strokeWidth="24" />
                <line x1="392" y1="328" x2="328" y2="392" stroke="currentColor" strokeWidth="24" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Wishlist is empty.</h2>
            <p className="text-gray-500 text-sm max-w-sm">
              You don’t have any products in the wishlist yet. <br />
              You will find a lot of interesting products on our <span className="font-medium text-black">"Shop"</span> page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {wishlist.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="bg-white shadow-md rounded-md overflow-hidden relative group hover:shadow-lg transition flex flex-col h-full">
                  <div className="w-full aspect-[4/4] relative overflow-hidden group">
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded z-30 shadow-md">
                        {product.discount}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleWishlist(product._id, e)}
                      className="absolute top-2 right-2 z-30 bg-white text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-300 rounded-full p-2 border border-red-500 group/delete"
                      disabled={wishlistLoading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 group-hover/delete:scale

-110 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12M10 11v6m4-6v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12H5zM9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                        />
                      </svg>
                    </button>
                    <img
                      src={product.variants[0].productImage[0]}
                      alt={product.productName}
                      className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10"
                    />
                    <img
                      src={product.variants[0].productImage[1]}
                      alt={product.productName}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-in-out z-20"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="p-4">
                      <h3 className="text-md font-bold mb-2">{product.productName}</h3>
                      <div>
                        {product.variants[0].originalPrice && (
                          <span className="line-through text-gray-400 mr-2">
                            ₹{product.variants[0].originalPrice}.00
                          </span>
                        )}
                        <span className="text-green-600 font-semibold">
                          {typeof product.variants[0].discountPrice === 'number'
                            ? `₹${product.variants[0].discountPrice}.00`
                            : product.variants[0].discountPrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-1/2 bg-gray-900 hover:bg-black text-white text-lg py-2 transition"
                        disabled={cartLoading}
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(product, e)}
                        className="w-1/2 bg-green-700 hover:bg-green-800 text-white text-lg py-2"
                        disabled={cartLoading}
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;