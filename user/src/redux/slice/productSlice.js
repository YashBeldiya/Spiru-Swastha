import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

export const fetchProductdata = createAsyncThunk(
    'products/fetchProductdata',
    async () => {
        const response = await axios.get('https://spiru-backend.onrender.com/api/product/get-all')
        return response.data.data
    }
)

export const newLaunchesData = createAsyncThunk(
    'products/newLaunchesData',
    async () => {
        const response = await axios.get('https://spiru-backend.onrender.com/api/product/new-launch')
        // console.log(response.data.data)
        return response.data.data
    }
)

export const bestSellerData = createAsyncThunk(
    'products/bestSellerData',
    async () => {
        const response = await axios.get('https://spiru-backend.onrender.com/api/product/best-seller')
        return response.data.data
    }
)


export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId) => {
        const response = await axios.get(`https://spiru-backend.onrender.com/api/product/get/${productId}`)
        return response.data.data
    }
)


export const productSlice = createSlice({
    name:'products',
    initialState : {
        loading : false,
        isError : null,
        productData : [],
        newlaunchData : [],
        bestsellerData : [],
        singleProduct: null, // Add this for the single product
        singleProductLoading: false, // Add loading state for single product
        singleProductError: null 
    },
    reducers : {},
    extraReducers :(builder) => {
        builder.addCase(fetchProductdata.pending,(state) => {
            state.loading = true
        })
        .addCase(fetchProductdata.fulfilled,(state,action) => {
            state.loading = true,
            state.productData = action.payload
        })
        .addCase(fetchProductdata.rejected,(state,action) => {
            state.loading = false,
            state.isError = action.error.message
        })
        .addCase(newLaunchesData.pending,(state) => {
            state.loading = true
        })
        .addCase(newLaunchesData.fulfilled,(state,action) => {
            state.loading = true,
            state.newlaunchData = action.payload
        })
        .addCase(newLaunchesData.rejected,(state,action) => {
            state.loading = false,
            state.isError = action.error.message
        })
        .addCase(bestSellerData.pending,(state) => {
            state.loading = true
        })
        .addCase(bestSellerData.fulfilled,(state,action) => {
            state.loading = true,
            state.bestsellerData = action.payload
        })
        .addCase(bestSellerData.rejected,(state,action) => {
            state.loading = false,
            state.isError = action.error.message
        })
        .addCase(fetchProductById.pending, (state) => {
            state.singleProductLoading = true
            state.singleProductError = null
        })
        .addCase(fetchProductById.fulfilled, (state, action) => {
            state.singleProductLoading = false
            state.singleProduct = action.payload
        })
        .addCase(fetchProductById.rejected, (state, action) => {
            state.singleProductLoading = false
            state.singleProductError = action.error.message
        })
    }
})

export default productSlice.reducer