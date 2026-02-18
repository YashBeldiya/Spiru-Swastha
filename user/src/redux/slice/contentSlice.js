import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch content by product ID
export const fetchContentByProductId = createAsyncThunk(
  'content/fetchByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      // const response = await axios.get(`https://spiru-backend.onrender.com/api/content/product/${productId}`);
      const response = await axios.get(`http://localhost:3000/api/content/product/${productId}`);
      return response.data.data; // Assuming API returns content in `data` field
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    content: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearContentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchContentByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContentError } = contentSlice.actions;
export default contentSlice.reducer;