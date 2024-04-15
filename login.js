// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

import {
  getDatabase,
  set,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

import {
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeJ3NX4DDi17tDgkS9MCKnQrNiNn6SPAI",
  authDomain: "spotify-e24b7.firebaseapp.com",
  databaseURL: "https://spotify-e24b7-default-rtdb.firebaseio.com",
  projectId: "spotify-e24b7",
  storageBucket: "spotify-e24b7.appspot.com",
  messagingSenderId: "19564928193",
  appId: "1:19564928193:web:362dabb5e133eec0174840",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);

let email = document.getElementById("mail");
let password = document.getElementById("password");
let name = document.getElementById("name");
let mainform = document.querySelector(".form");
let login = document.getElementById("submitLogin");
let signup = document.getElementById("submitSignup");

console.log(auth);
// window.firebaseAuth = auth;
// console.log(window.firebaseAuth);

let RegisterUser = (e) => {
  e.preventDefault();

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((credentials) => {
      console.log(credentials);
      alert("Congratulations SignUp is successful");
      set(ref(db, "UsersAuthList/" + credentials.user.uid), {
        // set(ref(db, "UsersAuthList/" + name.value), {
        Name: name.value,
      });
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });
};

let SignInUser = (e) => {
  e.preventDefault();

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((credentials) => {
      console.log(credentials);
      alert("Congratulations Login is successful");

      // window.open("../index.html", "_self");
      // get(child(dbref, "UsersAuthList/" + credentials.user.uid)).then(
      get(child(dbref, "UsersAuthList/" + credentials.user.uid)).then(
        (snapshot) => {
          // get(child(dbref, "UsersAuthList/" + name.value)).then((snapshot) => {
          console.log(snapshot);
          // console.log(sessionStorage);
          if (snapshot.exists) {
            sessionStorage.setItem(
              "user-info",
              JSON.stringify({
                Name: snapshot.val().name,
              })
            );
            sessionStorage.setItem(
              "user-creds",
              JSON.stringify(credentials.user)
            );
            window.location.href = "index.html";
            // window.open("index.html", "_self");
          }
        }
      );
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });
};

signup.addEventListener("click", RegisterUser);
login.addEventListener("click", SignInUser);
