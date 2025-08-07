import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for your API
const API_URL = 'https://spiru-backend.onrender.com/api';

// Async thunks for CRUD operations
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/address/get/${userId}`);
      
      return response.data.data.addresses;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  'address/addAddress',
  async ({ userId, address }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/address/add`, { userId, address });
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ userId, addressId, address }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/address/update/${userId}/${addressId}`, { userId, address });
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/address/delete/${userId}/${addressId}`, {
        data: { userId }
      });
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/address/default/${userId}/${addressId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set Default Address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((addr) =>
          addr._id === action.payload._id
            ? action.payload
            : { ...addr, isDefault: false }
        );
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;