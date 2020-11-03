import { CURRENT_SWIPE_HANDLE, CURRENT_USER, ADD_NOTIFICATION } from "../types";

const initialState = {
  user: "",
  handle: "",
  notifications: 0,
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
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications + 1,
      };
    default:
      return state;
  }
}
