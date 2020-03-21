import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
import { VueCryptojs } from "boot/vue-cryptojs";
import { COLLECTIONS } from "../../config/constants";

const state = {
  parent: {},
  errors: [],
  messages: []
};

const getters = {
  GET_PARENT: state => state.parent,
  GET_ERRORS: state => state.errors,
  GET_MESSAGES: state => state.messages
};

const actions = {
  async LOGIN_PARENT({ commit }, payload) {
    try {
      // auhenticate user in authetication
      let auth_response = await FirebaseAuth.signInWithEmailAndPassword(
        payload.email,
        payload.password
      );

      // fetch user data from database
      if (auth_response.user.uid) {
        let doc = await FirebaseDatabase.collection(COLLECTIONS.PARENTS)
          .doc(auth_response.user.uid)
          .get();
        if (doc.exists) {
          commit("SET_SUCCESS", doc.data());
          commit("SET_PARENT", doc.data());
        }
      }
    } catch (error) {
      console.log(error);
      commit("SET_ERROR", error);
    }
  },
  async REGISTER_PARENT({ commit }, payload) {
    try {
      // register user in authetication
      let auth_response = await FirebaseAuth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      // register user in database
      if (auth_response.user.uid) {
        payload.id = auth_response.user.uid;
        await FirebaseDatabase.collection(COLLECTIONS.PARENTS)
          .doc(payload.id)
          .set({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            isActive: true
          });

        // send verification email
        await auth_response.user.sendEmailVerification();

        // logout user
        await FirebaseAuth.signOut();

        commit("SET_SUCCESS", payload);
      }
    } catch (error) {
      console.log(error);
      commit("SET_ERROR", error);
    }
  },
  TRIGGER_PARENT_STATE({ commit }) {
    FirebaseAuth.onAuthStateChanged(user => {
      if (user) {
        FirebaseDatabase.collection(COLLECTIONS.PARENTS)
          .doc(user.uid)
          .get()
          .then(snapshot => {
            commit("SET_PARENT", snapshot.data());
          })
          .catch(error => {
            commit("SET_ERROR", error);
          });
      } else {
        commit("SET_PARENT", {});
      }
    });
  },
  async RESET_PARENT_PASSWORD({ commit }, payload) {
    try {
      await FirebaseAuth.sendPasswordResetEmail(payload.email);
      commit("SET_SUCCESS", { message: "success" });
    } catch (error) {
      commit("SET_ERROR", error);
    }
  },
  LOGOUT_PARENT({}) {
    FirebaseAuth.signOut();
  },
  LOG_ERROR({ commit }, error) {
    commit("SET_ERROR", error);
  },
  CLEAR_ERRORS_AND_MESSAGES({ commit }) {
    commit("RESET_ERRORS_AND_MESSAGES");
  }
};

const mutations = {
  SET_ERROR: (state, error) => state.errors.unshift(error),
  SET_SUCCESS: (state, payload) => {
    state.errors = [];
    state.messages.push(payload);
  },
  SET_PARENT: (state, parent) => (state.parent = parent),
  RESET_ERRORS_AND_MESSAGES: state => {
    state.errors = [];
    state.messages = [];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
