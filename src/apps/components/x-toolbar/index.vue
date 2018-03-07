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
    position: relative;
    &:after{
      content: '';
      width: 1px;
      height: 14px;
      background: $def-gray-color;
      top: 5px;
      right: 0px;
      position: absolute;
    }
    &:last-of-type {
      &:after{
        display: none;
      }
    }
  }
</style>
