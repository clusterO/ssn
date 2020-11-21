import {
  CURRENT_SWIPE_HANDLE,
  CURRENT_USER,
  ADD_NOTIFICATION,
  SET_PROFILE,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
} from "../types";

const initialState = {
  user: "",
  handle: "",
  notifications: 0,
  loading: false,
  authenticated: false,
  profile: {
    display_name: "",
    id: "",
    email: "",
    href: "",
    country: "",
    images: [{ url: "" }],
    external_urls: { spotify: "" },
    followers: { total: null },
  },
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
    case SET_PROFILE:
      return {
        ...state,
        profile: { ...action.data },
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    default:
      return state;
  }
}
