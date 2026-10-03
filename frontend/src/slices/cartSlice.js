import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], shippingInfo: {}, loading: false },
  reducers: {
    addCartItemRequest:  (state) => { state.loading = true; },
    addCartItemSuccess:  (state, action) => {
      state.loading = false;
      const item = action.payload;
      const existing = state.items.find((i) => i.product === item.product);
      if (existing) {
        state.items = state.items.map((i) => i.product === existing.product ? item : i);
      } else {
        state.items.push(item);
      }
    },
    increaseCartItemQty: (state, action) => {
      const item = state.items.find((i) => i.product === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseCartItemQty: (state, action) => {
      const item = state.items.find((i) => i.product === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeItemFromCart:  (state, action) => {
      state.items = state.items.filter((i) => i.product !== action.payload);
    },
    saveShippingInfo:    (state, action) => { state.shippingInfo = action.payload; },
    orderCompleted:      (state) => { state.items = []; state.shippingInfo = {}; },
  },
});

export const {
  addCartItemRequest, addCartItemSuccess,
  increaseCartItemQty, decreaseCartItemQty,
  removeItemFromCart, saveShippingInfo, orderCompleted,
} = cartSlice.actions;

export default cartSlice.reducer;