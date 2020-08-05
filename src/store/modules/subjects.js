// Import Needed Modules
import { Dialog } from "quasar";
import { FirebaseDatabase, FirebaseStorage } from "boot/firebase";
import {
  COLLECTIONS,
  MUTATIONS,
  MESSAGES,
  ERRORS
} from "../../config/constants";

// State
const state = {
  subjects: [],
};

// Getters
const getters = {
  GET_SUBJECTS: state => state.subjects
};

// Actions
const actions = {
  async FETCH_SUBJECTS({ commit }, payload) {
    console.log(payload)
    commit(MUTATIONS.UI.SET_LOADING, true);
    try {
      let snapshot = null;

      if (payload.status !== "") {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
          .where("status", "==", payload.status)
          .where("year", "==", payload.year )
          .get();
      } else {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .orderBy("createdAt", "desc")
          .where("year", "==", payload.year )
          .get();
      }
      let subjects =  snapshot.docs.data();

      commit(MUTATIONS.SUBJECTS.SET_SUBJECTS, subjects);
    } catch (error) {
      console.log("FETCH_SUBJECTS", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async REGISTER_SUBJECT({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let FirebaseStorageRef = FirebaseStorage.ref();
      payload.filesUrl = [];

    
      if (payload.files.length > 0) {
        let cerArr = await payload.files.map(async file => {
          let fileRef = FirebaseStorageRef.child(
            `Subjects/${file.name}_${Date.now()}`
          );

          let snapshot = await fileRef.put(file);
          return await snapshot.ref.getDownloadURL();
        });

        payload.filesUrl = await Promise.all(cerArr);
      }
      let subject = {
        name : payload.name,
        files : payload.filesUrl,
        description : payload.description,
        createdAt : payload.createdAt,
        createdBy : payload.createdBy
      }

      await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
        .doc()
        .set(subject);
        commit(MUTATIONS.UI.SET_MESSAGE, "تم تسجيل المادة بنجاح");

      Dialog.create({
        title: "تنبيه",
        message: "تم تسجيل المادة بنجاح"
      });
    } catch (error) {
      console.log("REGISTER_SUBJECT", error);
      Dialog.create({
        title: "تنبيه",
        message: "حدث خطأ اثناء التسجيل"
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async DELETE_STUDENT({ commit }, payload) {
    try {
      await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.STUDENT_FORM_RECORD_DELETED
      });
    } catch (error) {
      console.log("DELETE_STUDENT", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.STUDENT_FORM_RECORD_NOT_DELETED
      });
    }
  },

  async EDIT_STUDENT_STATUS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
        .doc(payload.id)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .doc(payload.id)
          .update({
            status: payload.status,
            rejectionReasons: payload.reasons
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.STUDENT_STATUS_UPDATED
        });
      } else {
        commit(MUTATIONS.UI.SET_ERROR, {
          code: ERRORS.DATABASE.STUDENT_NOT_FOUND
        });
      }
    } catch (error) {
      console.log("EDIT_APPLICATION_STATUS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_STUDENT_STATUS_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async EDIT_STUDENT_MARK({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(
        COLLECTIONS.STUDENT_EXAM_MARKS
      )
        .doc(payload.studentId)
        .get();

      if (!doc.exists) {
        switch (payload.examType) {
          case EXAM_TYPE.WRITTEN:
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .set({
                written: payload.studentMarks,
                writtenNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
          case EXAM_TYPE.RECITE:
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .set({
                recite: payload.studentMarks,
                reciteNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
          case EXAM_TYPE.READING:
            // Insert Student Mark
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .set({
                reading: payload.studentMarks,
                readingNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
          case EXAM_TYPE.PERSONAL:
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .set({
                personal: payload.studentMarks,
                personalNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
        }
      } else {
        switch (payload.examType) {
          case EXAM_TYPE.WRITTEN:
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .update({
                written: payload.studentMarks,
                writtenNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
          case EXAM_TYPE.RECITE:
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .update({
                recite: payload.studentMarks,
                reciteNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
          case EXAM_TYPE.READING:
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .update({
                reading: payload.studentMarks,
                readingNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
          case EXAM_TYPE.PERSONAL:
            await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
              .doc(payload.studentId)
              .update({
                personal: payload.studentMarks,
                personalNotes: payload.examNotes
              });
            commit(MUTATIONS.UI.SET_MESSAGE, {
              code: MESSAGES.DATABASE.STUDENT_MARK_UPDATED
            });
            break;
        }
      }
    } catch (error) {
      console.log("EDIT_STUDENT_MARK ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.EDIT_STUDENT_MARK_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_STUDENTS_MARKS({ commit }) {
    let snapshot = await FirebaseDatabase.collection(
      COLLECTIONS.STUDENT_EXAM_MARKS
    ).get();
    let docs = snapshot.docs;

    if (docs.length > 0) {
      let studentMarks = docs.map(doc => ({
        studentId: doc.id,
        written: doc.data().written,
        writtenNotes: doc.data().writtenNotes,
        recite: doc.data().recite,
        reciteNotes: doc.data().reciteNotes,
        reading: doc.data().reading,
        readingNotes: doc.data().readingNotes,
        personal: doc.data().personal,
        personalNotes: doc.data().personalNotes,
        commonKnowledge: doc.data().commonKnowledge
      }));

      commit(MUTATIONS.STUDNETS.SET_STUDENTS_MARKS, studentMarks);
    }
  },

  async SET_STUDENT_ANSWERS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(
        COLLECTIONS.STUDENT_QUESTION_MARKS
      )
        .doc(payload.studentId)
        .get();

      if (!doc.exists) {
        // Insert Student Answers
        await FirebaseDatabase.collection(COLLECTIONS.STUDENT_QUESTION_MARKS)
          .doc(payload.studentId)
          .set({
            studentId: payload.studentId,
            marks: payload.totalMarks,
            answers: payload.answers
          });

        // Check For Student Marks
        let studentMarks = await FirebaseDatabase.collection(
          COLLECTIONS.STUDENT_EXAM_MARKS
        )
          .doc(payload.studentId)
          .get();

        if (!studentMarks.exists) {
          // Insert Student Mark
          await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
            .doc(payload.studentId)
            .set({
              commonKnowledge: payload.totalMarks
            });
        } else {
          // Update Student Mark
          await FirebaseDatabase.collection(COLLECTIONS.STUDENT_EXAM_MARKS)
            .doc(payload.studentId)
            .update({
              commonKnowledge: payload.totalMarks
            });
        }

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.STUDENT_ANSWERS_SUBMITTED
        });
      } else {
        commit(MUTATIONS.UI.SET_ERROR, {
          code: ERRORS.DATABASE.STUDENT_ALREADY_TAKEN_EXAM
        });
      }
    } catch (error) {
      console.log("SET_STUDENT_ANSWERS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.STUDENT_ANSWERS_SUBMIT_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_STUDENT_ANSWERS_BY_ID({ commit }, payload) {
    try {
      let doc = await FirebaseDatabase.collection(
        COLLECTIONS.STUDENT_QUESTION_MARKS
      )
        .doc(payload.studentId)
        .get();

      if (doc.exists) {
        let studentAnswers = {
          studentId: doc.data().studentId,
          marks: doc.data().marks,
          answers: doc.data().answers
        };

        commit(MUTATIONS.STUDNETS.SET_STUDENT_ANSWERS, studentAnswers);
      }
    } catch (error) {
      console.log("FETCH_STUDENT_ANSWERS_BY_ID Error", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.FETCH_STUDENT_ANSWERS_BY_ID_ERROR
      });
    }
  },

  SET_STUDENTS_AND_MARKS({ commit }, payload) {
    commit(MUTATIONS.STUDNETS.SET_STUDENTS_AND_MARKS, payload.updatedStudents);
  },

  async JOIN_STUDENT_TO_GROUP({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
        .doc(payload.studentId)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .doc(payload.studentId)
          .update({
            groupId: payload.groupId
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.STUDENT_GROUP_JOINED
        });
      }
    } catch (error) {
      console.log("JOIN_STUDENT_TO_GROUP ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.JOIN_STUDENT_TO_GROUP_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  RESET_STUDENTS({ commit }) {
    commit(MUTATIONS.STUDNETS.SET_STUDENTS, []);
  }
};

// Mutations
const mutations = {
  SET_STUDENTS: (state, students) => (state.students = students),
  SET_STUDENTS_MARKS: (state, studentMarks) =>
    (state.studentMarks = studentMarks),
  SET_STUDENT_ANSWERS: (state, answers) => (state.studentAnswers = answers),
  SET_STUDENTS_AND_MARKS: (state, updatedStudents) =>
    (state.studentsAndMarks = updatedStudents)
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
