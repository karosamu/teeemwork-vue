<template>
  <div class="modal nondrag scrollbar flex vertical" @click="$emit('disable')">
    <div class="modal-content scrollbar box-shadow" @click.stop>
      <div class="task-modal-title-container">
        <div class="task-name-container">
          <div class="icon task"></div>
          <p class="text left task-modal-title">
            {{ task.name }}
          </p>
          <div v-if="task.asignee" class="asignee">
            <span v-if="task.asignee" class="text">Assigned user:</span>
            <div v-if="task.asignee" class="text asignee-text">
              - {{ asigneeInfo.name }} {{ asigneeInfo.surname }}
            </div>
          </div>
        </div>
        <div v-if="checkIfDescriptionExists" class="description-container">
          <div class="icon description"></div>
          <span class="text">Description</span>
          <div class="description-box">
            <code
              style="white-space: pre-wrap"
              class="text left description-text"
              >{{ task.description }}
            </code>
          </div>
        </div>
      </div>
      <CheckboxList
        :checkboxes="checkboxes"
        class="checkbox-list-component"
        :task="task"
      />
      <TaskLabelList
        class="label-list-component"
        :task="task"
        :labels="task.labels"
      />
    </div>
  </div>
</template>

<script>
import CheckboxList from "./CheckboxList";
import TaskLabelList from "./TaskLabelList";
import { mapState } from "vuex";
export default {
  name: "TaskModal",
  components: { CheckboxList, TaskLabelList },
  props: {
    checkboxes: {
      type: Array,
      default: () => {
        return {};
      }
    },
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
  computed: {
    ...mapState(["project", "users"]),
    asigneeInfo() {
      return this.users.find(x => x.id === this.task.asignee);
    },
    checkIfDescriptionExists() {
      if (
        this.task.description &&
        this.task.description != "" &&
        this.task.description != "\n"
      )
        return true;
      else return false;
    }
  }
};
</script>
