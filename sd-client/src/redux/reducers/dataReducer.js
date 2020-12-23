import {
  SWIPED_CARD_HANDLE,
  ADD_NOTIFICATION,
  SET_PROFILE,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  SET_CARDS,
  SWIPE_PROFILE,
  CLEAR_NOTIFICATION,
} from "../types";

const initialState = {
  user: "",
  handle: "",
  notifications: {
    length: 0,
    data: [],
  },
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
    case SWIPED_CARD_HANDLE:
      return {
        ...state,
        handle: action.handle,
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: {
          length: state.notifications.length + action.length,
          data: [...action.data, ...state.notifications.data],
        },
      };
    case CLEAR_NOTIFICATION:
      return {
        ...state,
        notifications: {
          length: 0,
          data: [],
        },
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
    case SWIPE_PROFILE:
      state.cards.profiles.pop();
      return {
        ...state,
        cards: { tracks: true, profiles: [...state.cards.profiles] },
        handle:
          state.cards.profiles.length > 0
            ? state.cards.profiles[state.cards.profiles.length - 1].name
            : "",
      };
    default:
      return state;
  }
}
