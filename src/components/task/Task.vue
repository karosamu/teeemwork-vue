<template>
  <div>
    <div
      :class="taskModal ? 'disable-drag' : 'enable-drag'"
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
      <span v-if="!editing" class="task-title"
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
      newTaskName: "",
      taskModal: false,
      editing: false,
      editTaskName: "",
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

<style lang="scss">
#task {
  margin: 10px 10px 20px 10px;
  color: var(--task-foreground);
  background-color: var(--task-background);
  min-height: 50px;
  width: 230px;
  display: flex;
  justify-content: space-between;
  position: relative;

  .task-container-description {
    margin: 0 10px 10px 10px;
    color: var(--foreground-light);
    transition: var(--animation-duration);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; /* number of lines to show */
    line-height: 1em; /* fallback */
    max-height: 1em * 3; /* fallback */
  }

  .subtask-counter {
    opacity: 70%;
    font-size: 13px;
  }

  .owner-controls {
    position: absolute;
    right: 8px;
    top: 15px;
    z-index: 1;
  }

  .asignee {
    margin: 0 10px 10px 10px;
    color: var(--accent-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }
}

.task-title {
  width: calc(100% - 20px);
  margin: 16px 10px 10px 10px;
  line-height: 20px;

  .icon {
    float: left;
    margin-right: 3px;
  }
}

.label {
  height: 10px;
}

.label-container {
  width: 100%;
  position: absolute;
  display: grid;
  grid-column-gap: 5px;
  grid-template-columns: repeat(3, 1fr);

  .label:first-child {
    border-top-left-radius: var(--corner-radius);
  }

  .label:last-child {
    border-top-right-radius: var(--corner-radius);
  }
}

.task-edit-form {
  margin: 16px 10px;
}

.task-cursor {
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.disable-drag {
  pointer-events: none;
}

.subtask-container {
  margin: 0px 10px 10px 10px;

  .subtask {
    padding: 0 5px 0 10px;
    margin: 10px 0;
    transition: var(--animation-duration);

    &.completed {
      border-left: 3px solid var(--accent-1);
    }

    &.incomplete {
      border-left: 3px solid var(--task-foreground);
    }
  }

  .checkbox-asignee {
    color: var(--accent-1);
    font-size: 14px;
  }
}
</style>
