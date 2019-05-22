import { storage, auth } from "../firebase";

export const uploadPhoto = (listingId, file) =>
  storage
    .ref()
    .child(`listings/${listingId}/${file.name}`)
    .put(file)
    .then(snapshot => {
      return snapshot.metadata.fullPath;
    });

export const uploadProfilePhoto = file => {
  return storage
    .ref()
    .child(`users/${auth.currentUser.uid}/${file.name}`)
    .put(file)
    .then(snapshot => {
      return snapshot.downloadURL;
    });
};
