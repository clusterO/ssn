import {
  CURRENT_SWIPE_HANDLE,
  ADD_NOTIFICATION,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  SET_PROFILE,
  SET_CARDS,
} from "../types";
import dayjs from "dayjs";
import store from "../store";

import axios from "axios";

export const setHandle = identifier => dispatch => {
  dispatch({ type: CURRENT_SWIPE_HANDLE, handle: identifier });
};

export const setProfile = () => dispatch => {
  axios
    .get("/me", { params: { token: localStorage.getItem("accessToken") } })
    .then(body => {
      if (body.data.error.status === 401) refreshToken();

      store.dispatch({
        type: SET_PROFILE,
        data: { ...body.data },
      });

      localStorage.setItem("user", body.data.display_name);
    })
    .catch(err => console.error(err));
};

export const addNotification = () => dispatch => {
  dispatch({ type: ADD_NOTIFICATION });
};

export const userLogout = () => dispatch => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expireTime");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const initializeAccess = accessToken => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("expireTime", dayjs(Date.now()).add(1, "hour"));
  axios.defaults.headers.common["authorization"] = accessToken;
  store.dispatch({ type: SET_AUTHENTICATED });
};

export const getUserDetails = () => dispatch => {
  axios
    .post("/profile", { handle: localStorage.getItem("user") })
    .then(res => {
      const profiles = [];
      if (res.data && res.data?.matchs)
        res.data.matchs.forEach(match => {
          profiles.push({
            name: match.display_name,
            url: match.images[0].url,
          });
        });

      dispatch({ type: SET_CARDS, profiles: [...profiles] });
      dispatch({
        type: CURRENT_SWIPE_HANDLE,
        handle: profiles[profiles.length - 1].name,
      });
    })
    .catch(err => console.error(err));
};

const refreshToken = () => {
  axios
    .get("/refresh", {
      params: { refresh_token: localStorage.getItem("refreshToken") },
    })
    .then(res => {
      initializeAccess(res.data.access_token);
    })
    .catch(err => {
      console.error(err);
    });
};
