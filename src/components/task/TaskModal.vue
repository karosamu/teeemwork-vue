<template>
  <div class="modal nondrag scrollbar flex vertical" @click="$emit('disable')">
    <div class="modal-content scrollbar box-shadow" @click.stop>
      <div class="task-modal-title-container">
        <div class="task-name-container">
          <div class="icon task"></div>
          <p
            v-if="!editing"
            class="text left task-modal-title task-modal-cursor"
            @click="editTask"
          >
            {{ task.name }}
          </p>
          <form
            class="edit-form task-modal-edit-form"
            @submit.prevent="submitEdit"
          >
            <input
              v-if="editing"
              ref="editModalTask"
              v-model="editTaskName"
              class="edit-input"
              minlength="1"
              maxlength="300"
              v-on="listenersName"
            />
          </form>
          <div
            v-if="checkIfOwner || checkIfTask || checkIfAdmin || task.asignee"
            class="asignee"
          >
            <span class="text">Assigned user:</span>
            <div
              @click="editAsigneeClick"
              v-if="!task.asignee && !editingAsignee"
              class="text"
            >
              <div class="icon plus"></div>
              User
            </div>
            <div
              @click="editAsigneeClick"
              v-if="task.asignee && !editingAsignee"
              class="text asignee-text"
            >
              - {{ asigneeInfo.name }} {{ asigneeInfo.surname }}
            </div>
            <form
              class="edit-form nondrag asignee-edit-form"
              @submit.prevent="submitAsignee"
            >
              <input
                v-if="editingAsignee"
                ref="editAsignee"
                v-model="editAsignee"
                class="edit-input"
                v-on="listenersAsignee"
              />
            </form>
          </div>
        </div>
        <div
          v-if="
            checkIfOwner ||
              checkIfTask ||
              checkIfAdmin ||
              checkIfDescriptionExists
          "
          class="description-container"
        >
          <div class="icon description"></div>
          <span class="text">Description</span>
          <div @click="editDescription" class="description-box">
            <code
              style="white-space: pre-wrap"
              v-if="!editingDescription && checkIfDescriptionExists"
              class="text left description-text"
              >{{ task.description }}
            </code>
            <p
              v-if="
                !editingDescription &&
                  !checkIfDescriptionExists &&
                  (checkIfOwner || checkIfTask || checkIfAdmin)
              "
              class="text left"
              @click="editDescription"
            >
              Add a description...
            </p>
          </div>
          <form
            class="edit-form task-modal-edit-form"
            @submit.prevent="submitEditDescription"
          >
            <textarea
              @focus="mixin_autoResize_resize"
              @input="mixin_autoResize_resize"
              v-if="editingDescription"
              ref="editModalTaskDescription"
              v-model="editTaskDescription"
              class="edit-input edit-description"
              maxlength="10000"
              @keydown.tab.prevent="tabber($event)"
            />
            <input
              v-if="editingDescription"
              type="submit"
              class="description-submit-button box-shadow"
              value="Save"
              @click="submitEditDescription"
            />
          </form>
        </div>
        <div
          v-if="checkIfOwner || checkIfTask || checkIfAdmin"
          class="owner-controls"
          @click.stop
        >
          <button class="action-button" @click="deleteTask">
            <div class="action-icon icon delete animate normal"></div>
          </button>
          <button class="action-button" @click="editTask">
            <div
              class="action-icon icon edit animate"
              :class="editing ? 'editing' : 'normal'"
            ></div>
          </button>
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
import { tasksRef } from "../../main";
import { checkboxList } from "../../utils/deletion";
import CheckboxList from "./CheckboxList";
import TaskLabelList from "./TaskLabelList";
import firebase from "firebase/app";
import { log } from "../../utils/log";
import { downTask, updateTaskHistory } from "../../utils/statCollection";
import { mapState } from "vuex";
import mixinAutoResize from "../../utils/autoResize";
export default {
  name: "TaskModal",
  components: { CheckboxList, TaskLabelList },
  mixins: [mixinAutoResize],
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
  data() {
    return {
      editing: false,
      editingDescription: false,
      editTaskName: "",
      editTaskDescription: "",
      inputActive: false,
      editingAsignee: false,
      editAsignee: ""
    };
  },
  computed: {
    ...mapState(["projects", "users"]),
    asigneeInfo() {
      return this.users.find(x => x.id === this.task.asignee);
    },
    listenersName() {
      if (this.inputActive) {
        return { blur: this.submitEdit };
      }
      return null;
    },
    listenersAsignee() {
      if (this.inputActive) {
        return { blur: this.submitAsignee };
      }
      return null;
    },
    project() {
      return this.projects.find(x => x.id === this.$route.params.projectid);
    },
    checkIfDescriptionExists() {
      if (
        this.task.description &&
        this.task.description != "" &&
        this.task.description != "\n"
      )
        return true;
      else return false;
    },
    checkIfTask() {
      return this.project
        ? this.project.permTask.includes(firebase.auth().currentUser.uid)
        : false;
    },
    checkIfOwner() {
      return this.project
        ? this.project.owner === firebase.auth().currentUser.uid
        : false;
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    }
  },
  methods: {
    tabber(event) {
      let text = this.editTaskDescription,
        originalSelectionStart = event.target.selectionStart,
        textStart = text.slice(0, originalSelectionStart),
        textEnd = text.slice(originalSelectionStart);
      this.editTaskDescription = `${textStart}    ${textEnd}`;
      event.target.selectionEnd = event.target.selectionStart =
        originalSelectionStart + 1;
    },
    editAsigneeClick() {
      this.inputActive = true;
      if (this.checkIfTask || this.checkIfOwner || this.checkIfAdmin) {
        if (this.task.asignee) this.editAsignee = this.asigneeInfo.email;
        this.editingAsignee = !this.editingAsignee;
        if (this.editingAsignee) {
          this.$nextTick(() => {
            this.$refs.editAsignee.focus();
          });
        }
      }
    },
    submitAsignee() {
      this.editingAsignee = false;
      let user = this.users.find(obj => {
        return obj.email === this.editAsignee;
      });
      if ((user && this.task.asignee !== user.id) || this.editAsignee == "") {
        if (this.editAsignee.length <= 300) {
          tasksRef
            .doc(this.task.id)
            .update({
              asignee: user ? user.id : ""
            })
            .then(() => {
              log(
                `Changed ${this.task.name} asignee to ${
                  user ? user.email : "none"
                }`,
                this.$route.params.projectid,
                "task"
              );
              this.editAsignee = "";
              this.inputActive = false;
            })
            .catch(error => {
              this.$toasted.global.error({
                message: error
              });
            });
        }
      }
    },
    editTask() {
      this.inputActive = true;
      if (this.checkIfTask || this.checkIfOwner || this.checkIfAdmin) {
        this.editTaskName = this.task.name;
        this.editing = !this.editing;
        if (this.editing) {
          this.$nextTick(() => {
            this.$refs.editModalTask.focus();
          });
        }
      }
    },
    editDescription() {
      if (this.checkIfTask || this.checkIfOwner || this.checkIfAdmin) {
        this.inputActive = true;
        this.editTaskDescription = this.task.description;
        this.editingDescription = !this.editing;
        if (this.editingDescription) {
          this.$nextTick(() => {
            this.$refs.editModalTaskDescription.focus();
          });
        }
      }
    },
    submitEditDescription() {
      this.editingDescription = false;
      if (
        this.editTaskDescription.length <= 10000 &&
        this.task.description !== this.editTaskDescription
      ) {
        tasksRef
          .doc(this.task.id)
          .update({
            description: this.editTaskDescription.replace(/^\n|\n$/g, "")
          })
          .then(() => {
            log(
              `Changed ${this.task.name} description to ${this.editTaskDescription}`,
              this.$route.params.projectid,
              "task"
            );
            this.editTaskDescription = "";
            this.inputActive = false;
          })
          .catch(error => {
            this.$toasted.global.error({
              message: error
            });
          });
      }
    },
    submitEdit() {
      this.editing = false;
      if (
        this.editTaskName.length >= 1 &&
        this.editTaskName.length <= 300 &&
        this.task.name !== this.editTaskName
      ) {
        tasksRef
          .doc(this.task.id)
          .update({
            name: this.editTaskName
          })
          .then(() => {
            log(
              `Edited title of ${this.task.name}`,
              this.$route.params.projectid,
              "task"
            );
            this.inputActive = false;
          })
          .catch(error => {
            this.$toasted.global.error({
              message: error
            });
          });
      }
    },
    deleteTask() {
      let oldTask = this.task;
      tasksRef
        .doc(this.task.id)
        .delete()
        .then(() => {
          downTask(this.$route.params.projectid);
          log(`Deleted ${oldTask.name}`, this.$route.params.projectid, "task");
          tasksRef
            .where("group", "==", this.groupid)
            .where("order", ">", oldTask.order)
            .get()
            .then(function(snapshot) {
              snapshot.forEach(object => {
                object.ref.update({
                  order: firebase.firestore.FieldValue.increment(-1)
                });
              });
            });
          checkboxList(this.task);
          updateTaskHistory(this.$route.params.projectid);
          this.$toasted.global.success({
            message: "Task successfully removed."
          });
        })
        .catch(error => {
          this.$toasted.global.error({
            message: error
          });
        });
    }
  }
};
</script>

