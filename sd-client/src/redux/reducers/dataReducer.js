import { CURRENT_SWITE_HANDLE } from "../types";

const initialState = {
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CURRENT_SWITE_HANDLE:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
