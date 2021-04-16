<template>
  <div ref="groups" class="box-shadow scrollbar task-list-parent">
    <div class="static-top">
      <div class="group-title text left">
        <div class="title">
          <div class="icon group"></div>

          <p class="group-name">
            {{ group.name }}
            <span class="task-length">({{ tasks.length }})</span>
          </p>
        </div>
      </div>
    </div>
    <div class="task-list animate">
      <Task
        v-for="task in getTaskList"
        :key="task.id"
        :task="task"
        :groupid="group.id"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { tasksRef } from "../../main";
import Task from "./Task.vue";
export default {
  name: "Group",
  components: { Task },
  props: {
    projectid: {
      type: String,
      default: ""
    },
    found: {
      type: Boolean,
      default: false
    },
    boardid: {
      type: String,
      default: ""
    },
    group: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      tasks: [],
      foundTasks: [],
      hasScroll: false
    };
  },
  updated() {
    this.$nextTick(() => {
      this.hasScroll =
        this.$refs.groups.scrollHeight > this.$refs.groups.clientHeight;
    });
  },
  computed: {
    ...mapState(["search", "projects"]),
    getSearchResults() {
      return this.$store.getters.getSearch;
    },
    getTaskList() {
      if (this.search !== "") {
        return this.tasks.filter(e =>
          e.name.toLowerCase().includes(this.getSearchResults.toLowerCase())
        );
      } else return this.tasks;
    },
    listPopulated() {
      return this.getTaskList.length > 0;
    },
    project() {
      return this.projects.find(x => x.id === this.projectid);
    }
  },
  firestore() {
    return {
      tasks: tasksRef
        .orderBy("order", "desc")
        .where("group", "==", `${this.group.id}`)
    };
  }
};
</script>
