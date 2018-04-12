<template>
  <div class="points-charge-panel">
    <div class="nav">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'points-charge-panel',
    data() {
      return {
        navList:[
          {
            id:1,
            name:'话费充值',
            icon:'phone-money'
          },
          {
            id:2,
            name:'流量充值',
            icon:'phone-flow'
          },
          {
            id:3,
            name:'QQ充值',
            icon:'qq-charge'
          }
        ],
        index:1,

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