<style lang="scss">
.modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;

  transition: opacity var(--animation-duration);
  background-color: #00000066;

  .modal-content {
    top: 5%;
    width: 60vw;
    max-width: 800px;
    text-align: left;
    flex-direction: column;
    height: max-content;
    background-color: var(--background);
    padding: 30px;

    .description-submit-button {
      padding: 5px 10px;
      border: none;
      color: var(--background);
      background-color: var(--accent-1);
      transition: var(--animation-duration);
    }

    .description-submit-button:hover {
      transition: var(--animation-duration);
      background-color: var(--accent-2);
    }

    .asignee-edit-form {
      width: 100%;

      input {
        width: 100%;
      }
    }

    .description-container {
      margin-top: 30px;
    }

    .asignee {
      margin: 10px 0 0 0;
    }

    .asignee-text {
      color: var(--accent-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .description-text {
      font-weight: 500;
      font-family: monospace;
      font-size: 12px;
      line-height: 10px !important;
      -moz-tab-size: 2;
      tab-size: 2;
      width: 100%;
    }

    .description-box {
      margin-top: 5px;
      cursor: pointer;
    }

    .edit-description {
      font-family: monospace;
      line-height: 14px;
      font-size: 12px;
      color: var(--foreground);
      background-color: var(--background);
      overflow-y: hidden;
      outline: none;
      border: none;
      border-bottom: 1px solid var(--foreground);
      resize: none;
      -moz-tab-size: 2;
      tab-size: 2;
    }

    .task-modal-edit-form {
      width: calc(100% - 40px);

      .edit-input {
        width: calc(95%);
      }

      .edit-description {
        height: max-content;
        line-height: 20px !important;
      }
    }

    .task-modal-title-container {
      position: relative;
      width: calc(100%);
      line-height: 20px;

      .owner-controls {
        position: absolute;
        right: -15px;
        top: 0px;
        z-index: 1;
      }

      .icon {
        float: left;
        margin-right: 5px;
      }
    }

    .label-list-component {
      margin-top: 30px;
    }

    .task-modal-title {
      width: calc(100% - 40px);
      word-wrap: break-word;
    }

    .task-modal-cursor {
      cursor: pointer;
    }

    .checkbox-list-component {
      margin-top: 30px;
    }
  }
}
</style>
