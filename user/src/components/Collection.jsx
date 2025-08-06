
// import React, { useEffect, useState } from "react";
// import { useParams, NavLink, useNavigate } from "react-router-dom";
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { CiFilter } from "react-icons/ci";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProductdata } from "../redux/slice/productSlice";
// import { addToCart, fetchCart } from "../redux/slice/cartSlice";
// import { fetchWishlist, toggleWishlistItem } from "../redux/slice/whishlistSlice";
// import bgimg from '../assets/img/collection.webp';

// const sortOptions = [
//   'Featured',
//   'Best selling',
//   'Alphabetically, A-Z',
//   'Alphabetically, Z-A',
//   'Price, low to high',
//   'Price, high to low',
//   'Date, old to new',
// ];

// const Collection = () => {
//   const params = useParams();
//   const { productData } = useSelector((state) => state.products);
//   const { wishlist, loading: wishlistLoading } = useSelector((state) => state.wishlist);
//   const { user, isLoggedIn } = useSelector((state) => state.auth);
//   const { loading: cartLoading } = useSelector((state) => state.cart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [sortOpen, setSortOpen] = useState(false);
//   const [selectedSort, setSelectedSort] = useState('Best selling');
//   const [showFilter, setShowFilter] = useState(false);

//   useEffect(() => {
//     dispatch(fetchProductdata());
//     if (isLoggedIn && user?._id) {
//       dispatch(fetchWishlist(user._id));
//       dispatch(fetchCart(user._id));
//     }
//   }, [dispatch, isLoggedIn, user]);

//   const handleToggleWishlist = (product, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isLoggedIn || !user?._id) {
//       alert('Please log in to manage your wishlist.');
//       return;
//     }
//     dispatch(toggleWishlistItem({ userId: user._id, productId: product._id }));
//   };

//   const handleAddToCart = async (product, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isLoggedIn || !user?._id) {
//       alert('Please log in to add items to your cart.');
//       return;
//     }
//     try {
//       await dispatch(
//         addToCart({
//           userId: user._id,
//           productId: product._id,
//           variantId: product.variants[0]._id,
//           quantity: 1,
//         })
//       ).unwrap();
//       dispatch(fetchCart(user._id));
//     } catch (error) {
//       console.error('Add to cart error:', error);
//     }
//   };

//   const handleBuyNow = async (product, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isLoggedIn || !user?._id) {
//       alert('Please log in to proceed to checkout.');
//       return;
//     }
//     try {
//       await dispatch(
//         addToCart({
//           userId: user._id,
//           productId: product._id,
//           variantId: product.variants[0]._id,
//           quantity: 1,
//         })
//       ).unwrap();
//       dispatch(fetchCart(user._id));
//       navigate('/checkout');
//     } catch (error) {
//       console.error('Add to cart error:', error);
//     }
//   };

//   // Filter products based on category
//   let newData = params.category === "shop-all" 
//     ? [...productData] 
//     : productData.filter((x) => x.category?.slug === params.category);

//   // Apply sorting
//   newData = [...newData].sort((a, b) => {
//     switch (selectedSort) {
//       case 'Alphabetically, A-Z':
//         return a.productName.localeCompare(b.productName);
//       case 'Alphabetically, Z-A':
//         return b.productName.localeCompare(a.productName);
//       case 'Price, low to high':
//         return (a.variants[0]?.discountPrice || 0) - (b.variants[0]?.discountPrice || 0);
//       case 'Price, high to low':
//         return (b.variants[0]?.discountPrice || 0) - (a.variants[0]?.discountPrice || 0);
//       case 'Date, old to new':
//         return new Date(a.createdAt) - new Date(b.createdAt);
//       case 'Date, new to old':
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       default:
//         return 0; // 'Featured' or 'Best selling' (default)
//     }
//   });

//   const heading = params.category.charAt(0).toUpperCase() + params.category.slice(1);

//   return (
//     <section className="secNewLaunches mx-auto bg-white mb-10">
//       <div
//         className="relative py-28 px-6"
//         style={{ backgroundImage: `url(${bgimg})`, backgroundRepeat: "no-repeat", backgroundPosition: "center center", backgroundSize: "cover" }}
//       >
//         <div className="absolute inset-0 bg-black/40"></div>
//         <h1 className="relative z-10 text-4xl font-semibold mb-2 text-white">{heading}</h1>
//         <p className="relative z-10 text-md text-white">
//           Home <span className="mx-1">{'>'}</span> {heading}
//         </p>
//       </div>

