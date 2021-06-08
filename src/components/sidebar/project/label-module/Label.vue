<template>
  <div class="project-label-container">
    <div class="label-left">
      <div class="label-title-container">
        <input
          v-model="color"
          class="color-picker"
          type="color"
          @change="updateColor"
        />
        <p v-if="!editing" class="color-title" @click="editLabel">
          {{ label.name }}
        </p>
        <form
          v-if="editing"
          class="edit-form color-title"
          @submit.prevent="submitEdit"
        >
          <input
            ref="editLabel"
            v-model="editLabelName"
            class="edit-input"
            minlength="1"
            maxlength="100"
            @blur="editing = false"
          />
        </form>
        <div v-if="checkIfAdmin || checkIfOwner" class="owner-controls">
          <button class="action-button" @click="deleteLabel">
            <div class="action-icon icon cross animate normal"></div>
          </button>
          <button class="action-button" @click="editLabel">
            <div
              class="action-icon icon edit animate"
              :class="editing ? 'editing' : 'normal'"
            ></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { labelsRef, db, tasksRef } from "../../../../main";
import firebase from "firebase/app";
import { log } from "../../../../utils/log";
export default {
  name: "Label",
  props: {
    label: {
      type: Object,
      default: () => {
        return {};
      }
    },
    project: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      color: "",
      editing: false,
      newLabelName: "",
      newColor: "",
      colorPicker: false
    };
  },
  mounted() {
    this.color = this.label.color;
  },
  computed: {
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
    decrement(orderNo) {
      labelsRef
        .where("project", "==", this.$route.params.projectid)
        .where("order", ">", orderNo)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(object => {
            object.ref.update({
              order: firebase.firestore.FieldValue.increment(-1)
            });
          });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    },
    deleteLabel() {
      let oldLabel = this.label;
      tasksRef
        .where("labels", "array-contains", db.doc("/labels/" + this.label.id))
        .get()
        .then(tasksQuery => {
          tasksQuery.forEach(doc => {
            doc.ref.update({
              labels: firebase.firestore.FieldValue.arrayRemove(
                db.doc("/labels/" + this.label.id)
              )
            });
          });
          labelsRef
            .doc(this.label.id)
            .delete()
            .then(() => {
              log(
                `Deleted label ${oldLabel.name}`,
                this.$route.params.projectid,
                "label"
              );
            })
            .catch(error => {
              this.$toasted.global.error({ message: error });
            });
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    },
    editLabel() {
      this.newColor = this.label.color;
      this.editLabelName = this.label.name;
      this.editing = !this.editing;
      if (this.editing) {
        this.$nextTick(() => {
          this.$refs.editLabel.focus();
        });
      }
    },
    submitEdit() {
      let oldLabel = this.label;
      if (
        this.editLabelName.length >= 1 &&
        this.editLabelName.length <= 100 &&
        this.label.name !== this.editLabelName
      ) {
        labelsRef
          .doc(this.label.id)
          .update({
            name: this.editLabelName
          })
          .then(() => {
            log(
              `Updated label name from ${oldLabel.name} to ${this.editLabelName}`,
              this.$route.params.projectid,
              "label"
            );
            this.editLabelName = "";
            this.editing = false;
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    },
    updateColor() {
      let oldLabel = this.label;
      if (this.label.color !== this.color) {
        labelsRef
          .doc(this.label.id)
          .update({
            color: this.color
          })
          .then(() => {
            log(
              `Updated label color from ${oldLabel.color} to ${this.color}`,
              this.$route.params.projectid,
              "label"
            );
            this.editing = false;
          })
          .catch(error => {
            this.$toasted.global.error({ message: error });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.color-title {
  margin-left: 10px;
  width: 80%;
  cursor: pointer;
  word-wrap: break-word;
}

.color-picker {
  padding-left: 0;
  height: 48px;
  width: 48px;
  min-width: 48px;
  min-height: 48px;
  border: none;
  outline: none;
  float: left;
  -webkit-appearance: none;

  &::-webkit-color-swatch-wrapper {
    transition: var(--animation-duration);
  }
  &::-webkit-color-swatch {
    border: none;
    border-radius: var(--corner-radius);
  }
}

.label-title-container {
  display: flex;
  align-items: center;
  width: calc(100% - 60px);
  height: 60px;
  position: relative;

  .owner-controls {
    position: absolute;
    top: 14px;
    right: -60px;
  }

  .edit-form {
    width: 100%;

    .edit-input {
      width: 100%;
    }
  }
}

.project-label-container {
  height: max-content;
  width: 100%;
}

.label-left {
  height: 100%;
  width: 100%;
}
</style>
