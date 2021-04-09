<template>
  <div id="nav" class="nav-main animate">
    <div :class="toggledStatus ? '' : 'toggled'" class="left-box">
      <div class="menu-placeholder">
        <div
          v-if="allowedSidebar"
          class="icon menu"
          @click="toggleSidebar"
        ></div>
      </div>
      <router-link class="teeemwork-link" to="/">Teeemwork</router-link>
    </div>
    <div>
      <div class="right-box">
        <div @click="changeTheme" class="icon theme"></div>
        <div
          @click="$router.push({ path: '/profile' })"
          class="icon user"
        ></div>
        <router-link v-if="!loggedIn" to="/login">Login</router-link>
        <a v-if="loggedIn" to="" @click="signOut">Sign Out</a>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  data() {
    return {
      loggedIn: false,
      toggled: this.toggledStatus
    };
  },
  computed: {
    toggledStatus() {
      return this.$store.getters.getToggled;
    },
    allowedSidebar() {
      return this.$route.meta.allowSidebar;
    }
  },
  created() {
    if (localStorage.getItem("sidebar") === "false")
      this.$store.dispatch("disableToggled");
    else this.$store.dispatch("enableToggled");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  },
  mounted() {
    this.toggled = this.toggledStatus;
  },
  methods: {
    toggleSidebar() {
      if (this.toggled) this.$store.dispatch("disableToggled");
      else this.$store.dispatch("enableToggled");
      this.toggled = !this.toggled;
      localStorage.sidebar = this.toggled;
    },
    changeTheme() {
      this.$emit("change");
    },
    signOut: async function() {
      try {
        await firebase.auth().signOut();
        this.$router.replace({ name: "home" });
      } catch (error) {
        this.$toasted.global.error({
          message: error
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#nav {
  background-color: var(--topbar-background);
  transition: var(--animation-duration);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100vw;
  padding: 10px;
}

.left-box {
  display: flex;
  align-items: center;

  .teeemwork-link {
    margin-top: 2px;
    margin-right: 10px;
  }

  .icon {
    background-color: var(--accent-1);
    margin-right: 10px;
    max-height: 30px;
    max-width: 30px;
    height: 30px;
    width: 30px;
  }
}

.menu-placeholder {
  height: 30px;
  width: 40px;
}

.toggled {
  .icon {
    background-color: var(--foreground) !important;
  }
}

.right-box {
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon:hover {
    background-color: var(--accent-1);
  }

  * {
    margin-left: 20px;
    cursor: pointer;
  }
}

.theme-button {
  border: none;
  outline: none;
  background-color: #00000000;
}
</style>
