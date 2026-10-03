import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    product: {},
    error: null,

    reviewLoading: false,
    isReviewSubmitted: false,

    newProductLoading: false,
    isProductCreated: false,

    updateProductLoading: false,
    isProductUpdated: false,
    isReviewDeleted: false,
    reviews: [],
  },

  reducers: {
    // ================= PRODUCT =================
    productRequest: (state) => {
      state.loading = true;
    },
    productSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload.product;
    },
    productFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= REVIEW =================
    createReviewRequest: (state) => {
      state.reviewLoading = true;
    },
    createReviewSuccess: (state) => {
      state.reviewLoading = false;
      state.isReviewSubmitted = true;
    },
    createReviewFail: (state, action) => {
      state.reviewLoading = false;
      state.error = action.payload;
    },
    clearReviewSubmitted: (state) => {
      state.isReviewSubmitted = false;
    },

    // ================= NEW PRODUCT =================
    newProductRequest: (state) => {
      state.newProductLoading = true;
    },
    newProductSuccess: (state, action) => {
      state.newProductLoading = false;
      state.isProductCreated = true;
      state.product = action.payload.product;
    },
    newProductFail: (state, action) => {
      state.newProductLoading = false;
      state.error = action.payload;
    },
    clearProductCreated: (state) => {
      state.isProductCreated = false;
    },

    // ================= UPDATE PRODUCT =================
    updateProductRequest: (state) => {
      state.updateProductLoading = true;
    },
    updateProductSuccess: (state, action) => {
      state.updateProductLoading = false;
      state.isProductUpdated = true;
      state.product = action.payload.product;
    },
    updateProductFail: (state, action) => {
      state.updateProductLoading = false;
      state.error = action.payload;
    },

    clearProductUpdated: (state) => {
      state.isProductUpdated = false;
    },
    // ================= REVIEW =================
    reviewsRequest: (state) => {
      state.loading = true;
    },
    reviewsSuccess: (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews;
    },
    reviewsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= REVIEW DELETE =================
    deleteReviewRequest: (state) => {
      state.loading = true;
    },
    deleteReviewSuccess: (state) => {
      state.loading = false;
      state.isReviewDeleted = true;
    },
    deleteReviewFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearReviewDeleted: (state) => {
      state.isReviewDeleted = false;
    },

    // ================= COMMON =================
    clearError: (state) => {
      state.error = null;
    },
  },
});

export default productSlice.reducer;

export const {
  productRequest,
  productSuccess,
  productFail,

  createReviewRequest,
  createReviewSuccess,
  createReviewFail,
  clearReviewSubmitted,

  newProductRequest,
  newProductSuccess,
  newProductFail,
  clearProductCreated,

  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  clearProductUpdated,

  reviewsRequest,
  reviewsSuccess,
  reviewsFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFail,
  clearReviewDeleted,
  clearError,
} = productSlice.actions;
