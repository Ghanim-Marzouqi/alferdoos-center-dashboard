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
  examMarks: [],
  memorizations: [],
  schaduals : []
};

// Getters
const getters = {
  GET_YEAR_INFO: state => state.yearInfo,
  GET_REGISTRATION_PERIOD: state => state.registrationPeriod,
  GET_QUESTIONS: state => state.questions,
  GET_EXAM_MARKS: state => state.examMarks,
  GET_MEMORIZATIONS: state => state.memorizations,
  GET_SCHADUALS : state => state.schaduals
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
    commit(MUTATIONS.UI.SET_LOADING, true);

    let date = new Date();

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.getFullYear().toString())
        .get();

      if (!doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .set({
            id: date.getFullYear().toString(),
            name: payload,
            startPeriodDate: Date.now(),
            endPeriodDate: Date.now()
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_CREATED
        });
      } else {
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .update({
            name: payload
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_UPDATED
        });
      }
    } catch (error) {
      console.log("SET_YEAR_NAME", error);
      commit(MUTATIONS.UI.SET_ERROR, { code: ERRORS.DATABASE.YEAR_INFO_ERROR });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async SET_REGISTRATION_PERIOD({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    let date = new Date();

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.getFullYear().toString())
        .get();

      if (!doc.exists) {
        commit(MUTATIONS.UI.SET_ERROR, {
          code: ERRORS.DATABASE.YEAR_INFO_NOT_FOUND
        });
      } else {
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .update({
            startPeriodDate: payload.startPeriodDate,
            endPeriodDate: payload.endPeriodDate
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_REGISTRATION_PERIOD_UPDATED
        });
      }
    } catch (error) {
      console.log("SET_REGISTRATION_PERIOD", error);
      commit(MUTATIONS.UI.SET_ERROR, { code: ERRORS.DATABASE.YEAR_INFO_ERROR });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_REGISTRATION_PERIOD({ commit }) {
    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.YEARS)
        .doc(date.formatDate(Date.now(), "YYYY"))
        .get();

      if (doc.exists) {
        commit(MUTATIONS.SETTINGS.SET_REGISTRATION_PERIOD, {
          id: doc.data().id,
          name: doc.data().name,
          startPeriodDate: doc.data().startPeriodDate,
          endPeriodDate: doc.data().endPeriodDate
        });
      } else {
        commit(MUTATIONS.SETTINGS.SET_REGISTRATION_PERIOD, {});
      }
    } catch (error) {
      console.log("FETCH_REGISTRATION_PERIOD", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.FETCH_REGISTRATION_PERIOD_ERROR
      });
    }
  },

  async SET_EXAM_TOTAL_MARKS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.EXAM_MARKS)
        .doc(payload.examType)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.EXAM_MARKS)
          .doc(doc.id)
          .update({
            marks: payload.marks,
            marksDistribution: payload.marksDistribution
          });

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

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.EXAM_MARKS_UPDATED
        });
      }
    } catch (error) {
      console.log("SET_EXAM_TOTAL_MARKS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.SET_EXAM_MARKS_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_EXAM_TOTAL_MARKS({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.EXAM_MARKS
      ).get();

      let docs = snapshot.docs;

      let marks = docs.map(doc => ({
        id: doc.id,
        marks: doc.data().marks,
        marksDistribution: doc.data().marksDistribution
      }));

      commit(MUTATIONS.SETTINGS.SET_EXAM_MARKS, marks);
    } catch (error) {
      console.log("FETCH_EXAM_TOTAL_MARKS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.FETCH_EXAM_TOTAL_MARKS_ERROR
      });
    }
  },

  async SET_QUESTION({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let createdAt = Date.now();

      payload.createdAt = createdAt;

      await FirebaseDatabase.collection(COLLECTIONS.QUESTIONS)
        .doc(createdAt.toString())
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.QUESTION_ADDED
      });
    } catch (error) {
      console.log("SET_QUESTION ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.SET_QUESTION_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_QUESTIONS({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(COLLECTIONS.QUESTIONS)
        .orderBy("createdAt", "asc")
        .get();

      let docs = snapshot.docs;

      let questions = docs.map(question => ({
        id: question.id,
        text: question.data().text,
        marks: question.data().marks,
        options: question.data().options,
        createdAt: question.data().createdAt
      }));

      if (questions.length > 0) {
        commit(MUTATIONS.SETTINGS.SET_QUESTIONS, questions);
      } else {
        commit(MUTATIONS.SETTINGS.SET_QUESTIONS, []);
      }
    } catch (error) {
      console.log("FETCH_QUESTIONS ERROR", error);
    }
  },

  async DELETE_QUESTION({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.QUESTIONS)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.QUESTION_DELETED
      });
    } catch (error) {
      console.log("DELETE_QUESTION ERROR", error);

      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_QUESTION_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async ADD_MEMORIZATION({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let date = Date.now();

      await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
        .doc()
        .set({
          name: payload.name,
          details: [],
          createdAt: date
        });

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.MEMORIZATION_ADDED
      });
    } catch (error) {
      console.log("ADD_MEMORIZATION ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_MEMORIZATION_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async EDIT_MEMORIZATION({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
        .doc(payload.id)
        .update({
          name: payload.name
        });

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.MEMORIZATION_UPDATED
      });
    } catch (error) {
      console.log("EDIT_MEMORIZATION ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_MEMORIZATION_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async DELETE_MEMORIZATION({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.MEMORIZATION_DELETED
      });
    } catch (error) {
      console.log("DELETE_MEMORIZATION ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_MEMORIZATION_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_MEMORIZATIONS({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.MEMORIZATIONS
      )
        .orderBy("createdAt", "asc")
        .get();
      let docs = snapshot.docs;

      if (docs.length > 0) {
        let memorizations = docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          details: doc.data().details.length > 0 ? [...doc.data().details] : []
        }));

        commit(MUTATIONS.SETTINGS.SET_MEMORIZATIONS, memorizations);
      } else {
        commit(MUTATIONS.SETTINGS.SET_MEMORIZATIONS, []);
      }
    } catch (error) {
      console.log("FETCH_MEMORIZATIONS ERROR", error);
    }
  },

  async ADD_MEMORIZATION_DETAILS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let date = Date.now();
      let doc = await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
        .doc(payload.id)
        .get();

      if (doc.exists) {
        if (Object.keys(doc.data().details).length > 0) {
          let newDetails = [
            ...doc.data().details,
            {
              uid: payload.uid,
              pageNumberFrom: payload.pageNumberFrom,
              pageNumberTo: payload.pageNumberTo,
              pageMarks: payload.pageMarks,
              mistakeMarks: payload.mistakeMarks,
              cautionMarks: payload.cautionMarks,
              repeatNumber: payload.repeatNumber,
              failMarks: payload.failMarks,
              createdAt: date
            }
          ];

          await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
            .doc(payload.id)
            .update({
              details: newDetails
            });

          commit(MUTATIONS.UI.SET_MESSAGE, {
            code: MESSAGES.DATABASE.MEMORIZATION_DETAILS_ADDED
          });
        } else {
          let newDetails = [
            {
              uid: payload.uid,
              pageNumberFrom: payload.pageNumberFrom,
              pageNumberTo: payload.pageNumberTo,
              pageMarks: payload.pageMarks,
              mistakeMarks: payload.mistakeMarks,
              cautionMarks: payload.cautionMarks,
              repeatNumber: payload.repeatNumber,
              failMarks: payload.failMarks,
              createdAt: date
            }
          ];

          await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
            .doc(payload.id)
            .update({
              details: newDetails
            });

          commit(MUTATIONS.UI.SET_MESSAGE, {
            code: MESSAGES.DATABASE.MEMORIZATION_DETAILS_ADDED
          });
        }
      }
    } catch (error) {
      console.log("ADD_MEMORIZATION_DETAILS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_MEMORIZATION_DETAILS_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async DELETE_MEMORIZATION_DETAILS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
        .doc(payload.id)
        .get();
      let details = doc
        .data()
        .details.filter(detail => detail.uid !== payload.uid);
      await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
        .doc(payload.id)
        .update({
          details
        });

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.MEMORIZATION_DETAILS_DELETED
      });
    } catch (error) {
      console.log("DELETE_MEMORIZATION_DETAILS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_MEMORIZATION_DETAILS_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  } ,
  async ADD_SCHEDUAL({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.SCHEDUALS)
        .doc(payload.group.value)
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.SCHEDUAL_ADDED
      });
    } catch (error) {
      console.log("ADD_SCHEDUAL ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_SCHEDUAL_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },
  async FETCH_SCHEDUAL({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(COLLECTIONS.SCHEDUALS)
        .get();

      let docs = snapshot.docs;

      let schaduals = docs.map(schadual => ({
        group: schadual.data().group,
        0: schadual.data()[0],
        1: schadual.data()[1],
        2: schadual.data()[2],
        3: schadual.data()[3],
        4: schadual.data()[4]
      }));

      if (schaduals.length > 0) {
        commit(MUTATIONS.SETTINGS.SET_SCHEDUALS, schaduals);
      } else {
        commit(MUTATIONS.SETTINGS.SET_SCHEDUALS, []);
      }
    } catch (error) {
      console.log("FETCH_SCHADUALS ERROR", error);
    }
  },
};

// Mutations
const mutations = {
  SET_YEAR_INFO: (state, info) => (state.yearInfo = info),
  SET_REGISTRATION_PERIOD: (state, period) =>
    (state.registrationPeriod = period),
  SET_QUESTIONS: (state, questions) => (state.questions = questions),
  SET_EXAM_MARKS: (state, marks) => (state.examMarks = marks),
  SET_MEMORIZATIONS: (state, memorizations) =>
    (state.memorizations = memorizations),
    SET_SCHEDUALS : (state,schaduals) => state.schaduals = schaduals,
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
