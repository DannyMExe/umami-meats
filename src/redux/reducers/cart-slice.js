import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    // Guest Cart Reducers
    addToCart: (state, action) => {
      let found = false;
      state.cart.map((obj, idx) => {
        if (obj.productId === action.payload.productId) {
          state.cart[idx].qty += action.payload.qty;
          found = true;
        }
      });
      !found && state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      console.log(action.payload);
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
    },
    clearCart: (state) => {
      state.cart = [];
    },
    // for logging out only
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice;
