// Import Needed Modules
import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
import {
  COLLECTIONS,
  MUTATIONS,
  ERRORS,
  MESSAGES
} from "../../config/constants";

// State
const state = {
  teachers: [],
  teacher: {}
};

// Getters
const getters = {
  GET_TEACHERS: state => state.teachers,
  GET_TEACHER: state => state.teacher
};

// Actions
const actions = {
  async ADD_TEACHER({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      // check if teacher not registered
      let emailSnaphot = await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
        .where("email", "==", payload.email)
        .get();

      let phoneSnapshot = await FirebaseDatabase.collection(
        COLLECTIONS.TEACHERS
      )
        .where("phone", "==", `+968${payload.phone}`)
        .get();

      let emailDocs = emailSnaphot.docs;
      let phoneDocs = phoneSnapshot.docs;

      if (emailDocs.length === 0 && phoneDocs.length === 0) {
        await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
          .doc()
          .set({
            name: payload.name,
            email: payload.email,
            phone: `+968${payload.phone}`,
            isActive: true
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.TEACHER_ADDED
        });
      } else {
        commit(MUTATIONS.UI.SET_ERROR, {
          code: ERRORS.DATABASE.TEACHER_ALREADY_EXISTED
        });
      }
    } catch (error) {
      console.log("ADD_TEACHER ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_TEACHER_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async EDIT_TEACHER({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
        .doc(payload.id)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
          .doc(payload.id)
          .update({
            name: payload.name,
            email: payload.email,
            phone: `+968${payload.phone}`,
            isActive: payload.isActive
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.TEACHER_UPDATED
        });
      }
    } catch (error) {
      console.log("EDIT_TEACHER ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_TEACHER_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async DELETE_TEACHER({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
        .doc(payload)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
          .doc(payload)
          .delete();

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.TEACHER_DELETED
        });
      }
    } catch (error) {
      console.log("DELETE_TEACHER ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_TEACHER_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_TEACHERS({ commit }) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.TEACHERS
      ).get();

      let docs = snapshot.docs;

      if (docs.length > 0) {
        let teachers = docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          phone: doc.data().phone,
          isActive: doc.data().isActive
        }));

        commit(MUTATIONS.TEACHERS.SET_TEACHERS, teachers);
      } else {
        commit(MUTATIONS.TEACHERS.SET_TEACHERS, []);
      }
    } catch (error) {
      console.log("FETCH_TEACHERS ERROR", error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETECH_TEACHER_BY_ID({ commit }, payload) {
    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.TEACHERS)
        .doc(payload.teacherId)
        .get();

      if (doc.exists) {
        let teacher = {
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          phone: doc.data().phone,
          isActive: doc.data().isActive
        };

        commit(MUTATIONS.TEACHERS.SET_TEACHER, group);
      } else {
        commit(MUTATIONS.TEACHERS.SET_TEACHER, {});
      }
    } catch (error) {
      console.log("FETECH_TEACHER_BY_ID error");
    }
  }
};

// Mutations
const mutations = {
  SET_TEACHERS: (state, teachers) => (state.teachers = teachers),
  SET_TEACHER: (state, teacher) => (state.teacher = teacher)
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
