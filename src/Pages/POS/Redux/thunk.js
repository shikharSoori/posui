import { createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "./api";

export const getProduct = createAsyncThunk(
  "pos/getProduct",
  async (postsPerPage, { rejectWithValue }) => {
    try {
      const { data } = await API.getProduct(postsPerPage);
      return data;
    } catch (error) {
      return rejectWithValue("Failed to get Product.");
    }
  }
);

export const getAllProduct = createAsyncThunk(
  "pos/getAllProduct",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.getAllProduct();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to get AllProduct.");
    }
  }
);

export const createInvoice = createAsyncThunk(
  "pos/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const { data } = await API.createInvoice(invoiceData);
      return data;
    } catch (error) {
      return rejectWithValue("Failed to create invoice.");
    }
  }
);

export const getDayBook = createAsyncThunk(
  "pos/getDayBook",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.getDayBook();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to get Day Book.");
    }
  }
);
