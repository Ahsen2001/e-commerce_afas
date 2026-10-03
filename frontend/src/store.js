import { configureStore } from "@reduxjs/toolkit";
import productsReducer  from "./slices/productsSlice";
import productReducer   from "./slices/productSlice";
import authReducer      from "./slices/authSlice";
import cartReducer      from "./slices/cartSlice";
import orderReducer     from "./slices/orderSlice";
import userReducer      from "./slices/userSlice";
import vehicleReducer   from "./slices/vehicleSlice";
import itineraryReducer from "./slices/itinerarySlice";

const store = configureStore({
  reducer: {
    products:  productsReducer,
    product:   productReducer,
    auth:      authReducer,
    cart:      cartReducer,
    order:     orderReducer,
    user:      userReducer,
    vehicle:   vehicleReducer,
    itinerary: itineraryReducer,
  },
});

export default store;