import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Redux/Auth/authSlice";
import alertReducer from "../Redux/Alert/alertSlice";
import layoutReducer from "../Redux/Layout/layoutSlice";
import { posSlice } from "../Pages/POS/Redux/posSlice";
import posReducer from "../Pages/POS/Redux/posSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  alert: alertReducer,
  pos: posReducer,
});

export default rootReducer;
