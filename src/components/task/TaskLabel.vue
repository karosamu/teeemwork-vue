<template>
  <div class="task-label">
    <div :style="{ backgroundColor: label.color }" class="label-color"></div>
    <p
      class="text label-text"
      :class="checkIfOwner || checkIfTask || checkIfAdmin ? 'label-click' : ''"
      @click="removeLabel"
    >
      {{ label.name }}
    </p>
  </div>
</template>

<script>
import { db, tasksRef } from "../../main";
import firebase from "firebase/app";
import { log } from "../../utils/log";
import { mapState } from "vuex";
export default {
  name: "Label",
  props: ["task", "label"],
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
      return this.task.owner === firebase.auth().currentUser.uid;
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    }
  },
  methods: {
    removeLabel() {
      if (this.checkIfOwner || this.checkIfTask)
        tasksRef
          .doc(this.task.id)
          .update({
            labels: firebase.firestore.FieldValue.arrayRemove(
              db.doc("/labels/" + this.label.id)
            )
          })
          .then(
            log(
              `Removed ${this.label.name} label from ${this.task.name}`,
              this.$route.params.projectid,
              "label"
            )
          )
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
    }
  }
};
</script>

<style lang="scss" scoped>
.label-color {
  height: 17px;
  width: 50px;
  margin-bottom: 2px;
  margin-right: 10px;
  border-radius: 10px;
  transition: var(--animation-duration);
}

.label-list {
  .label-click {
    cursor: pointer;
  }

  .label-click:hover {
    text-decoration: line-through;
    color: gray;
    transition: var(--animation-duration);
  }
}
.label-text {
  line-height: 20px;
  word-wrap: break-word;
}

.label-color {
  float: left;
  margin-right: 5px;
}

.task-label {
  width: 100%;
  margin: 10px 0;
}
</style>
