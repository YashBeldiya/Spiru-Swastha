
import React, { useEffect, useState, useCallback } from 'react';
import logo from '../assets/img/spiru_logo.svg';
import { MdOutlineLocalShipping, MdDelete } from 'react-icons/md';
import { CiHeart, CiShoppingCart, CiUser } from 'react-icons/ci';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { navlist } from '../const/Storage';
import { NavLink } from 'react-router-dom';
import { useWishlist } from './WhishlistContext';
import { FaTruckFast } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import SearchSidebar from './SearchSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategorydata } from '../redux/slice/categorySlice';
import { loginUser, registerUser, logout, clearError } from '../redux/slice/authSlice';
import { fetchCart, removeFromCart, updateCartQuantity, setIsCartOpen, resetCart } from '../redux/slice/cartSlice';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [optimisticQuantities, setOptimisticQuantities] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);

    const { categoryData } = useSelector((state) => state.categories);
    const { isLoggedIn, loading: authLoading, error: authError, user } = useSelector((state) => state.auth);
    const { cart, loading: cartLoading, error: cartError, isCartOpen } = useSelector((state) => state.cart);
    const { wishlist, clearWishlist } = useWishlist();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategorydata());
        if (isLoggedIn && user?._id) {
            dispatch(fetchCart(user._id));
        }
    }, [dispatch, isLoggedIn, user]);

    useEffect(() => {
        if (cart?.items) {
            console.log(
                'Cart Items from Redux:',
                cart.items.map((item) => ({
                    id: item._id,
                    productName: item.productName,
                    quantity: item.quantity ?? 'Missing',
                    discountPrice: item.variant?.discountPrice ?? 'Missing',
                    variantId: item.variant?._id ?? 'Missing',
                    stockAvailability: item.variant?.stockAvailability ?? 'Unknown',
                }))
            );
            const initialQuantities = {};
            cart.items.forEach((item) => {
                const key = `${item._id}-${item.variant?._id}`;
                initialQuantities[key] = item.quantity ?? 1;
            });
            setOptimisticQuantities(initialQuantities);
        } else {
            console.log('Cart is empty or undefined:', cart);
            setOptimisticQuantities({});
        }
    }, [cart, isLoggedIn]);

    const subtotal = cart?.items?.reduce((acc, item) => {
        const price = item.variant?.discountPrice || item.variant?.originalPrice || 0;
        const quantity = optimisticQuantities[`${item._id}-${item.variant?._id}`] ?? item.quantity ?? 1;
        console.log(`Subtotal calc - Item: ${item.productName}, Price: ${price}, Quantity: ${quantity}, Total: ${price * quantity}`);
        return acc + price * quantity;
    }, 0) || 0;

    const progress = Math.min(100, (subtotal / 500) * 100);

    const handleLoginChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.id]: e.target.value,
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({
            ...registerForm,
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

    const handleRegister = () => {
        dispatch(registerUser(registerForm)).then((result) => {
            if (registerUser.fulfilled.match(result)) {
                setIsCreateOpen(false);
                setIsLoginOpen(true);
                setRegisterForm({ firstName: '', lastName: '', email: '', password: '', role: 'User' });
            }
        });
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetCart());
        clearWishlist();
        setOptimisticQuantities({});
        setIsDropdownOpen(false);
        setIsLoginOpen(true);
    };

    const handleRemoveFromCart = async (productId, variantId) => {
        try {
            console.log(`Removing: ProductID=${productId}, VariantID=${variantId}`);
            await dispatch(removeFromCart({ userId: user._id, productId, variantId })).unwrap();

            // Immediately update the local state if this was the last item
            if (cart.items.length === 1) {
                dispatch(resetCart());
            } else {
                dispatch(fetchCart(user._id));
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
        }
    };

    const handleUpdateQuantity = useCallback(
        debounce(async (productId, variantId, newQuantity, delta) => {
            if (newQuantity < 1) {
                console.log(`Cannot set quantity below 1 for ProductID=${productId}, VariantID=${variantId}`);
                return;
            }
            try {
                console.log(`Sending updateCartQuantity: ProductID=${productId}, VariantID=${variantId}, NewQuantity=${newQuantity}, Delta=${delta}`);
                await dispatch(updateCartQuantity({ userId: user?._id, productId, variantId, quantity: newQuantity })).unwrap();
                setErrorMessage(null);
            } catch (error) {
                console.error('Update quantity error:', error);
                setErrorMessage(error.message || 'Failed to update quantity');
                setOptimisticQuantities((prev) => {
                    const key = `${productId}-${variantId}`;
                    const newState = { ...prev };
                    delete newState[key];
                    return newState;
                });
            }
        }, 1000),
        [dispatch, user]
    );

    const updateQuantityHandler = (productId, variantId, currentQuantity, delta, stockAvailability) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return;

        // Fallback to 50 if stockAvailability is undefined
        const maxStock = stockAvailability ?? 50;

        // Check if new quantity exceeds stock limit
        // if (newQuantity > maxStock) {
        //     alert(`Cannot add more than ${maxStock} items to the cart. Only ${maxStock} in stock.`);
        //     return;
        // }
        if (newQuantity > maxStock) {
          toast.error(`Cannot add more than ${maxStock} items to the cart. Only ${maxStock} in stock.`, {
              position: "top-right",
              autoClose: 3000,
          });
          return;
      }

        const key = `${productId}-${variantId}`;
        console.log(`Optimistic update: ProductID=${productId}, VariantID=${variantId}, NewQuantity=${newQuantity}, Delta=${delta}`);
        setOptimisticQuantities((prev) => ({
            ...prev,
            [key]: newQuantity,
        }));

        handleUpdateQuantity(productId, variantId, newQuantity, delta);
    };

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const [registerForm, setRegisterForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'User',
    });

    useEffect(() => {
        if (isLoginOpen || isCreateOpen) {
            dispatch(clearError());
        }
    }, [isLoginOpen, isCreateOpen, dispatch]);

    return (
        <header className="w-full shadow-md sticky top-0 z-50 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-3xl">
                        <HiMenuAlt3 />
                    </button>
                    <NavLink to="/">
                        <img src={logo} alt="Logo" className="w-36" />
                    </NavLink>
                </div>

                <nav className="hidden lg:flex space-x-6">
                    {categoryData?.map((item, idx) => (
                        <NavLink to={`/collection/${item.slug}`} key={idx}>
                            <div className="flex items-center text-sm">
                                <img src={item.icon} alt={item.name} className="w-6 h-6 mb-1" />
                                <span className="ms-1.5">{item.name}</span>
                            </div>
                        </NavLink>
                    ))}
                </nav>

                <div className="flex space-x-4 text-2xl items-center">
                    <FiSearch className="cursor-pointer text-xl hover:text-green-700" onClick={() => setShowSearch(true)} />
                    <MdOutlineLocalShipping className="hidden lg:block" />
                    <div className="relative">
                        {isLoggedIn ? (
                            <>
                                <CiUser className="cursor-pointer hover:text-green-700" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                                        <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                            Dashboard
                                        </NavLink>
                                        <NavLink to="/order-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                            Order History
                                        </NavLink>
                                        <NavLink to="/address" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                                            Address
                                        </NavLink>
                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <CiUser onClick={() => setIsLoginOpen(true)} className="cursor-pointer hover:text-green-700" />
                        )}
                    </div>
                    <div className="relative cursor-pointer hover:text-green-700">
                        {isLoggedIn ? (
                            <NavLink to="/wishlist">
                                <CiHeart />
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full text-xs px-1">{wishlist.length}</span>
                            </NavLink>
                        ) : (
                            <CiHeart onClick={() => setIsLoginOpen(true)} className="cursor-pointer hover:text-green-700" />
                        )}
                    </div>
                    <div className="relative cursor-pointer hover:text-green-700">
                        {isLoggedIn ? (
                            <>
                                <CiShoppingCart onClick={() => dispatch(setIsCartOpen(true))} />
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full text-xs px-1">{cart?.items?.length || 0}</span>
                            </>
                        ) : (
                            <CiShoppingCart onClick={() => setIsLoginOpen(true)} className="cursor-pointer hover:text-green-700" />
                        )}
                    </div>
                </div>
            </div>

            <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center px-4 py-4 border-b">
                    <h2 className="text-lg font-bold">MENU</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-3xl">
                        <HiX />
                    </button>
                </div>
                <nav className="flex flex-col divide-y">
                    {navlist.map((item, idx) => (
                        <a href="#" key={idx} className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100">
                            <img src={item.img} alt={item.title} className="w-6 h-6" />
                            <span className="text-base">{item.title}</span>
                        </a>
                    ))}
                </nav>
                <div className="absolute bottom-5 left-5">
                    <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-10 h-10" />
                    </a>
                </div>
            </div>

            <div className={`fixed top-0 right-0 h-full w-85 max-w-full bg-white z-50 shadow-lg transition-transform duration-300 transform ${isLoginOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold">LOGIN</h2>
                    <button onClick={() => setIsLoginOpen(false)} className="text-2xl transition-transform duration-750 hover:rotate-[180deg]">
                        <HiX />
                    </button>
                </div>

                <div className="px-6 py-6 space-y-6">
                    {authError && <p className="text-red-500 text-sm">{authError}</p>}

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
                            className="absolute left-3 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-700 "
                        >
                            Password *
                        </label>
                    </div>

                    <a href="#" className="text-sm text-gray-500 text-decoration-underline">
                        Forgot your password?
                    </a>
                    <button className="w-full bg-green-700 text-white py-2 mt-2 hover:bg-green-800 transition disabled:bg-gray-400" onClick={handleLogin} disabled={authLoading}>
                        {authLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <p className="text-sm text-center">
                        New customer?{' '}
                        <a
                            href="#"
                            className="text-green-700 underline"
                            onClick={() => {
                                setIsLoginOpen(false);
                                setIsCreateOpen(true);
                            }}
                        >
                            Create your account
                        </a>
                    </p>
                </div>
            </div>

            <div className={`fixed top-0 right-0 h-full w-85 max-w-full bg-white z-50 shadow-lg transition-transform duration-300 transform ${isCreateOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold">Create Account</h2>
                    <button onClick={() => setIsCreateOpen(false)} className="text-2xl transition-transform duration-750 hover:rotate-[180deg]">
                        <HiX />
                    </button>
                </div>
                <div className="px-6 py-6 space-y-6">
                    {authError && <p className="text-red-500 text-sm">{authError}</p>}

                    <div className="relative">
                        <input
                            type="text"
                            id="firstName"
                            placeholder=" "
                            required
                            value={registerForm.firstName}
                            onChange={handleRegisterChange}
                            className="peer w-full px-3 pt-6 pb-2 border border-gray-300 text-sm placeholder-transparent focus:border-green-700 focus:outline-none"
                        />
                        <label
                            htmlFor="firstName"
                            className="absolute left-3 top-3 pb-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-700"
                        >
                            First Name *
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            id="lastName"
                            placeholder=" "
                            required
                            value={registerForm.lastName}
                            onChange={handleRegisterChange}
                            className="peer w-full px-3 pt-6 pb-2 border border-gray-300 text-sm placeholder-transparent focus:border-green-700 focus:outline-none"
                        />
                        <label
                            htmlFor="lastName"
                            className="absolute left-3 top-3 pb-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-700"
                        >
                            Last Name *
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            placeholder=" "
                            required
                            value={registerForm.email}
                            onChange={handleRegisterChange}
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
                            value={registerForm.password}
                            onChange={handleRegisterChange}
                            className="peer w-full px-3 pt-6 pb-2 border border-gray-300 text-sm placeholder-transparent focus:border-green-700 focus:outline-none"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-3 top-3 pb-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-700"
                        >
                            Password *
                        </label>
                    </div>
                    <p className="text-sm">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
                    <button className="w-full bg-green-700 text-white py-2 mt-2 hover:bg-green-800 transition disabled:bg-gray-400" onClick={handleRegister} disabled={authLoading}>
                        {authLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <p className="text-sm text-center">
                        Already have an account?{' '}
                        <a
                            href="#"
                            className="text-green-700 underline"
                            onClick={() => {
                                setIsCreateOpen(false);
                                setIsLoginOpen(true);
                            }}
                        >
                            Login here
                        </a>
                    </p>
                </div>
            </div>

            {(isSidebarOpen || isLoginOpen || isCreateOpen || isCartOpen) && (
                <div
                    className="fixed inset-0 bg-black/70 bg-opacity-40 z-40"
                    onClick={() => {
                        setIsSidebarOpen(false);
                        setIsLoginOpen(false);
                        setIsCreateOpen(false);
                        dispatch(setIsCartOpen(false));
                        setIsDropdownOpen(false);
                    }}
                ></div>
            )}

            <div className={`fixed top-0 right-0 w-full max-w-sm bg-white h-full shadow-lg z-50 transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center px-5 py-4 border-b">
                    <h2 className="text-lg font-semibold">SHOPPING CART</h2>
                    <button onClick={() => dispatch(setIsCartOpen(false))} className="text-gray-600 hover:text-black transition-transform duration-300 hover:rotate-180">
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-5 pt-4 pb-2">
                    {cartError && <p className="text-red-500 text-sm mb-3">{cartError}</p>}
                    {errorMessage && <p className="text-red-500 text-sm mb-3">{errorMessage}</p>}
                    {!isLoggedIn ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 py-10">
                            <svg className="w-12 h-12 mb-3" fill="currentColor" viewBox="0 0 576 512">
                                <path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM48 368V48h480v320H48zm288 80h-96l16-48h64l16 48z" />
                            </svg>
                            <p className="mb-4">Please log in to view your cart.</p>
                            <button
                                onClick={() => {
                                    dispatch(setIsCartOpen(false));
                                    setIsLoginOpen(true);
                                }}
                                className="bg-green-700 text-white px-6 py-2 hover:bg-green-800 transition"
                            >
                                LOG IN
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-sm text-gray-700 mb-3">
                                {subtotal < 500 ? (
                                    <>
                                        Almost there, add <span className="text-green-700 font-semibold">₹{(500 - subtotal).toFixed(2)}</span> more to get <strong>FREE SHIPPING!</strong>
                                    </>
                                ) : (
                                    <span className="text-green-700 font-semibold">You got FREE SHIPPING!</span>
                                )}
                            </div>

                            <div className="relative w-full bg-gray-200 h-2 rounded-full">
                                <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                <div className="absolute -top-4 text-xl transition-all duration-500" style={{ left: `calc(${progress}% - 12px)` }}>
                                    <FaTruckFast className="text-green-700" />
                                </div>
                            </div>

                            <div className="px-5 pb-4 pt-2 overflow-y-auto max-h-[50vh] space-y-6">
                                {cart?.items?.length === 0 || !cart?.items ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 py-10">
                                        <svg className="w-12 h-12 mb-3" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h192l-16 48h-72c-13.3 0-24 10.7-24 24s10.7 24 24 24h272c13.3 0 24-10.7 24-24s-10.7-24-24-24h-72l-16-48h192c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM48 368V48h480v320H48zm288 80h-96l16-48h64l16 48z" />
                                        </svg>
                                        <p className="mb-4">Your cart is empty.</p>
                                        <button onClick={() => dispatch(setIsCartOpen(false))} className="bg-green-700 text-white px-6 py-2 hover:bg-green-800 transition">
                                            RETURN TO SHOP
                                        </button>
                                    </div>
                                ) : (
                                    cart.items.map((item) => {
                                        const variant = item.variant;
                                        const imageUrl = variant?.productImage?.[0] || 'https://via.placeholder.com/80?text=No+Image';
                                        const quantity = optimisticQuantities[`${item._id}-${variant._id}`] ?? item.quantity;
                                        const stockAvailability = variant?.stockAvailability ?? 50; // Fallback to 50
                                        return (
                                            <div key={`${item._id}-${variant._id}`} className="flex gap-4 items-center border-b pb-4">
                                                <img
                                                    src={imageUrl}
                                                    alt={item.productName}
                                                    className="w-20 h-20 object-contain"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/80?text=Image+Not+Found';
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold truncate">{item.productName}</h3>
                                                    <div className="text-sm text-green-700 font-semibold">₹{variant?.discountPrice || variant?.originalPrice || 'N/A'}</div>
                                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                                        {variant?.originalPrice && <span className="line-through text-gray-400">₹{variant.originalPrice}</span>}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className="bg-gray-200 px-2"
                                                                onClick={() => updateQuantityHandler(item._id, variant._id, quantity, -1, stockAvailability)}
                                                                disabled={quantity <= 1 || cartLoading}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center">{quantity}</span>
                                                            <button
                                                                className="bg-gray-200 px-2"
                                                                onClick={() => updateQuantityHandler(item._id, variant._id, quantity, 1, stockAvailability)}
                                                                disabled={cartLoading}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="text-red-500" onClick={() => handleRemoveFromCart(item._id, variant._id)} disabled={cartLoading}>
                                                    <MdDelete className="w-5 h-5" />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {cart?.items?.length > 0 && (
                                <div className="px-5 py-4 border-t">
                                    <div className="flex justify-between text-sm font-medium mb-4">
                                        <span>Subtotal:</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <NavLink to="/view-cart" onClick={() => dispatch(setIsCartOpen(false))}>
                                        <button className="w-full bg-black text-white py-2 mb-3 hover:bg-gray-800">VIEW CART</button>
                                    </NavLink>
                                    <NavLink to="/checkout" onClick={() => dispatch(setIsCartOpen(false))}>
                                        <button className="w-full bg-green-700 text-white py-2 hover:bg-green-800">CHECK OUT</button>
                                    </NavLink>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <SearchSidebar isOpen={showSearch} onClose={() => setShowSearch(false)} />
        </header>
    );
};

export default Navbar;