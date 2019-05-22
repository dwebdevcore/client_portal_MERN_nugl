import * as ActionTypes from "./actionTypes";
import { firestore, storage, fieldValues } from "../firebase";

const getListingsSuccess = listings => {
  return {
    type: ActionTypes.GET_LISTINGS_SUCCESS,
    listings
  };
};

const addListingSuccess = listing => {
  return {
    type: ActionTypes.ADD_LISTING_SUCCESS,
    listing
  };
};

const publishListingSuccess = listing => {
  return {
    type: ActionTypes.PUBLISH_LISTING_SUCCESS,
    listing
  };
};

const uploadTempPhoto = (listingId, name, path) => {
  return {
    type: ActionTypes.UPLOAD_LISTING_TEMP_PHOTO,
    listingId,
    name,
    path
  };
};

const uploadPhotoSuccess = (listingId, name, path) => {
  return {
    type: ActionTypes.UPLOAD_LISTING_PHOTO_SUCCESS,
    listingId,
    name,
    path
  };
};

export const getListings = userId => {
  return dispatch => {
    return firestore
      .collection("listings")
      .where("userId", "==", userId)
      .get()
      .then(snapshot => {
        const listings = snapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id,
            logo: `${process.env.REACT_APP_IMGIX_HOST}/listings/${
              doc.id
            }/logo.jpg`,
            banner: `${process.env.REACT_APP_IMGIX_HOST}/listings/${
              doc.id
            }/banner.jpg`
          };
        });
        dispatch(getListingsSuccess(listings));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

export const addListing = listing => {
  return (dispatch, getState) => {
    const { user } = getState();
    const normalizedListing = {
      ...normalizeOnWrite(listing),
      userId: user.uid,
      createdOn: fieldValues.serverTimestamp()
    };
    return firestore
      .collection("listings")
      .doc(listing.id)
      .set(normalizedListing, { merge: true })
      .then(() => {
        const newListing = { ...normalizedListing, id: listing.id };
        dispatch(addListingSuccess(newListing));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

export const publishListing = (listing, publish) => {
  return (dispatch, getState) => {
    return firestore
      .collection("listings")
      .doc(listing.id)
      .set({ publish }, { merge: true })
      .then(() => {
        dispatch(publishListingSuccess({ ...listing, publish }));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

export const uploadPhoto = (listing, name, photo) => {
  return dispatch => {
    dispatch(uploadTempPhoto(listing.id, name, photo.dataUrl));
    return storage
      .ref()
      .child(`listings/${listing.id}/${photo.file.name}`)
      .put(photo.file)
      .then(snapshot => {
        const path = `${process.env.REACT_APP_IMGIX_HOST}/${
          snapshot.metadata.fullPath
        }`;
        dispatch(uploadPhotoSuccess(listing.id, name, path));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

const normalizeOnWrite = listing => {
  let newListing = { ...listing };
  delete newListing.id;
  delete newListing.createdOn;
  delete newListing.logo;
  delete newListing.banner;
  return newListing;
};
