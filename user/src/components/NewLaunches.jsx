import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { newLaunchesData } from '../redux/slice/productSlice';
import { addToCart, fetchCart } from '../redux/slice/cartSlice';
import { clearError, fetchWishlist, toggleWishlistItem } from '../redux/slice/whishlistSlice';

const NewLaunches = () => {
  const newlaunchData = useSelector((state) => state.products.newlaunchData);
  const { wishlist, loading: wishlistLoading } = useSelector((state) => state.wishlist);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(newLaunchesData());
    if (isLoggedIn && user?._id) {
      dispatch(fetchCart(user._id));
      dispatch(fetchWishlist(user._id));
    }
    return () => {
      dispatch(clearError());
    };
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

  return (
    <div className="px-4 py-10 max-w-10xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">
        New Launches
        <div className="w-40 h-0.5 bg-green-600 mx-auto mt-2"></div>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newlaunchData.map((product) => (
          <div key={product._id}>
            <NavLink to={`/products/${product.slug}`} state={{ productId: product._id }}>
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
  );
};

export default NewLaunches;