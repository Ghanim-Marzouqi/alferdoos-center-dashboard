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
  marks : [],
};

// Getters
const getters = {
  GET_SUBJECTS: state => state.subjects,
  GET_MARKS: state => state.marks
};

// Actions
const actions = {
  async FETCH_SUBJECTS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);
    try {
      let snapshot = null;
        snapshot = await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
          .get();
      

      let docs = snapshot.docs;

      if (docs.length > 0) {
        let subjects = docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          marks : doc.data().marks,
          teachers : doc.data().teachers,
          year : doc.data().year,
          description : doc.data().description,
          uplodedFiles : doc.data().files,
          files : [],
        }));

        commit(MUTATIONS.SUBJECTS.SET_SUBJECTS, subjects);
      }
      
    } catch (error) {
      console.log("FETCH_SUBJECTS", error);
      commit(MUTATIONS.UI.SET_ERROR, ERRORS.DATABASE.FETCH_SUBJECTS_FAIL);
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
            `subjects/${file.name}_${Date.now()}`
          );

          let snapshot = await fileRef.put(file);
          return {fileUrl : await snapshot.ref.getDownloadURL() , name : file.name }
        });

        payload.filesUrl = await Promise.all(cerArr);
      }
      let subject = {
        name : payload.name,
        files : payload.filesUrl,
        description : payload.description,
        createdAt : payload.createdAt,
        teachers : payload.teachers,
        createdBy : payload.createdBy,
        marks : payload.marks,
        year : payload.year
      }

      await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
        .doc()
        .set(subject);
        
        
        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.SUBJECT_SAVED
        });

      
    } catch (error) {
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.ADD_SUBJECT_FAIL
      });
      console.log("REGISTER_SUBJECT", error);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async DELETE_SUBJECT({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
      await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
        .doc(payload)
        .delete();

      commit(MUTATIONS.UI.SET_MESSAGE, {
        code: MESSAGES.DATABASE.SUBJECT_DELETED
      });
    } catch (error) {
      console.log("DELETE_STUDENT", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.DELETE_SUBJECT_ERROR
      });
    }

    commit(MUTATIONS.UI.SET_LOADING, false);
  },

  async UPDATE_SUBJECT({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {

      let FirebaseStorageRef = FirebaseStorage.ref();
      let files = [];

      if (payload.files.length > 0) {
        let cerArr = await payload.files.map(async file => {
          let fileRef = FirebaseStorageRef.child(
            `subjects/${file.name}_${Date.now()}`
          );

          let snapshot = await fileRef.put(file);
          return {fileUrl : await snapshot.ref.getDownloadURL() , name : file.name }
        });

        files = await Promise.all(cerArr);
      }

      payload.files = files.concat(payload.uplodedFiles);
  
      let subject = {
        id : payload.id,
        name : payload.name,
        description : payload.description,
        createdAt : payload.createdAt,
        createdBy : payload.createdBy,
        marks : payload.marks,
        files : payload.files
      }

      console.log(payload);

      await FirebaseDatabase.collection(COLLECTIONS.SUBJECTS)
        .doc(payload.id)
        .update(subject);

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.SUBJECT_UPDATED
        });

    
    } catch (error) {
      console.log("UPDATE_SUBJECT", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.UPDATE_SUBJECT_FAIL
      });
     
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async UPDATE_MARKS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {



      await FirebaseDatabase.collection(COLLECTIONS.MARKS)
        .doc(payload.id)
        .update(payload.object);

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.MARKS_UPDATED
        });

        
    } catch (error) {
      console.log("UPDATE_MARKS", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.MARKS_UPDATE_FAIL
      });

    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async SAVE_MARKS({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, true);

    try {
     
      await FirebaseDatabase.collection(COLLECTIONS.MARKS)
        .doc()
        .set(payload);

        commit(MUTATIONS.UI.SET_MESSAGE, {
          code: MESSAGES.DATABASE.MARKS_SAVED
        });

      
    } catch (error) {
      console.log("SAEV_MARKS", error);
      commit(MUTATIONS.UI.SET_ERROR, {
        code: ERRORS.DATABASE.MARKS_SAVING_FAIL
      });
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },
  async FETCH_MARKS({ commit }) {
    commit(MUTATIONS.UI.SET_LOADING, true);
    try {
      let snapshot = null;


        snapshot = await FirebaseDatabase.collection(COLLECTIONS.MARKS)
          .get();
      let docs = snapshot.docs;

      if (docs.length > 0) {
        let marks = docs.map(doc => ({
          id: doc.id,
          students : doc.data().students,
          subject : doc.data().subject,
          group : doc.data().group
        }));

        commit(MUTATIONS.SUBJECTS.SET_MARKS, marks);
      }
      
    } catch (error) {
      console.log("FETCH_MARKS", error);
      commit(MUTATIONS.UI.SET_ERROR, ERRORS.DATABASE.FETCH_SUBJECTS_FAIL);
    } finally {
      commit(MUTATIONS.UI.SET_LOADING, false);
    }
  },


};

// Mutations
const mutations = {
  SET_SUBJECTS: (state, subjects) => (state.subjects = subjects),
  SET_MARKS : (state,marks) => state.marks = marks,
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
