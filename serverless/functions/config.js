const path = require("path");

// development envirnment
const DEV_FIREBASE_CONFIG = {
    apiKey: "AIzaSyB7PsUXk19VoEXPCnY0XOoLHYAyUVPZT8s",
    authDomain: "al-ferdoos-school.firebaseapp.com",
    databaseURL: "https://al-ferdoos-school.firebaseio.com",
    projectId: "al-ferdoos-school",
    storageBucket: "al-ferdoos-school.appspot.com",
    messagingSenderId: "765477839813",
    appId: "1:765477839813:web:7c5f17d521d9baf7f4e1ac",
    measurementId: "G-ZW16G2T3G7",
};
const DEV_ADMIN_CONFIG = require(path.join(__dirname, "dev_service_account_key"));
const DEV_DATABASE_URL = "https://al-ferdoos-school.firebaseio.com";

// production envirnment
const PROD_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBS7LJDMLFxMNcmVh_uTD_T98ltLWGBeQI",
    authDomain: "al-ferdoos-center.firebaseapp.com",
    databaseURL: "https://al-ferdoos-center.firebaseio.com",
    projectId: "al-ferdoos-center",
    storageBucket: "al-ferdoos-center.appspot.com",
    messagingSenderId: "696207748909",
    appId: "1:696207748909:web:1390528609e9f9cb67ada4",
    measurementId: "G-VG1J1322XG"
};
const PROD_ADMIN_CONFIG = require(path.join(__dirname, "prod_service_account_key"));
const PROD_DATABASE_CONFIG = "https://al-ferdoos-center.firebaseio.com";

module.exports = {
    DEV_FIREBASE_CONFIG,
    DEV_ADMIN_CONFIG,
    DEV_DATABASE_URL,
    PROD_FIREBASE_CONFIG,
    PROD_ADMIN_CONFIG,
    PROD_DATABASE_CONFIG
}