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
    commit(MUTATIONS.UI.SET_LOADING, true);
    try {
      let snapshot = null;


        snapshot = await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
          //.orderBy("createdAt", "desc")
          //.where("year", "==", payload.year )
          .get();
      

      let docs = snapshot.docs;

      console.log(docs);

      if (docs.length > 0) {
        let subjects = docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));

        commit(MUTATIONS.SUBJECTS.SET_SUBJECTS, subjects);
      }
      
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


};

// Mutations
const mutations = {
  SET_SUBJECTS: (state, subjects) => (state.subjects = subjects),

};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
