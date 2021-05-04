<template>
  <div v-if="checkboxes.length > 0">
    <div class="checkbox-title">
      <div class="icon checkbox"></div>
      Subtasks:
    </div>
    <Checkbox
      v-for="checkbox in checkboxes"
      :key="checkbox.id"
      :checkbox="checkbox"
    />
  </div>
</template>

<script>
import Checkbox from "./Checkbox";
export default {
  name: "CheckboxList",
  components: { Checkbox },
  props: {
    checkboxes: {
      ype: Object,
      default: () => {
        return {};
      }
    },
    task: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
