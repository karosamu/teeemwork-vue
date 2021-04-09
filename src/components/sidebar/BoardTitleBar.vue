<template>
  <div class="board-list-container">
    <router-link
      class="board-item"
      :to="{
        name: 'board',
        params: { projectid: project.id, boardid: board.id }
      }"
    >
      <div class="board-title">
        <div
          :class="{ 'icon-active': $route.params.boardid == board.id }"
          class="icon board"
        ></div>

        <p v-if="!editingBoard">{{ board.name }}</p>
        <form class="edit-form" @submit.prevent="editingBoard = false">
          <input
            v-if="editingBoard"
            ref="boardEdit"
            v-model="editBoardName"
            class="edit-input"
            minlength="1"
            maxlength="150"
            @blur="submitEditBoard"
          />
        </form>
      </div>
    </router-link>

    <div
      v-if="checkIfOwner || checkIfAllowedBoard || checkIfAdmin"
      class="owner-controls"
    >
      <button class="action-button" @click="deleteBoard(board)">
        <div class="action-icon icon delete animate normal"></div>
      </button>
      <button class="action-button" @click="editBoard(board)">
        <div
          class="action-icon icon edit animate"
          :class="editingBoard ? 'editing' : 'normal'"
        ></div>
      </button>
    </div>
  </div>
</template>

<script>
import { boardsRef } from "../../main";
import firebase from "firebase/app";
import { groupsList } from "../../utils/deletion";
import { log } from "../../utils/log";
import { downBoard, updateBoardHistory } from "../../utils/statCollection";
export default {
  name: "BoardTitleBar",
  props: {
    project: {
      type: Object,
      default: () => {
        return {};
      }
    },
    board: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      editingBoard: false,
      editBoardName: ""
    };
  },
  computed: {
    checkIfOwner() {
      return this.project.owner === firebase.auth().currentUser.uid;
    },
    checkIfAllowedBoard() {
      return this.project.permBoard.includes(firebase.auth().currentUser.uid);
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    }
  },
  methods: {
    deleteBoard(board) {
      let oldBoard = this.board;
      boardsRef
        .doc(this.board.id)
        .delete()
        .then(() => {
          downBoard(this.project.id);
          log(`Deleted board ${oldBoard.name}`, this.project.id, "board");
          groupsList(board, this.project.id);
          if (this.$route.params.boardid === board.id) {
            this.$router.push({
              path: `/project/${this.project.id}`
            });
          }
          updateBoardHistory(this.project.id);
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    },
    editBoard() {
      this.editBoardName = this.board.name;
      this.editingBoard = !this.editingBoard;
      if (this.editingBoard) {
        this.$nextTick(() => {
          this.$refs.boardEdit.focus();
        });
      }
    },
    submitEditBoard() {
      if (
        this.editBoardName.length >= 1 &&
        this.editBoardName.length <= 150 &&
        this.board.name !== this.editBoardName
      ) {
        boardsRef
          .doc(this.board.id)
          .update({
            name: this.editBoardName
          })
          .then(() => {
            this.editingBoard = false;
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.board-title {
  width: 220px;
  line-height: 20px;
  padding-left: 10px;

  .icon {
    float: left;
    margin-right: 5px;
  }

  div {
    margin-right: 10px;
  }
}

.board-item:hover {
  .icon {
    background-color: var(--accent-1);
  }
}

.board-list-container {
  position: relative;

  .owner-controls {
    position: absolute;
    right: 0;
    top: 4px;
    z-index: 1;
  }
}
</style>
