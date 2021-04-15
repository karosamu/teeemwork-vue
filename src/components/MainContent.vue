<template>
  <div id="main" class="animate scrollbar">
    <Sidebar
      v-show="toggledStatus"
      :class="toggledStatus ? 'normal-sidebar' : 'hidden-sidebar'"
      class="sidebar animate"
    />
    <div
      :class="toggledStatus ? 'inner-shadow-shown' : 'inner-shadow-hidden'"
      class="inner-shadow"
    ></div>
    <router-view
      :key="$route.fullPath"
      :class="toggledStatus ? 'normal-width' : 'hidden-width'"
      name="contentRouter"
      class="content animate"
    />
  </div>
</template>

<script>
import Sidebar from "./sidebar/Sidebar.vue";
export default {
  mounted() {
    this.$store.dispatch("bindProjects");
    this.$store.dispatch("bindUsers");
  },
  components: { Sidebar },
  computed: {
    toggledStatus() {
      return this.$store.getters.getToggled;
    }
  }
};
</script>

<style lang="scss" scoped>
#main {
  display: flex;
  background-color: var(--sidebar-background);
  position: relative;
  overflow: hidden;
}

.inner-shadow {
  box-shadow: inset 5px 5px 10px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  border-radius: var(--corner-radius);
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
  z-index: 500;
}

.inner-shadow-shown {
  left: 300px;
}

.inner-shadow-hidden {
  left: 0;
}

.sidebar {
  background-color: var(--sidebar-background);
  height: 100%;
}

.content {
  height: calc(100%);
  background-color: var(--background);
  border-top-left-radius: 5px;
}

.normal-width {
  width: calc(100vw - 300px);
}

.hidden-width {
  width: 100vw;
}
</style>
