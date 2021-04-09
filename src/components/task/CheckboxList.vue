<template>
  <div>
    <div class="checkbox-title">
      <div class="icon checkbox"></div>
      Tasks:
    </div>
    <Checkbox
      v-for="checkbox in checkboxes"
      :key="checkbox.id"
      :data="checkbox"
    />
    <div
      v-if="checkIfOwner || checkIfTask || checkIfAdmin"
      class="new-checkbox-container"
    >
      <button
        v-if="!newOpen"
        class="new-checkbox action-button"
        @click="openCheckboxEntry"
      >
        <div class="flex horizontal text">
          <div class="icon plus"></div>
          Task
        </div>
      </button>
      <form class="new-checkbox-form edit-form" @submit.prevent="addCheckbox">
        <input
          v-if="newOpen"
          ref="checkbox"
          v-model="checkboxInput"
          class="new-checkbox-input"
          minlength="1"
          maxlength="100"
          type="text"
          @blur="newOpen = false"
        />
      </form>
    </div>
  </div>
</template>

<script>
import Checkbox from "./Checkbox";
import { checkboxRef } from "../../main";
import firebase from "firebase/app";
import { log } from "../../utils/log";
import { mapState } from "vuex";
export default {
  name: "CheckboxList",
  components: { Checkbox },
  props: {
    task: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      checkboxes: {},
      newOpen: false,
      checkboxInput: ""
    };
  },
  computed: {
    ...mapState(["projects"]),
    project() {
      return this.projects.find(x => x.id === this.$route.params.projectid);
    },
    checkIfTask() {
      return this.project
        ? this.project.permTask.includes(firebase.auth().currentUser.uid)
        : false;
    },
    checkIfOwner() {
      return this.project
        ? this.project.owner === firebase.auth().currentUser.uid
        : false;
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    }
  },
  methods: {
    openCheckboxEntry() {
      this.newOpen = true;
      this.$nextTick(() => {
        this.$refs.checkbox.focus();
      });
    },
    addCheckbox() {
      if (this.checkboxInput.length >= 1 && this.checkboxInput.length <= 100) {
        this.newOpen = false;
        checkboxRef
          .add({
            name: this.checkboxInput,
            owner: firebase.auth().currentUser.uid,
            createdAt: firebase.firestore.Timestamp.now(),
            task: this.task.id,
            order: this.checkboxes.length,
            checked: false
          })
          .then(() => {
            log(
              `Added ${this.checkboxInput} checkbox to ${this.task.name}`,
              this.$route.params.projectid,
              "checkbox"
            );
            this.checkboxInput = "";
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    }
  },
  firestore() {
    return {
      checkboxes: checkboxRef
        .where("task", "==", this.task.id)
        .orderBy("order", "asc")
    };
  }
};
</script>

<style lang="scss" scoped>
.new-checkbox-container {
  height: 24px;
}

.checkbox-title {
  color: var(--foreground);
  margin: 10px 0;
  display: flex;
  align-items: center;

  .icon {
    float: left;
    margin-right: 5px;
  }
}
</style>
