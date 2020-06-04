// Import Needed Modules
import { date } from "quasar";
import { FirebaseDatabase } from "boot/firebase";
import {
  COLLECTIONS,
  MUTATIONS,
  MESSAGES,
  ERRORS
} from "../../config/constants";

// State
const state = {
  yearInfo: {},
  registrationPeriod: {},
  questions: [],
  examMarks: []
};

// Getters
const getters = {
  GET_YEAR_INFO: state => state.yearInfo,
  GET_REGISTRATION_PERIOD: state => state.registrationPeriod,
  GET_QUESTIONS: state => state.questions,
  GET_EXAM_MARKS: state => state.examMarks
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
          endPeriodDate: doc.data().endPeriodDate
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
      // Get Exam Marks
      let doc = await FirebaseDatabase.collection(COLLECTIONS.EXAM_MARKS)
        .doc(payload.examType)
        .get();

      // Check Exam Marks If Exists
      if (doc.exists) {
        // Update Exam Marks
        await FirebaseDatabase.collection(COLLECTIONS.EXAM_MARKS)
          .doc(doc.id)
          .update({
            marks: payload.marks,
            marksDistribution: payload.marksDistribution
          });

        // Set Success Message
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.EXAM_MARKS_UPDATED
        });
      } else {
        await FirebaseDatabase.collection(COLLECTIONS.EXAM_MARKS)
          .doc(payload.examType)
          .set({
            marks: payload.marks,
            marksDistribution: payload.marksDistribution
          });

        // Set Success Message
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.EXAM_MARKS_UPDATED
        });
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
  },

  async FETCH_EXAM_TOTAL_MARKS({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.EXAM_MARKS
      ).get();

      // Get All Records
      let docs = snapshot.docs;

      // Create a New Array Of Exam Marks
      let marks = docs.map(doc => ({
        id: doc.id,
        marks: doc.data().marks,
        marksDistribution: doc.data().marksDistribution
      }));

      commit(MUTATIONS.SETTINGS.SET_EXAM_MARKS, marks);
    } catch (error) {
      // Display Error In Console
      console.log("FETCH_EXAM_TOTAL_MARKS ERROR", error);
      // Set Error (Fetch Exam Marks Error)
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.FETCH_EXAM_TOTAL_MARKS_ERROR
      });
    }
  },

  async SET_QUESTION({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let createdAt = Date.now();

      // Add Created At Timestamp
      payload.createdAt = createdAt;

      // Add New Question
      await FirebaseDatabase.collection(COLLECTIONS.QUESTIONS)
        .doc(createdAt.toString())
        .set(payload);

      // Set Success Message
      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.QUESTION_ADDED
      });

      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    } catch (error) {
      // Display Error In Console
      console.log("SET_QUESTION ERROR", error);
      // Set Error (Add Question Error)
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.SET_QUESTION_ERROR
      });
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_QUESTIONS({ commit }) {
    try {
      // Fetch All Questions
      let snapshot = await FirebaseDatabase.collection(COLLECTIONS.QUESTIONS)
        .orderBy("createdAt", "asc")
        .get();

      let docs = snapshot.docs;

      // Create New Question Array
      let questions = docs.map(question => ({
        id: question.id,
        text: question.data().text,
        marks: question.data().marks,
        options: question.data().options,
        createdAt: question.data().createdAt
      }));

      if (questions.length > 0) {
        // Set Questions Array
        commit(MUTATIONS.SETTINGS.SET_QUESTIONS, questions);
      } else {
        // Reset Question Array To Zero
        commit(MUTATIONS.SETTINGS.SET_QUESTIONS, []);
      }
    } catch (error) {
      // Display Error In Console
      console.log("FETCH_QUESTIONS ERROR", error);
    }
  },

  async DELETE_QUESTION({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      // Delete Question By Id
      await FirebaseDatabase.collection(COLLECTIONS.QUESTIONS)
        .doc(payload)
        .delete();

      // Set Successful Message
      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.QUESTION_DELETED
      });

      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    } catch (error) {
      // Display Error In Console
      console.log("DELETE_QUESTION ERROR", error);
      // Set Error (Delete Question Error)
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_QUESTION_ERROR
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
    (state.registrationPeriod = period),
  SET_QUESTIONS: (state, questions) => (state.questions = questions),
  SET_EXAM_MARKS: (state, marks) => (state.examMarks = marks)
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
