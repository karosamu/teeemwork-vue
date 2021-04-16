import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import Profile from "../views/Profile.vue";
import MainContent from "../components/MainContent.vue";
import Board from "../views/Board.vue";
import Share from "../views/Share.vue";
import Project from "../views/Project.vue";
import Homepage from "../components/Homepage.vue";
import firebase from "firebase/app";
import { boardsRef, projectsRef } from "../main";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    components: {
      mainRouter: Home
    },
    meta: {
      allowSidebar: false
    }
  },
  {
    path: "/main",
    name: "mainapp",
    components: {
      mainRouter: MainContent
    },
    meta: {
      allowSidebar: true,
      requiresAuth: true
    },
    props: true,
    children: [
      {
        path: "/project/:projectid/board/:boardid",
        name: "board",
        components: {
          contentRouter: Board
        },
        props: {
          contentRouter: true
        },
        meta: {
          requiresUserInList: true,
          allowSidebar: true
        }
      },
      {
        path: "/profile",
        name: "profile",
        components: {
          contentRouter: Profile
        },
        meta: {
          allowSidebar: false,
          requiresAuth: true
        }
      },
      {
        path: "/project/:projectid",
        name: "project",
        components: {
          contentRouter: Project
        },
        props: {
          contentRouter: true
        },
        meta: {
          requiresUserInList: true,
          allowSidebar: true
        }
      },
      {
        path: "/homepage",
        name: "homepage",
        components: {
          contentRouter: Homepage
        },
        meta: {
          allowSidebar: true
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    components: {
      mainRouter: Login
    },
    meta: {
      alreadyAuthed: true,
      allowSidebar: false
    }
  },
  {
    path: "/signup",
    name: "signup",
    components: {
      mainRouter: SignUp
    },
    meta: {
      alreadyAuthed: true,
      allowSidebar: false
    }
  },
  {
    path: "/public/:projectid/board/:boardid",
    name: "public",
    components: {
      mainRouter: Share
    },
    meta: {
      allowPublic: true
    },
    props: {
      mainRouter: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const allowPublic = to.matched.some(record => record.meta.allowPublic);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const alreadyAuthed = to.matched.some(record => record.meta.alreadyAuthed);
  const isAuthenticated = firebase.auth().currentUser;
  const requiresUserInList = to.matched.some(
    record => record.meta.requiresUserInList
  );
  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (alreadyAuthed && isAuthenticated) {
    next("/homepage");
  } else if (requiresUserInList) {
    projectsRef
      .doc(to.params.projectid)
      .get()
      .then(doc => {
        if (doc.data())
          if (doc.data().users.includes(firebase.auth().currentUser.uid))
            next();
          else {
            next("/homepage");
            this.$toasted.global.error({
              message: "You don't have permissions to access this."
            });
          }
        else {
          next("/homepage");
          this.$toasted.global.error({
            message: "You don't have permissions to access this."
          });
        }
      })
      .catch(error => {
        this.$toasted.global.error({
          message: error
        });
      });
  } else if (to.name === "public" && allowPublic) {
    boardsRef
      .doc(to.params.boardid)
      .get()
      .then(doc => {
        console.log(doc.data().allowPublic);
        if (doc.data().allowPublic) next();
        else next("/homepage");
      });
  } else {
    next();
  }
});

export default router;
