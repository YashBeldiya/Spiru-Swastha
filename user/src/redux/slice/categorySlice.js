import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategorydata = createAsyncThunk(
    "categories/fetchCategorydata",
    async () => {
        const response = await axios.get("http://localhost:3000/api/category/all-category");
        return response.data.data
    }
)

const categorySlice = createSlice({
    name : "categories",
    initialState : {
        loading : false,
        isError : null,
        categoryData : []
    },
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(fetchCategorydata.pending,(state) => {
            state.loading = true
        })
        .addCase(fetchCategorydata.fulfilled,(state,action) => {
            state.loading = false,
            state.categoryData = action.payload;
        })
        .addCase(fetchCategorydata.rejected,(state,action) => {
            state.loading = false,
            state.isError = action.error.message
        })
    }
})

export default categorySlice.reducer;