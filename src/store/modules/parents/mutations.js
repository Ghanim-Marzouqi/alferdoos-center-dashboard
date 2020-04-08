const SET_USER = (state, user) => (state.user = user);

const SET_MESSAGE = (state, payload) => {
  state.errors = [];
  state.messages.push(payload);
};

const SET_ERROR = (state, error) => state.errors.push(error);

const RESET_ERRORS_AND_MESSAGES = state => {
  state.errors = [];
  state.messages = [];
};

const SET_LOADER = (state, value) => (state.loading = value);

const SET_REGISTRATION = (state, value) => (state.is_user_registered = value);

export default {
  SET_USER,
  SET_MESSAGE,
  SET_ERROR,
  RESET_ERRORS_AND_MESSAGES,
  SET_LOADER,
  SET_REGISTRATION
};
