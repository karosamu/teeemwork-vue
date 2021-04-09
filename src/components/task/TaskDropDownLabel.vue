<template>
  <div class="task-label">
    <div :style="{ backgroundColor: label.color }" class="label-color"></div>
    <p class="text label-text label-click">{{ label.name }}</p>
  </div>
</template>

<script>
export default {
  name: "Label",
  props: {
    label: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.label-color {
  height: 17px;
  width: 50px;
  margin-bottom: 2px;
  margin-right: 10px;
  border-radius: 10px;
  transition: var(--animation-duration);
}

.label-list {
  .label-click {
    cursor: pointer;
  }

  .label-click:hover {
    text-decoration: line-through;
    color: gray;
    transition: var(--animation-duration);
  }
}
.label-text {
  line-height: 20px;
  word-wrap: break-word;
}

.label-color {
  float: left;
  margin-right: 5px;
}

.task-label {
  width: 100%;
  margin: 10px 0;
}
</style>
