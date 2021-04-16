<template>
  <div @click="toggle" class="user-dropdown">
    Open
    <slot />
  </div>
</template>

<script>
export default {
  name: "AppDropdown",
  provide() {
    return {
      sharedState: this.sharedState
    };
  },
  data() {
    return {
      sharedState: {
        active: false
      }
    };
  },
  methods: {
    toggle() {
      this.sharedState.active = !this.sharedState.active;
    },
    away() {
      this.sharedState.active = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-dropdown {
  position: relative;
  display: block;
}
</style>
