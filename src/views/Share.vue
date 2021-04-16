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
    <div class="group-grid board-padding scrollbar">
      <Group
        v-for="group in groups"
        :key="group.id"
        :group="group"
        :projectid="projectid"
        :boardid="boardid"
      />
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
      default: "",
      enabled: false
    }
  },
  watch: {
    project() {
      if (!this.project.allowPublic) {
        this.$router.push({ name: "homepage" });
      }
    }
  },
  data() {
    return {
      groups: [],
      search: ""
    };
  },
  computed: {
    ...mapState(["project"])
  },
  methods: {
    globalSearch() {
      this.$store.commit("setSearch", this.search);
    }
  },
  mounted() {
    this.$store.dispatch("bindProject", this.projectid);
    this.$store.dispatch("bindUsers");
    this.mounted = this.project.allowPublic;
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
.group-grid {
  padding: 20px 0 20px 20px;
}
</style>
