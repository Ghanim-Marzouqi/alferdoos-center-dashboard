import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const state = {
  user: {},
  errors: [],
  messages: [],
  chapters: [],
  surahs: [],
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
