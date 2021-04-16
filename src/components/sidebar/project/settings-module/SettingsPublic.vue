<template>
  <div class="settings-list animate box-shadow scrollbar">
    <div class="text left">
      <div class="module-title">Public</div>
      <div>
        <input
          :id="project.id"
          v-model="allowPublic"
          type="checkbox"
          @change="setAllow"
        />
        Allow to share this board publicly
      </div>
    </div>
  </div>
</template>

<script>
import { projectsRef } from "../../../../main";
import { log } from "../../../../utils/log";
import { mapState } from "vuex";
export default {
  name: "SettingsList",
  props: {
    projectid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      allowPublic: false
    };
  },
  mounted() {
    this.allowPublic = this.project.allowPublic;
  },
  computed: {
    ...mapState(["projects"]),
    project() {
      return this.projects.find(x => x.id === this.projectid);
    }
  },
  methods: {
    setAllow() {
      projectsRef
        .doc(this.project.id)
        .update({
          allowPublic: !this.project.allowPublic
        })
        .then(
          log(
            `Changed project settings: Allow to share this board publicly to ${
              this.project.allowAddBoards ? "Disabled" : "Enabled"
            }`,
            this.$route.params.projectid,
            "settings"
          )
        );
    }
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
  table {
    width: 100%;
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
