import * as ActionTypes from "./actionTypes";
import { firestore, fieldValues } from "../firebase";

const getReviewsSuccess = listings => {
  return {
    type: ActionTypes.GET_REVIEWS_SUCCESS,
    listings
  };
};

const addReviewSuccess = listing => {
  return {
    type: ActionTypes.ADD_REVIEW_SUCCESS,
    listing
  };
};

const addReviewError = () => {
  return {
    type: ActionTypes.ADD_REVIEW_ERROR
  };
};

export const getReviews = listingId => {
  return dispatch => {
    return firestore
      .collection("reviews")
      .where("listingId", "==", listingId)
      .get()
      .then(snapshot => {
        const reviews = snapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          };
        });
        dispatch(getReviewsSuccess(reviews));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

export const addReview = (listingId, review) => {
  return (dispatch, getState) => {
    const { user, profile } = getState();
    const normalizedReview = {
      listingId,
      userId: user.uid,
      userDisplayName: profile.displayName,
      ...normalizeOnWrite(review),
      createdOn: fieldValues.serverTimestamp()
    };
    return firestore
      .collection("reviews")
      .where("userId", "==", user.uid)
      .where("listingId", "==", listingId)
      .get()
      .then(snapshot => {
        const exists = snapshot.docs.length > 0;
        if (exists) {
          dispatch(addReviewError());
          return Promise.reject({
            code: "ALREADY_REVIEWED"
          });
        }
        return firestore
          .collection("reviews")
          .add(normalizedReview)
          .then(ref => {
            const newReview = { ...normalizedReview, id: ref.id };
            dispatch(addReviewSuccess(newReview));
          });
      });
  };
};

const normalizeOnWrite = review => {
  let newReview = { ...review };
  delete newReview.id;
  return newReview;
};
