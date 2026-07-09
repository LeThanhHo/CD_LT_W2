import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../services/cartService";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await cartService.getCart();
  return res.data;
});

export const addToCart = createAsyncThunk("cart/addToCart", async (data) => {
  const res = await cartService.addItem(data);
  return res.data;
});

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }) => {
    const res = await cartService.updateItem(itemId, { quantity });
    return res.data;
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId) => {
    const res = await cartService.removeItem(itemId);
    return res.data;
  }
);

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    const applyCart = (state, action) => {
      state.items = action.payload.items || [];
      state.totalPrice = action.payload.totalPrice || 0;
      state.totalItems = action.payload.totalItems || 0;
      state.loading = false;
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, applyCart)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, applyCart)
      .addCase(updateCartItem.fulfilled, applyCart)
      .addCase(removeCartItem.fulfilled, applyCart);
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
