<template>
  <div>
    <span class="label-title"
      ><div class="icon label"></div>
      Labels:</span
    >
    <Label
      v-for="label in labels"
      :key="label.id"
      class="label-list"
      :task="task"
      :label="label"
    />
  </div>
</template>

<script>
import Label from "./Label";
export default {
  name: "TaskLabelList",
  components: { Label },
  props: {
    taskId: {
      type: Object,
      default: () => {
        return {};
      }
    },
    task: {
      type: Object,
      default: () => {
        return {};
      }
    },
    labels: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>
