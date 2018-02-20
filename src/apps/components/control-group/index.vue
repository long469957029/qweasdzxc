<template>
  <div class="control-group">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'control-group'
  }
</script>

<style lang="scss" scoped>
  .control-group {
    display: flex;
    align-items: center;
    color: #333333;
  }

</style>
