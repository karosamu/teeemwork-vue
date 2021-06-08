<template>
  <div class="nav-main animate home flex center">
    <div class="home-container flex column box-shadow">
      <h1 class="animate text home-title">
        Welcome to <span class="colored-text">Teeemwork</span>
      </h1>
      <p class="text left home-description">
        What is Teeemwork? Teeemwork is an
        <a
          class="colored-text link"
          href="https://github.com/karosamu/teeemwork-vue"
          target="_blank"
          >open-source</a
        >
        Kanban-style based project management tool designed to make it easy to
        manage multiple projects with several boards.
      </p>
      <p class="text left home-description">
        Latest changes:
          <ul>
            <li>Improved drag&drop by removing the weird animation.</li>
            <li>Fixed hard-coded security protocol for public board links.</li>
            <li>Fixed a bug where tasks swap places if task is placed in last place</li>
          </ul>
      </p>
      <router-link v-if="!checkIfLoggedIn" class="animate" to="/signup"
        >Sign Up</router-link
      >
      <router-link v-if="checkIfLoggedIn" class="animate" to="/homepage"
        >Go to the app</router-link
      >
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  name: "Home",
  computed: {
    checkIfLoggedIn() {
      return firebase.auth().currentUser ? true : false;
    }
  }
};
</script>

<style lang="scss">
.home-title {
  transition: var(--animation-duration);
  color: var(--foreground);
  font-size: 40px;
}

.home-description {
  margin: 40px;
  line-height: 30px;

  ul {
    margin-left: 30px;
  }
}

.home-container {
  width: 600px;
  padding: 40px;
  transition: var(--animation-duration);
  background-color: var(--background-2);
}

.colored-text {
  transition: var(--animation-duration);
  color: var(--accent-1) !important;
}

.link {
  text-decoration: underline !important;
}

.home {
  transition: var(--animation-duration);
  background-color: var(--background);
}
</style>
