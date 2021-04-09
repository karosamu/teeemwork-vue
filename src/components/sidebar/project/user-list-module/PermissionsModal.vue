<template>
  <div class="modal flex center" @click="$emit('disable')">
    <div class="modal-content box-shadow" @click.stop>
      <div class="title">{{ user.name }} {{ user.surname }} permissions</div>

      <div v-if="project">
        <div>
          <input
            v-model="adminEnabled"
            type="checkbox"
            @click="changePerm('permAdmin', checkIfAdmin)"
          />
          Admin
        </div>
        <div>
          <input
            v-model="boardsEnabled"
            type="checkbox"
            @click="changePerm('permBoard', checkIfBoard)"
          />
          Boards write/delete permission
        </div>
        <div>
          <input
            v-model="groupsEnabled"
            type="checkbox"
            @click="changePerm('permGroup', checkIfGroup)"
          />
          Groups write/delete permission
        </div>
        <div>
          <input
            v-model="tasksEnabled"
            type="checkbox"
            @click="changePerm('permTask', checkIfTask)"
          />
          Tasks write/delete permission
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { projectsRef } from "../../../../main";
import firebase from "firebase/app";
import { log } from "../../../../utils/log";
export default {
  name: "TaskModal",
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      adminEnabled: false,
      boardsEnabled: false,
      groupsEnabled: false,
      tasksEnabled: false
    };
  },
  mounted() {
    this.adminEnabled = this.checkIfAdmin;
    this.boardsEnabled = this.checkIfBoard;
    this.groupsEnabled = this.checkIfGroup;
    this.tasksEnabled = this.checkIfTask;
  },
  watch: {
    checkIfAdmin(newValue) {
      this.adminEnabled = newValue;
    },
    checkIfBoard(newValue) {
      this.boardsEnabled = newValue;
    },
    checkIfGroup(newValue) {
      this.groupsEnabled = newValue;
    },
    checkIfTask(newValue) {
      this.tasksEnabled = newValue;
    }
  },
  computed: {
    ...mapState(["projects"]),
    project() {
      return this.projects.find(x => x.id === this.$route.params.projectid);
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(this.user.id);
    },
    checkIfBoard() {
      return this.project.permBoard.includes(this.user.id);
    },
    checkIfGroup() {
      return this.project.permGroup.includes(this.user.id);
    },
    checkIfTask() {
      return this.project.permTask.includes(this.user.id);
    }
  },
  methods: {
    changePerm(permission, toggle) {
      if (!toggle)
        projectsRef
          .doc(this.$route.params.projectid)
          .update({
            [permission]: firebase.firestore.FieldValue.arrayUnion(this.user.id)
          })
          .then(() => {
            log(
              `Changed ${this.user.name} permission`,
              this.$route.params.projectid,
              "user"
            );
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      else
        projectsRef
          .doc(this.$route.params.projectid)
          .update({
            [permission]: firebase.firestore.FieldValue.arrayRemove(
              this.user.id
            )
          })
          .then(() => {
            log(
              `Removed user ${this.user.name} as an admin`,
              this.$route.params.projectid,
              "user"
            );
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow-y: scroll;

  transition: opacity var(--animation-duration);
  background-color: #00000066;

  .modal-content {
    top: 30px;
    margin: 100px 0;
    width: 40vw;
    max-width: 500px;
    text-align: left;
    display: flex;
    flex-direction: column;
    height: max-content;
    background-color: var(--background);
    padding: 30px;

    .settings-button {
      padding: 10px;
      cursor: pointer;
    }
    .enabled {
      background-color: var(--background);
    }
    .disabled {
      background-color: var(--background-2);
    }
  }
}
</style>
