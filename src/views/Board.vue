<template>
  <div class="board-groups-container">
    <div class="search-box">
      <div
        v-if="project && (checkIfOwner || checkIfGroup || checkIfAdmin)"
        class="new-group-container"
      >
        <div class="inner-new-group-container box-shadow">
          <button v-if="!newOpen" class="new-group" @click="openGroupEntry">
            <div class="flex horizontal text">
              <div class="icon plus"></div>
              Group
            </div>
          </button>
          <form
            v-if="newOpen"
            class="new-group-form edit-form"
            @submit.prevent="addGroup"
          >
            <input
              ref="group"
              v-model="newGroupName"
              class="new-group-input"
              minlength="1"
              maxlength="150"
              type="text"
              @blur="newOpen = false"
            />
          </form>
        </div>
      </div>
      <div class="search-form">
        <input
          @input="globalSearch"
          placeholder="Type to search...."
          v-model="search"
          type="text"
          class="text search-input box-shadow"
        />
      </div>
    </div>
    <Container
      :get-child-payload="getChildPayload"
      @drop="onDrop(board, $event)"
      orientation="horizontal"
      class="group-grid board-padding scrollbar"
      non-drag-area-selector=".nondrag"
      :animation-duration="animationSpeed"
      v-if="project"
    >
      <Draggable
        class="draggable-container"
        :class="
          (checkIfGroup || checkIfOwner || checkIfAdmin) && !dragLoading
            ? ''
            : 'nondrag'
        "
        v-for="group in showDragLoad"
        :key="group.id"
      >
        <Group :group="group" :projectid="projectid" :boardid="boardid" />
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { updateGroupHistory, upGroup } from "../utils/statCollection";
import { boardsRef, groupsRef } from "../main";
import firebase from "firebase/app";
import { Container, Draggable } from "vue-smooth-dnd";
import Group from "../components/group/Group.vue";
import { applyDragGroup } from "../utils/dragdrop";
import { log } from "../utils/log";
import { mapState } from "vuex";
export default {
  name: "Board",
  components: { Group, Container, Draggable },
  props: {
    projectid: {
      type: String,
      default: ""
    },
    boardid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      newGroupName: "",
      groupName: "",
      groups: [],
      loadingGroups: [],
      newOpen: false,
      search: "",
      animationSpeed: 50
    };
  },
  mounted() {
    this.loadingGroups = this.groups;
  },
  watch: {
    dragLoading() {
      if (!this.dragLoading) {
        this.loadingGroups = this.groups;
      }
    }
  },
  computed: {
    ...mapState(["projects", "dragLoading"]),
    showDragLoad() {
      return this.dragLoading ? this.loadingGroups : this.groups;
    },
    checkIfGroup() {
      return this.project.permGroup.includes(firebase.auth().currentUser.uid);
    },
    checkIfOwner() {
      return this.project.owner === firebase.auth().currentUser.uid;
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    },
    project() {
      return this.projects.find(x => x.id === this.projectid);
    }
  },
  methods: {
    globalSearch() {
      this.$store.commit("setSearch", this.search);
    },
    onDrop(collection, dropResult) {
      if (
        this.project &&
        (this.checkIfOwner || this.checkIfAdmin || this.checkIfGroup) &&
        (dropResult.removedIndex !== null || dropResult.addedIndex !== null) &&
        dropResult.removedIndex !== dropResult.addedIndex
      )
        this.$store.commit("toggleDragLoad", true);
      this.loadingGroups = this.loadingGroups.filter(
        el => el.id !== dropResult.payload.id
      );
      this.loadingGroups.splice(dropResult.addedIndex, 0, dropResult.payload);
      applyDragGroup(
        collection,
        dropResult,
        this.groups[dropResult.addedIndex]
      );
    },
    getChildPayload(index) {
      return this.groups[index];
    },
    openGroupEntry() {
      this.newOpen = true;
      this.$nextTick(() => {
        this.$refs.group.focus();
      });
    },
    addGroup() {
      if (this.newGroupName.length >= 1 && this.newGroupName.length <= 150) {
        this.newOpen = false;
        groupsRef
          .add({
            name: this.newGroupName,
            owner: firebase.auth().currentUser.uid,
            createdAt: firebase.firestore.Timestamp.now(),
            board: this.boardid,
            project: this.$route.params.projectid,
            order: this.groups.length
          })
          .then(() => {
            upGroup(this.projectid);
            log(
              `Created a new group: ${this.newGroupName}`,
              this.projectid,
              "group"
            );
            updateGroupHistory(this.projectid);
            this.newGroupName = "";
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    }
  },
  firestore() {
    return {
      groups: groupsRef
        .orderBy("order", "desc")
        .where("board", "==", `${this.boardid}`),
      board: boardsRef.doc(this.boardid)
    };
  }
};
</script>

<style lang="scss">
.search-box {
  height: 70px;
  width: 100%;
  padding: 20px 20px 0 20px;
  display: flex;

  .search-form {
    width: 100%;
    height: 100%;

    .search-input {
      color: var(--group-foreground);
      transition: var(--animation-duration);
      background: var(--group-background);
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      padding-left: 20px;
    }
  }
}
.board-padding {
  padding: 20px 40px 20px 20px;
}

.group-grid {
  height: calc(100% - 70px);
  display: grid !important;
  grid-auto-columns: 272px;
  grid-auto-flow: column;
  grid-gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
}

.new-group-container {
  height: 100%;
  position: relative;
  z-index: 20;
}

.inner-new-group-container {
  transition: var(--animation-duration);
  background-color: var(--group-new-background);
  height: 100%;
  width: 272px;
  margin-right: 12px;
}
.new-group-input {
  height: 100%;
  width: 100%;
  background-color: #ffffff00;
  border: none;
  outline: none;
  color: var(--foreground);
  padding: 10px;
}
.new-group {
  background-color: #00000000;
  outline: none;
  border: none;
  cursor: pointer;
  width: 100%;
  height: 100%;
  text-align: left;
  padding-left: 10px;
  color: var(--foreground);
}

.new-group-form {
  width: 100%;
  height: 100%;
}
</style>
