import { CURRENT_SWIPE_HANDLE, CURRENT_USER } from "../types";

const initialState = {
  user: "",
  handle: "",
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CURRENT_SWIPE_HANDLE:
      return {
        ...state,
        handle: action.handle,
      };
    case CURRENT_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}
