<template>
  <div class="side-shadow sidebar project-list scrollbar">
    <div class="nav-main projects-overview-link">
      <router-link to="/homepage">Projects overview</router-link>
    </div>

    <div class="new-project-container box-shadow">
      <button v-if="!newOpen" class="new-project" @click="openProjectEntry">
        <div class="flex horizontal text">
          <div class="icon plus"></div>
          Project
        </div>
      </button>
      <form class="edit-form" @submit.prevent="addProject">
        <input
          v-if="newOpen"
          ref="project"
          v-model="newProjectName"
          placeholder="Project name"
          class="new-project-input"
          minlength="1"
          maxlength="100"
          type="text"
          @blur="newOpen = false"
        />
      </form>
    </div>
    <div class="project-box" v-if="returnOwnedProjects.length >= 1">
      <div class="ownership text left">User owned projects</div>
      <Project
        v-for="project in returnOwnedProjects"
        :key="project.id"
        class="project-item box-shadow"
        :project="project"
      />
    </div>
    <div class="project-box" v-if="returnNonOwnerProjects.length >= 1">
      <div class="ownership text left">Other boads</div>
      <Project
        v-for="project in returnNonOwnerProjects"
        :key="project.id"
        class="project-item box-shadow"
        :project="project"
      />
    </div>
  </div>
</template>

<script>
import { projectsRef, statsRef } from "../../main";
import firebase from "firebase/app";
import { mapState } from "vuex";
import Project from "./Project.vue";
export default {
  name: "Sidebar",
  components: { Project },
  data() {
    return {
      newProjectName: "",
      count: 0,
      newOpen: false
    };
  },
  computed: {
    ...mapState(["projects"]),
    returnOwnedProjects() {
      return this.projects.filter(
        e => e.owner === firebase.auth().currentUser.uid
      );
    },
    returnNonOwnerProjects() {
      return this.projects.filter(
        e =>
          e.owner !== firebase.auth().currentUser.uid &&
          (e.boards > 0 || this.checkIfTask(e) || this.checkIfAdmin(e) || this.checkIfBoard(e))
      );
    },
  },
  methods: {
    openProjectEntry() {
      this.newOpen = true;
      this.$nextTick(() => {
        this.$refs.project.focus();
      });
    },
    checkIfTask(project) {
      return project.permTask.includes(firebase.auth().currentUser.uid);
    },
    checkIfAdmin(project) {
      return project.permAdmin.includes(firebase.auth().currentUser.uid);
    },
    checkIfBoard(project) {
      return project.permBoard.includes(firebase.auth().currentUser.uid)
    },
    addProject: function() {
      if (
        this.newProjectName.length >= 1 &&
        this.newProjectName.length <= 100
      ) {
        this.newOpen = false;
        projectsRef
          .add({
            name: this.newProjectName,
            owner: firebase.auth().currentUser.uid,
            createdAt: firebase.firestore.Timestamp.now(),
            order: this.count[0].count + 1,
            users: firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.uid
            ),
            permAdmin: [],
            permBoard: [],
            permGroup: [],
            permTask: []
          })
          .then(docRef => {
            this.$router.push({
              name: "project",
              params: { projectid: docRef.id }
            });
            this.newProjectName = "";
            statsRef.doc("projectcount").update({
              count: firebase.firestore.FieldValue.increment(1)
            });
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    }
  },
  firestore() {
    return {
      count: statsRef
    };
  }
};
</script>

<style lang="scss" scoped>
.project-box {
  transition: var(--animation-duration);
  margin: 20px 0 0 0;
}

.sidebar {
  background-color: var(--sidebar-background);
  width: 300px;
  max-height: calc(100vh - 50px);
}
.edit-form {
  height: 100%;
  width: 100%;
}
.project-list {
  padding: 10px;
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
  grid-gap: 4px;
  height: max-content;
  overflow-y: auto;
}

.project {
  transition: var(--animation-duration);
  background-color: var(--project-background);
}

.project-item {
  margin: 15px 0;
  padding: 10px;
}

.projects-overview-link {
  text-align: left;
  margin: 10px 0 20px 0;
}

.new-project-container {
  transition: var(--animation-duration);
  background-color: var(--project-new-background);
  height: 60px;
}
.new-project-input {
  height: 100%;
  width: 100%;
  background-color: #ffffff00;
  border: none;
  outline: none;
  color: var(--foreground);
  padding: 10px;
}
.new-project {
  background-color: #00000000;
  outline: none;
  border: none;
  cursor: pointer;
  width: 100%;
  height: 100%;
  text-align: left;
  padding-left: 10px;
  color: var(--foreground);
}

.ownership {
  margin: 10px 0;
}
</style>
