<template>
  <div class="points-charge-panel">
    <div class="sfa-pt-wait"></div>
    <div class="text-wait">敬请期待</div>
    <div class="text-brief">更多功能正在努力开拓中...</div>
  </div>
</template>

<script>
  export default {
    name: 'points-charge-panel',
    data() {
      return {
      }
    },
  }
</script>

<style lang="scss" scoped>
  .points-charge-panel {
    height: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #e6e6e6;
    margin-top: 30px;
    margin-bottom: 100px;
    background: #ffffff;
  }
  .text-wait {
    margin: 10px 12px 10px 0;
    font-size: 16px;
    color: #666666;
  }
  .text-brief {
    font-size: 14px;
    color: #cccccc;
  }

</style>
