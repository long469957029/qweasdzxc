<template>
<div class="betting-chips-setting">
  <div class="setting" @click="openSetting">
    <span class="setting-icon"></span>
    <span class="setting-title">筹码设置：</span>
    <div class="chips-popover in">
      <div class="arrow"></div>
      <div class="popover-content">
        <span class="font-bold">中奖举例：</span>
        投注方案：13456； 开奖号码：13456，即中五星直选。
      </div>
    </div>
  </div>

  <div class="chips">
    <span class="chip" v-for="chip in chips">{{chip}}</span>
  </div>
</div>

</template>

<script>
  export default {
    name: "betting-chips-setting",

    data: function() {
      return {
        chips: [5, 10, 200, 5000, 10000]
      }
    },

    methods: {
      openSetting() {

      },
      saveSetting() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/variable";

  .betting-chips-setting {
    margin-right: 20px;
    .setting {
      display: inline-block;
      cursor: pointer;

      :hover {
        color: $new-main-deep-color;
      }
    }
    .setting-icon {
      width: 26px;
      height: 27px;
      background: url(../misc/chips-setting.png);
      display: inline-block;
    }
    .setting-title {
      font-size: 14px;
      color: $def-black-color;
      display: inline-block;
      position: relative;
      bottom: 8px;
    }

    .chips {
      display: inline-block;
      position: relative;
      bottom: 10px;
    }

    .chip {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      line-height: 48px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      margin-right: 15px;
      position: relative;
      z-index: 1;

      &:before {
        content: '';
        position: absolute;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: inline-block;
        border: 2px solid #e6e6e6;
        z-index: -1;
        top: 3px;
        left: 3px;
      }
      &:after {
        content: '';
        position: absolute;
        width: 48px;
        height: 48px;
        top: 0;
        left: 0;
        border-radius: 50%;
        display: inline-block;
        z-index: -2;
        background-image: linear-gradient(#fefefe 0%, #f6f6f6 100%);
      }

      &:hover {
        color: $def-white-color;
        &:before {
          border: 2px solid #1198a1;
        }
        &:after {
          background-image: linear-gradient(0deg,
            #0f949c 0%,
            #1fa8b1 46%,
            #2ebcc5 100%);
        }
      }
    }

    .chips-popover {
      position: absolute;
      top: 25px;
      left: 5;
      z-index: 10;
      display: none;
      max-width: 470px;
      padding: 1px;
      text-align: left;
      white-space: normal;
      box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
      background-clip: padding-box;
      .arrow {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border: 11px solid transparent;
        :after {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          content: "";
        }
      }
    }
  }
</style>
