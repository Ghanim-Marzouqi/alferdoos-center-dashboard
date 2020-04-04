const SET_USER = (state, user) => (state.user = user);

const SET_SUCCESS = (state, payload) => {
  state.errors = [];
  state.messages.push(payload);
};

const SET_ERROR = (state, error) => state.errors.unshift(error);

const RESET_ERRORS_AND_MESSAGES = (state) => {
  state.errors = [];
  state.messages = [];
};

const SET_CHAPTERS = (state, chapters) => (state.chapters = chapters);

const SET_SURAHS = (state, surahs) => (state.surahs = surahs);

export default {
  SET_USER,
  SET_SUCCESS,
  SET_ERROR,
  RESET_ERRORS_AND_MESSAGES,
  SET_CHAPTERS,
  SET_SURAHS,
};
