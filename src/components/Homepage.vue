<template>
  <div class="statistics scrollbar" v-if="projects">
    <div v-if="projects.length < 1">
      <h1 class="text no-projects">
        You have no projects, create one by clicking the
        <span class="colored-text">+ Project</span> button to the side
      </h1>
    </div>
    <StatisticsModule
      :project="project"
      v-for="project in returnOwnedProjects"
      :key="project.id"
    />
    <StatisticsModule
      :project="project"
      v-for="project in returnNonOwnerProjects"
      :key="project.id"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase/app";
import StatisticsModule from "./sidebar/project-statistics/StatisticsModule";
export default {
  name: "Homepage",
  components: { StatisticsModule },
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
          (e.boards > 0 || e.allowAddBoards)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.statistics {
  overflow-x: auto;
  overflow-y: auto;
}

.no-projects {
  font-size: 30px;
  margin: 50px 20px 0 20px;
}
</style>
