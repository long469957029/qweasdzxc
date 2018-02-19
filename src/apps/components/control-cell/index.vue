<template>
  <div class="control-cell">
    <label class="control-label">{{title}}</label>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'control-cell',

    props: {
      title: String,
      default: ''
    }
  }
</script>

<style lang="scss" scoped>
  $font-size: 12px;

  .control-cell {
    display: flex;
    align-items: center;
    margin-left: 15px;
    margin-right: 9px;
    font-size: $font-size;

    .control-label {
      margin-bottom: 0;
      margin-right: 14px;
      font-size: $font-size;
      color: #333333;
    }
  }
</style>
