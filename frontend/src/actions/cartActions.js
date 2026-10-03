import axios from "axios";
import {
  addCartItemRequest,
  addCartItemSuccess,
} from "../slices/cartSlice";

export const addCartItem = (id, quantity) => async (dispatch) => {
  try {
    dispatch(addCartItemRequest());

    const { data } = await axios.get(`/api/v1/product/${id}`);

    const product = data.product;

    dispatch(
      addCartItemSuccess({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.image || "",
        stock: product.stock,
        quantity,
      })
    );
  } catch (error) {
    console.error(
      "ADD CART ERROR:",
      error.response?.data || error.message
    );
  }
};