import { date } from "quasar";
import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
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
        let doc = await FirebaseDatabase.collection(COLLECTIONS.ADMINS)
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
                isSuperAdmin: doc.data().isSuperAdmin,
                isEmailVerified: true
              });
            } else {
              commit("SET_USER", {
                id: doc.data().id,
                name: doc.data().name,
                email: doc.data().email,
                isActive: doc.data().isActive,
                isSuperAdmin: doc.data().isSuperAdmin,
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
      let doc = await FirebaseDatabase.collection(COLLECTIONS.ADMINS)
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
              isSuperAdmin: doc.data().isSuperAdmin,
              isEmailVerified: true,
              isPhoneVerified: true
            });
          } else if (user.emailVerified && user.phoneNumber === null) {
            commit("SET_USER", {
              id: doc.data().id,
              name: doc.data().name,
              email: doc.data().email,
              isActive: doc.data().isActive,
              isSuperAdmin: doc.data().isSuperAdmin,
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
              isSuperAdmin: doc.data().isSuperAdmin,
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

//#region STUDENT
const FETCH_REGISTERED_STUDENTS = async ({ commit }) => {
  // Activate Loader
  commit("SET_LOADER", true);

  // Fetch Registered Students
  let snapshot = await FirebaseDatabase.collection(
    COLLECTIONS.REGISTERED_STUDENTS
  )
    .orderBy("createdAt", "desc")
    .get();

  let docs = snapshot.docs;

  // Create A New Array From Results
  let registeredStudents = docs.map(doc => ({
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

  commit("SET_REGISTERED_STUDENTS", registeredStudents);

  // Deactivate Loader
  commit("SET_LOADER", false);
};

const DELETE_REGISTERED_STUDENT = async ({ commit }, payload) => {
  try {
    // Delete Registered Student
    await FirebaseDatabase.collection(COLLECTIONS.REGISTERED_STUDENTS)
      .doc(payload)
      .delete();

    // Commit Success Message
    commit("SET_MESSAGE", { code: "database/student-form-record-deleted" });
  } catch (error) {
    // Commit Error Message
    commit("SET_ERROR", { code: "database/student-form-record-not-deleted" });
  }
};

const EDIT_APPLICATION_STATUS = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  try {
    // Get Registered Student Data
    let doc = await FirebaseDatabase.collection(COLLECTIONS.REGISTERED_STUDENTS)
      .doc(payload.id)
      .get();

    if (doc.exists) {
      await FirebaseDatabase.collection(COLLECTIONS.REGISTERED_STUDENTS)
        .doc(payload.id)
        .update({
          status: payload.status,
          rejectionReasons: payload.reasons
        });

      commit("SET_MESSAGE", { code: "database/application-status-updated" });
    } else {
      commit("SET_ERROR", { code: "database/registered-student-not-found" });
    }
  } catch (error) {
    console.log("EDIT_APPLICATION_STATUS ERROR", error);
    commit("SET_ERROR", { code: "database/edit-application-status-error" });
  }

  // Dectivate Loader
  commit("SET_LOADER", false);
};
//#endregion

//#region SETTINGS
const FETCH_YEAR_INFO = async ({ commit }) => {
  // Get Date
  let date = new Date();

  try {
    // Get Year Info If Exists
    let doc = await FirebaseDatabase.collection(COLLECTIONS.YEAR_INFO)
      .doc(date.getFullYear().toString())
      .get();

    if (doc.exists) {
      // Get data
      commit("SET_YEAR_INFO", {
        id: doc.data().id,
        name: doc.data().name,
        startPeriodDate: doc.data().startPeriodDate,
        endPeriodDate: doc.data().endPeriodDate
      });
    }
  } catch (error) {
    console.log("admins/FETCH_YEAR_INFO", error);
    // Set Error
    commit("SET_ERROR", { code: "database/year-info-error" });
  }
};

const SET_YEAR_NAME = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  // Get Date
  let date = new Date();

  try {
    // Get Year Info If Exists
    let doc = await FirebaseDatabase.collection(COLLECTIONS.YEAR_INFO)
      .doc(date.getFullYear().toString())
      .get();

    if (!doc.exists) {
      // Register New Year Info
      await FirebaseDatabase.collection(COLLECTIONS.YEAR_INFO)
        .doc(date.getFullYear().toString())
        .set({
          id: date.getFullYear().toString(),
          name: payload,
          startPeriodDate: Date.now(),
          endPeriodDate: Date.now()
        });

      commit("SET_MESSAGE", { code: "database/year-info-created" });

      // Deactivate Loader
      commit("SET_LOADER", false);
    } else {
      // Update Existed Year Info
      await FirebaseDatabase.collection(COLLECTIONS.YEAR_INFO)
        .doc(date.getFullYear().toString())
        .update({
          name: payload
        });

      commit("SET_MESSAGE", { code: "database/year-info-updated" });

      // Deactivate Loader
      commit("SET_LOADER", false);
    }
  } catch (error) {
    console.log("admins/SET_YEAR_NAME", error);
    commit("SET_ERROR", { code: "database/year-info-error" });

    // Deactivate Loader
    commit("SET_LOADER", false);
  }
};

const SET_REGISTRATION_PERIOD = async ({ commit }, payload) => {
  // Activate Loader
  commit("SET_LOADER", true);

  // Get Date
  let date = new Date();

  try {
    // Get Year Info If Exists
    let doc = await FirebaseDatabase.collection(COLLECTIONS.YEAR_INFO)
      .doc(date.getFullYear().toString())
      .get();

    if (!doc.exists) {
      // Set Error
      commit("SET_ERROR", { code: "database/year-info-not-found" });

      // Deactivate Loader
      commit("SET_LOADER", false);
    } else {
      // Update Existed Year Info
      await FirebaseDatabase.collection(COLLECTIONS.YEAR_INFO)
        .doc(date.getFullYear().toString())
        .update({
          startPeriodDate: payload.startPeriodDate,
          endPeriodDate: payload.endPeriodDate
        });

      commit("SET_MESSAGE", {
        code: "database/year-info-registration-period-updated"
      });

      // Deactivate Loader
      commit("SET_LOADER", false);
    }
  } catch (error) {
    // Set Error
    commit("SET_ERROR", { code: "database/year-info-error" });

    // Deactivate Loader
    commit("SET_LOADER", false);
  }
};

const FETCH_REGISTRATION_PERIOD = async ({ commit }) => {
  try {
    let doc = await FirebaseDatabase.collection(COLLECTIONS.YEAR_INFO)
      .doc(date.formatDate(Date.now(), "YYYY"))
      .get();

    if (doc.exists) {
      commit("SET_REGISTRATION_PERIOD", {
        id: doc.data().id,
        name: doc.data().name,
        startPeriodDate: doc.data().startPeriodDate,
        endPeriodDate: doc.data().endPeriodDate
      });
    } else {
      commit("SET_REGISTRATION_PERIOD", {});
    }
  } catch (error) {
    console.log("FETCH_REGISTRATION_PERIOD ERROR", error);
    commit("SET_ERROR", { code: "database/fetch-registration-period-info" });
  }
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
  TRIGGER_USER_STATE,
  RESET_PASSWORD,
  LOGOUT,
  SET_ERROR,
  CLEAR_ERRORS_AND_MESSAGES,
  TRIGGER_USER_REGISTRATION,
  SET_LOADER,
  SET_MESSAGE,
  FETCH_REGISTERED_STUDENTS,
  DELETE_REGISTERED_STUDENT,
  SET_YEAR_NAME,
  SET_REGISTRATION_PERIOD,
  FETCH_YEAR_INFO,
  EDIT_APPLICATION_STATUS,
  FETCH_REGISTRATION_PERIOD
};
