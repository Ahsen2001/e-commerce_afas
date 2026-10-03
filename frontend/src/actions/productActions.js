import axios from "axios";
import {
  productsRequest,
  productsSuccess,
  productsFail,
  adminProductsRequest,
  adminProductsSuccess,
  adminProductsFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
} from "../slices/productsSlice";

import {
  productRequest,
  productSuccess,
  productFail,
  createReviewRequest,
  createReviewSuccess,
  createReviewFail,
  newProductRequest,
  newProductSuccess,
  newProductFail,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  reviewsRequest,
  reviewsSuccess,
  reviewsFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  deleteReviewFail,
} from "../slices/productSlice";

// ================= GET PRODUCTS =================
export const getProducts =
  (keyword = "", price = [], category = null, rating = null, currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch(productsRequest());

      let link = `/api/v1/products?page=${currentPage}`;

      if (keyword) link += `&keyword=${keyword}`;

      if (price.length === 2) {
        const minPrice = price[0].toString().replace(/,/g, "");
        const maxPrice = price[1].toString().replace(/,/g, "");
        link += `&price[gte]=${minPrice}&price[lte]=${maxPrice}`;
      }

      if (category) link += `&category=${category}`;

      if (rating) link += `&ratings=${rating}`;

      const { data } = await axios.get(link);

      dispatch(
        productsSuccess({
          products: data.products,
          productsCount: data.productsCount,
          resPerPage: data.resPerPage,
          filteredProductsCount: data.filteredProductsCount,
        }),
      );
    } catch (error) {
      dispatch(productsFail(error.response?.data?.message || error.message));
    }
  };

// ================= GET SINGLE PRODUCT =================
export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch(productSuccess({ product: data.product }));
  } catch (error) {
    dispatch(productFail(error.response?.data?.message || error.message));
  }
};

// ================= CREATE REVIEW =================
export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    await axios.put("/api/v1/review", reviewData, config);

    dispatch(createReviewSuccess());
  } catch (error) {
    dispatch(createReviewFail(error.response?.data?.message || error.message));
  }
};

// ================= CREATE PRODUCT (FIXED) =================
export const createNewProduct = (formData) => async (dispatch) => {
  try {
    dispatch(newProductRequest());

    const { data } = await axios.post(
      "/api/v1/admin/product/new",
      formData
    );

    dispatch(newProductSuccess({ product: data.product }));
  } catch (error) {
    dispatch(
      newProductFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

// ================= ADMIN PRODUCTS =================
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch(adminProductsRequest());

    const { data } = await axios.get(`/api/v1/admin/products`);

    dispatch(
      adminProductsSuccess({
        products: data.products,
      }),
    );
  } catch (error) {
    dispatch(adminProductsFail(error.response?.data?.message || error.message));
  }
};

// ================= DELETE PRODUCT =================
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());

    const { data } = await axios.delete(`/api/v1/admin/product/${id}`);

    dispatch(deleteProductSuccess(data.success));
  } catch (error) {
    dispatch(deleteProductFail(error.response?.data?.message || error.message));
  }
};

// ================= UPDATE PRODUCT =================
export const updateProduct = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());

    const { data } = await axios.put(
      `/api/v1/admin/product/${id}`,
      formData
    );

    dispatch(updateProductSuccess({ product: data.product }));
  } catch (error) {
    dispatch(
      updateProductFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

// ================= GET REVIEWS =================
// fix in productActions.js
export const getReviews = (productId) => async (dispatch) => {
  try {
    dispatch(reviewsRequest());
    const { data } = await axios.get(`/api/v1/admin/reviews?id=${productId}`); 
    dispatch(reviewsSuccess(data));
  } catch (error) {
    dispatch(reviewsFail(error.response?.data?.message || error.message));
  }
};

// ================= DELETE REVIEW =================
export const deleteReview = (id, productId) => async (dispatch) => {
  try {
    dispatch(deleteReviewRequest());
    await axios.delete(`/api/v1/admin/reviews`, {
      params: { id, productId },
    });
    dispatch(deleteReviewSuccess());
  } catch (error) {
    dispatch(deleteReviewFail(error.response?.data?.message || error.message));
  }
};