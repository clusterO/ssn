import { CURRENT_SWIPE_HANDLE } from "../types";

export const setHandle = identifier => dispatch => {
  dispatch({ type: CURRENT_SWIPE_HANDLE, handle: identifier });
};

export const setUser = identifier => dispatch => {
  dispatch({ type: CURRENT_SWIPE_HANDLE, user: identifier });
};
