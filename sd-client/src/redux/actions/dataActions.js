import {
  CURRENT_SWIPE_HANDLE,
  CURRENT_USER,
  ADD_NOTIFICATION,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
} from "../types";
import dayjs from "dayjs";
import store from "../store";

import axios from "axios";

export const setHandle = identifier => dispatch => {
  dispatch({ type: CURRENT_SWIPE_HANDLE, handle: identifier });
};

export const setUser = identifier => dispatch => {
  dispatch({ type: CURRENT_USER, user: identifier });
};

export const addNotification = () => dispatch => {
  dispatch({ type: ADD_NOTIFICATION });
};

export const userLogout = () => dispatch => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expireTime");
  delete axios.defaults.headers.common["authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const initializeAccess = (accessToken, user) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("expireTime", dayjs(Date.now()).add(1, "hour"));

  axios.defaults.headers.common["authorization"] = accessToken;

  store.dispatch({ type: SET_AUTHENTICATED });
  store.dispatch({
    type: CURRENT_USER,
    user: user,
  });
};
