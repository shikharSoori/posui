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
