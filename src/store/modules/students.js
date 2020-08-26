// Import Needed Modules
import { Dialog } from "quasar";
import { FirebaseDatabase, FirebaseStorage } from "boot/firebase";
import {
  COLLECTIONS,
  MUTATIONS,
  STUDENT_STATUS,
  MESSAGES,
  ERRORS,
  EXAM_TYPE
} from "../../config/constants";

// State
const state = {
  students: [],
  studentMarks: [],
  studentAnswers: {},
  studentsAndMarks: [],
  studentGroup: {}
};

// Getters
const getters = {
  GET_STUDENTS: state => state.students,
  GET_STUDENTS_MARKS: state => state.studentMarks,
  GET_STUDENT_ANSWERS: state => state.studentAnswers,
  GET_STUDENTS_AND_MARKS: state => state.studentsAndMarks
};

// Actions
const actions = {
  async FETCH_STUDENTS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let snapshot = null;

      if (payload.status !== "") {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .where("status", "==", payload.status)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .orderBy("createdAt", "desc")
          .get();
      }

      let docs = snapshot.docs;

      let students = docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        centerKnownBy: doc.data().centerKnownBy,
        certificates: doc.data().certificates,
        createdAt: doc.data().createdAt,
        diseases: doc.data().diseases,
        finishedClass: doc.data().finishedClass,
        firstPhoneNumber: doc.data().firstPhoneNumber,
        imageURL: doc.data().imageURL,
        isLearntInCenterBefore: doc.data().isLearntInCenterBefore,
        oldCenterName: doc.data().oldCenterName,
        parentId: doc.data().parentId,
        parentName: doc.data().parentName,
        savedChapters: doc.data().savedChapters,
        savedSurahs: doc.data().savedSurahs,
        secondPhoneNumber: doc.data().secondPhoneNumber,
        skills: doc.data().skills,
        status: doc.data().status,
        rejectionReasons: doc.data().rejectionReasons,
        studentState: doc.data().studentState,
        subjectANumber: doc.data().subjectANumber,
        subjectBNumber: doc.data().subjectBNumber,
        village: doc.data().village,
        groupId: doc.data().groupId
      }));

      commit(MUTATIONS.STUDNETS.SET_STUDENTS, students);
    } catch (error) {
      console.log("FETCH_STUDENTS", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async FETCH_STUDENTS_BY_PARENT_ID({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let snapshot = null;

      if (payload.status) {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .where("status", "==", payload.status)
          .where("parentId", "==", payload.parentId)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .where("parentId", "==", payload.parentId)
          .orderBy("createdAt", "desc")
          .get();
      }

      let docs = snapshot.docs;

      let students = docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        centerKnownBy: doc.data().centerKnownBy,
        certificates: doc.data().certificates,
        createdAt: doc.data().createdAt,
        diseases: doc.data().diseases,
        finishedClass: doc.data().finishedClass,
        firstPhoneNumber: doc.data().firstPhoneNumber,
        imageURL: doc.data().imageURL,
        isLearntInCenterBefore: doc.data().isLearntInCenterBefore,
        oldCenterName: doc.data().oldCenterName,
        parentId: doc.data().parentId,
        parentName: doc.data().parentName,
        savedChapters: doc.data().savedChapters,
        savedSurahs: doc.data().savedSurahs,
        secondPhoneNumber: doc.data().secondPhoneNumber,
        skills: doc.data().skills,
        status: doc.data().status,
        rejectionReasons: doc.data().rejectionReasons,
        studentState: doc.data().studentState,
        subjectANumber: doc.data().subjectANumber,
        subjectBNumber: doc.data().subjectBNumber,
        village: doc.data().village
      }));

      commit(MUTATIONS.STUDNETS.SET_STUDENTS, students);
    } catch (error) {
      console.log("FETCH_STUDENTS_BY_PARENT_ID", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async REGISTER_STUDENT({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let FirebaseStorageRef = FirebaseStorage.ref();
      payload.certificateURLs = [];

      if (payload.image) {
        let imageRef = FirebaseStorageRef.child(
          `Students/Personal/${payload.image.name}_${Date.now()}`
        );
        let snapshot = await imageRef.put(payload.image);
        payload.imageURL = await snapshot.ref.getDownloadURL();
      }

      if (payload.certificates.length > 0) {
        let cerArr = await payload.certificates.map(async certificate => {
          let certificateRef = FirebaseStorageRef.child(
            `Students/Certificates/${certificate.name}_${Date.now()}`
          );

          let snapshot = await certificateRef.put(certificate);

          return await snapshot.ref.getDownloadURL();
        });

        payload.certificateURLs = await Promise.all(cerArr);
      }

      const student = {
        name: `${payload.firstName} بن ${payload.secondName} بن ${payload.thirdName} ${payload.familyName}`,
        finishedClass: payload.finishedClass,
        firstPhoneNumber: payload.parentPhone1,
        secondPhoneNumber: payload.parentPhone2,
        village: payload.village,
        subjectANumber: payload.subjectANumber,
        subjectBNumber: payload.subjectBNumber,
        savedChapters: payload.savedChapters.map(chapter => chapter.name),
        savedSurahs: payload.savedSurahs.map(surah => surah.name),
        isLearntInCenterBefore: payload.isLearntInCenterBefore,
        oldCenterName: payload.oldCenterName,
        skills: payload.skills,
        centerKnownBy: payload.centerKnownBy,
        studentState: payload.studentState,
        diseases: payload.diseases,
        imageURL: payload.imageURL,
        certificates: payload.certificateURLs,
        parentId: payload.parentId,
        parentName: payload.parentName,
        createdAt: Date.now(),
        status: STUDENT_STATUS.REVIEW
      };

      await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
        .doc()
        .set(student);

      commit(MUTATIONS.UI.SET_MESSAGE, "تم تقديم الطلب بنجاح");

      Dialog.create({
        title: "تنبيه",
        message: "تم تقديم الطلب بنجاح"
      });
    } catch (error) {
      console.log("REGISTER_STUDENT", error);
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
  },
  async SAVE_ATTENDEANCE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    console.log(payload);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.ATTENDANCE)
        .doc()
        .set(payload);

      commit(MUTATIONS.UI.SET_MESSAGE, "تم الحفظ بنجاح");

      Dialog.create({
        title: "تنبيه",
        message: "تم الحفظ بنجاح"
      });
    } catch (error) {
      console.log("SAVE_ATTENDENACE", error);
      Dialog.create({
        title: "تنبيه",
        message: "حدث خطأ اثناء الحفظ"
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
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
