<template>
  <table>
    <tr>
      <th>Category</th>
      <th>Message</th>
      <th>User</th>
    </tr>
    <tr is="Log" v-for="log in logs" :key="log.id" class="log" :log="log" />
  </table>
</template>

<script>
import { logsRef } from "../../../../main";
import Log from "./Log";
export default {
  name: "LogList",
  components: { Log },
  props: {
    projectid: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      logs: []
    };
  },
  firestore() {
    return {
      logs: logsRef
        .where("project", "==", this.projectid)
        .limit(10)
        .orderBy("date", "desc")
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
</style>
