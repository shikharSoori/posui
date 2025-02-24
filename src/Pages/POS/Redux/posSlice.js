import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getProduct } from "./thunk";
const initialState = {
  products: [],
  edit: false,
  product: null,
  count: null,
  next: null,
  previous: null,
  loading: false,
  loadingProduct: false,
};

export const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProduct.pending, (state) => {
      state.loadingProduct = true;
    });
    builder.addCase(getProduct.fulfilled, (state, { payload }) => {
      state.products = payload.data;
      state.loadingProduct = false;
      state.edit = false;
      state.count = payload.count;
      state.next = payload.next;
      state.previous = payload.previous;
    });
    builder.addCase(getProduct.rejected, (state) => {
      state.loadingProduct = false;
      state.edit = false;
    });
  },
});

export default posSlice.reducer;
