import { CURRENT_SWITE_HANDLE } from "../types";
import axios from "axios";

export const setHandle = () => dispatch => {
  dispatch({ type: CURRENT_SWITE_HANDLE });
  axios
    .get("/")
    .then(result => {
      dispatch({
        type: SET_TROLLS,
        payload: result.data,
      });
    })
    .catch(err => {
      dispatch({
        type: SET_TROLLS,
        payload: [],
      });
    });
};
