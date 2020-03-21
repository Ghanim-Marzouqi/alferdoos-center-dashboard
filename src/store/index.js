import Vue from "vue";
import Vuex from "vuex";

import users from "./modules/users";
import parents from "./modules/parents";
import registered_students from "./modules/registered_students";

Vue.use(Vuex);

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      users,
      parents,
      registered_students
    },
    strict: process.env.DEV
  });

  return Store;
}
