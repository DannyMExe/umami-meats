import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchCart = async (id) => {
  // const { data } = await axios.get(`/api/orders/${id}`);
  const {data} = await axios.get(`/api/users/${id}`)
  console.log("line 6", data);
  return data;
};

export const fetchCartThunk = createAsyncThunk(
  "fetchCart/handleFetchCart",
  async (id) => {
    try {
      const { data } = await fetchCart(id);
      console.log("line 15", data);
      return data;
    } catch (error) {
      throw new Error(Error);
    }
  }
);

const usersCartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    cartId: null,
  },
  reducers: {
    initializeCart: (state, action) => {
      console.log("initializing", action.payload);
      state.id = action.payload.id;
      state.cart = action.payload;
    },
    addToUsersCart: (state, action) => {
      console.log("adding item", action.payload);
      let found = false;
      state.cart.lineItems.map((obj, idx) => {
        if (obj?.productId === action.payload.newData.productId) {
          state.cart.lineItems[idx].qty += action.payload.num;
          found = true;
        }
      });
      !found && state.cart.lineItems.push(action.payload.newData);
    },
    removeFromUsersCart: (state, action) => {
      state.cart.lineItems = state.cart.lineItems.filter(
        (item) => item.productId !== action.payload
      );
    },
    clearUserCart: (state) => {
      state.cartId = null;
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartThunk.fulfilled, (state, action) => {
      console.log("inside reducer", action.payload);
      state.cartId = action.payload.id;
      state.cart = action.payload.order;
    });
  },
});

export const {
  initializeCart,
  addToUsersCart,
  removeFromUsersCart,
  clearUserCart,
} = usersCartSlice.actions;

export default usersCartSlice;
