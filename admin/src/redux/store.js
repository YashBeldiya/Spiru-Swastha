import { configureStore } from "@reduxjs/toolkit";
import orderSlice from "./slice/orderSlice";
import userSlice from "./slice/userSlice";



export const store = configureStore({
    reducer : {
        user : userSlice,
        order : orderSlice
    }
})