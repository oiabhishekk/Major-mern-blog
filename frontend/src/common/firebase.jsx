// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtq1nzdsS0Tm66y-gqlWKF38yDDDP088E",
  authDomain: "blog-app-931ce.firebaseapp.com",
  projectId: "blog-app-931ce",
  storageBucket: "blog-app-931ce.appspot.com",
  messagingSenderId: "901138051070",
  appId: "1:901138051070:web:fb23c0e1406fd7e656daaf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//googel auth
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user
      console.log(user)
    })
    .catch((err) => {
      console.log(err);
    });
  return user;
};
