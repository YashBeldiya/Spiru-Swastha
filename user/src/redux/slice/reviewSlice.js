import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch reviews for a specific product
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://spiru-backend.onrender.com/api/review/get/${productId}`);
            // Map API fields to match component expectations
            const mappedReviews = response.data.data.map(review => ({
                ...review,
                rating: review.count,
                review: review.content,
                name: review.displayName,
                date: review.createdAt
            }));
            return mappedReviews;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

// Add a new review
export const addReview = createAsyncThunk(
    'reviews/addReview',
    async (reviewData, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            if (!auth.isLoggedIn || !auth.user?._id) {
                return rejectWithValue('Please log in to submit a review');
            }
            const response = await axios.post('https://spiru-backend.onrender.com/api/review/create', {
                product: reviewData.productId,
                user: auth.user._id,
                count: reviewData.rating,
                title: reviewData.title,
                content: reviewData.review,
                displayName: reviewData.name,
                email: reviewData.email
            });
            // Map response to match component expectations
            const newReview = {
                ...response.data.review,
                rating: response.data.review.count,
                review: response.data.review.content,
                name: response.data.review.displayName,
                date: response.data.review.createdAt
            };
            return newReview;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add review');
        }
    }
);

// Fetch top 3 reviewed products
export const fetchTopReviewedProducts = createAsyncThunk(
    'reviews/fetchTopReviewedProducts',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get('https://spiru-backend.onrender.com/api/review/top-reviewed-products');
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch top reviewed products');
      }
    }
  );
  
const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        topReviewed:[]
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Reviews
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Review
            .addCase(addReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = [action.payload, ...state.reviews];
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTopReviewedProducts.pending, (state) => {
                state.loading = true;
              })
              .addCase(fetchTopReviewedProducts.fulfilled, (state, action) => {
                state.loading = false;
                // state.topReviewed = action.payload;
              })
              .addCase(fetchTopReviewedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              });
    }
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;