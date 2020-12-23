import {
  SWIPED_CARD_HANDLE,
  ADD_NOTIFICATION,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  SET_PROFILE,
  SET_CARDS,
  SWIPE_PROFILE,
} from "../types";
import dayjs from "dayjs";
import axios from "axios";

export const setHandle = (identifier) => (dispatch) => {
  dispatch({ type: SWIPED_CARD_HANDLE, handle: identifier });
};

export const swipeProfile = () => (dispatch) => {
  dispatch({ type: SWIPE_PROFILE });
};

export const setProfile = () => (dispatch) => {
  axios
    .get("/me", { params: { token: localStorage.getItem("accessToken") } })
    .then((body) => {
      if (
        body.data.error &&
        body.data.error.status === 401 &&
        localStorage.getItem("refreshToken")
      )
        dispatch(refreshToken());

      dispatch({
        type: SET_PROFILE,
        data: { ...body.data },
      });

      localStorage.setItem("user", body.data.display_name);
    })
    .catch((err) => console.error(err));
};

export const addNotification = () => (dispatch) => {
  dispatch({ type: ADD_NOTIFICATION, length: 1 });
};

export const userLogout = () => (dispatch) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expireTime");
  localStorage.removeItem("user");
  localStorage.removeItem("id");

  delete axios.defaults.headers.common["authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserDetails = () => (dispatch) => {
  axios
    .post("/profile", { handle: localStorage.getItem("user") })
    .then((res) => {
      const profiles = [];
      if (res.data && res.data?.matchs)
        res.data.matchs.forEach((match) => {
          profiles.push({
            name: match.display_name,
            url: match.images[0].url,
          });
        });

      dispatch({ type: SET_CARDS, profiles: [...profiles] });
      dispatch({
        type: SWIPED_CARD_HANDLE,
        handle: profiles[profiles.length - 1].name,
      });
    })
    .catch((err) => console.error(err));
};

const refreshToken = () => (dispatch) => {
  axios
    .get("/refresh", {
      params: { refresh_token: localStorage.getItem("refreshToken") },
    })
    .then((res) => {
      // DRY it
      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("expireTime", dayjs(Date.now()).add(1, "hour"));
      axios.defaults.headers.common["authorization"] = res.data.access_token;
      dispatch({ type: SET_AUTHENTICATED });
      window.location.href = "/";
    })
    .catch((err) => {
      console.error(err);
    });
};
