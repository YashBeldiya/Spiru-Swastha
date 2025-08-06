

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api';

// export const addToCart = createAsyncThunk(
//   'cart/addToCart',
//   async ({ userId, productId, variantId, quantity }, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/add-cart/add`, {
//         userId,
//         productId,
//         variantId,
//         quantity,
//       });
//       await dispatch(fetchCart(userId));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
//     }
//   }
// );

// export const fetchCart = createAsyncThunk(
//   'cart/fetchCart',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/add-cart/get/${userId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
//     }
//   }
// );

// export const removeFromCart = createAsyncThunk(
//   'cart/removeFromCart',
//   async ({ userId, productId, variantId }, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/add-cart/remove`, {
//         userId,
//         productId,
//         variantId,
//       });
//       await dispatch(fetchCart(userId));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
//     }
//   }
// );

// export const updateCartQuantity = createAsyncThunk(
//   'cart/updateCartQuantity',
//   async ({ userId, productId, variantId, quantity }, { rejectWithValue, dispatch }) => {
//     console.log('updateCartQuantity payload:', { userId, productId, variantId, quantity });
//     try {
//       const response = await axios.post(`${API_BASE_URL}/add-cart/update-quantity`, {
//         userId,
//         productId,
//         variantId,
//         quantity,
//       });
//       await dispatch(fetchCart(userId));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update cart quantity');
//     }
//   }
// );

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: {
//     cart: null,
//     loading: false,
//     error: null,
//     isCartOpen: false,
//   },
//   reducers: {
//     setIsCartOpen(state, action) {
//       state.isCartOpen = action.payload;
//     },
//     clearCartError(state) {
//       state.error = null;
//     },
//     resetCart: (state) => {
//       state.cart = null;
//       state.loading = false;
//       state.error = null;
//       state.isCartOpen = false
//       state.items = []
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addToCart.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.loading = false;
//       })
//       .addCase(addToCart.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchCart.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.loading = false;
//         state.cart = action.payload.data;
//       })
//       .addCase(fetchCart.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(removeFromCart.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(removeFromCart.fulfilled, (state, action) => {
//         state.loading = false;
//       })
//       .addCase(removeFromCart.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateCartQuantity.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCartQuantity.fulfilled, (state, action) => {
//         state.loading = false;
//       })
//       .addCase(updateCartQuantity.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { setIsCartOpen, resetCart,clearCartError } = cartSlice.actions;
// export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, variantId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add-cart/add`, {
        userId,
        productId,
        variantId,
        quantity,
      });
      await dispatch(fetchCart(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/add-cart/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId, variantId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add-cart/remove`, {
        userId,
        productId,
        variantId,
      });
      await dispatch(fetchCart(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ userId, productId, variantId, quantity }, { rejectWithValue, dispatch }) => {
    console.log('updateCartQuantity payload:', { userId, productId, variantId, quantity });
    try {
      const response = await axios.post(`${API_BASE_URL}/add-cart/update-quantity`, {
        userId,
        productId,
        variantId,
        quantity,
      });
      await dispatch(fetchCart(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart quantity');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/add-cart/clear/${userId}`);
      await dispatch(fetchCart(userId)); // Refetch cart to ensure state is updated
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
    isCartOpen: false,
  },
  reducers: {
    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
    clearCartError(state) {
      state.error = null;
    },
    resetCart: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
      state.isCartOpen = false;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = null; // Clear the cart in the state
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsCartOpen, resetCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;