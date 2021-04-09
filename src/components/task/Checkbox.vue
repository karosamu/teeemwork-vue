<template>
  <div class="checkbox">
    <div class="checkbox-container">
      <input
        :disabled="!(checkIfOwner || checkIfTask || checkIfAdmin)"
        :id="data.id"
        v-model="checked"
        type="checkbox"
        class="modal-checkbox"
        @change="setCheckbox"
      />
      <p
        v-if="!editing"
        class="checkbox-text"
        :class="checked ? 'checked' : 'normal'"
        @click="editCheckbox"
      >
        {{ data.name }}
      </p>
      <form
        class="edit-form checkbox-modal-edit-form"
        @submit.prevent="submitEdit"
      >
        <input
          v-if="editing"
          ref="editModalCheckbox"
          v-model="editCheckboxName"
          class="edit-input"
          minlength="1"
          maxlength="100"
          v-on="listenersName"
        />
      </form>
    </div>
    <div
      v-if="checkIfOwner || checkIfTask || checkIfAdmin"
      class="owner-controls"
      @click.stop
    >
      <button class="action-button" @click="removeCheckBox">
        <div class="action-icon icon cross animate normal"></div>
      </button>
      <button class="action-button" @click="editCheckbox">
        <div
          class="action-icon icon edit animate"
          :class="editing ? 'editing' : 'normal'"
        ></div>
      </button>
    </div>
  </div>
</template>

<script>
import { checkboxRef } from "../../main";
import firebase from "firebase/app";
import { log } from "../../utils/log";
import { mapState } from "vuex";
export default {
  name: "Checkbox",
  props: {
    data: {
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
    }
  },
  data() {
    return {
      checked: false,
      editing: false,
      editCheckboxName: "",
      inputActive: false
    };
  },
  mounted() {
    this.checked = this.data.checked;
  },
  computed: {
    ...mapState(["projects"]),
    project() {
      return this.projects.find(x => x.id === this.$route.params.projectid);
    },
    listenersName() {
      if (!this.inputActive) {
        return { blur: this.submitEdit };
      }
      return null;
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
    setCheckbox() {
      if (this.checkIfOwner || this.checkIfTask || this.checkIfAdmin)
        checkboxRef.doc(this.data.id).update({
          checked: this.checked
        });
    },
    editCheckbox() {
      if (this.checkIfTask || this.checkIfOwner || this.checkIfAdmin) {
        this.editCheckboxName = this.data.name;
        this.editing = !this.editing;
        if (this.editing) {
          this.$nextTick(() => {
            this.$refs.editModalCheckbox.focus();
          });
        }
      }
    },
    submitEdit() {
      this.inputActive = true;
      this.editing = false;
      if (
        this.editCheckboxName.length >= 1 &&
        this.editCheckboxName.length <= 100 &&
        this.data.name !== this.editCheckboxName
      ) {
        checkboxRef
          .doc(this.data.id)
          .update({
            name: this.editCheckboxName
          })
          .then(() => {
            log(
              `Edited checkbox title of ${this.data.name}`,
              this.$route.params.projectid,
              "checkbox"
            );
            this.inputActive = false;
          })
          .catch(error => {
            this.$toasted.global.error({
              message: error
            });
          });
      }
    },
    decrement(orderNo) {
      checkboxRef
        .where("task", "==", this.data.task)
        .where("order", ">", orderNo)
        .get()
        .then(function(snapshot) {
          snapshot.forEach(object => {
            object.ref.update({
              order: firebase.firestore.FieldValue.increment(-1)
            });
          });
        });
    },
    removeCheckBox() {
      let odrerNo = this.data.order;
      checkboxRef
        .doc(this.data.id)
        .delete()
        .then(() => {
          log(
            `Removed ${this.data.name} label from ${this.task.name}`,
            this.$route.params.projectid,
            "checkbox"
          );
          this.decrement(odrerNo);
        })
        .catch(error => {
          this.$toasted.global.error({ message: error });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.checkbox {
  margin: 5px 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  .checkbox-container {
    width: calc(100% - 30px);
    line-height: 20px;
  }

  .modal-checkbox {
    float: left;
    margin-right: 10px;
    height: 20px;
  }
}

.checkbox-text {
  width: 100%;
  word-wrap: break-word;
  line-height: 20px;
  padding-left: 10px;
}

.normal {
  transition: var(--animation-duration);
  color: var(--foreground);
  text-decoration: none;
}

.checked {
  transition: var(--animation-duration);
  color: gray;
  text-decoration: line-through;
}
</style>
