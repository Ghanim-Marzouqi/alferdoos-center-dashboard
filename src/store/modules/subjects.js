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

  async DELETE_SUBJECT({ commit }, payload) {
    try {
      await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
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
