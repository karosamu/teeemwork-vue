<template>
  <div class="settings-list animate box-shadow scrollbar">
    <div class="text left">
      <div class="module-title">
        <div class="icon settings"></div>
        Toggle panes
      </div>
      <div class="settings-box">
        <div
          @click="toggleSetting(toggle)"
          v-for="toggle in settingsList"
          :key="toggle"
          class="button-container"
        >
          <ToggleButton :list="disabled" :name="toggle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleButton from "./ToggleButton";
export default {
  name: "ToggleList",
  components: { ToggleButton },
  props: {
    settingsList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    disabled: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    toggleSetting(value) {
      this.$emit("disable", value);
    }
  }
};
</script>

<style lang="scss">
.settings-list {
  background-color: var(--group-background);
  margin: 10px;
  width: calc(100% - 20px);
  padding: 10px;
  overflow-y: overlay;
  height: max-content;

  table {
    width: 100%;
  }

  .new-settings-container {
    display: flex;
  }
}

.settings-box {
  display: flex;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  user-select: none;
}

.settings-button {
  padding: 10px;
  cursor: pointer;
}
.settings-button:not(:first-child) {
  margin: 0 0 0 10px;
}
.enabled {
  background-color: var(--background);
}
.disabled {
  background-color: var(--background-2);
}

.button-container {
  margin-right: 10px;
}
</style>
