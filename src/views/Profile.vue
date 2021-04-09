<template>
  <div class="profile scrollbar">
    <div class="profile-container box-shadow" v-if="user">
      <div class="name text">{{ user.name }} {{ user.surname }}</div>
      <div class="email text">{{ user.email }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase/app";
export default {
  name: "Profile",
  computed: {
    ...mapState(["users"]),
    user() {
      return this.users.find(x => x.id === firebase.auth().currentUser.uid);
    }
  }
};
</script>

<style lang="scss" scoped>
.profile {
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
  padding-bottom: 50px;
  overflow-x: hidden;

  .profile-container {
    background-color: var(--background-2);
    padding: 40px;
    width: 500px;
    display: flex;
    flex-direction: column;
    margin: auto;

    .name {
      font-weight: bold;
      margin-bottom: 40px;
    }

    .email {
      margin-bottom: 20px;
    }
  }
}
</style>
