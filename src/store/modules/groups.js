// Import Needed Modules
import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
import { COLLECTIONS, MUTATIONS, ERRORS } from "../../config/constants";

// State
const state = {
  groups: [],
  studentGroup: {}
};

// Getters
const getters = {
  GET_GROUPS: state => state.groups,
  GET_STUDENT_GROUP: state => state.studentGroup
};

// Actions
const actions = {
  async ADD_GROUP({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
        .doc()
        .set({
          name: payload.name
        });

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.GROUP_ADDED
      });
    } catch (error) {
      console.log("ADD_GROUP ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_GROUP_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async EDIT_GROUP({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
        .doc(payload.id)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
          .doc(payload.id)
          .update({
            name: payload.name
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.GROUP_UPDATED
        });
      }
    } catch (error) {
      console.log("EDIT_GROUP ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_GROUP_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async DELETE_GROUP({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
        .doc(payload)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
          .doc(payload)
          .delete();
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.GROUP_DELETED
        });
      }
    } catch (error) {
      console.log("DELETE_GROUP ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_GROUP_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_GROUPS({ commit }) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.GROUPS
      ).get();
      let docs = snapshot.docs;

      if (docs.length > 0) {
        let groups = docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));

        commit(MUTATIONS.GROUPS.SET_GROUPS, groups);
      } else {
        commit(MUTATIONS.GROUPS.SET_GROUPS, []);
      }
    } catch (error) {
      console.log("FETCH_GROUPS ERROR", error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETECH_GROUP_BY_ID({ commit }, payload) {
    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
        .doc(payload.groupId)
        .get();

      if (doc.exists) {
        let group = {
          groupId: doc.id,
          groupName: doc.data().name
        };

        commit(MUTATIONS.GROUPS.SET_STUDENT_GROUP, group);
      } else {
        commit(MUTATIONS.GROUPS.SET_STUDENT_GROUP, {});
      }
    } catch (error) {
      console.log("FETECH_GROUP_BY_STUDENT_ID error");
    }
  }
};

// Mutations
const mutations = {
  SET_GROUPS: (state, groups) => (state.groups = groups),
  SET_STUDENT_GROUP: (state, group) => (state.studentGroup = group)
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
