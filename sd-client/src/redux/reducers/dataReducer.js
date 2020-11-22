import {
  CURRENT_SWIPE_HANDLE,
  ADD_NOTIFICATION,
  SET_PROFILE,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  SET_CARDS,
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
  cards: {
    tracks: false,
    profiles: [],
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CURRENT_SWIPE_HANDLE:
      return {
        ...state,
        handle: action.handle,
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
    case SET_CARDS:
      return {
        ...state,
        cards: { tracks: true, profiles: action.profiles },
      };
    default:
      return state;
  }
}
