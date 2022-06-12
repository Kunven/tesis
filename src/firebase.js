/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeyl0azn0DOxSWRMYzfg1VqB5bfeAc2aM",
  authDomain: "tesis-usm.firebaseapp.com",
  projectId: "tesis-usm",
  storageBucket: "tesis-usm.appspot.com",
  messagingSenderId: "698274582452",
  appId: "1:698274582452:web:2eaa5d9a25ed265e18ece1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

  export { auth };
