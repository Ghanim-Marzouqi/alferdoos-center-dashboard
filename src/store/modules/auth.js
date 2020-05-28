// Import Needed Modules
import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
import { COLLECTIONS, MUTATIONS, ERRORS } from "../../config/constants";

// State
const state = {
  user: {},
  isUserRegistered: false
};

// Getters
const getters = {
  GET_USER: state => state.user
};

// Actions
const actions = {
  async LOGIN({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

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
          let doc = await FirebaseDatabase.collection(payload.collection)
            .doc(response.user.uid)
            .get();

          // Check If User Exists
          if (doc.exists) {
            if (doc.data().isActive === true) {
              // Check Phone Number Is Verified
              if (response.user.phoneNumber !== null) {
                // Set User With Phone Number
                commit(MUTATIONS.AUTH.SET_USER, {
                  id: doc.data().id,
                  name: doc.data().name,
                  email: doc.data().email,
                  phone: doc.data().phone,
                  isActive: doc.data().isActive,
                  isSuperAdmin: doc.data().isSuperAdmin,
                  isEmailVerified: true
                });
              } else {
                // Set User Without Phone Number
                commit(MUTATIONS.AUTH.SET_USER, {
                  id: doc.data().id,
                  name: doc.data().name,
                  email: doc.data().email,
                  isActive: doc.data().isActive,
                  isSuperAdmin: doc.data().isSuperAdmin,
                  isEmailVerified: true
                });
              }
            } else {
              // Set Error (User Inactive)
              commit(MUTATIONS.UI.SET_ERROR, {
                code: ERRORS.USER_INACTIVE
              });
              await FirebaseAuth.signOut();
            }
          } else {
            // Set Error (User Not Found)
            commit(MUTATIONS.UI.SET_ERROR, {
              code: ERRORS.USER_NOT_FOUND
            });
            await FirebaseAuth.signOut();
          }
        } else {
          // Set Error (Email Not Verified)
          commit(MUTATIONS.UI.SET_ERROR, {
            code: ERRORS.EMAIL_NOT_VERIFIED
          });

          // Re-Send Email Verification
          response.user.sendEmailVerification();

          // Sign Out User
          await FirebaseAuth.signOut();
        }

        // Deactivate Loading
        commit(MUTATIONS.UI.SET_LOADING, false);
      }
    } catch (error) {
      // Display Error In Console
      console.log("LOGIN", error);
      // Set Error (Login Action Error)
      commit(MUTATIONS.UI.SET_ERROR, error);
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async REGISTER({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      // Register New User In Firebase Authentication Using Email And Password
      let response = await FirebaseAuth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      // Check User Id From Firebase Authentication
      if (response.user.uid) {
        // Get User Id From Firebase Authentication And Supply It To Payload
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
      }

      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    } catch (error) {
      // Display Error In Console
      console.log("REGISTER", error);
      // Set Error (Register Action Error)
      commit(MUTATIONS.UI.SET_ERROR, error);
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  TRIGGER_USER_REGISTRATION_STATE({ commit }) {
    FirebaseAuth.onAuthStateChanged(user => {
      if (user && user.phoneNumber === null) {
        // Set Registration State
        commit(MUTATIONS.AUTH.SET_REGISTRATION_STATE, true);
      } else {
        // Set Registration State
        commit(MUTATIONS.AUTH.SET_REGISTRATION_STATE, false);
      }
    });
  },

  TRIGGER_USER_STATE({ commit }, payload) {
    FirebaseAuth.onAuthStateChanged(async user => {
      // Check If User Logged In
      if (user) {
        // Fetch User Data
        let doc = await FirebaseDatabase.collection(payload.collection)
          .doc(user.uid)
          .get();

        // Check If User Data Exist And User Is Active
        if (doc.exists && doc.data().isActive === true) {
          if (doc.data().isActive === true) {
            if (user.emailVerified && user.phoneNumber !== null) {
              // Set User With Email And Phone Number
              commit(MUTATIONS.AUTH.SET_USER, {
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
              // Set User With Email Only
              commit(MUTATIONS.AUTH.SET_USER, {
                id: doc.data().id,
                name: doc.data().name,
                email: doc.data().email,
                isActive: doc.data().isActive,
                isSuperAdmin: doc.data().isSuperAdmin,
                isEmailVerified: true,
                isPhoneVerified: false
              });
            } else if (!user.emailVerified && user.phoneNumber !== null) {
              // Set User With Phone Number Only
              commit(MUTATIONS.AUTH.SET_USER, {
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
              // Set Error (Email Or Phone Inctivated)
              this.SET_ERROR({
                code: ERRORS.EMAIL_OR_PHONE_INACTIVE
              });
            }
          } else {
            // Set Error (User Not Found)
            commit(MUTATIONS.UI.SET_ERROR, {
              code: ERRORS.USER_INACTIVE
            });
          }
        } else {
          // Set User To Empty Object
          commit(MUTATIONS.AUTH.SET_USER, {});
        }
      } else {
        // Set User To Empty Object
        commit(MUTATIONS.AUTH.SET_USER, {});
      }
    });
  },

  async RESET_PASSWORD({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseAuth.sendPasswordResetEmail(payload.email);
      // Set Messages
      commit(
        MUTATIONS.UI.SET_MESSAGE,
        "تم إرسال رابط تعيين كلمة المرور على بريدك الإلكتروني"
      );

      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    } catch (error) {
      // Display Error In Console
      console.log("RESET_PASSWORD", error);
      // Set Error (Reset Password Action)
      commit(MUTATIONS.UI.SET_ERROR, error);
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  LOGOUT({ commit }) {
    FirebaseAuth.signOut();
    // Set User To Empty Object
    commit(MUTATIONS.AUTH.SET_USER, {});
  }
};

// Mutations
const mutations = {
  SET_USER: (state, user) => (state.user = user),
  SET_REGISTRATION_STATE: (state, value) => (state.isUserRegistered = value)
};

// Export
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
