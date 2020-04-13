import { Dialog } from "quasar";
import { FirebaseAuth, FirebaseDatabase, FirebaseStorage } from "boot/firebase";
import { COLLECTIONS } from "../../../config/constants";

//#region AUTH
const LOGIN = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  try {
    // Autheticate User Using Firebase Authentication
    let response = await FirebaseAuth.signInWithEmailAndPassword(
      payload.email,
      payload.password
    );

    // Fetch User Data From Firebase Firestore
    if (response.user.uid) {
      // Check If Email Verfied
      if (response.user.emailVerified) {
        let doc = await FirebaseDatabase.collection(COLLECTIONS.PARENTS)
          .doc(response.user.uid)
          .get();
        if (doc.exists) {
          if (doc.data().isActive === true) {
            commit("SET_MESSAGE", "تم تسجيل المستخدم بنجاح");
            if (response.user.phoneNumber !== null) {
              commit("SET_USER", {
                id: doc.data().id,
                name: doc.data().name,
                email: doc.data().email,
                phone: doc.data().phone,
                isActive: doc.data().isActive,
                isEmailVerified: true
              });
            } else {
              commit("SET_USER", {
                id: doc.data().id,
                name: doc.data().name,
                email: doc.data().email,
                isActive: doc.data().isActive,
                isEmailVerified: true
              });
            }
          } else {
            commit("SET_ERROR", {
              code: "databse/user-inactive"
            });
            await FirebaseAuth.signOut();
          }
        } else {
          commit("SET_ERROR", {
            code: "auth/user-not-found"
          });
          await FirebaseAuth.signOut();
        }
        commit("SET_LOADER", false);
      } else {
        commit("SET_ERROR", {
          code: "auth/email-not-verified"
        });
        commit("SET_LOADER", false);

        // Re-Send Email Verification
        response.user.sendEmailVerification();

        // Sign Out User
        await FirebaseAuth.signOut();
      }
    }
  } catch (error) {
    console.log(error);
    commit("SET_ERROR", error);
    commit("SET_LOADER", false);
  }
};

const REGISTER = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  try {
    // Register New User In Firebase Authentication Using Email And Password
    let response = await FirebaseAuth.createUserWithEmailAndPassword(
      payload.email,
      payload.password
    );

    if (response.user.uid) {
      // Get User Id From Firebase Authentication
      payload.id = response.user.uid;

      // Update User Display Name
      await response.user.updateProfile({ displayName: payload.name });

      // Register New User In Firebase Firestore
      await FirebaseDatabase.collection(COLLECTIONS.PARENTS)
        .doc(payload.id)
        .set({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          isActive: true
        });

      // Send Verification Email
      await response.user.sendEmailVerification();

      commit("SET_LOADER", false);
    }
  } catch (error) {
    console.log(error);
    commit("SET_ERROR", error);
    commit("SET_LOADER", false);
  }
};

const TRIGGER_USER_REGISTRATION = ({ commit }) => {
  FirebaseAuth.onAuthStateChanged(user => {
    if (user && user.phoneNumber === null) {
      commit("SET_REGISTRATION", true);
    } else {
      commit("SET_REGISTRATION", false);
    }
  });
};

const TRIGGER_USER_STATE = ({ commit }) => {
  FirebaseAuth.onAuthStateChanged(async user => {
    if (user) {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.PARENTS)
        .doc(user.uid)
        .get();

      if (doc.exists && doc.data().isActive === true) {
        if (doc.data().isActive === true) {
          if (user.emailVerified && user.phoneNumber !== null) {
            commit("SET_USER", {
              id: doc.data().id,
              name: doc.data().name,
              email: doc.data().email,
              phone: doc.data().phone,
              isActive: doc.data().isActive,
              isEmailVerified: true,
              isPhoneVerified: true
            });
          } else if (user.emailVerified && user.phoneNumber === null) {
            commit("SET_USER", {
              id: doc.data().id,
              name: doc.data().name,
              email: doc.data().email,
              isActive: doc.data().isActive,
              isEmailVerified: true,
              isPhoneVerified: false
            });
          } else if (!user.emailVerified && user.phoneNumber !== null) {
            commit("SET_USER", {
              id: doc.data().id,
              name: doc.data().name,
              email: doc.data().email,
              phone: doc.data().phone,
              isActive: doc.data().isActive,
              isEmailVerified: false,
              isPhoneVerified: true
            });
          } else {
            this.SET_ERROR({
              code: "auth/email-or-phone-inactive"
            });
          }
        } else {
          this.SET_ERROR({
            code: "databse/user-inactive"
          });
        }
      } else {
        commit("SET_USER", {});
      }
    } else {
      commit("SET_USER", {});
    }
  });
};

const RESET_PASSWORD = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  try {
    await FirebaseAuth.sendPasswordResetEmail(payload.email);
    commit(
      "SET_MESSAGE",
      "تم إرسال رابط تعيين كلمة المرور على بريدك الإلكتروني"
    );
    commit("SET_LOADER", false);
  } catch (error) {
    commit("SET_ERROR", error);
    commit("SET_LOADER", false);
  }
};

const LOGOUT = ({ commit }) => {
  FirebaseAuth.signOut();
  commit("SET_USER", {});
};
//#endregion

