import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  dabaseURL: "https://spotify-31e91-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings); //connecting our project with fireBase
const database = getDatabase(app);
