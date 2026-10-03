import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    products: [],
    productsCount: 0,
    resPerPage: 0,
    filteredProductsCount: 0,
    error: null,
    isProductDeleted: false,
  },
  reducers: {
    productsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.productsCount = action.payload.productsCount;
      state.resPerPage = action.payload.resPerPage;
      state.filteredProductsCount = action.payload.filteredProductsCount;
    },
    productsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    adminProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    },
    adminProductsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteProductRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      state.isProductDeleted = action.payload;
    },
    deleteProductFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProductDeleted: (state) => {
      state.isProductDeleted = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  productsRequest,
  productsSuccess,
  productsFail,
  adminProductsRequest,
  adminProductsSuccess,
  adminProductsFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  clearProductDeleted,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
