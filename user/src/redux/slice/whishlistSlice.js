import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
axios.defaults.withCredentials = true;

// Base URL for the API (adjust as needed)
// const API_URL = 'http://localhost:3000/api/whishlist';
const API_URL = 'https://spiru-backend.onrender.com/api/whishlist';

// Async thunk to fetch wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get/${userId}`);
      console.log(response)
      if (response.data.success) {
        return response.data.data.products || [];
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Async thunk to add or remove item from wishlist (toggle)
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async ({ userId, productId }, { getState, rejectWithValue }) => {
    const { wishlist } = getState().wishlist;
    const isInWishlist = wishlist.some((item) => item._id === productId);
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await axios.post(`${API_URL}/remove`, { userId, productId });
        if (response.data.success) {
          return { productId, action: 'remove' };
        }
        return rejectWithValue(response.data.message);
      } else {
        // Add to wishlist
        const response = await axios.post(`${API_URL}/add`, { userId, productId });
        if (response.data.success) {
          // Fetch the product details to include in the wishlist state
          // const productResponse = await axios.get(`http://localhost:3000/api/product/get/${productId}`);
          const productResponse = await axios.get(`http://spiru-backend.onrender.com/api/product/get/${productId}`);
          return { product: productResponse.data.data, action: 'add' };
        }
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Wishlist Item
      .addCase(toggleWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.action === 'add') {
          state.wishlist.push(action.payload.product);
        } else if (action.payload.action === 'remove') {
          state.wishlist = state.wishlist.filter((item) => item._id !== action.payload.productId);
        }
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;