import Vue from "vue";
import Vuex from "vuex";

import admins from "./modules/admins";
import parents from "./modules/parents";
import teachers from "./modules/teacher";

Vue.use(Vuex);

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      admins,
      parents,
      teachers,
    },
    strict: process.env.DEV,
  });

  return Store;
}
