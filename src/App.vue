<template>
  <div id="app">
    <TopHeader @change="darkMode = !darkMode" />
    <router-view class="main" name="mainRouter" />
  </div>
</template>

<script>
import TopHeader from "./components/header/TopHeader.vue";
export default {
  components: { TopHeader },
  data() {
    return {
      darkMode: false
    };
  },
  watch: {
    darkMode: function() {
      let htmlEl = document.documentElement;

      if (this.darkMode) {
        localStorage.setItem("theme", "dark");
        htmlEl.setAttribute("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
        htmlEl.setAttribute("theme", "light");
      }
    }
  },
  mounted() {
    let htmlElement = document.documentElement;
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
      htmlElement.setAttribute("theme", "dark");
      this.darkMode = true;
    } else {
      htmlElement.setAttribute("theme", "light");
      this.darkMode = false;
    }

    if (localStorage.getItem("sidebar") === null) localStorage.sidebar = "true";
  }
};
</script>

<style lang="scss">
:root {
  /* main colors */
  --background: #ffffff;
  --background-2: #ffffff;
  --foreground: #1b1b1b;
  --foreground-light: #424242;
  --accent-1: #7c9473;
  --accent-2: #646e64;
  --accent-hover: #5d665a;

  /* other variables */
  --animation-duration: 0.1s;
  --margin: 10px;
  --padding: 10px;
  --corner-radius: 3px;

  /* scrollbar */
  --scrollbar-color: var(--accent-1);

  /* task */
  --task-background: var(--background);
  --task-foreground: var(--foreground);
  --task-new-background: var(--background);
  --task-new-foreground: var(--foreground);

  /* group */
  --group-background: var(--background-2);
  --group-foreground: var(--foreground);
  --group-new-background: var(--background-2);
  --group-new-foreground: var(--foreground);

  /* sidebar */

  --sidebar-background: var(--background-2);

  /* project */
  --project-background: var(--background);
  --project-foreground: var(--foreground);
  --project-new-background: var(--project-background);
  --project-new-foreground: var(--project-foreground);

  /* board */
  --board-background: var(--background);
  --board-foreground: var(--foreground);
  --board-new-background: var(--board-new-background);
  --board-new-foreground: var(--board-new-foreground);

  /* top bar */
  --topbar-background: var(--background-2);

  /* labels select */
  --label-hover: #e9e9e9;
}

[theme="dark"] {
  /* main colors */
  --background: #313131;
  --background-2: #414141;
  --foreground: #fefefe;
  --foreground-light: #d1d1d1;
  --accent-hover: #9cbd8f;

  /* task */
  --task-background: var(--background);
  --task-foreground: var(--foreground);
  --task-new-background: var(--background);
  --task-new-foreground: var(--foreground);

  /* group */
  --group-background: var(--background-2);
  --group-foreground: var(--foreground);
  --group-new-background: var(--background-2);
  --group-new-foreground: var(--foreground);

  /* sidebar */
  --sidebar-background: var(--background-2);

  /* project */
  --project-background: var(--background);
  --project-foreground: var(--foreground);
  --project-new-background: var(--background);
  --project-new-foreground: var(--project-foreground);

  /* board */
  --board-background: var(--background);
  --board-foreground: var(--foreground);
  --board-new-background: var(--board-new-background);
  --board-new-foreground: var(--board-new-foreground);

  /* top bar */
  --topbar-background: var(--background-2);

  /* labels select */
  --label-hover: var(--background-2);
}

html,
body {
  background-color: var(--background);
}

