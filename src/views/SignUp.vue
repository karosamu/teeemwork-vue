<template>
  <div class="scrollbar signup">
    <form
      @submit.prevent="signUp"
      class="form-underline box-shadow signup-form edit-form"
    >
      <h1 class="text signup-header">Signup</h1>

      <div class="input-field">
        <label class="text left" for="name">Name (Optional)</label>
        <input
          v-model="name"
          maxlength="30"
          type="name"
          name="name"
          autocomplete="name"
          minlength="1"
        />
      </div>
      <div class="input-field">
        <label class="text left" for="surname">Surname (Optional)</label>
        <input
          v-model="surname"
          maxlength="30"
          type="surname"
          autocomplete="lastname"
          name="surname"
          minlength="1"
        />
      </div>
      <div class="input-field">
        <label class="text left" for="email">Email</label>
        <input
          required
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          minlength="1"
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
      <div class="input-field">
        <label class="text left" for="password-confirm">Confirm password</label>
        <input
          required
          v-model="passwordConfirm"
          type="password"
          autocomplete="current-password"
          name="password-confirm"
          minlength="5"
        />
      </div>
      <div class="button-container flex center box-shadow">
        <input class="submit-button" type="submit" value="Submit" />
      </div>
      <p class="text nav-main">
        Already have an account?
        <router-link to="/login">Log In</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { usersRef } from "../main";
export default {
  name: "Login",
  data() {
    return {
      password: "",
      passwordConfirm: "",
      email: "",
      name: "",
      surname: ""
    };
  },
  methods: {
    async signUp() {
      if(this.password === this.passwordConfirm) {
        try {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then(() => {
              usersRef.doc(firebase.auth().currentUser.uid).set({
                name: this.name,
                surname: this.surname,
                email: this.email
              });
              firebase.auth().currentUser.updateProfile({
                displayName: `${this.name} ${this.surname}`
              });
              this.$router.replace({ name: "homepage" });
            });
        } catch (error) {
          this.$toasted.global.error({ message: error });
        }
      } else {
        this.$toasted.global.error({ message: "Passwords do not match!" });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.signup {
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
  padding-bottom: 50px;
  overflow-x: hidden;

  .signup-header {
    font-size: 30px;
  }
}
.signup-form {
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
