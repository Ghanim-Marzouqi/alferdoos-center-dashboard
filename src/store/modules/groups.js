// Import Needed Modules
import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
import {
  COLLECTIONS,
  MUTATIONS,
  MESSAGES,
  ERRORS
} from "../../config/constants";

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
          name: payload.name,
          memorizations: []
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
          name: doc.data().name,
          memorizations: doc.data().memorizations
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
      console.log("FETECH_GROUP_BY_ID error");
    }
  },

  async ADD_MEMORIZATION_TO_GROUP({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
        .doc(payload.groupId)
        .get();

      // Check If Group Exists
      if (doc.exists) {
        let groupMemorization = doc.data().memorizations;
        if (groupMemorization && typeof groupMemorization !== "undefined" && groupMemorization.length > 0) {
          let newMemorizations = [];

          // Check if Memorization Exists
          if (groupMemorization.find(m => m.memorizationId === payload.memorizationId)) {
            let newMemorizationDetails = [];

            // Get Memorization By Id
            let memorization = await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS).doc(payload.memorizationId).get();

            // Check Sent Memorization Details From List Of Original Memorization Details
            for (let i = 0; i < memorization.data().details.length; i++) {
              for (let j = 0; j < payload.memorizationDetails.length; j++) {
                if (memorization.data().details[i].uid === payload.memorizationDetails[j]) {
                  newMemorizationDetails.push(memorization.data().details[i]);
                }
              }
            }
  
            // Filter Memorizations To Accept New Ones Only
            let filteredMemorizations = groupMemorization.filter(m => m.memorizationId !== payload.memorizationId);

            newMemorizations = [
              {
                memorizationId: payload.memorizationId,
                memorizationDetails: newMemorizationDetails
              },
              ...filteredMemorizations
            ];
          } else {
            let newMemorizationDetails = [];

            // Get Memorization By Id
            let memorization = await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS).doc(payload.memorizationId).get();

            // Check Sent Memorization Details From List Of Original Memorization Details
            for (let i = 0; i < memorization.data().details.length; i++) {
              for (let j = 0; j < payload.memorizationDetails.length; j++) {
                if (memorization.data().details[i].uid === payload.memorizationDetails[j]) {
                  newMemorizationDetails.push(memorization.data().details[i]);
                }
              }
            }
  
            newMemorizations = [
              {
                memorizationId: payload.memorizationId,
                memorizationDetails: newMemorizationDetails
              },
              ...groupMemorization
            ];
          }
  
          // Update Group Memorization
          await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
          .doc(payload.groupId)
          .update({
            memorizations: newMemorizations
          });

          commit(MUTATIONS.UI.SET_MESSAGE, {
            code: MESSAGES.DATABASE.GROUP_MEMORIZATIONS_ADDED
          });
        } else {
          let newMemorizationDetails = [];

          // Get Memorization By Id
          let memorization = await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS).doc(payload.memorizationId).get();

          if (memorization.exists && memorization.data().details.length > 0) {
            // Check Sent Memorization Details From List Of Original Memorization Details
            for (let i = 0; i < memorization.data().details.length; i++) {
              for (let j = 0; j < payload.memorizationDetails.length; j++) {
                if (memorization.data().details[i].uid === payload.memorizationDetails[j]) {
                  newMemorizationDetails.push(memorization.data().details[i]);
                }
              }
            }

            console.log("newMemorizationDetails", newMemorizationDetails);
  
            let newMemorizations = [
              {
                memorizationId: payload.memorizationId,
                memorizationDetails: newMemorizationDetails
              }
            ];
    
            // Update Group Memorization
            await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
              .doc(payload.groupId)
              .update({
                memorizations: newMemorizations
              });
    
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.GROUP_MEMORIZATIONS_ADDED
            });
          } else {
            console.log("No Memorization Details For This Memorization");
            commit(MUTATIONS.UI.SET_ERROR, {
              code: ERRORS.DATABASE.ADD_MEMORIZATION_TO_GROUP_ERROR
            });
          }
        }
      } else {
        console.log("Group Doesn't Exist");
        commit(MUTATIONS.UI.SET_ERROR, {
          code: ERRORS.DATABASE.ADD_MEMORIZATION_TO_GROUP_ERROR
        });
      }
    } catch (error) {
      console.log("ADD_MEMORIZATION_TO_GROUP ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_MEMORIZATION_TO_GROUP_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async DELETE_MEMORIZATION_FROM_GROUP({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
        .doc(payload.groupId)
        .get();

      if (doc.exists) {
        let memorizations = doc.data().memorizations;
        let filteredMemorizations = memorizations.filter(
          memo => memo.memorizationId !== payload.memorizationId
        );

        await FirebaseDatabase.collection(COLLECTIONS.GROUPS)
          .doc(payload.groupId)
          .update({
            memorizations: filteredMemorizations
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.GROUP_MEMORIZATIONS_DELETED
        });
      }
    } catch (error) {
      console.log("DELETE_MEMORIZATION_FROM_GROUP ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_MEMORIZATION_FROM_GROUP_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETECH_MEMORIZATION_DETAILS_BY_ID({}, payload) {
    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS).doc(payload.memorizationId).get();
      let value = null;

      if (doc.exists) {
        let details = doc.data().details;

        if (details && details.length > 0) {
          let detail = details.find(d => d.uid === payload.memorizationDetailId);
          if (detail) value = detail;
        }
      }

      return value;
    } catch(error) {
      console.log("GET_MEMORIZATION_DETAILS_BY_ID ERROR", error);
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
