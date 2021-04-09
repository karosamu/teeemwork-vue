<template>
  <div class="scrollbar login">
    <form
      @submit.prevent="login"
      class="form-underline  box-shadow login-form edit-form"
    >
      <h1 class="text login-header">Login</h1>
      <div class="input-field">
        <label class="text left" for="email">Email</label>
        <input
          required
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          minlength="2"
        />
      </div>
      <div class="input-field">
        <label class="text left" for="password">Password</label>
        <input
          required
          v-model="password"
          type="password"
          autocomplete="current-password"
          name="password"
          minlength="5"
        />
      </div>
      <div class="button-container box-shadow flex center">
        <input class="submit-button" type="submit" value="Log In" />
      </div>

      <p class="text nav-main">
        Need an account?
        <router-link to="/signup">Sign Up</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  name: "Login",
  data() {
    return {
      password: "",
      email: ""
    };
  },
  methods: {
    login: async function() {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        this.$router.replace({ name: "homepage" });
      } catch (error) {
        this.$toasted.global.error({ message: error });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
  padding-bottom: 50px;
  overflow-x: hidden;

  .login-header {
    font-size: 30px;
  }
}
.login-form {
  background-color: var(--background-2);
  padding: 40px;
  width: 500px;
  display: flex;
  flex-direction: column;
  margin: auto;

  .input-field {
    display: flex;
    flex-direction: column;
    margin: 30px 0;
  }

  label {
    padding: 0 40px;
  }

  input {
    width: calc(100% - 80px);
    margin: 20px 40px;
  }

  .submit-button {
    cursor: pointer;
    width: 100px;
    border: none;
  }

  .button-container {
    background: var(--background);
    margin: 0 40px 20px 40px;
  }
}
</style>
