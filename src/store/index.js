import Vue from "vue";
import Vuex from "vuex";

// Vuex Store Modules
import auth from "./modules/auth";
import groups from "./modules/groups";
import settings from "./modules/settings";
import students from "./modules/students";
import teachers from "./modules/teachers";
import ui from "./modules/ui";

Vue.use(Vuex);

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      groups,
      settings,
      students,
      teachers,
      ui
    },
    strict: process.env.DEV
  });

  return Store;
}
