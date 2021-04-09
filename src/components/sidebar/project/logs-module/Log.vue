<template>
  <tr class="table-row">
    <td class="table-name">
      <span>{{ returnContext }}</span>
    </td>
    <td class="table-surname">
      <span>{{ log.message }}</span>
    </td>
    <td class="table-email">
      <span v-if="user">
        {{ user.name }} {{ user.surname }} ({{ user.email }})
      </span>
      <span v-else>User data not found</span>
    </td>
  </tr>
</template>

<script>
import { usersRef } from "../../../../main";
export default {
  name: "Log",
  props: {
    log: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      user: Object
    };
  },
  computed: {
    returnContext() {
      return (
        this.log.context.charAt(0).toUpperCase() + this.log.context.slice(1)
      );
    }
  },
  firestore() {
    return {
      user: usersRef.doc(this.log.user)
    };
  }
};
</script>

<style lang="scss" scoped>
td {
  padding: 15px 0;
  text-align: left;
}

.table-row {
  .table-name {
    max-width: 500px;
  }
  .table-surname {
    max-width: 500px;
  }
}
</style>
