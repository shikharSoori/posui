import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import deleteCookie from "../../Utils/Cookies/deleteCookie";
import setCookie from "../../Utils/Cookies/setCookie";

const initialState = {
  isAuthenticated: false,
  loadingLogin: false,
  loadingLogout: false,
  userName: null,
  userId: "",
  authError: false,
  isSuperuser: true,
  permissions: [],
  loadingResetPassword: false,
  loadingChangePassword: false,
  message: [],
  photo: "",
  signature: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authError: (state) => {
      storage.removeItem("persist:root");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      state.isAuthenticated = false;
      state.loading = false;
      state.userName = null;
      state.authError = true;
      state.isSuperuser = false;
    },
    tokenRefreshSuccess: (state, action) => {
      setCookie("accessToken", action.payload, {
        "max-age": 360000,
      });
      state.authError = false;
    },
    loginSuccess: (state, action) => {
      const permissions = action.payload.permissions;
      const userPermissions = permissions?.map((permission) => {
        return permission?.codeName;
      });
      setCookie("accessToken", action.payload.access, {
        "max-age": 1800,
      });
      setCookie("refreshToken", action.payload.refresh, {
        "max-age": 86400, // 24 hours
      });
      state.isAuthenticated = true;
      state.userName = action.payload.userName;
      state.loadingLogin = false;
      state.authError = false;
      state.userId = action.payload.id;
      state.isSuperuser = action.payload.isSuperuser;
      state.permissions = userPermissions;
      state.photo = action.payload.photo;
    },
    logoutSuccess: (state, action) => {
      storage.removeItem("persist:root");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      state.isAuthenticated = false;
      state.loadingLogout = false;
      state.userName = null;
      state.userId = null;
      state.authError = false;
      state.isSuperuser = false;
      state.permissions = [];
      state.groups = [];
      state.img = null;
    },
    forgetPassword: (state, action) => {
      state.loadingResetPassword = false;
      state.message = action.payload;
      state.authError = false;
    },
    resetPassword: (state, action) => {
      state.authError = false;
      state.loadingResetPassword = false;
    },
  },
});

const { actions, reducer } = authSlice;
export const {
  authError,
  loginSuccess,
  logoutSuccess,
  tokenRefreshSuccess,
  forgetPassword,
  resetPassword,
} = actions;
export default reducer;
