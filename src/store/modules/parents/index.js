import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const state = {
  user: {},
  errors: [],
  messages: [],
  chapters: [],
  surahs: [],
  loading: false,
  is_user_registered: false
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
