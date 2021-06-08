<template>
  <div
    v-if="checkIfAdmin || checkIfOwner || labels.length > 0"
    class="project-label-list animate box-shadow scrollbar"
  >
    <div class="text left">
      <div class="module-title">
        <div class="icon label"></div>
        Labels
      </div>
      <div v-if="labels.length > 0">
        <Label
          :project="project"
          v-for="label in labels"
          :key="label.id"
          class="label-item"
          :label="label"
        />
      </div>
    </div>
    <div v-if="checkIfAdmin || checkIfOwner" class="add-label-container">
      <button
        v-if="!newOpen"
        class="new-label action-button"
        @click.stop="openLabelEntry"
      >
        <div class="flex horizontal text">
          <div class="icon plus"></div>
          Label
        </div>
      </button>
      <form
        v-if="newOpen"
        class="new-label-form edit-form"
        @submit.prevent="loseFocus"
      >
        <input v-model="color" class="color-picker" type="color" />
        <input
          @blur="addLabel"
          ref="label"
          v-model="labelName"
          class="new-label-input"
          minlength="1"
          maxlength="100"
          type="text"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { labelsRef } from "../../../../main";
import { mapState } from "vuex";
import Label from "./Label";
import firebase from "firebase/app";
import { log } from "../../../../utils/log";
export default {
  name: "LabelList",
  components: { Label },
  props: {
    projectid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      labelName: "",
      newOpen: false,
      labels: [],
      color: "#7c9473"
    };
  },
  computed: {
    ...mapState(["projects"]),
    project() {
      return this.projects.find(x => x.id === this.projectid);
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
    loseFocus() {
      this.newOpen = false;
    },
    closeForm() {
      this.newOpen = false;
    },
    openLabelEntry() {
      this.newOpen = true;
      this.$nextTick(() => {
        this.$refs.label.focus();
      });
    },
    addLabel() {
      if (this.labelName.length >= 1 && this.labelName.length <= 100) {
        this.newOpen = false;
        labelsRef
          .add({
            name: this.labelName,
            createdAt: firebase.firestore.Timestamp.now(),
            order: this.labels.length,
            project: this.projectid,
            color: this.color
          })
          .then(() => {
            log(
              `Created new label ${this.labelName}`,
              this.$route.params.projectid,
              "label"
            );
            this.labelName = "";
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    }
  },
  firestore() {
    return {
      labels: labelsRef
        .orderBy("createdAt", "asc")
        .where("project", "==", `${this.projectid}`)
    };
  }
};
</script>

<style lang="scss">
.add-label-container {
  display: flex;
}

.project-label-list {
  background-color: var(--group-background);
  margin: 10px;
  width: calc(100% - 20px);
  padding: 10px;
  overflow-y: overlay;
  height: max-content;

  .label-item {
    margin: 10px 0;
  }

  .new-label-container {
    display: flex;
  }

  .new-label-form {
    width: 100%;
    display: flex;

    .new-label-input {
      padding-left: 10px;
      width: 100%;
    }
  }
}
.color-picker {
  padding-left: 0;
  height: 48px;
  width: 48px;
  border: none;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-color-swatch-wrapper {
    background-color: var(--group-background);
  }
  &::-webkit-color-swatch {
    border: none;
    border-radius: var(--corner-radius);
  }
}
</style>
