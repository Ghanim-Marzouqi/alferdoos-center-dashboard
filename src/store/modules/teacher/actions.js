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
        let doc = await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
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
      let doc = await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
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

const LOGOUT = ({}) => {
  FirebaseAuth.signOut();
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
  SET_MESSAGE
};
