<template>
  <div class="settings-list animate box-shadow scrollbar nav-main">
    <div class="text left">
      <div class="module-title">
        <div class="icon public"></div>
        Public
      </div>
      <div
        class="box-shadow board-public-container"
        v-for="board in boards"
        :key="board.id"
      >
        <div class="board-public-title">
          <router-link
            :to="{
              name: 'board',
              params: { projectid: projectid, boardid: board.id }
            }"
            >{{ board.name }}</router-link
          >
        </div>
        <SettingsPublicToggle :board="board" />
        Allow to share this board publicly
        <div
          @click="copyLink(board)"
          class="public-link"
          v-if="board.allowPublic"
        >
          <div class="icon clipboard"></div>
          <div>{{ getLink(board) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { boardsRef } from "../../../../main";
import { mapState } from "vuex";
import SettingsPublicToggle from "./SettingsPublicToggle";
export default {
  name: "SettingsList",
  components: { SettingsPublicToggle },
  props: {
    projectid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      boards: []
    };
  },
  methods: {
    getLink(board) {
      return (
        location.protocol + '//' +
        location.hostname +
        (location.port ? ":" + location.port : "") +
        "/public/" +
        this.projectid +
        "/board/" +
        board.id
      );
    },
    copyLink(board) {
      this.$copyText(this.getLink(board)).then(
        () => {
          this.$toasted.global.success({ message: "Copied to clipboard!" });
        },
        () => {
          this.$toasted.global.error({ message: "Failed to copy!" });
        }
      );
    }
  },
  computed: {
    ...mapState(["projects"]),
    project() {
      return this.projects.find(x => x.id === this.projectid);
    }
  },
  firestore() {
    return {
      boards: boardsRef
        .orderBy("createdAt", "asc")
        .where("project", "==", this.projectid)
    };
  }
};
</script>

<style lang="scss">
.settings-list {
  background-color: var(--group-background);
  margin: 10px;
  width: calc(100% - 20px);
  padding: 10px;
  overflow-y: overlay;
  height: max-content;

  .board-public-title {
    margin-bottom: 10px;
  }

  .board-public-container {
    background-color: var(--background);
    transition: var(--animation-duration);
    padding: 15px;
    margin: 10px 0;
  }

  table {
    width: 100%;
  }

  .public-link {
    margin-top: 10px;
    align-items: center;
    color: var(--foreground);
    font-weight: bold;
    cursor: pointer;
    transition: var(--animation-duration);

    .icon {
      float: left;
      margin-right: 10px;
    }

    &:hover .icon {
      background-color: var(--accent-1);
    }

    &:hover {
      color: var(--accent-1);
    }
  }

  .settings {
    .action-icon {
      opacity: 100%;
    }
  }

  .new-settings-container {
    display: flex;
  }
}
</style>
