<template>
  <div class="task-label">
    <div :style="{ backgroundColor: label.color }" class="label-color"></div>
    <p
      class="text label-text"
    >
      {{ label.name }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Label",
  props: ["task", "label"],
};
</script>