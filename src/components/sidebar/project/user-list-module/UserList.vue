<template>
  <div class="user-list animate box-shadow scrollbar">
    <div class="text left">
      <div class="module-title">
        <div class="icon users"></div>
        Users
      </div>
      <table v-if="users">
        <tr>
          <th>Name</th>
          <th>Surname</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
        <tr
          is="User"
          v-for="user in project.users"
          :key="user"
          class="user"
          :user="user"
          :project="project"
        />
      </table>
    </div>
    <div v-if="checkIfOwner" class="new-user-container">
      <button
        v-if="!newOpen"
        class="new-user action-button"
        @click="openUserEntry"
      >
        <div class="flex horizontal text">
          <div class="icon plus"></div>
          User
        </div>
      </button>
      <form class="new-user-form edit-form" @submit.prevent="addUser">
        <input
          v-if="newOpen"
          ref="userInput"
          v-model="userName"
          class="new-user-input"
          minlength="1"
          type="email"
          placeholder="Enter user's email address"
          @blur="newOpen = false"
        />
      </form>
      
    </div>
  </div>
</template>

<script>
import { projectsRef } from "../../../../main";
import User from "./User";
import firebase from "firebase/app";
import { mapState } from "vuex";
import { log } from "../../../../utils/log";
export default {
  name: "UserList",
  components: { User },
  props: {
    projectid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      userName: "",
      newOpen: false
    };
  },
  computed: {
    ...mapState(["projects", "users"]),
    project() {
      return this.projects.find(x => x.id === this.projectid);
    },
    checkIfOwner() {
      return this.project.owner === firebase.auth().currentUser.uid;
    }
  },
  methods: {
    openUserEntry() {
      this.newOpen = true;
      this.$nextTick(() => {
        this.$refs.userInput.focus();
      });
    },
    addUser() {
      let user = this.users.find(obj => {
        return obj.email === this.userName;
      });
      if (user) {
        if (this.userName.length >= 1) {
          this.newOpen = false;
          projectsRef
            .doc(this.project.id)
            .update({
              users: firebase.firestore.FieldValue.arrayUnion(user.id)
            })
            .then(() => {
              log(
                `Added user ${this.userName} to the project`,
                this.project.id,
                "user"
              );
              this.userName = "";
            })
            .catch(error => {
              this.$toasted.global.error({ message: error });
            });
        }
      } else
        this.$toasted.global.error({
          message: "User email address not found"
        });
    }
  }
};
</script>

<style lang="scss">
.module-title {
  display: flex;
  align-items: center;

  .icon {
    margin-right: 10px;
  }
}

.new-user-input,
.new-user-form {
  width: 100%;
}

.user-list {
  background-color: var(--group-background);
  margin: 10px;
  height: max-content;
  width: calc(100% - 20px);
  padding: 10px;
  overflow-y: overlay;
  max-height: calc(100vh - 70px);

  table {
    width: 100%;

    th {
      padding: 15px 0;
      text-align: left;
    }
  }

  .new-user-container {
    display: flex;
  }
}
</style>
