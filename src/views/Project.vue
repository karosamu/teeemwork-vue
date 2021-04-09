<template>
  <div v-if="project" class="project scrollbar">
    <SettingsToggle
      v-if="project"
      @disable="toggleButton"
      :settingsList="passSettings"
      :disabled="disabledSettings"
    />
    <UserList
      v-show="checkIfShow('Users')"
      v-if="checkIfOwner || checkIfAdmin"
      :projectid="projectid"
    />
    <LabelList v-show="checkIfShow('Labels')" :projectid="projectid" />
    <LogPanel
      v-show="checkIfShow('Logs')"
      v-if="checkIfOwner || checkIfAdmin"
      :projectid="project.id"
    />
  </div>
</template>

<script>
import SettingsToggle from "../components/sidebar/project/settings-module/SettingsToggle";
import UserList from "../components/sidebar/project/user-list-module/UserList";
import LabelList from "../components/sidebar/project/label-module/LabelList";
import LogPanel from "../components/sidebar/project/logs-module/LogPanel";
import firebase from "firebase/app";
import { mapState } from "vuex";
export default {
  name: "Project",
  components: { UserList, LabelList, LogPanel, SettingsToggle },
  props: {
    projectid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      settingsList: ["Labels"],
      disabledSettings: [],
      ownerSettings: ["Users", "Labels", "Logs"]
    };
  },
  computed: {
    ...mapState(["projects"]),
    project() {
      return this.projects.find(x => x.id === this.projectid);
    },
    checkIfOwner() {
      return this.project.owner === firebase.auth().currentUser.uid;
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    },
    passSettings() {
      return this.checkIfOwner || this.checkIfAdmin
        ? this.ownerSettings
        : this.settingsList;
    }
  },
  methods: {
    toggleButton(value) {
      if (this.disabledSettings.includes(value)) {
        this.disabledSettings.splice(this.disabledSettings.indexOf(value), 1);
      } else {
        this.disabledSettings.push(value);
      }
    },
    checkIfShow(value) {
      return !this.disabledSettings.includes(value);
    }
  }
};
</script>

<style lang="scss" scoped>
.project {
  overflow-x: auto;
  overflow-y: auto;
}

.half-container {
  display: flex;
}
</style>
