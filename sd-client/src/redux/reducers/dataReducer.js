import { CURRENT_SWIPE_HANDLE } from "../types";

const initialState = {
  handle: "",
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CURRENT_SWIPE_HANDLE:
      return {
        ...state,
        handle: action.handle,
        loading: true,
      };
    default:
      return state;
  }
}
