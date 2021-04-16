<template>
  <div class="checkbox-cont">
    <div class="checkbox-container">
      <input
        disabled
        :id="checkbox.id"
        :checked="checked"
        type="checkbox"
        class="modal-checkbox"
      />
      <p class="checkbox-text" :class="checked ? 'checked' : 'normal'">
        {{ checkbox.name }}
      </p>
      <div>
        <div v-if="checkbox.asignee" class="checkbox-asignee">
          - {{ asigneeInfo.name }} {{ asigneeInfo.surname }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
  props: {
    checkbox: {
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
    }
  },
  data() {
    return {
      checked: false
    };
  },
  mounted() {
    this.checked = this.checkbox.checked;
  },
  computed: {
    cbVal() {
      return this.checkbox.checked;
    }
  }
};
</script>

<style lang="scss" scoped>
input[type="checkbox"][disabled] {
  appearance: auto;
}
</style>
