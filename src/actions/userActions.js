import * as ActionTypes from "./actionTypes";
import MessageTypes from "../const/MessageTypes";
import firebase from "firebase";
import { auth, provider } from "../firebase";
import * as storage from "../firebase/storage";

const signInSuccess = user => {
  return {
    type: ActionTypes.SIGN_IN_SUCCESS,
    user
  };
};

const signInError = message => {
  return {
    type: ActionTypes.SIGN_IN_ERROR,
    message: { type: MessageTypes.ERROR, text: message }
  };
};

const signUpSuccess = user => {
  return {
    type: ActionTypes.SIGN_UP_SUCCESS,
    user
  };
};

const signUpError = message => {
  return {
    type: ActionTypes.SIGN_UP_ERROR,
    message: { type: MessageTypes.ERROR, text: message }
  };
};

const signOutSuccess = user => {
  return {
    type: ActionTypes.SIGN_OUT_SUCCESS,
    user: null
  };
};

const sendPasswordResetEmailSuccess = () => {
  return {
    type: ActionTypes.SEND_PASSWORD_RESET_EMAIL_SUCCESS
  };
};

const sendEmailVerificationSuccess = () => {
  return {
    type: ActionTypes.SEND_EMAIL_VERIFICATION_SUCCESS
  };
};

const updatePasswordSuccess = () => {
  return {
    type: ActionTypes.UPDATE_PASSWORD_SUCCESS
  };
};

const updatePasswordError = message => {
  return {
    type: ActionTypes.UPDATE_PASSWORD_ERROR,
    message: { type: MessageTypes.ERROR, text: message }
  };
};

const updateProfileImageSuccess = photoUrl => {
  return {
    type: ActionTypes.UPDATE_USER_PROFILE_PHOTO_URL_SUCCESS,
    photoUrl
  };
};

const updateProfileImageError = message => {
  return {
    type: ActionTypes.UPDATE_USER_PROFILE_PHOTO_URL_SUCCESS,
    message: { type: MessageTypes.ERROR, text: message }
  };
};

export const updateUser = user => {
  return {
    type: ActionTypes.UPDATE_USER,
    user
  };
};

export const signIn = (email, password) => {
  return dispatch => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(signInSuccess(user));
      })
      .catch(error => {
        switch (error.code) {
          case "auth/wrong-password":
            dispatch(signInError("Username and password is incorrect."));
            throw new Error("Username and password is incorrect.");
          case "auth/too-many-requests":
            dispatch(signInError("Too many failed login attempts."));
            throw new Error("Too many failed login attempts.");
          default:
            dispatch(signInError("Username and password is incorrect."));
            throw new Error("Unknown error trying to sign in.");
        }
      });
  };
};

export const signInWithProvider = () => {
  return dispatch => {
    return auth
      .signInWithPopup(provider)
      .then(user => {
        dispatch(signInSuccess(user));
      })
      .catch(error => {});
  };
};

export const signOut = () => {
  return dispatch => {
    return auth.signOut().then(result => {
      dispatch(signOutSuccess());
    });
  };
};

export const signUp = (email, password) => {
  return dispatch => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(signUpSuccess(user));
      })
      .catch(error => {
        switch (error.code) {
          case "auth/email-already-in-use":
            dispatch(signUpError("Email address is already in use."));
            throw new Error("Email address is already in use.");
          default:
            throw new Error("Unknown error trying to create your account.");
        }
      });
  };
};

export const updateProfileImageTempUrl = photoUrl => {
  return {
    type: ActionTypes.UPDATE_USER_PROFILE_PHOTO_URL_TEMP,
    photoUrl
  };
};

export const sendPasswordResetEmail = email => {
  return dispatch => {
    return auth.sendPasswordResetEmail(email).then(result => {
      dispatch(sendPasswordResetEmailSuccess());
    });
  };
};

export const sendEmailVerification = () => {
  return dispatch => {
    return auth.currentUser.sendEmailVerification().then(result => {
      dispatch(sendEmailVerificationSuccess());
    });
  };
};

export const updateProfileImage = (file, dataUrl) => {
  return dispatch => {
    dispatch(updateProfileImageTempUrl(dataUrl));
    return storage
      .uploadProfilePhoto(file)
      .then(photoUrl => {
        return auth.currentUser
          .updateProfile({ photoURL: photoUrl })
          .then(() => {
            dispatch(updateProfileImageSuccess(photoUrl));
          })
          .catch(error => {
            dispatch(
              updateProfileImageError("Failed to update profile photo.")
            );
          });
      })
      .catch(error => {
        dispatch(updateProfileImageError("Failed to save photo."));
      });
  };
};

export const updatePassword = (currentPassword, newPassword) => {
  return dispatch => {
    const credential = firebase.auth.EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    return auth.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        return auth.currentUser
          .updatePassword(newPassword)
          .then(() => {
            dispatch(updatePasswordSuccess());
          })
          .catch(error => {
            dispatch(
              updatePasswordError(
                "Failed to update password. Please re-authenticate."
              )
            );
          });
      })
      .catch(error => {
        console.log(error);
        dispatch(updatePasswordError("Failed to update password."));
      });
  };
};
