import firebase from "firebase";
import "firebase/firestore";

const prodConfig = {
  apiKey: "AIzaSyAnXdObyhK8OEZA9UVAik9bUGv-vmwL0fA",
  authDomain: "nugl-da5c2.firebaseapp.com",
  databaseURL: "https://nugl-da5c2.firebaseio.com",
  projectId: "nugl-da5c2",
  storageBucket: "nugl-da5c2.appspot.com",
  messagingSenderId: "923391876732"
};

// var devConfig = {
//   apiKey: "AIzaSyC0G4bGCEqTYFSGjAqXY6zHnDsvY2-Zw2I",
//   authDomain: "nugl-dev.firebaseapp.com",
//   databaseURL: "https://nugl-dev.firebaseio.com",
//   projectId: "nugl-dev",
//   storageBucket: "nugl-dev.appspot.com",
//   messagingSenderId: "665233179786"
// };

// const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

var fire = firebase.initializeApp(prodConfig);

export const provider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();

export const firestore = firebase.firestore();

export const storage = firebase.storage();

export const types = {
  GeoPoint: firebase.firestore.GeoPoint
};

export const fieldValues = {
  serverTimestamp: firebase.firestore.FieldValue.serverTimestamp
};

export default fire;
