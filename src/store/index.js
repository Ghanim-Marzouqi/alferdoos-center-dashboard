import Vue from "vue";
import Vuex from "vuex";

import users from "./modules/users";
import parents from "./modules/parents";

Vue.use(Vuex);

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      users,
      parents
    },
    strict: process.env.DEV
  });

  return Store;
}
