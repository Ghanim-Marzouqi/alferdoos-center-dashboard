// Import Needed Modules
import { FirebaseDatabase } from "boot/firebase";
import {
  COLLECTIONS,
  MUTATIONS,
  STUDENT_STATUS,
  MESSAGES,
  ERRORS
} from "../../config/constants";

// State
const state = {
  students: []
};

// Getters
const getters = {};

// Actions
const actions = {
  async FETCH_STUDENTS({ commit }, payload) {
    // Activate Loader
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      // Create Students Snapshot Instance
      let snapshot = null;

      // Check Student Status And Fetch Student Based On Status
      if (payload.status) {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .where("status", "==", payload.status)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .orderBy("createdAt", "desc")
          .get();
      }

      // Get Students Records
      let docs = snapshot.docs;

      // Create A New Array From Students Records
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

      // Set Students
      commit(MUTATIONS.STUDNETS.SET_STUDENTS, students);

      // Deactivate Loader
      commit(MUTATIONS.UI.SET_LOADING, false);
    } catch (error) {
      // Display Error In Console
      console.log("FETCH_STUDENTS", error);
      // Set Error (Fetch Student Action)
      commit(MUTATIONS.UI.SET_ERROR, error);
      // Deactivate Loader
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },

  async REGISTER_STUDENT({ commit }, payload) {
    // Activate Loading
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      // Create Firebase Storage Reference
      let FirebaseStorageRef = FirebaseStorage.ref();
      payload.certificateURLs = [];

      // Upload Student Personal Image
      if (payload.image) {
        let imageRef = FirebaseStorageRef.child(
          `Students/Personal/${payload.image.name}_${Date.now()}`
        );
        let snapshot = await imageRef.put(payload.image);
        payload.imageURL = await snapshot.ref.getDownloadURL();
      }

      // Upload Student Certificates
      if (payload.certificates.length > 0) {
        let cerArr = await payload.certificates.map(async certificate => {
          // Create File Reference
          let certificateRef = FirebaseStorageRef.child(
            `Students/Certificates/${certificate.name}_${Date.now()}`
          );

          // Get File Snapshot
          let snapshot = await certificateRef.put(certificate);

          // Get File Download URL
          return await snapshot.ref.getDownloadURL();
        });

        // push results
        payload.certificateURLs = await Promise.all(cerArr);
      }

      // Create Student Object
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

      // Insert Student Data Inside Firebase Firestore
      await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
        .doc()
        .set(student);

      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
      // Set Message
      commit(MUTATIONS.UI.SET_MESSAGE, "تم تقديم الطلب بنجاح");

      // Display Dialog Message
      Dialog.create({
        title: "تنبيه",
        message: "تم تقديم الطلب بنجاح"
      });
    } catch (error) {
      // Display Error In Console
      console.log("REGISTER_STUDENT", error);
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
      // Display Error Message
      Dialog.create({
        title: "تنبيه",
        message: "حدث خطأ اثناء التسجيل"
      });
    }
  },

  async DELETE_STUDENT({ commit }, payload) {
    try {
      // Delete Registered Student
      await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
        .doc(payload)
        .delete();

      // Commit Success Message
      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.STUDENT_FORM_RECORD_DELETED
      });
    } catch (error) {
      // Display Error In Console
      console.log("DELETE_STUDENT", error);
      // Commit Error Message
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.STUDENT_FORM_RECORD_NOT_DELETED
      });
    }
  },

  async EDIT_STUDENT_STATUS({ commit }, payload) {
    // Activate Loader
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      // Get Registered Student Data
      let doc = await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
        .doc(payload.id)
        .get();

      // Check If Student Data Exists
      if (doc.exists) {
        await FirebaseDatabase.collection(COLLECTIONS.STUDENTS)
          .doc(payload.id)
          .update({
            status: payload.status,
            rejectionReasons: payload.reasons
          });

        // Set Message
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.APPLICATION_STATUS_UPDATED
        });
      } else {
        // Set Error (Student Not Found)
        commit(MUTATIONS.UI.SET_ERROR, { code: ERRORS.STUDENT_NOT_FOUND });
      }

      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    } catch (error) {
      // Display Error In Console
      console.log("EDIT_APPLICATION_STATUS ERROR", error);
      // Set Error (Edit Application Status Error)
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.EDIT_APPLICATION_STATUS_ERROR
      });
      // Deactivate Loading
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  }
};

// Mutations
const mutations = {
  SET_STUDENTS: (state, students) => (state.students = students)
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
