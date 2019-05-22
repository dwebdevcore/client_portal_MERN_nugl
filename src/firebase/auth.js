import firebase from "firebase";
import { auth } from "../firebase";

export const createUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

export const signInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const signOut = () => auth.signOut();

export const sendPasswordResetEmail = email =>
  auth.sendPasswordResetEmail(email);

export const sendEmailVerification = () => {
  auth.currentUser().sendEmailVerification();
};

export const reauthenticateUserWithEmailAndPassword = (email, password) => {
  const credential = new firebase.auth.EmailAuthProvider(email, password);
  return auth.currentUser.reauthenticateWithCredential(credential);
};

export const updatePassword = password =>
  auth.currentUser.updatePassword(password);
