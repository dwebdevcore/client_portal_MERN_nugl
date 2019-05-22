import * as ActionTypes from "./actionTypes";
import { firestore, storage, fieldValues } from "../firebase";

const getBrandsSuccess = brands => {
  return {
    type: ActionTypes.GET_BRANDS_SUCCESS,
    brands
  };
};

const addBrandSuccess = brand => {
  return {
    type: ActionTypes.ADD_BRAND_SUCCESS,
    brand
  };
};

const publishBrandSuccess = brand => {
  return {
    type: ActionTypes.PUBLISH_BRAND_SUCCESS,
    brand
  };
};

const uploadTempPhoto = (brandId, name, path) => {
  return {
    type: ActionTypes.UPLOAD_BRAND_TEMP_PHOTO,
    brandId,
    name,
    path
  };
};

const uploadPhotoSuccess = (brandId, name, path) => {
  return {
    type: ActionTypes.UPLOAD_BRAND_PHOTO_SUCCESS,
    brandId,
    name,
    path
  };
};

export const getBrands = userId => {
  return dispatch => {
    return firestore
      .collection("brands")
      .where("userId", "==", userId)
      .get()
      .then(snapshot => {
        const brands = snapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id,
            logo: `${process.env.REACT_APP_IMGIX_HOST}/brands/${
              doc.id
            }/logo.jpg`,
            banner: `${process.env.REACT_APP_IMGIX_HOST}/brands/${
              doc.id
            }/banner.jpg`
          };
        });
        dispatch(getBrandsSuccess(brands));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

export const addBrand = brand => {
  return (dispatch, getState) => {
    const { user } = getState();
    const normalizedBrand = {
      ...normalizeOnWrite(brand),
      userId: user.uid,
      createdOn: fieldValues.serverTimestamp()
    };
    return firestore
      .collection("brands")
      .doc(brand.id)
      .set(normalizedBrand, { merge: true })
      .then(() => {
        const newBrand = { ...normalizedBrand, id: brand.id };
        dispatch(addBrandSuccess(newBrand));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

export const publishBrand = (brand, publish) => {
  return (dispatch, getState) => {
    return firestore
      .collection("brands")
      .doc(brand.id)
      .set({ publish }, { merge: true })
      .then(() => {
        dispatch(publishBrandSuccess({ ...brand, publish }));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

export const uploadPhoto = (brand, name, photo) => {
  return dispatch => {
    dispatch(uploadTempPhoto(brand.id, name, photo.dataUrl));
    return storage
      .ref()
      .child(`brands/${brand.id}/${photo.file.name}`)
      .put(photo.file)
      .then(snapshot => {
        const path = `${process.env.REACT_APP_IMGIX_HOST}/${
          snapshot.metadata.fullPath
        }`;
        dispatch(uploadPhotoSuccess(brand.id, name, path));
      })
      .catch(error => {
        // TODO: dispatch error
      });
  };
};

const normalizeOnWrite = brand => {
  let newBrand = { ...brand };
  delete newBrand.id;
  delete newBrand.createdOn;
  delete newBrand.logo;
  delete newBrand.banner;
  return newBrand;
};
