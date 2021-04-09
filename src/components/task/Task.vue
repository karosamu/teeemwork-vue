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
      <form class="edit-form task-edit-form" @submit.prevent="submitEdit">
        <input
          v-if="editing"
          ref="editTask"
          v-model="editTaskName"
          class="edit-input"
          minlength="1"
          maxlength="150"
          @click.stop
          @blur="editing = false"
        />
      </form>
    </div>
    <TaskModal
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
      editTaskName: ""
    };
  },
  computed: {
    style() {
      return (
        "grid-template-columns: repeat(" + this.task.labels.length + ", 1fr);"
      );
    }
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

  .owner-controls {
    position: absolute;
    right: 8px;
    top: 15px;
    z-index: 1;
  }
}

.task-title {
  width: calc(100% - 20px);
  margin: 16px 10px;
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
    border-top-left-radius: 5px;
  }

  .label:last-child {
    border-top-right-radius: 5px;
  }
}

.task-edit-form {
  margin: 16px 10px;
}

.task-cursor {
  cursor: pointer;
}

.disable-drag {
  pointer-events: none;
}

.emable-drag {
  pointer-events: all;
}
</style>
