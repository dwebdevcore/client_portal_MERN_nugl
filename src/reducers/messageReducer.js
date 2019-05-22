import * as ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState.messages, action) => {
  switch (action.type) {
    case ActionTypes.SIGN_IN_ERROR:
    case ActionTypes.SIGN_UP_ERROR:
    case ActionTypes.UPDATE_USER_PROFILE_PHOTO_URL_ERROR:
    case ActionTypes.UPDATE_PASSWORD_ERROR:
    case ActionTypes.PUSH_MESSAGE:
      return [...state, action.message];
    case ActionTypes.POP_MESSAGE: {
      let messages = [...state];
      messages.shift();
      return messages;
    }
    default:
      return state;
  }
};
