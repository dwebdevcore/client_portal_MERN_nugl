import * as ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";
import update from "immutability-helper";

export default (state = initialState.reviews, action) => {
  switch (action.type) {
    case ActionTypes.GET_REVIEWS_SUCCESS:
      return action.reviews;
    case ActionTypes.GET_REVIEW_SUCCESS:
      return action.review;
    case ActionTypes.ADD_REVIEW_SUCCESS:
      return [...state, action.review];
    default:
      return state;
  }
};
