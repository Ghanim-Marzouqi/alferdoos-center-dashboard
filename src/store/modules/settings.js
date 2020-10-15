// Import Needed Modules
import { Dialog } from "quasar";
import { date } from "quasar";
import { FirebaseDatabase , FirebaseStorage } from "boot/firebase";
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
  schaduals : [],
  memorization: {},
  meetings : [],
  repeatedExpense : [],
  expense : [],
  entries : [],
  emails: [],
};

// Getters
const getters = {
  GET_YEAR_INFO: state => state.yearInfo,
  GET_REGISTRATION_PERIOD: state => state.registrationPeriod,
  GET_QUESTIONS: state => state.questions,
  GET_EXAM_MARKS: state => state.examMarks,
  GET_MEMORIZATIONS: state => state.memorizations,
  GET_SCHADUALS : state => state.schaduals,
  GET_MEMORIZATION: state => state.memorization,
  GET_METTINGS : state => state.meetings,
  GET_REPEATED_EXPENCE : state => state.repeatedExpense,
  GET_EXPENCE : state => state.expense,
  GET_ENTRIES : state => state.entries,
  GET_EMAILS : state => state.emails
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
          semesters : doc.data().semesters,
          session : doc.data().session
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

  async SET_YEAR_SEMESTERS({ commit }, payload) {

    console.log("reach the point")
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
            endPeriodDate: Date.now(),
            semesters : payload,
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_CREATED
        });
      } else {
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .update({
            semesters : payload
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.YEAR_INFO_UPDATED
        });
      }
    } catch (error) {
      console.log("SET_YEAR_SEMESTERS", error);
      commit(MUTATIONS.UI.SET_ERROR, { code: ERRORS.DATABASE.YEAR_SEMESTERS_ERROR });
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
  async SET_SESSION_SETTINGS({ commit }, payload) {
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
        console.log('session',payload.session)
        await FirebaseDatabase.collection(COLLECTIONS.YEARS)
          .doc(date.getFullYear().toString())
          .update({
            session: payload.session,
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

  async DELETE_EXPANCE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.EXPANCE)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.EXPANCE_DELETED
      });
    } catch (error) {
      console.log("DELETE_EXPANCE ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_EXPANCE_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async DELETE_REPEATED_EXPANCE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.REPEATED_EXPANCE)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.EXPANCE_DELETED
      });
    } catch (error) {
      console.log("DELETE_EXPANCE ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_EXPANCE_ERROR
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
              name: payload.name,
              pageNumberFrom: payload.pageNumberFrom,
              pageNumberTo: payload.pageNumberTo,
              pageMarks: payload.pageMarks,
              mistakeMarks: payload.mistakeMarks,
              cautionMarks: payload.cautionMarks,
              failMarks: payload.failMarks,
              repeats: payload.repeats,
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
              name: payload.name,
              pageNumberFrom: payload.pageNumberFrom,
              pageNumberTo: payload.pageNumberTo,
              pageMarks: payload.pageMarks,
              mistakeMarks: payload.mistakeMarks,
              cautionMarks: payload.cautionMarks,
              failMarks: payload.failMarks,
              repeats: payload.repeats,
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
  async UPDATE_SETTINGS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.SCHEDUALS)
        .doc(payload.group.value)
        .set(payload);

       
    } catch (error) {
      console.log("ADD_SETTINGS ERROR", error);
      
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
        settings : schadual.data().settings,
        0: schadual.data()[0],
        1: schadual.data()[1],
        2: schadual.data()[2],
        3: schadual.data()[3],
        4: schadual.data()[4],
        5: schadual.data()[5],
        6: schadual.data()[6],
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
  async FETCH_MEMORIZATIONS_BY_ID({ commit }, payload) {
    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.MEMORIZATIONS)
        .doc(payload)
        .get();

      if (doc.exists) {
        let memorization = {
          id: doc.id,
          name: doc.data().name,
          createdAt: doc.data().createdAt,
          details: doc.data().details
        };

        commit(MUTATIONS.SETTINGS.SET_MEMORIZATION, memorization);
      } else {
        commit(MUTATIONS.SETTINGS.SET_MEMORIZATION, {});
      }
    } catch (error) {
      console.log("FETCH_MEMORIZATIONS_BY_ID ERROR");
    }
  },
  async FETCH_MEETINGS({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(COLLECTIONS.MEETINGS)
        .get();

      let docs = snapshot.docs;
      console.log(docs);


      let MEETINGS = docs.map(m => ({
        id : m.id,
        date: m.data().date,
        description: m.data().description,
        title : m.data().title,
        files : [],
        uplodedFiles : m.data().files,
      }));

      if (MEETINGS.length > 0) {
        commit(MUTATIONS.SETTINGS.SET_MEETINGS, MEETINGS);
      } else {
        commit(MUTATIONS.SETTINGS.SET_MEETINGS, []);
      }
    } catch (error) {
      console.log("FETCH_MEETINGS ERROR", error);
    }
  },
  async SET_MEETINGS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {

      let FirebaseStorageRef = FirebaseStorage.ref();
      
      if (payload.files.length > 0) {
        let cerArr = await payload.files.map(async file => {
          let fileRef = FirebaseStorageRef.child(
            `meetings/${file.name}_${Date.now()}`
          );

          let snapshot = await fileRef.put(file);
          return {fileUrl : await snapshot.ref.getDownloadURL() , name : file.name }
        });

        payload.files = await Promise.all(cerArr);
      }


      await FirebaseDatabase.collection(COLLECTIONS.MEETINGS)
        .doc()
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.MEETINGS_ADDED
      });
    } catch (error) {
      console.log("SET_MEETINGS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.SET_MEETINGS_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async DELETE_MEETINGS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.MEETINGS)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.MEETINGS_DELETED
      });
    } catch (error) {
      console.log("DELETE_QUESTION ERROR", error);

      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_MEETING_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async EDIT_MEETING({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {

      let FirebaseStorageRef = FirebaseStorage.ref();
      let files = [];

      if (payload.files.length > 0) {
        let cerArr = await payload.files.map(async file => {
          let fileRef = FirebaseStorageRef.child(
            `meetings/${file.name}_${Date.now()}`
          );

          let snapshot = await fileRef.put(file);
          return {fileUrl : await snapshot.ref.getDownloadURL() , name : file.name }
        });

        files = await Promise.all(cerArr);
      }

      payload.files = files.concat(payload.uplodedFiles);
      delete payload.uplodedFiles;

        await FirebaseDatabase.collection(COLLECTIONS.MEETINGS)
          .doc(payload.id)
          .update(payload);

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.MEETING_UPDATED
        });
      
    } catch (error) {
      console.log("EDIT_MEETING ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_GROUP_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async ADD_REPEATED_EXPANCE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    if (payload.files.length > 0) {
      let FirebaseStorageRef = FirebaseStorage.ref();
      let cerArr = await payload.files.map(async file => {
        let fileRef = FirebaseStorageRef.child(
          `Payments/${file.name}_${Date.now()}`
        );

        let snapshot = await fileRef.put(file);
        return await snapshot.ref.getDownloadURL();
      });

      payload.files = await Promise.all(cerArr);
    }


    try {
      await FirebaseDatabase.collection(COLLECTIONS.REPEATED_EXPANCE)
        .doc()
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.REPEATED_EXPANCE_ADDED
      });
    } catch (error) {
      console.log("ADD_REPEATED ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_PEXPANCE_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async EDIT_REPEATED_EXPANCE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    if (payload.files.length > 0) {
      let FirebaseStorageRef = FirebaseStorage.ref();
      let cerArr = await payload.files.map(async file => {
        let fileRef = FirebaseStorageRef.child(
          `Payments/${file.name}_${Date.now()}`
        );

        let snapshot = await fileRef.put(file);
        return await snapshot.ref.getDownloadURL();
      });
      let arFiles = await Promise.all(cerArr)
      payload.data.files = payload.data.files.concat(arFiles);
    }


    try {
      await FirebaseDatabase.collection(COLLECTIONS.REPEATED_EXPANCE)
        .doc(payload.id)
        .update(payload.data);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.EDIT_REPEATED_EXPANCE
      });
    } catch (error) {
      console.log("SET_MEETINGS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_PEXPANCE_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async ADD_EXPANCE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    if (payload.files.length > 0) {
      let FirebaseStorageRef = FirebaseStorage.ref();
      let cerArr = await payload.files.map(async file => {
        let fileRef = FirebaseStorageRef.child(
          `Payments/${file.name}_${Date.now()}`
        );

        let snapshot = await fileRef.put(file);
        return {fileUrl : await snapshot.ref.getDownloadURL() , name : file.name }
      });

      payload.files = await Promise.all(cerArr);
    }

    try {
      await FirebaseDatabase.collection(COLLECTIONS.EXPANCE)
        .doc()
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.EXPANCE_ADDED
      });
    } catch (error) {
      console.log("SET_MEETINGS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_EXPANCE_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async EDIT_EXPANCE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    if (payload.files.length > 0) {
      let FirebaseStorageRef = FirebaseStorage.ref();
      let cerArr = await payload.files.map(async file => {
        let fileRef = FirebaseStorageRef.child(
          `Payments/${file.name}_${Date.now()}`
        );

        let snapshot = await fileRef.put(file);
        return await snapshot.ref.getDownloadURL();
      });
      let arFiles = await Promise.all(cerArr)
      payload.data.files = payload.data.files.concat(arFiles);
    }

    try {
      await FirebaseDatabase.collection(COLLECTIONS.EXPANCE)
        .doc(payload.id)
        .update(payload.data);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.EXPANCE_UPDATED
      });
    } catch (error) {
      console.log("EDIT_EXPANEC ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_EXPANCE_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async FETCH_EXPANCE({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.EXPANCE
      )
      .get();
      let docs = snapshot.docs;

      if (docs.length > 0) {
        let expense = docs.map(doc => ({
          id: doc.id,
          ref : doc.data().ref,
          title: doc.data().title,
          date: doc.data().date,
          amount : doc.data().amount,
          description : doc.data().description,
          isCredit : doc.data().isCredit,
          isDebit : doc.data().isDebit,
          uplodedFiles : doc.data().files,
          files : [],
        }));

        commit(MUTATIONS.SETTINGS.SET_EXPENCE, expense);
      } else {
        commit(MUTATIONS.SETTINGS.SET_EXPENCE, []);
      }
    } catch (error) {
      console.log("FETCH_EXPANCE ERROR", error);
    }
  },
  async FETCH_EMAILS({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.MESSAGES
      )
      .get();
      let docs = snapshot.docs;

      if (docs.length > 0) {
        let emails = docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          date: doc.data().date,
          content : doc.data().content,
          recipients : doc.data().recipients,
          groups : doc.data().groups,
          sender : doc.data().sender,
          uplodedFiles : doc.data().files,
          files : [],
        }));

        commit(MUTATIONS.SETTINGS.SET_EMAILS, emails);
      } else {
        commit(MUTATIONS.SETTINGS.SET_EXPENCE, []);
      }
    } catch (error) {
      console.log("FETCH_EMAILS ERROR", error);
    }
  },
  async FETCH_REPEATED_EXPANCE({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.REPEATED_EXPANCE
      )
      .get();
      let docs = snapshot.docs;


      if (docs.length > 0) {
        let expense = docs.map(doc => ({
          id: doc.id,
          ref : '',
          isReapted : true,
          amount : doc.data().amount,
          repeatation : doc.data().repeatation,
          filesUrl : doc.data().files,
          title : doc.data().title,
          months : doc.data().months,
          description :doc.data().description,
          startDate : doc.data().startDate,
          isCredit : true,
          isDebit : false,
          lastPayment : doc.data().lastPayment,
        }));


        commit(MUTATIONS.SETTINGS.SET_REPEATED_EXPENCE, expense);
      } else {
        commit(MUTATIONS.SETTINGS.SET_REPEATED_EXPENCE, []);
      }
    } catch (error) {
      console.log("FETCH_REPEATED_EXPANCE ERROR", error);
    }
  },
  async REGISTER_ENTRY({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.ENTRIES)
        .doc()
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.ENTRY_ADDED
      });
    } catch (error) {
      console.log("REGISTER_ENTRY ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_ENTRY_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async UPDATE_ENTRY({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.ENTRIES)
        .doc(payload.id)
        .update(payload.data);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.ENTRY_UPDATED
      });
    } catch (error) {
      console.log("UPDATE_ENTRY ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ENTRY_UPDATE_RROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async FETCH_ENTRIES({ commit }) {
    try {
      let snapshot = await FirebaseDatabase.collection(
        COLLECTIONS.ENTRIES
      )
      .get();
      let docs = snapshot.docs;


      if (docs.length > 0) {
        let entries = docs.map(doc => ({
          id: doc.id,
          name : doc.data().name,
          type : doc.data().type,
          year : doc.data.year
        }));


        commit(MUTATIONS.SETTINGS.SET_ENTRIES, entries);
      } else {
        commit(MUTATIONS.SETTINGS.SET_ENTRIES, []);
      }
    } catch (error) {
      console.log("FETCH_ENTRIES ERROR", error);
    }
  },
  async DELETE_ENTRY({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.ENTRIES)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.ENTRY_DELETED
      });
    } catch (error) {
      console.log("DELETE_ENTRY ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ENTRY_DELETE_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async ADD_MESSAGE ({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    if (payload.files.length > 0) {
      let FirebaseStorageRef = FirebaseStorage.ref();
      let cerArr = await payload.files.map(async file => {
        let fileRef = FirebaseStorageRef.child(
          `messages/${file.name}_${Date.now()}`
        );

        let snapshot = await fileRef.put(file);
        return {fileUrl : await snapshot.ref.getDownloadURL() , name : file.name }
      });

      payload.files = await Promise.all(cerArr);
    }

    try {
      await FirebaseDatabase.collection(COLLECTIONS.MESSAGES)
        .doc()
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.MESSAGE_ADDED
      });
    } catch (error) {
      console.log("ADD_MESSAGE ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_MESSAGE_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
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
    SET_MEETINGS : (state,meetings) => state.meetings = meetings,
  SET_MEMORIZATION: (state, memorization) => (state.memorization = memorization),
  SET_REPEATED_EXPENCE : (state, pexpance) => (state.repeatedExpense = pexpance),
  SET_EXPENCE : (state, expance) => (state.expense = expance),
  SET_ENTRIES : (state, entries) => (state.entries = entries),
  SET_EMAILS : (state, emails) => (state.emails = emails),
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
