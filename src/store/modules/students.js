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
  studentGroup: {},
  attendance : [],
  attendanceRange : [],
  attendanceByGrp : [],
  execuses : [],
  behaviors : [],
  activities :[],
};

// Getters
const getters = {
  GET_BEHAVIORS : state => state.behaviors,
  GET_STUDENTS: state => state.students,
  GET_ATTENDANCE: state => state.attendance,
  GET_ATTENDANCE_RANGE_DATE: state => state.attendanceRange,
  GET_ATTENDANCE_BY_GRP : state => state.attendanceByGrp,
  GET_STUDENTS_MARKS: state => state.studentMarks,
  GET_STUDENT_ANSWERS: state => state.studentAnswers,
  GET_STUDENTS_AND_MARKS: state => state.studentsAndMarks,
  GET_EXECUSES : state => state.execuses,
  GET_ACTIVITIES : state => state.activities,
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
  async DELETE_BEHAVIOR({ commit }, payload) {
    try {
      await FirebaseDatabase.collection(COLLECTIONS.BEHAVIORS)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.STUDENT_BEHAVIOR_DELETED
      });
    } catch (error) {
      console.log("DELETE_STUDENT", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.STUDENT_DELETE_BEHAVIOER_ERROR
      });
    }
  },
  async STUDENT_ACTIVITY_DELETED({ commit }, payload) {
    try {
      await FirebaseDatabase.collection(COLLECTIONS.ACTIVITIES)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.STUDENT_ACTIVITY_DELETED
      });
    } catch (error) {
      console.log("DELETE_STUDENT", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.STUDENT_DELETE_ACTIVITY_ERROR
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
  },
  async FETCH_ATTENDANCE({ commit }, payload) {

    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let snapshot = null;
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.ATTENDANCE)
          .where("date", "==", payload.year)
          .get();

      let docs = snapshot.docs;
      let attendance = docs.map(doc => ({
        id : doc.id,
        attendance: doc.data().attendance,
        date: doc.data().date,
        group: doc.data().group,
        session: doc.data().session,
      }));
      // type == 1 means only one date fetch , otherwise its many dates fetching
      if (payload.type == 1)
          commit(MUTATIONS.STUDNETS.SET_ATTENDANCE, attendance);
      else 
        commit(MUTATIONS.STUDNETS.SET_ATTENDANCE_RANGE_DATE, attendance);
    } catch (error) {
      console.log("FETCH_ATTENDANCE", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },

  async FETCH_ATTENDANCE_BY_GROUP({ commit }, payload) {

    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let snapshot = null;
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.ATTENDANCE)
          .where("group", "==", payload.group)
          .get();

      let docs = snapshot.docs;
      let attendance = docs.map(doc => ({
        id : doc.id,
        attendance: doc.data().attendance,
        date: doc.data().date,
        group: doc.data().group,
        session: doc.data().session,
      }));

          commit(MUTATIONS.STUDNETS.SET_ATTENDENACE_BY_GRP, attendance);
    } catch (error) {
      console.log("FETCH_ATTENDANCE_BY_GROUP", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },
  
  async UPDATE_ATTENDANCE({ commit }, payload) {

    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.ATTENDANCE)
        .doc(payload.id)
        .get();

      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.ATTENDANCE)
          .doc(payload.id)
          .update({
            attendance : payload.attendance
          });

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.STUDENT_ATTENDANCE_UPDATED
        });
      } else {
        commit(MUTATIONS.UI.SET_ERROR, {
          code: ERRORS.DATABASE.ATTENDANCE_RECORD_NOT_FOUND
        });
      }
    } catch (error) {
      console.log("EDIT_APPLICATION_STATUS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.UPDATE_ATTENDANCE_STATUS_ERROR
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },
  async UPDATE_BEHAVIOR({ commit }, payload) {

    commit(MUTATIONS.UI.SET_LOADING, true);

    try {


    
        await FirebaseDatabase.collection(COLLECTIONS.BEHAVIORS)
          .doc(payload.id)
          .update(payload);

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.BEHAVIOR_UPDATED
        });

      
    } catch (error) {
      console.log("EDIT_APPLICATION_STATUS ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.UPDATE_BEHAVIOR_FAIL
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },
  async UPDATE_ACTIVITY({ commit }, payload) {

    commit(MUTATIONS.UI.SET_LOADING, true);

    try {

        await FirebaseDatabase.collection(COLLECTIONS.ACTIVITIES)
          .doc(payload.id)
          .update(payload.obj);

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.ACTIVITY_UPDATED
        });

      
    } catch (error) {
      console.log("EDIT_ACTIVITY ERROR", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.UPDATE_ACTIVITY_FAIL
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },
  async ADD_EXECUSE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let FirebaseStorageRef = FirebaseStorage.ref();
     

    
      if (payload.files.length > 0) {
        let cerArr = await payload.files.map(async file => {
          let fileRef = FirebaseStorageRef.child(
            `execuses/${file.name}_${Date.now()}`
          );

          let snapshot = await fileRef.put(file);
          return await snapshot.ref.getDownloadURL();
        });

        payload.files = await Promise.all(cerArr);
      }

      await FirebaseDatabase.collection(COLLECTIONS.EXECUSES)
        .doc()
        .set(payload);
        commit(MUTATIONS.UI.SET_MESSAGE, { code:  MESSAGES.DATABASE.EXECUSE_ADDED});

      
    } catch (error) {
      commit(MUTATIONS.UI.SET_ERROR, { code : ERRORS.DATABASE.ADD_EXECUSE_FAIL});
      console.log("ADD_EXECUSE", error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async ADD_BEHAVIOR({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {   

      await FirebaseDatabase.collection(COLLECTIONS.BEHAVIORS)
        .doc()
        .set(payload);
        commit(MUTATIONS.UI.SET_MESSAGE, { code:  MESSAGES.DATABASE.BEHAVIOR_ADDED});

      
    } catch (error) {
      commit(MUTATIONS.UI.SET_ERROR,  { code : ERRORS.DATABASE.ADD_BEHAVIOR_FAIL});
      console.log("ADD_BEHAVIOR", error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async ADD_ACTIVITY({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {   

      await FirebaseDatabase.collection(COLLECTIONS.ACTIVITIES)
        .doc()
        .set(payload);
        commit(MUTATIONS.UI.SET_MESSAGE, { code:  MESSAGES.DATABASE.ACTIVITY_ADDED});

      
    } catch (error) {
      commit(MUTATIONS.UI.SET_ERROR,  { code : ERRORS.DATABASE.ADD_ACTIVITY_ERROR});
      console.log("ADD_ACTIVITY", error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  RESET_ATTENDANCE_RANGE_DATE({ commit }){
    commit(MUTATIONS.STUDNETS.RESET_ATTENDANCE_RANGE_DATE);
  },
  async FETCH_EXECUSES({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      let snapshot = null;
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.EXECUSES)
          .where("date", "==", payload.year)
          .get();

      let docs = snapshot.docs;
      let execuses = docs.map(doc => ({
        id : doc.id,
        date : doc.data().date,
        student: doc.data().student,
        files :doc.data().files,
        title: doc.data().title,
        description: doc.data().description,
        group: doc.data().group,
        session: doc.data().session,
      }));

      
      commit(MUTATIONS.STUDNETS.SET_EXECUSES, execuses);
      
    } catch (error) {
      console.log("FETCH_ATTENDANCE", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },
  async FETCH_BEHAVIOR({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      console.log('payload',payload)

      // TODO after adding active semester , add it here
      let snapshot = null;
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.BEHAVIORS)
          .where("year", "==", payload.year)
          //.where("semester","==",payload.semester)
          .get();

      let docs = snapshot.docs;
      let behavior = docs.map(doc => ({
        id : doc.id,
        date : doc.data().date,
        behaviorType : doc.data().type,
        year: doc.data().year,
        semester :doc.data().semester,
        title: doc.data().title,
        description: doc.data().description,
        student: doc.data().student,
        createdBy : doc.data().createdBy,
      }));

      
      commit(MUTATIONS.STUDNETS.SET_BEHAVIORS, behavior);
      
    } catch (error) {
      console.log("FETCH_BEHAVIOR", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },
  async FETCH_ACTIVITIES({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {

      let snapshot = null;
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.ACTIVITIES)
          .where("year", "==", payload.year)
          //.where("semester","==",payload.semester)
          .get();

      let docs = snapshot.docs;
      let activities = docs.map(doc => ({
        id : doc.id,
        isDone : doc.data().isDone,
        startDate : doc.data().startDate,
        endDate : doc.data().endDate,
        year: doc.data().year,
        feedback  : doc.data().feedback,
        semester :doc.data().semester,
        title: doc.data().title,
        description: doc.data().description,
        group: doc.data().group,
        createdBy : doc.data().createdBy,
        createdAt: doc.data().createdAt,
      }));
      activities = activities.sort((a,b) => a.createdAt - b.createdAt ) 
      commit(MUTATIONS.STUDNETS.SET_ACTIVITIES, activities);
      
    } catch (error) {
      console.log("FETCH_ACTIVITIES", error);
      commit(MUTATIONS.UI.SET_ERROR, error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }

  },

};

// Mutations 
const mutations = {
  SET_BEHAVIORS : (state, behaviors) => (state.behaviors = behaviors),
  SET_STUDENTS: (state, students) => (state.students = students),
  SET_ATTENDANCE: (state, attendance) => state.attendance = attendance,
  RESET_ATTENDANCE_RANGE_DATE : (state) => state.attendanceRange = [],
  SET_ATTENDANCE_RANGE_DATE(state, records){
    records.forEach((c) =>
    c.attendance.forEach((a) => {
      a.session = c.session;
      a.date = c.date;
      a.docId = c.id
    })
  );
    state.attendanceRange.push(records.map(c=> c.attendance))
  },
  SET_ACTIVITIES: (state, acts) => (state.activities = acts),
  SET_EXECUSES : (state, execuses) => (state.execuses = execuses),
  SET_STUDENTS_MARKS: (state, studentMarks) => (state.studentMarks = studentMarks),
  SET_STUDENT_ANSWERS: (state, answers) => (state.studentAnswers = answers),
  SET_ATTENDENACE_BY_GRP : (state, records) => state.attendanceByGrp = records,
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
