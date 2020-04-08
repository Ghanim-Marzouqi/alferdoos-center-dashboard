const GET_USER = state => state.user;
const GET_ERRORS = state => state.errors;
const GET_MESSAGES = state => state.messages;
const GET_CHAPTERS = state => state.chapters;
const GET_SURAHS = state => state.surahs;
const GET_LOADER = state => state.loading;
const GET_USER_REGISTRATION = state => state.is_user_registered;
const GET_REGISTERED_STUDENTS = state => state.registeredStudents;

export default {
  GET_USER,
  GET_ERRORS,
  GET_MESSAGES,
  GET_CHAPTERS,
  GET_SURAHS,
  GET_LOADER,
  GET_USER_REGISTRATION,
  GET_REGISTERED_STUDENTS
};
