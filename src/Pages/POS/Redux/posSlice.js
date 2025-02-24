import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createInvoice, getDayBook, getProduct } from "./thunk";
const initialState = {
  products: [],
  edit: false,
  product: null,
  count: null,
  next: null,
  previous: null,
  loading: false,
  loadingProduct: false,
  invoices: [],
  invoice: null,
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
    builder.addCase(createInvoice.pending, (state) => {
      state.loadingInvoice = true;
    });
    builder.addCase(createInvoice.fulfilled, (state, { payload }) => {
      state.loadingInvoice = false;
      state.edit = false;
    });
    builder.addCase(createInvoice.rejected, (state) => {
      state.loadingInvoice = false;
      state.edit = false;
    });
    builder.addCase(getDayBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDayBook.fulfilled, (state, { payload }) => {
      state.invoices = payload.data;
      state.loading = false;
      state.edit = false;
    });
    builder.addCase(getDayBook.rejected, (state) => {
      state.loading = false;
      state.edit = false;
    });
  },
});

export default posSlice.reducer;
