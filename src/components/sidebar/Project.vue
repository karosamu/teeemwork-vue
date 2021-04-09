<template>
  <div class="project">
    <div class="project-link-container nav-main">
      <router-link
        class="project-link"
        :to="{ name: 'project', params: { projectid: project.id } }"
      >
        <div class="project-title">
          <div
            :class="{
              'icon-active':
                $route.params.projectid == project.id &&
                $route.params.boardid == undefined
            }"
            class="icon project"
          ></div>
          <p v-if="!editing" class="project-name">{{ project.name }}</p>
          <form class="edit-form" @submit.prevent="editing = false">
            <input
              v-if="editing"
              ref="editProject"
              v-model="editProjectName"
              class="edit-input"
              minlength="1"
              maxlength="100"
              @blur="submitEdit"
            />
          </form>
        </div>
      </router-link>
      <div v-if="checkIfOwner" class="owner-controls">
        <button class="action-button" @click="deleteProject">
          <div class="action-icon icon delete animate normal"></div>
        </button>
        <button class="action-button" @click="editProject">
          <div
            class="action-icon icon edit animate"
            :class="editing ? 'editing' : 'normal'"
          ></div>
        </button>
      </div>
      <div v-else>
        <button class="action-button" @click="leaveProject">
          <div class="action-icon icon leave animate normal"></div>
        </button>
      </div>
    </div>
    <div v-if="boards.length > 0" class="nav-main board-list">
      <div v-for="board in boards" :key="board.id">
        <BoardTitleBar :board="board" :project="project" />
      </div>
    </div>
    <div v-if="checkIfAllowedAdd" class="new-board-container">
      <button v-if="!newOpen" class="new-board" @click="openBoardEntry">
        <div class="flex horizontal text">
          <div class="icon plus"></div>
          Board
        </div>
      </button>
      <form
        v-if="newOpen"
        class="new-board-container"
        @submit.prevent="addBoard"
      >
        <input
          ref="board"
          v-model="newBoardName"
          placeholder="Board name"
          class="new-board-input"
          minlength="1"
          maxlength="150"
          type="text"
          @blur="newOpen = false"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { boardsRef, projectsRef, statsRef } from "../../main";
import firebase from "firebase/app";
import BoardTitleBar from "./BoardTitleBar";
import { boardsList, labelsList } from "../../utils/deletion";
import { log } from "../../utils/log";
import { upBoard, updateBoardHistory } from "../../utils/statCollection";
export default {
  name: "Project",
  components: { BoardTitleBar },
  props: {
    project: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      newBoardName: "",
      boardName: "",
      boards: [],
      userInList: false,
      newOpen: false,
      editing: false,
      editProjectName: ""
    };
  },
  computed: {
    checkIfOwner() {
      return this.project.owner === firebase.auth().currentUser.uid;
    },
    checkIfAllowedAdd() {
      return (
        this.checkIfOwner ||
        this.project.permBoard.includes(firebase.auth().currentUser.uid)
      );
    },
    checkIfShowList() {
      return (
        this.checkIfOwner || this.boards.length !== 0 || this.checkIfAllowedAdd
      );
    }
  },
  methods: {
    closeForm() {
      this.newOpen = false;
    },
    decrement(orderid) {
      projectsRef
        .where("order", ">", orderid)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(object => {
            object.ref.update({
              order: firebase.firestore.FieldValue.increment(-1)
            });
          });
        });
    },
    deleteProject() {
      if (this.$route.params.projectid === this.project.id) {
        this.$router.push({ path: "/homepage" });
      }
      let oldProject = this.project;
      projectsRef
        .doc(this.project.id)
        .delete()
        .then(() => {
          log(`Deleted project ${oldProject.name}`, this.project.id, "project");
          boardsList(this.project);
          labelsList(this.project);
          statsRef.doc("projectcount").update({
            count: firebase.firestore.FieldValue.increment(-1)
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    },
    leaveProject() {
      if (this.$route.params.projectid === this.project.id) {
        this.$router.push({ path: "/homepage" });
      }
      projectsRef
        .doc(this.project.id)
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(
            firebase.auth().currentUser.uid
          )
        })
        .then(
          log(`Left project ${this.project.name}`, this.project.id, "project")
        )
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    },
    editProject() {
      this.editProjectName = this.project.name;
      this.editing = !this.editing;
      if (this.editing) {
        this.$nextTick(() => {
          this.$refs.editProject.focus();
        });
      }
    },
    submitEdit() {
      let oldName = this.project.name;
      if (
        this.editProjectName.length >= 1 &&
        this.editProjectName.length <= 100 &&
        this.project.name !== this.editProjectName
      ) {
        projectsRef
          .doc(this.project.id)
          .update({
            name: this.editProjectName
          })
          .then(() => {
            log(
              `Changed project name from ${oldName} to ${this.editProjectName}`,
              this.project.id,
              "project"
            );
            this.editing = false;
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    },
    openBoardEntry() {
      this.newOpen = true;
      this.$nextTick(() => {
        this.$refs.board.focus();
      });
    },
    addBoard: function() {
      if (this.newBoardName.length >= 1 && this.newBoardName.length <= 150) {
        this.newOpen = false;
        boardsRef
          .add({
            name: this.newBoardName,
            owner: firebase.auth().currentUser.uid,
            createdAt: firebase.firestore.Timestamp.now(),
            project: this.project.id,
            order: this.boards.length
          })
          .then(docRef => {
            this.$router.push({
              name: "board",
              params: { projectid: this.project.id, boardid: docRef.id }
            });
            upBoard(this.project.id);
            log(
              `Added a new board ${this.newBoardName}`,
              this.project.id,
              "board"
            );
            updateBoardHistory(this.project.id);
            this.newBoardName = "";
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    }
  },
  firestore() {
    return {
      boards: boardsRef
        .orderBy("createdAt", "asc")
        .where("project", "==", this.project.id)
    };
  }
};
</script>

<style lang="scss" scoped>
.project-title {
  width: 220px;
  line-height: 20px;
  text-align: left;

  .icon {
    float: left;
    margin-right: 6px;
  }

  .project-name {
    word-wrap: break-word;
  }
}

.project-link:hover {
  .icon {
    background-color: var(--accent-1);
  }
}

.project-link-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.new-board-container {
  transition: var(--animation-duration);
  background-color: var(--board-new-background);
  height: 30px;
  margin-right: 10px;
  margin-left: 8px;
  border-radius: 5px;
}

.new-board-input {
  height: 100%;
  width: 100%;
  background-color: var(--board-new-background);
  border: none;
  outline: none;
  color: var(--foreground);
  font-size: 15px;
}

.new-board {
  background-color: #00000000;
  outline: none;
  border: none;
  cursor: pointer;
  width: 100%;
  height: 100%;
  text-align: left;
  padding-left: 5px;
  font-size: 15px;
  color: var(--board-new-background);
}

.board-list {
  text-align: left;
  margin-left: 3px;
  word-break: break-word;
  margin-top: 10px;
}

.board-item {
  margin: 5px;
  width: max-content;
}
</style>
