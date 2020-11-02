import { CURRENT_SWIPE_HANDLE } from "../types";

export const setHandle = () => dispatch => {
  dispatch({ type: CURRENT_SWIPE_HANDLE });
};
