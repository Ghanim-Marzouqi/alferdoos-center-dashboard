import Vue from "vue";
import Vuex from "vuex";

// Vuex Store Modules
import auth from "./modules/auth";
import students from "./modules/students";
import settings from "./modules/settings";
import ui from "./modules/ui";
import groups from "./modules/groups";
import shared from "./modules/shared";

Vue.use(Vuex);

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      ui,
      auth,
      students,
      settings,
      // groups,
      shared
    },
    strict: process.env.DEV
  });

  return Store;
}
