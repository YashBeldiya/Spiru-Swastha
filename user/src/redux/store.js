import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./slice/categorySlice";
import productSlice from "./slice/productSlice";
import transformationSlice from "./slice/transformationSlice";
import authReducer from './slice/authSlice';
import whishlistSlice from "./slice/whishlistSlice";
import reviewSlice from "./slice/reviewSlice";
import cartSlice from "./slice/cartSlice";
import orderSlice from "./slice/orderSlice";
import contentSlice from "./slice/contentSlice";
import addressSlice from "./slice/addressSlice";


export const store = configureStore({
    reducer : {
        auth: authReducer,
        categories : categorySlice,
        products : productSlice,
        transformations : transformationSlice,
        wishlist: whishlistSlice,
        reviews : reviewSlice,
        cart:cartSlice,
        order : orderSlice,
        content : contentSlice,
        address : addressSlice
    }
})