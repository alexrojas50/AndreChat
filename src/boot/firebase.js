import { boot } from 'quasar/wrappers'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6BrqdqHgP7dlAer-NMi3qcVmd_1thWQY",
  authDomain: "firechat-1b3ec.firebaseapp.com",
  projectId: "firechat-1b3ec",
  storageBucket: "firechat-1b3ec.appspot.com",
  messagingSenderId: "319647580118",
  appId: "1:319647580118:web:c34b463a422a28fc68ee77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const timeStamp = serverTimestamp()

export { app, db, auth, timeStamp }
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
})
