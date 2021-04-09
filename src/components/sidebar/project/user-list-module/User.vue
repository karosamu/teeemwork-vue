<template>
  <tr v-if="userInfo" class="table-row">
    <td class="table-name">
      <span v-if="userInfo.length !== 0 && userInfo.name != ''">{{
        userInfo.name
      }}</span
      ><span v-else>-</span>
    </td>
    <td class="table-surname">
      <span v-if="userInfo.length !== 0 && userInfo.surname != ''">
        {{ userInfo.surname }}</span
      ><span v-else>-</span>
    </td>
    <td class="table-email">
      <span v-if="userInfo.length !== 0 && userInfo.email != ''">
        {{ userInfo.email }}</span
      ><span v-else>-</span>
    </td>
    <td>
      <div
        v-if="(!checkIfThisUser || !projectOwner) && checkIfOwner"
        class="owner-controls"
      >
        <button class="action-button" @click="permissions = true">
          <div class="action-icon icon permissions animate normal"></div>
        </button>
        <PermissionsModal
          @disable="permissions = false"
          v-if="permissions"
          :user="userInfo"
        />
        <button class="action-button" @click="deleteUser(user)">
          <div class="action-icon icon cross animate normal"></div>
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import { projectsRef } from "../../../../main";
import firebase from "firebase/app";
import { mapState } from "vuex";
import { log } from "../../../../utils/log";
import PermissionsModal from "./PermissionsModal";
export default {
  name: "User",
  data() {
    return {
      permissions: false
    };
  },
  components: { PermissionsModal },
  props: {
    user: {
      type: String,
      default: ""
    },
    project: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapState(["users"]),
    userInfo() {
      return this.users.find(x => x.id === this.user);
    },
    checkIfOwner() {
      return this.project.owner === firebase.auth().currentUser.uid;
    },
    checkIfThisUser() {
      return this.userInfo.id === firebase.auth().currentUser.uid;
    },
    projectOwner() {
      return this.userInfo.id === this.project.owner;
    },
    checkIfAdmin() {
      return this.project.permAdmin.includes(firebase.auth().currentUser.uid);
    }
  },
  methods: {
    deleteUser(username) {
      let oldUser = username;
      projectsRef
        .doc(this.project.id)
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(username)
        })
        .then(
          log(
            `Removed user ${oldUser} from the project`,
            this.$route.params.projectid,
            "user"
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
td {
  padding: 15px 0;
  text-align: left;
}

.table-row {
  .table-name {
    max-width: 500px;
  }
  .table-surname {
    max-width: 500px;
  }
}
</style>
