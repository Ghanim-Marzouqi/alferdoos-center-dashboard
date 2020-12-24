// load libraries
const path = require("path");
const express = require("express");
const cors = require('cors');
const firebase = require("firebase");
const admin = require("firebase-admin");
const functions = require('firebase-functions');
const emailValidator = require("email-validator");
const { COLLECTIONS, USER_DEFAULT_PASSWORD } = require('./constants');
const { DEV_FIREBASE_CONFIG, DEV_ADMIN_CONFIG, DEV_DATABASE_URL } = require('./config');
const { json } = require("express");

// initialize app and set port
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// initialize firebase
firebase.initializeApp(DEV_FIREBASE_CONFIG);

// initialize firebase admin
admin.initializeApp({
    credential: admin.credential.cert(DEV_ADMIN_CONFIG),
    databaseURL: DEV_DATABASE_URL,
});

// firebase instances
const db = admin.firestore();
const auth = admin.auth();

// default route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'مرحبا بك في نظام مركز الفردوس الأعلى'
    });
});

// register new teacher
app.post('/register-teacher', (req, res) => {
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

        // check if teacher is registered in database
        db.collection(COLLECTIONS.TEACHERS).doc(authUser.uid).get().then(user => {
            if (typeof user.data() === "undefined") {
                db.collection(COLLECTIONS.TEACHERS).doc(authUser.uid).set({
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
            } else {
                res.json({
                    status: 'error',
                    message: 'المعلم مسجل بالفعل'
                });
            }
        }).catch(error => {
            res.json({
                status: "error",
                message: "حدث خطأ أثناء التحقق من بيانات المعلم"
            });
        });

    }).catch(authError => {
        if (authError && authError.code === "auth/user-not-found") {
            auth.createUser({
                displayName: name,
                email,
                password: USER_DEFAULT_PASSWORD,
                phoneNumber: `+968${phone}`
            }).then(creatdUser => {
                db.collection(COLLECTIONS.TEACHERS).doc(creatdUser.uid).set({
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

// delete teacher
app.post('/delete-teacher', (req, res) => {
    const { id } = req.body;

    if (!id || id === null || typeof id === "undefined") {
        res.json({
            status: 'error',
            message: 'يوجد نقص في البيانات المرسلة'
        });
    } else {
        // check if teacher exists in database
        db.collection(COLLECTIONS.TEACHERS).doc(id).get().then(user => {
            if (typeof user.data() === "undefined") {
                res.json({
                    status: 'error',
                    message: 'لم يتم العثور على بيانات المعلم'
                });
            } else {
                db.collection(COLLECTIONS.TEACHERS).doc(id).delete().then(result => {
                    res.json({
                        status: 'success',
                        message: 'تم حذف المعلم بنجاح'
                    });
                }).catch(error => {
                    res.json({
                        status: 'success',
                        message: 'حدث خطأ أثناء محاولة حذف المعلم'
                    });
                });
            }
        }).catch(error => {
            res.json({
                status: 'success',
                message: 'حدث خطأ أثناء محاولة حذف المعلم'
            });
        });
    }
});

// serve app locally
// app.listen(port, () => console.log(`Listening on port ${port}`));

// serve app using firebase functions
exports.app = functions.https.onRequest(app);