//#region REGUSTER STUDENT
const REGISTER_STUDENT = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  try {
    // Create Firebase Storage Reference
    let FirebaseStorageRef = FirebaseStorage.ref();
    payload.certificateURLs = [];

    // Upload Student Personal Image
    if (payload.image) {
      let imageRef = FirebaseStorageRef.child(
        `RegisteredStudents/PersonalPictures/${
          payload.image.name
        }_${Date.now()}`
      );
      let snapshot = await imageRef.put(payload.image);
      payload.imageURL = await snapshot.ref.getDownloadURL();
    }

    // Upload Student Certificates
    if (payload.certificates.length > 0) {
      let cerArr = await payload.certificates.map(async certificate => {
        // Create File Reference
        let certificateRef = FirebaseStorageRef.child(
          `RegisteredStudents/Certificates/${certificate.name}_${Date.now()}`
        );

        // Get File Snapshot
        let snapshot = await certificateRef.put(certificate);

        // Get File Download URL
        return await snapshot.ref.getDownloadURL();
      });

      // push results
      payload.certificateURLs = await Promise.all(cerArr);
    }

    // Create Student Object
    const student = {
      name: `${payload.firstName} بن ${payload.secondName} بن ${payload.thirdName} ${payload.familyName}`,
      finishedClass: payload.finishedClass,
      firstPhoneNumber: payload.parentPhone1,
      secondPhoneNumber: payload.parentPhone2,
      village: payload.village,
      subjectANumber: payload.subjectANumber,
      subjectBNumber: payload.subjectBNumber,
      savedChapters: payload.savedChapters.map(chapter => chapter.name),
      savedSurahs: payload.savedSurahs.map(surah => surah.name),
      isLearntInCenterBefore: payload.isLearntInCenterBefore,
      oldCenterName: payload.oldCenterName,
      skills: payload.skills,
      centerKnownBy: payload.centerKnownBy,
      studentState: payload.studentState,
      diseases: payload.diseases,
      imageURL: payload.imageURL,
      certificates: payload.certificateURLs,
      parentId: payload.parentId,
      parentName: payload.parentName,
      createdAt: Date.now(),
      status: "review"
    };

    // Insert Student Data Inside Firebase Firestore
    await FirebaseDatabase.collection(COLLECTIONS.REGISTERED_STUDENTS)
      .doc()
      .set(student);

    // Deactivate Loader And Display Success Message
    commit("SET_LOADER", false);
    commit("SET_MESSAGE", "تم تقديم الطلب بنجاح");

    Dialog.create({
      title: "تنبيه",
      message: "تم تقديم الطلب بنجاح"
    });
  } catch (error) {
    // Deactivate Loader And Display Error Message
    console.log(error);
    commit("SET_LOADER", false);

    Dialog.create({
      title: "تنبيه",
      message: "حدث خطأ اثناء التسجيل"
    });
  }
};

const FETCH_REGISTERED_FORMS = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  // Get All Forms By Parent ID
  let snapshot = await FirebaseDatabase.collection(
    COLLECTIONS.REGISTERED_STUDENTS
  )
    .where("parentId", "==", payload)
    .get();

  // Get All Records
  let docs = snapshot.docs;

  // Prepare Data
  let forms = docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    centerKnownBy: doc.data().centerKnownBy,
    certificates: doc.data().certificates,
    createdAt: doc.data().createdAt,
    diseases: doc.data().diseases,
    finishedClass: doc.data().finishedClass,
    firstPhoneNumber: doc.data().firstPhoneNumber,
    imageURL: doc.data().imageURL,
    isLearntInCenterBefore: doc.data().isLearntInCenterBefore,
    oldCenterName: doc.data().oldCenterName,
    parentId: doc.data().parentId,
    parentName: doc.data().parentName,
    savedChapters: doc.data().savedChapters,
    savedSurahs: doc.data().savedSurahs,
    secondPhoneNumber: doc.data().secondPhoneNumber,
    skills: doc.data().skills,
    status: doc.data().status,
    studentState: doc.data().studentState,
    subjectANumber: doc.data().subjectANumber,
    subjectBNumber: doc.data().subjectBNumber,
    village: doc.data().village
  }));

  commit("SET_REGISTERED_FORMS", forms);
  commit("SET_LOADER", false);
};
//#endregion

//#region GENERAL
const SET_MESSAGE = ({ commit }, payload) => {
  commit("SET_MESSAGE", payload);
};

const SET_ERROR = ({ commit }, error) => {
  commit("SET_ERROR", error);
};

const SET_LOADER = ({ commit }, payload) => {
  commit("SET_LOADER", payload);
};

const CLEAR_ERRORS_AND_MESSAGES = ({ commit }) => {
  commit("RESET_ERRORS_AND_MESSAGES");
};
//#endregion

export default {
  LOGIN,
  REGISTER,
  TRIGGER_USER_STATE,
  RESET_PASSWORD,
  LOGOUT,
  SET_ERROR,
  CLEAR_ERRORS_AND_MESSAGES,
  REGISTER_STUDENT,
  TRIGGER_USER_REGISTRATION,
  SET_LOADER,
  SET_MESSAGE,
  FETCH_REGISTERED_FORMS
};
