<template>
  <div class="board-groups-container">
    <div class="search-box">
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
    <div class="group-grid board scrollbar">
        <Group v-for="group in groups" :key="group.id" :group="group" :projectid="projectid" :boardid="boardid" />
    </div>
  </div>
</template>

<script>
import { boardsRef, groupsRef } from "../main";
import Group from "../components/public/Group.vue";
import { mapState } from "vuex";
export default {
  name: "Share",
  components: { Group },
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
      groups: [],
      search: ""
    };
  },
  computed: {
    ...mapState(["project"]),
  },
  methods: {
    globalSearch() {
      this.$store.commit("setSearch", this.search);
    },
  },
  mounted() {
    this.$store.dispatch("bindProject", this.projectid);
    this.$store.dispatch("bindUsers");
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

<style lang="scss" scoped>
.board-groups-container {
  height: 100%;
}

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
.board {
  padding: 20px 40px 20px 20px;
}

.group-grid {
  padding-right: 100px;
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
