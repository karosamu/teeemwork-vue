<template>
  <div>
    <span class="label-title"
      ><div class="icon label"></div>
      Labels:</span
    >
    <Label
      v-for="label in labels"
      :key="label.id"
      class="label-list"
      :task="task"
      :label="label"
    />
    <div
      v-if="
        filteredLabels.length > 0 &&
          (checkIfOwner || checkIfTask || checkIfAdmin)
      "
      class="custom-select"
      @blur="open = false"
    >
      <div class="selected" :class="{ open: open }" @click="open = !open">
        <div class="flex horizontal text">
          <div class="icon plus"></div>
          Label
        </div>
      </div>
      <div class="items scrollbar box-shadow" :class="{ selectHide: !open }">
        <div
          v-for="label of filteredLabels"
          :key="label.id"
          @click="addLabel(label)"
        >
          <DropdownLabel :label="label" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, labelsRef, tasksRef } from "../../main";
import Label from "./TaskLabel";
import DropdownLabel from "./TaskDropDownLabel";
import firebase from "firebase/app";
import { mapState } from "vuex";
import { log } from "../../utils/log";
export default {
  name: "TaskLabelList",
  components: { Label, DropdownLabel },
  props: {
    taskId: {
      type: Object,
      default: () => {
        return {};
      }
    },
    task: {
      type: Object,
      default: () => {
        return {};
      }
    },
    labels: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      allLabels: [],
      open: false,
      selected: Object
    };
  },
  computed: {
    filteredLabels() {
      if (this.labels)
        return this.allLabels.filter(
          element1 => !this.labels.some(element2 => element1.id === element2.id)
        );
      else return this.allLabels;
    },
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
      return this.task.owner === firebase.auth().currentUser.uid;
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    }
  },
  methods: {
    addLabel(label) {
      this.selected = label;
      this.open = false;
      tasksRef
        .doc(this.task.id)
        .update({
          labels: firebase.firestore.FieldValue.arrayUnion(
            db.doc("/labels/" + this.selected.id)
          )
        })
        .then(() => {
          log(
            `Added ${this.selected.name} label to ${this.task.name}`,
            this.$route.params.projectid,
            "label"
          );
          this.selected = {};
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    }
  },
  firestore() {
    return {
      allLabels: labelsRef.where("project", "==", this.$route.params.projectid)
    };
  }
};
</script>

<style lang="scss" scoped>
.new-label-container {
  height: 24px;
}

.label-title {
  color: var(--foreground);
  display: flex;
  align-items: center;

  .icon {
    float: left;
    margin-right: 5px;
  }
}

.custom-select {
  margin-top: 20px;
  outline: none;
}

.custom-select .selected {
  background-color: var(--background);
  color: var(--foreground);
  cursor: pointer;
}

.custom-select .selected:after {
  position: absolute;
  content: "";
}

.custom-select .items {
  width: 300px;
  border-radius: 5px 5px 5px 5px;
  position: absolute;
  background-color: var(--background);
}

.custom-select .items div {
  padding: 2px 5px;
  cursor: pointer;
  user-select: none;
}

.custom-select .items div:hover {
  transition: var(--animation-duration);
  background-color: var(--label-hover);
  border-radius: 5px 5px 5px 5px;
}

.selectHide {
  display: none;
}
</style>
