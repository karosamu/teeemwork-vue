<template>
  <div>
    <div
      id="task"
      class="task-cursor box-shadow animate text left"
      @click="taskModal = true"
    >
      <div v-if="task.labels" class="label-container" :style="style">
        <div
          v-for="label in task.labels"
          :key="label.id"
          :style="{ backgroundColor: label.color }"
          class="label"
        ></div>
      </div>
      <span class="task-title"
        ><div class="icon task"></div>
        <p class="task-name">{{ task.name }}</p>
      </span>
      <span class="asignee" v-if="task.asignee"
        >- {{ asigneeInfo.name }} {{ asigneeInfo.surname }}</span
      >
      <p v-if="task.description" class="task-container-description">
        {{ task.description }}
      </p>
      <div class="subtask-container" v-if="checkboxes.length > 0">
        <p>
          Subtasks
          <span class="subtask-counter"
            >({{ completed.length }}/{{ checkboxes.length }})</span
          >
        </p>
        <div
          :class="checkbox.checked ? 'completed' : 'incomplete'"
          class="subtask"
          v-for="checkbox in checkboxes"
          :key="checkbox.id"
        >
          <div>{{ checkbox.name }}</div>
          <div class="checkbox-asignee" v-if="checkbox.asignee">
            - {{ checkboxeAsigneeInfo(checkbox.asignee).name }}
            {{ checkboxeAsigneeInfo(checkbox.asignee).surname }}
          </div>
        </div>
      </div>
    </div>
    <TaskModal
      :checkboxes="checkboxes"
      v-if="taskModal"
      class="task-modal"
      :task="task"
      :groupid="groupid"
      @disable="taskModal = false"
    />
  </div>
</template>

<script>
import TaskModal from "./TaskModal";
import { mapState } from "vuex";
import { checkboxRef } from "../../main";
export default {
  name: "Task",
  components: { TaskModal },
  props: {
    task: {
      type: Object,
      default: () => {
        return {};
      }
    },
    groupid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      taskModal: false,
      checkboxes: {}
    };
  },
  computed: {
    ...mapState(["users"]),
    asigneeInfo() {
      return this.users.find(x => x.id === this.task.asignee);
    },
    style() {
      return (
        "grid-template-columns: repeat(" + this.task.labels.length + ", 1fr);"
      );
    },
    completed() {
      return this.checkboxes.filter(e => e.checked == true);
    }
  },
  methods: {
    checkboxeAsigneeInfo(id) {
      return this.users.find(x => x.id === id);
    }
  },
  firestore() {
    return {
      checkboxes: checkboxRef
        .where("task", "==", this.task.id)
        .orderBy("order", "asc")
    };
  }
};
</script>