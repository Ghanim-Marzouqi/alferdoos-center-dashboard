// Import Needed Modules
import { MUTATIONS } from "../../config/constants";

// State
const state = {
  messages: [],
  errors: [],
  loading: false
};

// Getters
const getters = {
  GET_LOADING: state => state.loading,
  GET_ERRORS: state => state.errors,
  GET_MESSAGES: state => state.messages
};

// Actions
const actions = {
  SET_MESSAGE({ commit }, payload) {
    commit(MUTATIONS.UI.SET_MESSAGE, payload);
  },

  SET_ERROR({ commit }, error) {
    commit(MUTATIONS.UI.SET_ERROR, error);
  },

  SET_LOADING({ commit }, payload) {
    commit(MUTATIONS.UI.SET_LOADING, payload);
  },

  CLEAR_ERRORS_AND_MESSAGES({ commit }) {
    commit(MUTATIONS.UI.RESET_ERRORS_AND_MESSAGES);
  }
};

// Mutations
const mutations = {
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_MESSAGE(state, message) {
    state.errors = [];
    state.messages.push(message);
  },
  SET_ERROR(state, error) {
    state.errors.push(error);
  },
  RESET_ERRORS_AND_MESSAGES(state) {
    state.errors = [];
    state.messages = [];
  }
};

// Export
export default {
  state,
  getters,
  actions,
  mutations
};
