// load libraries
const path = require("path");
const express = require("express");
const firebase = require("firebase");
const admin = require("firebase-admin");
const emailValidator = require("email-validator");

// initialize app and set port
const app = express();
const port = process.env.PORT || 3000;

// set defaults
const userDefaultPassword = "Oman@123";

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const firebaseConfig = {
    apiKey: "AIzaSyB7PsUXk19VoEXPCnY0XOoLHYAyUVPZT8s",
    authDomain: "al-ferdoos-school.firebaseapp.com",
    databaseURL: "https://al-ferdoos-school.firebaseio.com",
    projectId: "al-ferdoos-school",
    storageBucket: "al-ferdoos-school.appspot.com",
    messagingSenderId: "765477839813",
    appId: "1:765477839813:web:7c5f17d521d9baf7f4e1ac",
    measurementId: "G-ZW16G2T3G7",
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// firebase admin configuration
const adminConfig = require(path.join(__dirname, "service_account_key"));

// initialize firebase admin
admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: "https://al-ferdoos-school.firebaseio.com",
});

// firebase instances
const db = admin.firestore();
const auth = admin.auth();

// default route
app.get('/', (req, res) => {
    res.json({ status: 'success', message: 'مرحبا بك في نظام مركز الفردوس الأعلى' });
});

// register new teacher
app.post('/register-teacher', async (req, res) => {
    const { name, email, phone } = req.body;

    // validations
    if (!name || name === null || typeof name === "undefined") {
        res.json({
            status: 'error',
            message: 'الرجاء إدخال أسم المعلم'
        });
    }

    if (!email || email === null || typeof email === "undefined") {
        res.json({
            status: 'error',
            message: 'الرجاء إدخال أسم البريد الإلكتروني'
        });
    }

    if (!phone || phone === null || typeof phone === "undefined") {
        res.json({
            status: 'error',
            message: 'الرجاء إدخال رقم الهاتف'
        });
    }

    if (!emailValidator.validate(email)) {
        res.json({
            status: 'error',
            message: 'البريد الإلكتروني غير صحيح'
        });
    }

    // check if teacher registered in auth
    auth.getUserByEmail(email).then(authUser => {
        db.collection("teachers").doc(authUser.uid).set({
            id: authUser.uid,
            name,
            email: authUser.email,
            phone: `+968${phone}`,
            isActive: true
        }).then(stored => {
            res.json({
                status: "success",
                message: "تم إضافة المعلم بنجاح",
                user: {
                    id: authUser.uid,
                    name,
                    email: authUser.email,
                    phone: `+968${phone}`,
                    isActive: true
                }
            });
        }).catch(error => {
            res.json({
                status: "error",
                message: "حدث خطأ أثناء إضافة المعلم"
            });
        });
    }).catch(authError => {
        if (authError && authError.code === "auth/user-not-found") {
            auth.createUser({
                displayName: name,
                email,
                password: userDefaultPassword,
                phoneNumber: `+968${phone}`
            }).then(creatdUser => {
                db.collection("teachers").doc(creatdUser.uid).set({
                    id: creatdUser.uid,
                    name: creatdUser.displayName,
                    email: creatdUser.email,
                    phone: creatdUser.phoneNumber,
                    isActive: true
                }).then(stored => {
                    res.json({
                        status: "success",
                        message: "تم إضافة المعلم بنجاح",
                        user: {
                            id: creatdUser.uid,
                            name: creatdUser.displayName,
                            email: creatdUser.email,
                            phone: creatdUser.phoneNumber,
                            isActive: true
                        }
                    });
                }).catch(error => {
                    res.json({
                        status: "error",
                        message: "حدث خطأ أثناء إضافة المعلم"
                    });
                });
            }).catch(dbError => {
                res.json({
                    status: "error",
                    message: "حدث خطأ أثناء إضافة المعلم"
                });
            });
        } else {
            res.json({
                status: "error",
                message: "حدث خطأ أثناء إضافة المعلم"
            });
        }
    });
});

// serve app
app.listen(port, () => console.log(`Listening on port ${port}`));