.main {
  height: calc(100vh - 50px);
  max-height: calc(100vh - 50px);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

// common styles

.box-shadow {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: var(--corner-radius);
}

.animate {
  transition: var(--animation-duration);
}

.text {
  transition: var(--animation-duration);
  font-size: 16px;
  color: var(--foreground);
  word-wrap: break-word;

  &.dark {
    color: var(--background);
  }

  &.left {
    text-align: left;
  }

  &.right {
    text-align: right;
  }

  &.center {
    text-align: center;
  }
}

// default navigation styles

.nav-main {
  a {
    font-weight: bold;
    text-decoration: none;
    color: var(--foreground);
    transition: var(--animation-duration);

    &:hover {
      color: var(--accent-hover);
      transition: var(--animation-duration);
    }

    &.router-link-exact-active {
      color: var(--accent-1);
      transition: var(--animation-duration);
    }
  }
}
.nav-secondary {
  a {
    font-weight: bold;
    text-decoration: none;
    color: var(--background);
    transition: var(--animation-duration);

    &.router-link-exact-active {
      color: var(--accent-1);
      transition: var(--animation-duration);
    }
  }
}

// scrollbar styles

.scrollbar::-webkit-scrollbar-track {
  background-color: #ffffff00;
  border-radius: var(--corner-radius);
  transition: var(--animation-duration);
}

.scrollbar::-webkit-scrollbar {
  width: 7px;
  height: 7px;
  transition: var(--animation-duration);
  background-color: #ffffff00;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--scrollbar-color);
  transition: var(--animation-duration);
}
.scrollbar::-webkit-scrollbar-corner {
  background-color: transparent;
}

.scrollbar {
  scrollbar-color: var(--accent-1) var(--background-2);
  scrollbar-width: thin;
  scrollbar-gutter: always;
}

/* flexbox */

.flex {
  display: flex;

  &.center {
    justify-content: center;
    align-items: center;
  }

  &.horizontal {
    align-items: center;
  }

  &.vertical {
    justify-content: center;
  }

  &.column {
    flex-direction: column;
  }

  &.row {
    flex-direction: column;
  }
}

/* icons */

.icon-active {
  background-color: var(--accent-1) !important;
}

.icon {
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  background-color: var(--foreground);
  transition: var(--animation-duration);

  &.theme {
    mask: url(./assets/brightness_4-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/brightness_4-black-18dp.svg) no-repeat center /
      contain;
  }

  &.project {
    mask: url(./assets/folder-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/folder-black-18dp.svg) no-repeat center / contain;
  }

  &.permissions {
    mask: url(./assets/flaky-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/flaky-black-18dp.svg) no-repeat center / contain;
  }

  &.leave {
    mask: url(./assets/logout-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/logout-black-18dp.svg) no-repeat center / contain;
  }

  &.board {
    mask: url(./assets/table_chart-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/table_chart-black-18dp.svg) no-repeat center /
      contain;
  }

  &.plus {
    mask: url(./assets/add-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/add-black-18dp.svg) no-repeat center / contain;
  }

  &.delete {
    mask: url(./assets/delete-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/delete-black-18dp.svg) no-repeat center / contain;
  }

  &.edit {
    mask: url(./assets/mode-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/mode-black-18dp.svg) no-repeat center / contain;
  }

  &.menu {
    mask: url(./assets/menu-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/menu-black-18dp.svg) no-repeat center / contain;
  }

  &.group {
    mask: url(./assets/inbox-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/inbox-black-18dp.svg) no-repeat center / contain;
  }

  &.task {
    mask: url(./assets/assignment-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/assignment-black-18dp.svg) no-repeat center /
      contain;
  }

  &.users {
    mask: url(./assets/people-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/people-black-18dp.svg) no-repeat center / contain;
  }

  &.cross {
    mask: url(./assets/clear-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/clear-black-18dp.svg) no-repeat center / contain;
  }

  &.description {
    mask: url(./assets/segment-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/segment-black-18dp.svg) no-repeat center /
      contain;
  }

  &.logs {
    mask: url(./assets/sticky_note_2-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/sticky_note_2-black-18dp.svg) no-repeat center /
      contain;
  }

  &.settings {
    mask: url(./assets/settings-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/settings-black-18dp.svg) no-repeat center /
      contain;
  }

  &.label {
    mask: url(./assets/label-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/label-black-18dp.svg) no-repeat center / contain;
  }

  &.new-label {
    mask: url(./assets/new_label_black_18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/new_label_black_18dp.svg) no-repeat center /
      contain;
  }

  &.user {
    mask: url(./assets/account_circle-black-18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/account_circle-black-18dp.svg) no-repeat center /
      contain;
  }

  &.checkbox {
    mask: url(./assets/task_alt_black_18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/task_alt_black_18dp.svg) no-repeat center /
      contain;
  }

  &.new-checkbox {
    mask: url(./assets/add_task_black_18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/add_task_black_18dp.svg) no-repeat center /
      contain;
  }
  &.public {
    mask: url(./assets/public_black_18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/public_black_18dp.svg) no-repeat center / contain;
  }
  &.clipboard {
    mask: url(./assets/content_paste_black_18dp.svg) no-repeat center / contain;
    -webkit-mask: url(./assets/content_paste_black_18dp.svg) no-repeat center /
      contain;
  }
}

.action-button {
  background-color: #ffffff00;
  outline: none;
  border: none;
  cursor: pointer;

  .action-icon {
    &.editing {
      background-color: var(--accent-1);
    }

    &:hover {
      background-color: var(--accent-1);
    }
  }
}

.editing-parent {
  pointer-events: none;
}

.normal-parent {
  pointer-events: initial;
}

.board-list-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
}

.edit-form {
  input {
    font-size: 16px;
    color: var(--foreground);
    background-color: #ffffff00;
    border: none;
    outline: none;
  }
}

.form-underline {
  input {
    border-bottom: 1px solid var(--foreground);
  }
}

.owner-controls {
  display: flex;
}

.module-title {
  margin-bottom: 20px;
}

.toasted-container.top-right {
  top: 60px !important;
  right: 20px !important;
}

.toasted-container .toasted.custom-toast-error {
  padding: 16px;
  border-radius: var(--corner-radius);
  background: #f8d7da;
  color: #721c24;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 15px;
  box-shadow: none;
  border: 1px solid #f5c6cb;
}
.toasted-container .toasted.custom-toast-error .action {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #721c24;
  margin: 0 0 0 0.8rem;
  border-radius: var(--corner-radius);
  padding: 0;
}

.toasted-container .toasted.custom-toast-info {
  padding: 16px;
  border-radius: var(--corner-radius);
  background: #cce5ff;
  color: #004085;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 15px;
  box-shadow: none;
  border: 1px solid #b8daff;
}
.toasted-container .toasted.custom-toast-info .action {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #004085;
  margin: 0 0 0 0.8rem;
  border-radius: var(--corner-radius);
  padding: 0;
}

.toasted-container .toasted.custom-toast-success {
  padding: 16px;
  border-radius: var(--corner-radius);
  background: #d4edda;
  color: #155724;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 15px;
  box-shadow: none;
  border: 1px solid #c3e6cb;
}
.toasted-container .toasted.custom-toast-success .action {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #155724;
  margin: 0 0 0 0.8rem;
  border-radius: var(--corner-radius);
  padding: 0;
}

.linkified {
  color: var(--foreground) !important;
  text-decoration: none;
  font-weight: bold;
  font-family: monospace;
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--foreground);
  transition: background-color 5000s ease-in-out 0s;
}
</style>
