import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDC56fL2VMXd6pSq4TiktVGWTyPrjWQGB8",
  authDomain: "otus-calendar.firebaseapp.com",
  databaseURL:
    "https://otus-calendar-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "otus-calendar",
  storageBucket: "otus-calendar.appspot.com",
  messagingSenderId: "567051909980",
  appId: "1:567051909980:web:20b3cca545d2fee0b85f99",
  measurementId: "G-6GH5N0BGSK",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const database = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("logged in");
  }
  console.log("no user");
});
