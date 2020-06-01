// Import Needed Modules
import { date } from "quasar";
import { FirebaseDatabase } from "boot/firebase";
import {
  COLLECTIONS,
  EXAM_TYPE,
  MUTATIONS,
  MESSAGES,
  ERRORS
} from "../../config/constants";

// State
const state = {
  yearInfo: {},
  registrationPeriod: {}
};

// Getters
const getters = {
  GET_YEAR_INFO: state => state.yearInfo,
  GET_REGISTRATION_PERIOD: state => state.registrationPeriod
};

// Actions
const actions = {
  async FETCH_YEAR_INFO({ commit }) {
    // Get Date
    let date = new Date();

    try {
      // Get Year Info If Exists
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.getFullYear().toString())
        .get();

      // Check If Year Data Exists
      if (doc.exists) {
        // Set Year Info
        commit(MUTATIONS.SETTINGS.SET_YEAR_INFO, {
          id: doc.data().id,
          name: doc.data().name,
          startPeriodDate: doc.data().startPeriodDate,
          endPeriodDate: doc.data().endPeriodDate,
          writtenExamMarks: doc.data().writtenExamMarks,
          reciteExamMarks: doc.data().reciteExamMarks
        });
      }
    } catch (error) {
      console.log("FETCH_YEAR_INFO", error);
      // Set Error
      commit(MUTATIONS.UI.SET_ERROR, { code: ERRORS.DATABASE.YEAR_INFO_ERROR });
    }
  },

  async SET_YEAR_NAME({ commit }, payload) {
    // Activate Loader
    commit(MUTATIONS.UI.SET_LOADING, true);

    // Get Date
    let date = new Date();

    try {
      // Fetch Year Data
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.getFullYear().toString())
        .get();

      // Check If Year Data Exists
      if (!doc.exists) {
        // Register New Year Info
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .set({
            id: date.getFullYear().toString(),
            name: payload,
            startPeriodDate: Date.now(),
            endPeriodDate: Date.now()
          });

        // Set Message
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_CREATED
        });

        // Deactivate Loading
        commit(MUTATIONS.UI.SET_LOADING, false);
      } else {
        // Update Existed Year Info
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .update({
            name: payload
          });

        // Set Message
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_UPDATED
        });
        // Deactivate Loading
        commit(MUTATIONS.UI.SET_LOADING, false);
      }
    } catch (error) {
      // Display Error In Console
      console.log("SET_YEAR_NAME", error);
      // Set Error (Set Year Name Action)
      commit(MUTATIONS.UI.SET_ERROR, { code: ERRORS.DATABASE.YEAR_INFO_ERROR });
      // Deactivate Loader
      commit("SET_LOADER", false);
    }
  },

  async SET_REGISTRATION_PERIOD({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

    // Get Date
    let date = new Date();

    try {
      // Get Year Info If Exists
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.getFullYear().toString())
        .get();

      // Check If Year Info Data Not Exists
      if (!doc.exists) {
        // Set Error
        commit(MUTATIONS.UI.SET_ERROR, {
          code: ERRORS.DATABASE.YEAR_INFO_NOT_FOUND
        });

        // Deactivate Loading
        commit(MUTATIONS.UI.SET_LOADING, false);
      } else {
        // Update Existed Year Info
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .update({
            startPeriodDate: payload.startPeriodDate,
            endPeriodDate: payload.endPeriodDate
          });

        // Set Messages
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_REGISTRATION_PERIOD_UPDATED
        });

        // Deactivate Loading
        commit(MUTATIONS.UI.SET_LOADING, false);
      }
    } catch (error) {
      // Display Error In Console
      console.log("SET_REGISTRATION_PERIOD", error);
      // Set Error (Year Info Error)
      commit(MUTATIONS.UI.SET_ERROR, { code: ERRORS.DATABASE.YEAR_INFO_ERROR });
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_REGISTRATION_PERIOD({ commit }) {
    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.formatDate(Date.now(), "YYYY"))
        .get();

      if (doc.exists) {
        // Set Registration Period
        commit(MUTATIONS.SETTINGS.SET_REGISTRATION_PERIOD, {
          id: doc.data().id,
          name: doc.data().name,
          startPeriodDate: doc.data().startPeriodDate,
          endPeriodDate: doc.data().endPeriodDate
        });
      } else {
        // Set Registration Period
        commit(MUTATIONS.SETTINGS.SET_REGISTRATION_PERIOD, {});
      }
    } catch (error) {
      // Display Error In Console
      console.log("FETCH_REGISTRATION_PERIOD", error);
      // Set Error (Fetch Registration Period Error)
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.FETCH_REGISTRATION_PERIOD_ERROR
      });
    }
  },

  async SET_EXAM_TOTAL_MARKS({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      // Get Date
      let date = new Date();

      // Get Year Info If Exists
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.getFullYear().toString())
        .get();

      // Check If Year Data Exists
      if (doc.exists) {
        // Set Exam Marks
        if (payload.examType === EXAM_TYPE.WRITTEN) {
          await FirebaseDatabase.collection(COLLECTIONS.YEARS)
            .doc(doc.id)
            .update({
              writtenExamMarks: payload.writtenExamMarks
            });

          commit(MUTATIONS.UI.SET_MESSAGE, {
            code: MESSAGES.DATABASE.EXAM_MARKS_UPDATED
          });
        } else if (payload.examType === EXAM_TYPE.RECITE) {
          await FirebaseDatabase.collection(COLLECTIONS.YEARS)
            .doc(doc.id)
            .update({
              reciteExamMarks: payload.reciteExamMarks
            });

          commit(MUTATIONS.UI.SET_MESSAGE, {
            code: MESSAGES.DATABASE.EXAM_MARKS_UPDATED
          });
        }
      }

      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    } catch (error) {
      // Display Error In Console
      console.log("SET_EXAM_TOTAL_MARKS ERROR", error);
      // Set Error (Set Exam Marks Error)
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.SET_EXAM_MARKS_ERROR
      });
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  }
};

// Mutations
const mutations = {
  SET_YEAR_INFO: (state, info) => (state.yearInfo = info),
  SET_REGISTRATION_PERIOD: (state, period) =>
    (state.registrationPeriod = period)
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
