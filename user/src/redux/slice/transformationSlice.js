import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransformationVideos = createAsyncThunk(
    "transformation/fetchTransformationVideos",
    async () => {
        const response = await axios.get("http://localhost:3000/api/media/category-by-media/productVideo");
        // const response = await axios.get("https://spiru-backend.onrender.com/api/media/category-by-media/productVideo");
        return response.data.data
    }
)

const transformationSlice = createSlice({
    name : "transformation",
    initialState : {
        loading : false,
        isError : null,
        transformationData : []
    },
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(fetchTransformationVideos.pending,(state) => {
            state.loading = true
        })
        .addCase(fetchTransformationVideos.fulfilled,(state,action) => {
            state.loading = false,
            state.transformationData = action.payload;
        })
        .addCase(fetchTransformationVideos.rejected,(state,action) => {
            state.loading = false,
            state.isError = action.error.message
        })
    }
})

export default transformationSlice.reducer;