import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../main";
import firebase from "firebase/app";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    loaded: true,
    toggled: true,
    search: "",
    projects: [],
    users: [],
    project: []
  },
  getters: {
    getLoaded: state => state.loaded,
    getToggled: state => state.toggled,
    getSearch: state => state.search
  },
  actions: {
    enableLoading({ commit }) {
      commit("updateLoaded", true);
    },
    disableLoading({ commit }) {
      commit("updateLoaded", false);
    },
    enableToggled({ commit }) {
      commit("updateToggled", true);
    },
    disableToggled({ commit }) {
      commit("updateToggled", false);
    },
    bindProjects: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef(
        "projects",
        db
          .collection("projects")
          .where(
            "users",
            "array-contains",
            `${firebase.auth().currentUser.uid}`
          )
          .orderBy("createdAt", "desc")
      );
    }),
    bindProject: firestoreAction(({ bindFirestoreRef }, id) => {
      return bindFirestoreRef("project", db.collection("projects").doc(id));
    }),
    bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef("users", db.collection("users"));
    })
  },
  mutations: {
    updateLoaded(state, loaded) {
      Vue.set(state, "loaded", loaded);
    },
    updateToggled(state, toggled) {
      Vue.set(state, "toggled", toggled);
    },
    setSearch(state, search) {
      Vue.set(state, "search", search);
    },
    setProjects(state, array) {
      Vue.set(state, "projects", array);
    },
    ...vuexfireMutations
  }
});
