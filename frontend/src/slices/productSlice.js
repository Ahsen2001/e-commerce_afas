import { createSlice } from "@reduxjs/toolkit";  // ✅ must import

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    product: {},
    error: null,
  },
  reducers: {
    productRequest: (state) => { state.loading = true; },
    productSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload.product;
    },
    productFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the reducer as default
export default productSlice.reducer;

// Export actions
export const { productRequest, productSuccess, productFail } = productSlice.actions;
