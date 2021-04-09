<template>
  <div class="log-list animate box-shadow scrollbar">
    <div class="text left">
      <div class="module-title">
        <div class="icon logs"></div>
        Logs
      </div>
      <div class="logs-button box-shadow" @click="shouldLog = true">
        Load logs
      </div>
      <table v-if="shouldLog" is="LogTable" :projectid="projectid" />
    </div>
  </div>
</template>

<script>
import LogTable from "./LogTable";
export default {
  name: "LogList",
  components: { LogTable },
  props: {
    projectid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      logs: [],
      text: "Load logs",
      shouldLog: false
    };
  }
};
</script>

<style lang="scss">
.module-title {
  display: flex;
  align-items: center;

  .icon {
    margin-right: 10px;
  }
}
.log-list {
  background-color: var(--group-background);
  margin: 10px;
  height: max-content;
  width: calc(100% - 20px);
  padding: 10px;
  overflow-y: overlay;

  table {
    width: 100%;

    th {
      padding: 15px 0;
      text-align: left;
    }
  }

  .new-log-container {
    display: flex;
  }
}

.logs-button {
  width: max-content;
  padding: 10px;
  cursor: pointer;
  background-color: var(--background);
}
</style>
