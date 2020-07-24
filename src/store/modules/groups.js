// Import Needed Modules
import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
import { COLLECTIONS, MUTATIONS, ERRORS } from "../../config/constants";

// State
const state = {
  groups: []
};

// Getters
const getters = {
  GET_GROUPS: state => state.groups
};

// Actions
const actions = {
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
  }
};

// Mutations
const mutations = {
  SET_GROUPS: (state, groups) => (state.groups = groups)
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
