<template>
  <div class="x-toolbar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'x-toolbar',
  }
</script>

<style lang="scss" scoped>
  .x-toolbar {
    display: flex;
  }
  .tool-cell {
    margin-right: 30px;
    padding-right: 30px;
    border-right: 1px solid $def-gray-color;
    &:last-of-type {
      border-right: 0;
    }
  }
</style>
