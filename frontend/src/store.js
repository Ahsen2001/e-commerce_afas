import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    product: productReducer,
    auth: authReducer, // ✅ auth (NOT authState)
  },
  devTools: true, // ✅ force enable
});

export default store;
