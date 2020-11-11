import {
  CURRENT_SWIPE_HANDLE,
  CURRENT_USER,
  ADD_NOTIFICATION,
  SET_PROFILE,
} from "../types";

const initialState = {
  user: "",
  handle: "",
  notifications: 0,
  loading: false,
  loggedIn: false,
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
        loggedIn: true,
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications + 1,
      };
    case SET_PROFILE:
      return {
        ...state,
        loggedIn: action.token ? true : false,
        profile: { ...action.data },
      };
    default:
      return state;
  }
}
