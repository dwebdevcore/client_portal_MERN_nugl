import * as ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState.profile, action) => {
  switch (action.type) {
    case ActionTypes.GET_PROFILE_SUCCESS:
    case ActionTypes.UPDATE_PROFILE_SUCCESS:
      return { ...action.profile };
    default:
      return state;
  }
};
