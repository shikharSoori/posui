import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorFunction, successFunction } from "../../Components/Alert/Alert";
import getCookie from "../../Utils/Cookies/getCookie";
import * as API from "./api";
import { loginSuccess, logoutSuccess } from "./authSlice";

// verify-signature
export const verifySignature = createAsyncThunk("auth/verifySignature", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.verifySignature(body);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.detail);
  }
});

// login
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await API.login(credentials);
    dispatch(loginSuccess(data));
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// logout
export const logout = createAsyncThunk("auth/logout", async (token, { rejectWithValue, dispatch }) => {
  try {
    const body = JSON.stringify({ refresh: token });
    await API.logout(body);
    dispatch(logoutSuccess());
    return;
  } catch (error) {
    return rejectWithValue(error.response.data.detail);
  }
});

// change password
export const changePassword = createAsyncThunk("auth/changePassword", async (values, { rejectWithValue, dispatch }) => {
  const { id, password, oldPassword, confirmPassword, history } = values;
  try {
    const token = getCookie("refreshToken");
    const body = JSON.stringify({ password, oldPassword, confirmPassword });
    const { data } = await API.changePassword(id, body);
    if (data) {
      await dispatch(logout(token));
      history.push("/");
      return;
    }
  } catch (error) {
    return rejectWithValue("Failed to change password.");
  }
});

// forget password
export const forgetPassword = createAsyncThunk("auth/forgetPassword", async (email, { rejectWithValue }) => {
  try {
    const body = JSON.stringify({ email: email });
    const { data } = await API.forgetPassword(body);
    successFunction("Check your email and click on the link to reset your Password.");

    return data;
  } catch (error) {
    errorFunction(`There is no active user associated with this e-mail address. Password can not be changed `);
    return rejectWithValue("Failed to reset password.");
  }
});
// reset password
export const resetPassword = createAsyncThunk("auth/resetPassword", async (value, { rejectWithValue }) => {
  const { password, history } = value;
  try {
    const body = JSON.stringify({ password });
    const { data } = await API.resetPassword(body);
    history.push("/");
    successFunction("Password Changed");
    return data;
  } catch (error) {
    errorFunction(`Password confirmation failed. `);
    return rejectWithValue("Failed to reset password.");
  }
});
