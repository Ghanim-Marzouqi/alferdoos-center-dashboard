import { FirebaseAuth, FirebaseDatabase } from "boot/firebase";
import { COLLECTIONS, URL } from "../../../config/constants";

//#region AUTH
const LOGIN = async ({ commit }, payload) => {
  try {
    // Autheticate User Using Firebase Authentication
    let auth_response = await FirebaseAuth.signInWithEmailAndPassword(
      payload.email,
      payload.password
    );

    // Fetch User Data From Firebase Firestore
    if (auth_response.user.uid) {
      let doc = await FirebaseDatabase.collection(COLLECTIONS.PARENTS)
        .doc(auth_response.user.uid)
        .get();
      if (doc.exists) {
        commit("SET_SUCCESS", doc.data());
        commit("SET_USER", doc.data());
      }
    }
  } catch (error) {
    console.log(error);
    commit("SET_ERROR", error);
  }
};

const REGISTER = async ({ commit }, payload) => {
  try {
    // Register New User In Firebase Authentication
    let auth_response = await FirebaseAuth.createUserWithEmailAndPassword(
      payload.email,
      payload.password
    );

    if (auth_response.user.uid) {
      // Get User Id From Firebase Authentication
      payload.id = auth_response.user.uid;

      // TODO: Register User Phone In Firebase Authentication

      // Register New User In Firebase Firestore
      await FirebaseDatabase.collection(COLLECTIONS.PARENTS)
        .doc(payload.id)
        .set({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          isActive: true,
        });

      // Send Verification Email
      await auth_response.user.sendEmailVerification();

      // Sign Out User
      await FirebaseAuth.signOut();

      commit("SET_SUCCESS", payload);
    }
  } catch (error) {
    console.log(error);
    commit("SET_ERROR", error);
  }
};

const TRIGGER_USER_STATE = ({ commit }) => {
  FirebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      FirebaseDatabase.collection(COLLECTIONS.PARENTS)
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          commit("SET_USER", snapshot.data());
        })
        .catch((error) => {
          commit("SET_ERROR", error);
        });
    } else {
      commit("SET_USER", {});
    }
  });
};

const RESET_PASSWORD = async ({ commit }, payload) => {
  try {
    await FirebaseAuth.sendPasswordResetEmail(payload.email);
    commit("SET_SUCCESS", { message: "success" });
  } catch (error) {
    commit("SET_ERROR", error);
  }
};

const LOGOUT = ({}) => {
  FirebaseAuth.signOut();
};
//#endregion

//#region REGUSTER STUDENT
const FETCH_CHAPTERS = async ({ commit }) => {
  let response = await FirebaseDatabase.collection(COLLECTIONS.QURAN_CHAPTERS)
    .orderBy("id", "asc")
    .get();

  let docs = response.docs;

  let chapters = docs.map((chapter) => ({
    id: chapter.data().id,
    name: chapter.data().name,
    selected: false,
  }));

  commit("SET_CHAPTERS", chapters);
};

const FETCH_SURAHS = async ({ commit }) => {
  let response = await FirebaseDatabase.collection(COLLECTIONS.QURAN_SURAHS)
    .orderBy("id", "asc")
    .get();

  let docs = response.docs;

  let surahs = docs.map((surah) => ({
    id: surah.data().id,
    name: surah.data().name,
    chapter: surah.data().chapter,
    phrases: surah.data().phrases,
  }));

  commit("SET_SURAHS", surahs);
};

const REGISTER_STUDENT = async ({ commit }, payload) => {
  if (payload.image) {
    // TODO: Upload Student Image
  }

  if (payload.certificates.length > 0) {
    // TODO: Upload Student Certificates
  }

  const student = {
    name: `${payload.firstName} بن ${payload.secondName} بن ${payload.thirdName} ${payload.familyName}`,
    finishedClass: payload.finishedClass,
    firstPhoneNumber: payload.parentPhone1,
    secondPhoneNumber: payload.parentPhone2,
    village: payload.village,
    subjectANumber: payload.subjectANumber,
    subjectBNumber: payload.subjectBNumber,
    savedChapters: payload.savedChapters.map((chapter) => chapter.name),
    savedSurahs: payload.savedSurahs.map((surah) => surah.name),
    isLearntInCenterBefore: payload.isLearntInCenterBefore,
    skills: payload.skills,
    centerKnownBy: payload.centerKnownBy,
    studentState: payload.studentState,
    diseases: payload.diseases,
    imageURL: `${URL}/RegisteredStudents/${payload.image.name}`,
    certificates: payload.certificates.map(
      (certificate) => `${URL}/RegisteredStudents/${certificate.name}`
    ),
    parentId: payload.parentId,
  };

  try {
    await FirebaseDatabase.collection(COLLECTIONS.REGISTERED_STUDENTS)
      .doc()
      .set(student);

    commit("SET_SUCCESS", "تم تسجيل المستخدم بنجاح");
  } catch (error) {
    console.log(error);
    commit("SET_ERROR", "حدث خطأ اثناء التسجيل");
  }
};
//#endregion

const LOG_ERROR = ({ commit }, error) => {
  commit("SET_ERROR", error);
};

const CLEAR_ERRORS_AND_MESSAGES = ({ commit }) => {
  commit("RESET_ERRORS_AND_MESSAGES");
};

export default {
  LOGIN,
  REGISTER,
  TRIGGER_USER_STATE,
  RESET_PASSWORD,
  LOGOUT,
  LOG_ERROR,
  CLEAR_ERRORS_AND_MESSAGES,
  FETCH_CHAPTERS,
  FETCH_SURAHS,
  REGISTER_STUDENT,
};
