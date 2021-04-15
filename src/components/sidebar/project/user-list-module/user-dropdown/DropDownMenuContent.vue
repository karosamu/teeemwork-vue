<template>
  <transition name="dropdown-content">
    <div
      v-if="active"
      class="dropdown"
    >
      <slot/>
    </div>
  </transition>
</template>

<script>
export default {
  name: "DropDownMenuContent",
  inject: ["sharedState"],
  computed: {
    active() {
      return this.sharedState.active;
    }
  }
};
</script>

<style>
.dropdown {
    transform-origin: top right;
    width: 12rem;
    right: 0;
    position: absolute;
    padding-top: .5rem;
    padding-bottom: .5rem;
    margin-top: .5rem;
    background-color: #000000;
}
.dropdown-content-enter-active,
.dropdown-content-leave-active {
  transition: all 0.2s;
}
.dropdown-content-enter,
.dropdown-content-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
