<template>
  <div class="points-nav">
    <router-link tag="div" class="points-tab" :class="{active: $route.name === 'pointsMall'}" :to="{name: 'pointsMall'}">
      <div class="sfa sfa-pt-cards"></div>
      <span class="tab-title">领券中心</span>
      <div class="divider-right"></div>
    </router-link>
    <router-link tag="div" class="points-tab" :class="{active: $route.name === 'pointsGifts'}" :to="{name: 'pointsGifts'}">
      <div class="sfa sfa-pt-gifts"></div>
      <span class="tab-title">礼物兑换</span>
      <div class="divider-right"></div>
    </router-link>
    <router-link tag="div" class="points-tab" :class="{active: $route.name === 'pointsLottery'}" :to="{name: 'pointsLottery'}">
      <div class="sfa sfa-pt-lottery"></div>
      <span class="tab-title">幸运夺宝</span>
      <div class="divider-right"></div>
    </router-link>
    <router-link tag="div" class="points-tab" :class="{active: $route.name === 'pointsTask'}" :to="{name: 'pointsTask'}">
      <div class="sfa sfa-pt-task"></div>
      <span class="tab-title">任务奖励</span>
      <div class="divider-right"></div>
    </router-link>
    <router-link tag="div" class="points-tab" :class="{active: $route.name === 'pointsCharge'}" :to="{name: 'pointsCharge'}">
      <div class="sfa sfa-pt-calls"></div>
      <span class="tab-title">话费／流量／QQ充值</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "points-nav"
  }
</script>

<style lang="scss" scoped>
  .points-nav {
    display: flex;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    height: 110px;
    align-items: flex-end;

    .points-tab {
      flex: 1 0 0;
      height: 100px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: relative;
      transition: height .2s, color .3s, border-radius .2s;

      .divider-right {
        width: 1px;
        background: $new-main-deep-color;
        height: 56px;
        position: absolute;
        right: 0;
        top: 26px;
      }

      &:first-of-type {
        border-radius: 10px 0 0 0;
      }
      &:last-of-type {
        border-radius: 0 10px 0 0;
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        border-radius: 10px 10px 0 0;
        top: -3px;
        left: 0;
        transition: height .2s, color .3s, border-radius .2s;
      }
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        border-radius: 10px 10px 0 0;
        top: 0;
        left: 0;
        transition: height .2s, color .3s, border-radius .2s;
      }

      &.active {
        color: $new-main-deep-color;
        height: 107px;
        border-radius: 10px 10px 0 0;
        box-shadow: 0 0 3px rgba(0, 0, 0, .2);
        z-index: 1;
        margin-left: -1px;

        .divider-right {
          display: none;
        }
        &:before {
          background: $new-main-deep-color;
          height: 10px;
        }
        &:after {
          background: #ffffff;
          height: 10px;
        }
      }
    }

    .tab-title {
      font-size: 14px;
      margin-top: 8px;
    }
  }
</style>
