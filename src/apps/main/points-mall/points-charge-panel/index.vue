<template>
  <div class="points-charge-panel">
    <div class="nav-list-charge">
      <div class="nav" :class="{active: item.id === type}" v-for="item in navList" :key="item.id"
           @click="type = item.id">
        <span class="sfa m-right-smd" :class='`sfa-${item.icon}`'></span>
        {{item.name}}
      </div>
    </div>
    <div class="container">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'points-charge-panel',
    data() {
      return {
        navList: [
          {
            id: 1,
            name: '话费充值',
            icon: 'phone-money'
          },
          {
            id: 2,
            name: '流量充值',
            icon: 'phone-flow'
          },
          {
            id: 3,
            name: 'QQ充值',
            icon: 'qq-charge'
          }
        ],
        type: 1,
        typeList:[],
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
    /*flex-direction: column;*/
    border: 1px solid #e6e6e6;
    margin-top: 30px;
    margin-bottom: 100px;
    background: #ffffff;
  }

  .nav-list-charge {
    width: 260px;
    height: 100%;
    background-color: #ecf0f8;
    .nav {
      width: 100%;
      height: 130px;
      box-sizing: border-box;
      border-bottom: 1px solid #d3d7e0;
      text-align: center;
      line-height: 130px;
      background-color: transparent;
      transition: background-color .5s;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active{
        background-color: $def-white-color;
        &:before{
          content: '';
          width: 2px;
          height: 100%;
          background-color: $new-main-deep-color;
          display: block;
          position: absolute;
          left: 0;
        }
      }
    }
  }

  .container {
    width: 940px;
    height: 100%;
  }

</style>
