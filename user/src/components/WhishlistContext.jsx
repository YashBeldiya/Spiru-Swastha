


import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem, fetchWishlist } from '../redux/slice/whishlistSlice';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const addToWishlist = async (product) => {
    if (isLoggedIn && user?._id) {
      await dispatch(toggleWishlistItem({ userId: user._id, productId: product._id }));
    } else {
      alert('Please log in to add to wishlist.');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isLoggedIn && user?._id) {
      await dispatch(toggleWishlistItem({ userId: user._id, productId }));
    } else {
      alert('Please log in to remove from wishlist.');
    }
  };

  const fetchUserWishlist = () => {
    if (isLoggedIn && user?._id) {
      dispatch(fetchWishlist(user._id));
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, fetchUserWishlist, loading, error }}>
      {children}
    </WishlistContext.Provider>
  );
};