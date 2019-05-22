import * as ActionTypes from "./actionTypes";
import { firestore } from "../firebase";

const getProfileSuccess = profile => {
  return {
    type: ActionTypes.GET_PROFILE_SUCCESS,
    profile
  };
};

const updateProfileSuccess = profile => {
  return {
    type: ActionTypes.UPDATE_PROFILE_SUCCESS,
    profile
  };
};

export const getProfile = uid => {
  return dispatch => {
    const profileRef = firestore.collection("profiles").doc(uid);
    return profileRef
      .get()
      .then(doc => {
        let profile = {};
        if (!doc.exists) {
          console.log("Profile does not exist for user.", uid);
        } else {
          profile = doc.data();
        }
        return dispatch(getProfileSuccess(profile));
      })
      .catch(error => {
        debugger;
      });
  };
};

export const updateProfile = (uid, profile) => {
  return dispatch => {
    const profileRef = firestore.collection("profiles").doc(uid);
    return profileRef
      .set(profile, { merge: true })
      .then(() => {
        return dispatch(updateProfileSuccess(profile));
      })
      .catch(error => {});
  };
};
