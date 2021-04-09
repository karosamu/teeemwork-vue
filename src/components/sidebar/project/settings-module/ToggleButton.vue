<template>
  <div
    :class="!checkIfToggled ? 'enabled box-shadow' : 'disabled'"
    class="settings-button"
  >
    <div>{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    name: {
      type: String,
      default: ""
    }
  },
  computed: {
    checkIfToggled() {
      return this.list.includes(this.name);
    }
  }
};
</script>

<style lang="scss">
.settings-button {
  padding: 10px;
  cursor: pointer;
}
.enabled {
  background-color: var(--background);
}
.disabled {
  background-color: var(--background-2);
}
</style>
