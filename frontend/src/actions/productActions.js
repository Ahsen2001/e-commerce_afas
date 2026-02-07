import axios from "axios";
import { productsRequest, productsSuccess, productsFail } from "../slices/productsSlice";
import { productRequest, productSuccess, productFail } from "../slices/productSlice";

export const getProducts =
  (keyword = "", price = [], category = null, rating = null, currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch(productsRequest());

      let link = `/api/v1/products?page=${currentPage}`;

      // keyword filter
      if (keyword) {
        link += `&keyword=${keyword}`;
      }

      // price range filter
      if (price.length === 2) {
        const minPrice = price[0].toString().replace(/,/g, "");
        const maxPrice = price[1].toString().replace(/,/g, "");

        link += `&price[gte]=${minPrice}&price[lte]=${maxPrice}`;
      }

      //  CATEGORY FILTER (NEW)
      if (category) {
        link += `&category=${category}`;
      }
      // RATING FILTER (NEW)
      if (rating) {
        link += `&ratings=${rating}`;
      }

      const { data } = await axios.get(link);

      dispatch(productsSuccess(data));
    } catch (error) {
      dispatch(productsFail(error.response?.data?.message || error.message));
    }
  };

 

// Action to get a single product by ID
export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());

    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch(productSuccess({ product: data.product }));
  } catch (error) {
    dispatch(productFail(error.response?.data?.message || error.message));
  }
};

