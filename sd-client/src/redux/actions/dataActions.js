import { CURRENT_SWIPE_HANDLE, CURRENT_USER, ADD_NOTIFICATION } from "../types";

export const setHandle = identifier => dispatch => {
  dispatch({ type: CURRENT_SWIPE_HANDLE, handle: identifier });
};

export const setUser = identifier => dispatch => {
  dispatch({ type: CURRENT_USER, user: identifier });
};

export const addNotification = () => dispatch => {
  dispatch({ type: ADD_NOTIFICATION });
};
