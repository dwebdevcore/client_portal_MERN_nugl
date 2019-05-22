import * as ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState.map, action) => {
  switch (action.type) {
    case ActionTypes.SET_CENTER_MAP_LOCATION:
      return { ...state, center: action.location, markerId: action.markerId };
    case ActionTypes.SET_CURRENT_LOCATION_SUCCESS:
      return {
        ...state,
        currentLocation: action.location,
        center: action.location
      };
    default:
      return state;
  }
};
