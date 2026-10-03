import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderDetail: {}, userOrders: [], adminOrders: [],
    loading: false, isOrderDeleted: false, isOrderUpdated: false, error: null,
  },
  reducers: {
    createOrderRequest:  (state) => { state.loading = true; },
    createOrderSuccess:  (state, action) => { state.loading = false; state.orderDetail = action.payload.order; },
    createOrderFail:     (state, action) => { state.loading = false; state.error = action.payload; },

    userOrdersRequest:   (state) => { state.loading = true; },
    userOrdersSuccess:   (state, action) => { state.loading = false; state.userOrders = action.payload.orders; },
    userOrdersFail:      (state, action) => { state.loading = false; state.error = action.payload; },

    orderDetailRequest:  (state) => { state.loading = true; },
    orderDetailSuccess:  (state, action) => { state.loading = false; state.orderDetail = action.payload.order; },
    orderDetailFail:     (state, action) => { state.loading = false; state.error = action.payload; },

    adminOrdersRequest:  (state) => { state.loading = true; },
    adminOrdersSuccess:  (state, action) => { state.loading = false; state.adminOrders = action.payload.orders; },
    adminOrdersFail:     (state, action) => { state.loading = false; state.error = action.payload; },

    deleteOrderRequest:  (state) => { state.loading = true; },
    deleteOrderSuccess:  (state) => { state.loading = false; state.isOrderDeleted = true; },
    deleteOrderFail:     (state, action) => { state.loading = false; state.error = action.payload; },
    clearOrderDeleted:   (state) => { state.isOrderDeleted = false; },

    updateOrderRequest:  (state) => { state.loading = true; },
    updateOrderSuccess:  (state) => { state.loading = false; state.isOrderUpdated = true; },
    updateOrderFail:     (state, action) => { state.loading = false; state.error = action.payload; },
    clearOrderUpdated:   (state) => { state.isOrderUpdated = false; },

    clearError:          (state) => { state.error = null; },
  },
});

export const {
  createOrderRequest, createOrderSuccess, createOrderFail,
  userOrdersRequest, userOrdersSuccess, userOrdersFail,
  orderDetailRequest, orderDetailSuccess, orderDetailFail,
  adminOrdersRequest, adminOrdersSuccess, adminOrdersFail,
  deleteOrderRequest, deleteOrderSuccess, deleteOrderFail, clearOrderDeleted,
  updateOrderRequest, updateOrderSuccess, updateOrderFail, clearOrderUpdated,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;