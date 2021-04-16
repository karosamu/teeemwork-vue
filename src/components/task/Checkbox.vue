<template>
  <div class="checkbox">
    <div class="checkbox-container">
      <input
        :disabled="!(checkIfOwner || checkIfTask || checkIfAdmin)"
        :id="checkbox.id"
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
        {{ checkbox.name }}
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
          @blur="submitEdit"
        />
      </form>
      <div>
        <div
          v-if="!editingAsignee && checkbox.asignee"
          @click="editAsigneeClick"
          class="checkbox-asignee"
        >
          - {{ asigneeInfo.name }} {{ asigneeInfo.surname }}
        </div>
        <form
          class="edit-form nondrag asignee-edit-form"
          @submit.prevent="submitAsignee"
        >
          <input
            v-if="editingAsignee"
            ref="editAsignee"
            v-model="editAsignee"
            class="edit-input"
            minlength="1"
            v-on="listenersAsignee"
          />
        </form>
      </div>
    </div>
    <div
      v-if="checkIfOwner || checkIfTask || checkIfAdmin"
      class="owner-controls"
      @click.stop
    >
      <button class="action-button" @click="editAsigneeClick">
        <div class="action-icon icon user animate"></div>
      </button>
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
    checkbox: {
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
      inputActive: false,
      editingAsignee: false,
      editAsignee: ""
    };
  },
  mounted() {
    this.checked = this.checkbox.checked;
  },
  computed: {
    ...mapState(["projects", "users"]),
    asigneeInfo() {
      return this.users.find(x => x.id === this.checkbox.asignee);
    },
    project() {
      return this.projects.find(x => x.id === this.$route.params.projectid);
    },
    listenersName() {
      if (this.inputActive) {
        return { blur: this.submitEdit };
      }
      return null;
    },
    listenersAsignee() {
      if (this.inputActive) {
        return { blur: this.submitAsignee };
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
        checkboxRef.doc(this.checkbox.id).update({
          checked: this.checked
        });
    },
    editCheckbox() {
      if (this.checkIfTask || this.checkIfOwner || this.checkIfAdmin) {
        this.editCheckboxName = this.checkbox.name;
        this.editing = !this.editing;
        if (this.editing) {
          this.$nextTick(() => {
            this.$refs.editModalCheckbox.focus();
          });
        }
      }
    },
    editAsigneeClick() {
      this.inputActive = true;
      if (this.checkIfTask || this.checkIfOwner || this.checkIfAdmin) {
        if (this.checkbox.asignee) this.editAsignee = this.asigneeInfo.email;
        this.editingAsignee = !this.editingAsignee;
        if (this.editingAsignee) {
          this.$nextTick(() => {
            this.$refs.editAsignee.focus();
          });
        }
      }
    },
    submitAsignee() {
      this.editingAsignee = false;
      let user = this.users.find(obj => {
        return obj.email === this.editAsignee;
      });
      if (
        (user && this.checkbox.asignee !== user.id) ||
        this.editAsignee == ""
      ) {
        if (this.editAsignee.length <= 300) {
          checkboxRef
            .doc(this.checkbox.id)
            .update({
              asignee: user ? user.id : ""
            })
            .then(() => {
              log(
                `Changed ${this.checkbox.name} asignee to ${
                  user ? user.email : "none"
                }`,
                this.$route.params.projectid,
                "checkbox"
              );
              this.editAsignee = "";
              this.inputActive = false;
            })
            .catch(error => {
              this.$toasted.global.error({
                message: error
              });
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
        this.checkbox.name !== this.editCheckboxName
      ) {
        checkboxRef
          .doc(this.checkbox.id)
          .update({
            name: this.editCheckboxName
          })
          .then(() => {
            log(
              `Edited checkbox title of ${this.checkbox.name}`,
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
        .where("task", "==", this.checkbox.task)
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
      let odrerNo = this.checkbox.order;
      checkboxRef
        .doc(this.checkbox.id)
        .delete()
        .then(() => {
          log(
            `Removed ${this.checkbox.name} label from ${this.task.name}`,
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
    width: calc(100% - 80px);
    line-height: 20px;
  }

  .modal-checkbox {
    float: left;
    margin-right: 10px;
    height: 20px;
  }

  .checkbox-modal-edit-form {
    width: calc(100% - 50px);

    input {
      width: 100%;
    }
  }
}

.checkbox-text {
  width: calc(100% - 30px);
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

.checkbox-asignee {
  color: var(--accent-1);
  font-size: 14px;
}
</style>
