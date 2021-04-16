<template>
  <div ref="groups" class="box-shadow scrollbar task-list-parent">
    <div v-if="project" class="static-top">
      <div class="group-title text left">
        <div
          class="title"
          :class="checkIfOwner || checkIfGroup || checkIfAdmin ? 'owned' : ''"
        >
          <div class="icon group"></div>

          <p @click.stop="editGroup" v-if="!editing" class="group-name">
            {{ group.name }}
            <span class="task-length">({{ getTaskList.length }})</span>
          </p>
          <form
            @click.stop
            class="edit-form nondrag group-edit-form"
            @submit.prevent="editing = false"
          >
            <input
              v-if="editing"
              ref="editGroup"
              v-model="editGroupName"
              class="edit-input"
              minlength="1"
              maxlength="150"
              @blur="submitEdit"
            />
          </form>
        </div>

        <div
          v-if="checkIfOwner || checkIfGroup || checkIfAdmin"
          class="owner-controls group-controls"
        >
          <button class="action-button" @click="deleteGroup">
            <div class="action-icon icon delete animate normal"></div>
          </button>
          <button ref="" class="action-button" @click="editGroup">
            <div
              class="action-icon icon edit animate"
              :class="editing ? 'editing' : 'normal'"
            ></div>
          </button>
        </div>
      </div>
      <div
        v-if="checkIfOwner || checkIfTask || checkIfAdmin"
        class="new-task-container box-shadow"
        :class="hasScroll ? 'scrollbar-active' : 'scrollbar-inactive'"
      >
        <button v-if="!newOpen" class="new-task" @click="openTaskEntry">
          <div class="flex horizontal text">
            <div class="icon plus"></div>
            Task
          </div>
        </button>
        <form class="new-task-form edit-form" @submit.prevent="addTask">
          <input
            v-if="newOpen"
            ref="task"
            v-model="newTaskName"
            class="new-task-input"
            minlength="1"
            maxlength="300"
            type="text"
            @blur="newOpen = false"
          />
        </form>
      </div>
    </div>
    <Container
      :get-child-payload="getChildPayload"
      group-name="1"
      @drop="onDrop(group, $event)"
      class="task-list animate"
      :animation-duration="animationSpeed"
      non-drag-area-selector=".nondrag"
    >
      <Draggable
        :class="checkIfGroup || checkIfOwner || checkIfAdmin ? '' : 'nondrag'"
        v-for="task in getTaskList"
        :key="task.id"
      >
        <Task :task="task" :groupid="group.id" />
      </Draggable>
    </Container>
  </div>
</template>

