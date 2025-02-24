import axios from "axios";
import { errorFunction } from "../Components/Alert/Alert";
import { authError } from "../Redux/Auth/authSlice";
import { store } from "../Store/store";
import deleteCookie from "./Cookies/deleteCookie";
import getCookie from "./Cookies/getCookie";
import setCookie from "./Cookies/setCookie";
import { generateSignature, MESSAGE } from "./getSignatureKey";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  appType: 1,
  deviceType: 2,
  // message: MESSAGE,
  // signature: generateSignature(),
});

export const publicAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  appType: 1,
  deviceType: 2,
});

// race condition login
let isRefreshing = false;
let subscribers = [];

function onTokenRefreshed(newToken) {
  subscribers.forEach((callback) => callback(newToken));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

const abortController = new AbortController();

axiosInstance.interceptors.request.use(
  (config) => {
    if (!window.navigator.onLine) {
      errorFunction(`No Internet Connection !!!`);
    } else if (window.navigator.onLine) {
      // get access token from cookie
      config.headers = {
        Authorization: getCookie("accessToken")
          ? `Bearer ${getCookie("accessToken")}`
          : "",
        // Message: MESSAGE,
        // Signature: generateSignature(),
      };

      config.baseURL =
        localStorage.getItem("url") !== null
          ? `http://${localStorage.getItem("url")}`
          : process.env.REACT_APP_BASE_URL;

      config.signal = abortController.signal;
      config.params = config.params || {};

      // Handle data transformation
      if (config.data !== undefined) {
        if (config.data instanceof FormData) {
          // Handle FormData
          config.data.append("appType", "1");
          config.data.append("deviceType", "2");
          // config.data.append("message", MESSAGE);
          // config.data.append("signature", generateSignature());
        } else if (typeof config.data === "object") {
          // Handle regular objects
          config.data = {
            ...config.data,
            appType: 1,
            deviceType: 2,
            // message: MESSAGE,
            // signature: generateSignature(),
          };
        } else if (typeof config.data === "string") {
          // Handle JSON strings
          let bodyData = JSON.parse(config.data);
          config.data = {
            ...bodyData,
            appType: 1,
            deviceType: 2,
            // message: MESSAGE,
            // signature: generateSignature(),
          };
        }
      }

      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response handling
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    //refresh token
    const originalRequest = error.config;

    //when refresh token is also not valid
    if (
      error.response.status === 401 &&
      originalRequest.url === `api/v1/user-app/generate-access-token`
    ) {
      store.dispatch(authError());
      return errorFunction(`Refresh Token Expired. Please Login.`);
    }

    //accessing new access token from refresh token
    else if (
      error.response?.data.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      //call for refresh token
      originalRequest._retry = true;
      // Check if another refresh token request is in progress
      if (isRefreshing) {
        // Add to subscribers and wait for the new token
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Call for refresh token
        const body = JSON.stringify({ refresh: getCookie("refreshToken") });
        deleteCookie("accessToken");
        const response = await axiosInstance.post(
          `api/v1/user-app/generate-access-token`,
          body
        );

        if (response.status === 200) {
          const newAccessToken = response.data.access;
          setCookie("accessToken", newAccessToken);

          // Notify all subscribers about the new token
          onTokenRefreshed(newAccessToken);

          // Update the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(authError());
        errorFunction(`Session expired. Please login again.`);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    //server down
    else if (error.message === "Network Error") {
      errorFunction("Internal Server Error. Contact IT manager !!!");
    } else if (error.response?.status === 500) {
      errorFunction("Internal Server Error. Contact IT manager !!!");
    } else if (error.response?.status === 403) {
      errorFunction("Permission Denied. Contact IT manager !!!");
    } else if (error.response?.status === 404) {
      errorFunction("Page Not Found !!!!!");
    }
    //unauthorized user
    else if (
      error.response?.status === 401 ||
      error.message === "Invalid token specified"
    ) {
      store.dispatch(authError());
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
