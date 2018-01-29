<template>
  <div>1</div>
</template>

<script>
  import {getTwoSideApi} from 'api/analysis'


  export default {
    name: "betting-history",
    data: {

    },

  }
</script>

<style lang="scss" scoped>
  .his-main {
    th {
      position: relative;
      &:after {
        width: 1px;
        height: 15px;
        content: '';
        background-color: $def-line-color;
        display: block;
        position: absolute;
        right: 0px;
        top: 11px;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
    }
    td {
      padding: 12px 0;
    }
    .open-nums {
      max-width: 150px;
      span {
        width: 20px;
        height: 20px;
        border: 1px solid $third-line-color;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        float: left;
        margin-left: 4px;
        margin-bottom: 2px;
      }
      .key-num {
        border-color: $new-main-deep-color;
        color: $new-main-deep-color;
      }
    }
  }
</style>