//       <div className="flex justify-between items-center p-6">
//         <button
//           className="text-gray-600 text-sm flex items-center gap-2"
//           onClick={() => setShowFilter(true)}
//         >
//           <CiFilter className="text-2xl" />
//           Filter
//         </button>

//         <div className="relative">
//           <button
//             onClick={() => setSortOpen(!sortOpen)}
//             className="border px-4 py-2 rounded-md text-sm flex items-center gap-2"
//           >
//             {selectedSort}
//             {sortOpen ? (
//               <FiChevronUp className="h-4 w-4" />
//             ) : (
//               <FiChevronDown className="h-4 w-4" />
//             )}
//           </button>

//           {sortOpen && (
//             <ul className="absolute right-0 mt-2 w-60 bg-white border rounded-md shadow z-50">
//               {sortOptions.map((option) => (
//                 <li
//                   key={option}
//                   onClick={() => {
//                     setSelectedSort(option);
//                     setSortOpen(false);
//                   }}
//                   className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedSort === option ? 'text-green-600 font-semibold' : ''}`}
//                 >
//                   {option}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       <div className="max-w-9xl mx-auto px-4">
//         <div className="secNewLaunches grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
//           {newData?.map((product) => (
//             <div key={product._id}>
//               <NavLink to={`/products/${product.slug}`}>
//                 <div className="bg-white shadow-md rounded-md overflow-hidden relative group hover:shadow-lg transition flex flex-col h-full">
//                   <div className="w-full aspect-[4/4] relative overflow-hidden group">
//                     {product.variants[0]?.discountPercent && (
//                       <span className="absolute top-2 left-2 bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded z-30 shadow-md">
//                         {product.variants[0].discountPercent}% OFF
//                       </span>
//                     )}
//                     <div className="absolute top-2 right-2 z-40 group/tooltip">
//                       <button
//                         type="button"
//                         onClick={(e) => handleToggleWishlist(product, e)}
//                         className="transition-colors duration-300 drop-shadow"
//                         disabled={wishlistLoading}
//                       >
//                         <i
//                           className={`fa-heart text-lg ${
//                             wishlist.some((item) => item._id === product._id)
//                               ? 'fas text-pink-700'
//                               : 'far text-green-600 group-hover/tooltip:opacity-100 opacity-40'
//                           }`}
//                         ></i>
//                       </button>
//                       <div className="absolute top-0 right-8 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
//                         {wishlist.some((item) => item._id === product._id)
//                           ? 'Remove from Wishlist'
//                           : 'Add to Wishlist'}
//                       </div>
//                     </div>
//                     <img
//                       src={product.variants[0]?.productImage[0]}
//                       alt={product.productName}
//                       className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10"
//                       onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
//                     />
//                     <img
//                       src={product.variants[0]?.productImage[1] || product.variants[0]?.productImage[0]}
//                       alt={product.productName}
//                       className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-in-out z-20"
//                       onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
//                     />
//                   </div>
//                   <div className="flex flex-col justify-between flex-1">
//                     <div className="p-4">
//                       <h3 className="text-md font-bold mb-2">{product.productName}</h3>
//                       <div>
//                         {product.variants[0]?.originalPrice && (
//                           <span className="line-through text-gray-400 mr-2">
//                             ₹{product.variants[0]?.originalPrice}.00
//                           </span>
//                         )}
//                         <span className="text-green-600 font-semibold">
//                           ₹{product.variants[0]?.discountPrice}.00
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <button
//                         onClick={(e) => handleAddToCart(product, e)}
//                         className="w-1/2 bg-gray-900 hover:bg-black text-white text-lg py-2 transition"
//                         disabled={cartLoading}
//                       >
//                         <i className="fas fa-shopping-cart"></i>
//                       </button>
//                       <button
//                         onClick={(e) => handleBuyNow(product, e)}
//                         className="w-1/2 bg-green-700 hover:bg-green-800 text-white text-lg py-2"
//                         disabled={cartLoading}
//                       >
//                         BUY NOW
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </NavLink>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="relative z-50">
//         {showFilter && (
//           <div
//             className="fixed inset-0 bg-black/50 bg-opacity-30 z-40"
//             onClick={() => setShowFilter(false)}
//           />
//         )}
//         <div
//           className={`fixed top-0 left-0 h-full w-[340px] bg-white shadow-md z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out
//           ${showFilter ? 'translate-x-0' : '-translate-x-full'}`}
//         >
//           <div className="p-5">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold">FILTER</h2>
//               <button
//                 className="text-2xl text-gray-600 hover:text-black"
//                 onClick={() => setShowFilter(false)}
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="mb-6">
//               <h3 className="text-md font-semibold border-b mb-2 pb-1">Availability</h3>
//               <div className="flex flex-col gap-2 text-sm">
//                 <label className="flex items-center gap-2">
//                   <input type="checkbox" className="w-4 h-4" />
//                   <span>In Stock (17)</span>
//                 </label>
//                 <label className="flex items-center gap-2 text-gray-400">
//                   <input type="checkbox" className="w-4 h-4" disabled />
//                   <span>Out Of Stock (0)</span>
//                 </label>
//               </div>
//             </div>
//             <div className="mb-6">
//               <h3 className="text-md font-semibold border-b mb-2 pb-1">Price</h3>
//               <input
//                 type="range"
//                 min={0}
//                 max={3599}
//                 className="w-full accent-green-600"
//               />
//               <p className="text-sm text-gray-600 mt-2">
//                 Price: <span className="text-black font-bold">₹0.00</span> —{' '}
//                 <span className="text-black font-bold">₹3,599.00</span>
//               </p>
//               <button className="mt-4 w-full bg-green-700 text-white py-2 font-semibold hover:bg-green-800 transition">
//                 FILTER
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Collection;