<script>
import {
  upTask,
  downGroup,
  updateGroupHistory,
  updateTaskHistory
} from "../../utils/statCollection";
import { groupsRef, tasksRef } from "../../main";
import { mapState } from "vuex";
import firebase from "firebase/app";
import Task from "../task/Task.vue";
import { tasksList } from "../../utils/deletion";
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "../../utils/dragdrop";
import { log } from "../../utils/log";
export default {
  name: "Group",
  components: { Task, Container, Draggable },
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
      newTaskName: "",
      taskName: "",
      tasks: [],
      newOpen: false,
      editing: false,
      editGroupName: "",
      foundTasks: [],
      animationSpeed: 50,
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
    checkIfGroup() {
      return this.project.permGroup.includes(firebase.auth().currentUser.uid);
    },
    checkIfTask() {
      return this.project.permTask.includes(firebase.auth().currentUser.uid);
    },
    checkIfOwner() {
      return this.project.owner === firebase.auth().currentUser.uid;
    },
    project() {
      return this.projects.find(x => x.id === this.projectid);
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    }
  },
  methods: {
    onDrop(collection, dropResult) {
      applyDrag(
        collection,
        dropResult,
        this.getTaskList[dropResult.addedIndex]
      );
    },
    getChildPayload(index) {
      return this.getTaskList[index];
    },
    closeForm() {
      this.newOpen = false;
      this.editing = false;
    },
    decrement(orderNo) {
      groupsRef
        .where("board", "==", this.boardid)
        .where("order", ">", orderNo)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(object => {
            object.ref.update({
              order: firebase.firestore.FieldValue.increment(-1)
            });
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    },
    deleteGroup() {
      let oldGroup = this.group;
      groupsRef
        .doc(this.group.id)
        .delete()
        .then(() => {
          downGroup(this.$route.params.projectid);
          log(
            `Deleted group ${oldGroup.name}`,
            this.$route.params.projectid,
            "group"
          );
          this.decrement(oldGroup.order);
          tasksList(this.group, this.$route.params.projectid);
          updateGroupHistory(this.$route.params.projectid);
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    },
    editGroup() {
      if (this.checkIfGroup || this.checkIfOwner) {
        this.editGroupName = this.group.name;
        this.editing = !this.editing;
        if (this.editing) {
          this.$nextTick(() => {
            this.$refs.editGroup.focus();
          });
        }
      }
    },
    submitEdit() {
      this.editing = false;
      let oldGroup = this.group;
      if (
        this.editGroupName.length >= 1 &&
        this.editGroupName.length <= 150 &&
        this.group.name !== this.editGroupName
      ) {
        groupsRef
          .doc(this.group.id)
          .update({
            name: this.editGroupName
          })
          .then(() => {
            log(
              `Changed group name from ${oldGroup.name} to ${this.editGroupName}`,
              this.$route.params.projectid,
              "group"
            );
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    },
    openTaskEntry() {
      this.newOpen = true;
      this.$nextTick(() => {
        this.$refs.task.focus();
      });
    },
    addTask() {
      if (this.newTaskName.length >= 1 && this.newTaskName.length <= 300) {
        this.newOpen = false;
        tasksRef
          .add({
            name: this.newTaskName,
            owner: firebase.auth().currentUser.uid,
            createdAt: firebase.firestore.Timestamp.now(),
            group: this.group.id,
            board: this.$route.params.boardid,
            project: this.$route.params.projectid,
            order: this.tasks.length,
            asignee: firebase.auth().currentUser.uid,
            labels: [],
            description: ""
          })
          .then(() => {
            upTask(this.$route.params.projectid);
            log(
              `Created a new task ${this.newTaskName}`,
              this.$route.params.projectid,
              "task"
            );
            updateTaskHistory(this.$route.params.projectid);
            this.newTaskName = "";
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
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

<style lang="scss">
.owned {
  cursor: pointer;
}

.group-title {
  padding: 20px 20px 10px 20px;
  color: var(--foreground);
  display: flex;
  justify-content: space-between;
  position: relative;

  .title {
    width: 190px;
    line-height: 20px;

    .icon {
      float: left;
      margin-right: 3px;
    }
  }

  .owner-controls {
    position: absolute;
    right: 18px;
    top: 20px;
    z-index: 1;
  }
}

.group-edit-form {
  width: 100%;

  .edit-input {
    width: calc(100% - 30px);
  }
}

.new-task-form {
  width: 100%;
  height: 100%;
}
.new-task-input {
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  background-color: #00000000;
  color: var(--task-new-foreground);
  padding: 10px;
}
.new-task {
  background-color: #00000000;
  outline: none;
  border: none;
  cursor: pointer;
  min-width: 100%;
  text-align: left;
  padding-left: 10px;
  color: var(--foreground);
}
.new-task-container {
  transition: var(--animation-duration);
  background-color: var(--task-new-background);
  display: flex;
  height: 50px;
}
.task-list {
  padding: 0 10px 0 10px;
}
.task-list-parent {
  width: 272px;
  max-height: calc(100vh - 160px);
  height: max-content;
  overflow: auto;
  transition: var(--animation-duration);
  background-color: var(--group-background);
}

.static-top {
  transition: var(--animation-duration);
  background-color: var(--group-background);
  padding-bottom: 10px;
  top: 0;
  position: sticky;
  z-index: 10;
}

.scrollbar-active {
  margin: 10px 16px 10px 20px;
}

.scrollbar-inactive {
  margin: 10px 20px 10px 20px;
}

.task-length {
  color: var(--foreground-light);
  font-size: 13px;
}
</style>
