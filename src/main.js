import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase/app";
import "firebase/firestore";
import axios from "axios";
import { firestorePlugin } from "vuefire";
import store from "./store/index";
import Toasted from "vue-toasted";
import linkify from "vue-linkify";
import VueClipboard from "vue-clipboard2";

Vue.directive("linkified", linkify);
Vue.prototype.$axios = axios;
Vue.use(firestorePlugin);
Vue.use(Toasted);
Vue.use(VueClipboard);
Vue.config.productionTip = false;

Vue.toasted.register(
  "error",
  payload => {
    if (!payload.message) {
      return "Something Went Wrong";
    }
    return payload.message;
  },
  {
    containerClass: "custom-toast-container",
    className: "custom-toast-error",
    position: "top-right",
    duration: 5000,
    keepOnHover: true,
    action: {
      text: "close",
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      }
    }
  }
);

Vue.toasted.register(
  "success",
  payload => {
    if (!payload.message) {
      return "Something Went Wrong";
    }
    return payload.message;
  },
  {
    containerClass: "custom-toast-container",
    className: "custom-toast-success",
    position: "top-right",
    duration: 5000,
    keepOnHover: true,
    action: {
      text: "close",
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      }
    }
  }
);

Vue.toasted.register(
  "info",
  payload => {
    if (!payload.message) {
      return "Something Went Wrong";
    }
    return payload.message;
  },
  {
    containerClass: "custom-toast-container",
    className: "custom-toast-info",
    position: "top-right",
    duration: 5000,
    keepOnHover: true,
    action: {
      text: "close",
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      }
    }
  }
);

var firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
};

const init = firebase.initializeApp(firebaseConfig);
export const db = init.firestore();
export const projectsRef = db.collection("projects");
export const boardsRef = db.collection("boards");
export const groupsRef = db.collection("groups");
export const tasksRef = db.collection("tasks");
export const checkboxRef = db.collection("checkboxes");
export const labelsRef = db.collection("labels");
export const usersRef = db.collection("users");
export const statsRef = db.collection("stats");
export const logsRef = db.collection("logs");

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
