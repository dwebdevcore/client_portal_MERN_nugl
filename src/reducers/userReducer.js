import * as ActionTypes from "../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState.user, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER:
    case ActionTypes.SIGN_IN_SUCCESS:
    case ActionTypes.SIGN_UP_SUCCESS:
      const {
        user: { displayName, email, phoneNumber, photoURL, uid }
      } = action;
      return {
        ...state,
        authenticated: true,
        displayName,
        email,
        phoneNumber,
        photoURL,
        uid
      };
    case ActionTypes.SIGN_OUT_SUCCESS: {
      return null;
    }
    case ActionTypes.UPDATE_USER_PROFILE_PHOTO_URL_TEMP:
    case ActionTypes.UPDATE_USER_PROFILE_PHOTO_URL_SUCCESS: {
      return { ...state, photoURL: action.photoUrl };
    }
    default:
      return state;
  }
};