import React, { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CiFilter } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductdata } from "../redux/slice/productSlice";
import { addToCart, fetchCart } from "../redux/slice/cartSlice";
import { fetchWishlist, toggleWishlistItem } from "../redux/slice/whishlistSlice";
import bgimg from '../assets/img/collection.webp';

const sortOptions = [
  'Featured',
  'Best selling',
  'Alphabetically, A-Z',
  'Alphabetically, Z-A',
  'Price, low to high',
  'Price, high to low',
  'Date, old to new',
];

const Collection = () => {
  const params = useParams();
  const { productData } = useSelector((state) => state.products);
  const { wishlist, loading: wishlistLoading } = useSelector((state) => state.wishlist);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Best selling');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    inStock: false,
    outOfStock: false,
    priceMin: 0,
    priceMax: 3599,
  });

  useEffect(() => {
    dispatch(fetchProductdata());
    if (isLoggedIn && user?._id) {
      dispatch(fetchWishlist(user._id));
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, isLoggedIn, user]);

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn || !user?._id) {
      alert('Please log in to manage your wishlist.');
      return;
    }
    dispatch(toggleWishlistItem({ userId: user._id, productId: product._id }));
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

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, checked, value, type } = e.target;
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: type === 'checkbox' ? checked : Number(value),
      };
      // Ensure priceMin is not greater than priceMax
      if (name === 'priceMin' && Number(value) > newFilters.priceMax) {
        newFilters.priceMin = newFilters.priceMax;
      } else if (name === 'priceMax' && Number(value) < newFilters.priceMin) {
        newFilters.priceMax = newFilters.priceMin;
      }
      return newFilters;
    });
  };

  // Filter products based on category and filters
  let newData = params.category === "shop-all" 
    ? [...productData] 
    : productData.filter((x) => x.category?.slug === params.category);

  // Apply filters
  newData = newData.filter((product) => {
    const price = product.variants[0]?.discountPrice || product.variants[0]?.originalPrice || 0;
    const stock = product.variants[0]?.stockAvailability || 0;
    const inStockFilter = filters.inStock ? stock > 0 : true;
    const outOfStockFilter = filters.outOfStock ? stock === 0 : true;
    const priceFilter = price >= filters.priceMin && price <= filters.priceMax;
    return inStockFilter && outOfStockFilter && priceFilter;
  });

  // Apply sorting
  newData = [...newData].sort((a, b) => {
    switch (selectedSort) {
      case 'Alphabetically, A-Z':
        return a.productName.localeCompare(b.productName);
      case 'Alphabetically, Z-A':
        return b.productName.localeCompare(a.productName);
      case 'Price, low to high':
        return (a.variants[0]?.discountPrice || 0) - (b.variants[0]?.discountPrice || 0);
      case 'Price, high to low':
        return (b.variants[0]?.discountPrice || 0) - (a.variants[0]?.discountPrice || 0);
      case 'Date, old to new':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'Date, new to old':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0; // 'Featured' or 'Best selling' (default)
    }
  });

  const heading = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <section className="secNewLaunches mx-auto bg-white mb-10">
      <div
        className="relative py-28 px-6"
        style={{ backgroundImage: `url(${bgimg})`, backgroundRepeat: "no-repeat", backgroundPosition: "center center", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative z-10 text-4xl font-semibold mb-2 text-white">{heading}</h1>
        <p className="relative z-10 text-md text-white">
          Home <span className="mx-1">{'>'}</span> {heading}
        </p>
      </div>

      <div className="flex justify-between items-center p-6">
        <button
          className="text-gray-600 text-sm flex items-center gap-2"
          onClick={() => setShowFilter(true)}
        >
          <CiFilter className="text-2xl" />
          Filter
        </button>

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="border px-4 py-2 rounded-md text-sm flex items-center gap-2"
          >
            {selectedSort}
            {sortOpen ? (
              <FiChevronUp className="h-4 w-4" />
            ) : (
              <FiChevronDown className="h-4 w-4" />
            )}
          </button>

          {sortOpen && (
            <ul className="absolute right-0 mt-2 w-60 bg-white border rounded-md shadow z-50">
              {sortOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSelectedSort(option);
                    setSortOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedSort === option ? 'text-green-600 font-semibold' : ''}`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="max-w-9xl mx-auto px-4">
        <div className="secNewLaunches grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {newData?.map((product) => (
            <div key={product._id}>
              <NavLink to={`/products/${product.slug}`}>
                <div className="bg-white shadow-md rounded-md overflow-hidden relative group hover:shadow-lg transition flex flex-col h-full">
                  <div className="w-full aspect-[4/4] relative overflow-hidden group">
                    {product.variants[0]?.discountPercent && (
                      <span className="absolute top-2 left-2 bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded z-30 shadow-md">
                        {product.variants[0].discountPercent}% OFF
                      </span>
                    )}
                    <div className="absolute top-2 right-2 z-40 group/tooltip">
                      <button
                        type="button"
                        onClick={(e) => handleToggleWishlist(product, e)}
                        className="transition-colors duration-300 drop-shadow"
                        disabled={wishlistLoading}
                      >
                        <i
                          className={`fa-heart text-lg ${
                            wishlist.some((item) => item._id === product._id)
                              ? 'fas text-pink-700'
                              : 'far text-green-600 group-hover/tooltip:opacity-100 opacity-40'
                          }`}
                        ></i>
                      </button>
                      <div className="absolute top-0 right-8 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                        {wishlist.some((item) => item._id === product._id)
                          ? 'Remove from Wishlist'
                          : 'Add to Wishlist'}
                      </div>
                    </div>
                    <img
                      src={product.variants[0]?.productImage[0]}
                      alt={product.productName}
                      className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
                    />
                    <img
                      src={product.variants[0]?.productImage[1] || product.variants[0]?.productImage[0]}
                      alt={product.productName}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-in-out z-20"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="p-4">
                      <h3 className="text-md font-bold mb-2">{product.productName}</h3>
                      <div>
                        {product.variants[0]?.originalPrice && (
                          <span className="line-through text-gray-400 mr-2">
                            ₹{product.variants[0]?.originalPrice}.00
                          </span>
                        )}
                        <span className="text-green-600 font-semibold">
                          ₹{product.variants[0]?.discountPrice}.00
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
              </NavLink>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-50">
        {showFilter && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-30 z-40"
            onClick={() => setShowFilter(false)}
          />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-[340px] bg-white shadow-md z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out
          ${showFilter ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">FILTER</h2>
              <button
                className="text-2xl text-gray-600 hover:text-black"
                onClick={() => setShowFilter(false)}
              >
                &times;
              </button>
            </div>
            <div className="mb-6">
              <h3 className="text-md font-semibold border-b mb-2 pb-1">Availability</h3>
              <div className="flex flex-col gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                    className="w-4 h-4"
                  />
                  <span>In Stock ({productData.filter(p => (p.variants[0]?.stockAvailability || 0) > 0).length})</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="outOfStock"
                    checked={filters.outOfStock}
                    onChange={handleFilterChange}
                    className="w-4 h-4"
                  />
                  <span>Out Of Stock ({productData.filter(p => (p.variants[0]?.stockAvailability || 0) === 0).length})</span>
                </label>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-md font-semibold border-b mb-2 pb-1">Price</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  name="priceMin"
                  min="0"
                  max="3599"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  className="w-full accent-green-600"
                />
                <input
                  type="range"
                  name="priceMax"
                  min="0"
                  max="3599"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  className="w-full accent-green-600"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Price: <span className="text-black font-bold">₹{filters.priceMin}.00</span> —{' '}
                <span className="text-black font-bold">₹{filters.priceMax}.00</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;