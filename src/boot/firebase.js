// import firebase
import * as firebase from "firebase";

// import firebase products
import "firebase/auth";
import "firebase/firestore";

// TEST ENVIRONMENT: firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB7PsUXk19VoEXPCnY0XOoLHYAyUVPZT8s",
//   authDomain: "al-ferdoos-school.firebaseapp.com",
//   databaseURL: "https://al-ferdoos-school.firebaseio.com",
//   projectId: "al-ferdoos-school",
//   storageBucket: "al-ferdoos-school.appspot.com",
//   messagingSenderId: "765477839813",
//   appId: "1:765477839813:web:7c5f17d521d9baf7f4e1ac",
//   measurementId: "G-ZW16G2T3G7",
// };

// LIVE ENVIRONMENT
const firebaseConfig = {
  apiKey: "AIzaSyBS7LJDMLFxMNcmVh_uTD_T98ltLWGBeQI",
  authDomain: "al-ferdoos-center.firebaseapp.com",
  databaseURL: "https://al-ferdoos-center.firebaseio.com",
  projectId: "al-ferdoos-center",
  storageBucket: "al-ferdoos-center.appspot.com",
  messagingSenderId: "696207748909",
  appId: "1:696207748909:web:1390528609e9f9cb67ada4",
  measurementId: "G-VG1J1322XG"
};

// initialize firbase
let FirebaseApp = firebase.initializeApp(firebaseConfig);
let FirebaseAnalytics = firebase.analytics();
let FirebaseAuth = FirebaseApp.auth();
let FirebaseDatabase = FirebaseApp.firestore();
let FirebaseStorage = FirebaseApp.storage();

// export firebase modules
export {
  FirebaseApp,
  FirebaseAnalytics,
  FirebaseAuth,
  FirebaseDatabase,
  FirebaseStorage,
};
