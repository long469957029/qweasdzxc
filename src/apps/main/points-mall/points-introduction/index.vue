<template>
  <div class="points-introduction">
    <div class="points-bg-texture"></div>
    <div class="intro-top">
      <div class="top-main">
        <div class="top-title">
          <div class="sfa-pt-intro-title"></div>
        </div>
        <div class="top-brief">
          <div class="sfa-pt-intro-teach-you"></div>
        </div>
        <div class="top-pr">
          <div class="sfa-pt-intro-pr"></div>
        </div>
      </div>
      <div class="top-character sfa-pt-intro-character"></div>
    </div>
    <div class="intro-main">
      <div class="intro-nav">
        <div class="intro-tab" :class="{active: currentView === 'RecognizePoint'}" @click="currentView = 'RecognizePoint'">
          <div class="intro-title">认识积分体系</div>
          <div class="sfa-pt-intro-right"></div>
          <div class="serial-num sfa-pt-intro-1"></div>
        </div>
        <div class="intro-tab" :class="{active: currentView === 'RecognizeMall'}" @click="currentView = 'RecognizeMall'">
          <div class="intro-title">认识积分商城</div>
          <div class="sfa-pt-intro-right"></div>
          <div class="serial-num sfa-pt-intro-2"></div>
        </div>
        <div class="intro-tab" :class="{active: currentView === 'MoreFeature'}" @click="currentView = 'MoreFeature'">
          <div class="intro-title">更多特色功能</div>
          <div class="sfa-pt-intro-right"></div>
          <div class="serial-num sfa-pt-intro-3"></div>
        </div>
      </div>
      <div class="intro-content">
        <transition
          enter-active-class="pt-page-moveFromRight pt-page-delay200 pt-page-ontop"
          leave-active-class="pt-page-rotateRightSideFirst">
          <!--enter-active-class="pt-page-scaleUpDown pt-page-delay300"-->
          <!--leave-active-class="pt-page-scaleDown"-->
          <comment :is="currentView" class="intro-content-inner"></comment>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>

  // outClass = 'pt-page-rotateRoomLeftOut';
  // inClass = 'pt-page-rotateRoomLeftIn';
  // outClass = 'pt-page-rotateRoomRightOut';
  // inClass = 'pt-page-rotateRoomRightIn';

  import RecognizePoint from './recognize-point'
  import RecognizeMall from './recognize-mall'
  import MoreFeature from './more-feature'

  export default {
    name: 'points-introduction',

    components: {
      RecognizePoint,
      RecognizeMall,
      MoreFeature,
    },

    data() {
      return {
        currentView: 'RecognizePoint'
      }
    },

  }
</script>

<style lang="scss" scoped>
  @import '~base/styles/_spritesPT';

  .points-introduction {
    position: relative;
    background: linear-gradient(to bottom, #16464b, rgba(0,0,0,0)) no-repeat;
    background-size: 100% 600px;
  }

  .points-bg-texture {
    background: url(./bg-top-texture.png) no-repeat;
    height: 493px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  .intro-top {
    width: 1200px;
    height: 440px;
    margin: 0 auto;
    z-index: 1;
    position: relative;
  }

  .intro-main {
    width: 1200px;
    margin: 0 auto 77px auto;
    position: relative;
    display: flex;
    justify-content: space-between;
    z-index: 1;
  }

  .top-title {
    padding-top: 80px;
    padding-left: 30px;
  }

  .top-main {
    padding-left: 160px;
    display: inline-block;
  }

  .top-brief {
    border: solid 1px #ffffff;
    width: 280px;
    height: 48px;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 18px;
    margin-top: 15px;
  }

  .top-pr {
    margin-top: -10px;
  }

  .top-character {
    position: absolute;
    bottom: -20px;
    right: -2px;
  }

  .intro-nav {
    width: 300px;
    min-height: 1900px;
    background-color: #ffffff;
    box-shadow: 0px 1px 10px 0px    rgba(0, 0, 0, 0.1);
  }


  .intro-tab {
    height: 90px;
    background-color: #f2f2f2;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    transition: .5s;

    &.active {
      background-color: #3a7f87;
      .intro-title {
        color: #ffffff;
      }
      .sfa-pt-intro-right {
        opacity: 1;
      }


      .serial-num {
        transform: translate(5px);
      }

      &:nth-of-type(1) {
        .serial-num {
          @include sprite($sfa-pt-intro-1-selected);
        }
      }
      &:nth-of-type(2) {
        .serial-num {
          @include sprite($sfa-pt-intro-2-selected);
        }
      }
      &:nth-of-type(3) {
        .serial-num {
          @include sprite($sfa-pt-intro-3-selected);
        }
      }
    }

    .sfa-pt-intro-right {
      transform: translate(30px);
      animation: swing-right .8s infinite alternate;
      opacity: 0;
    }
  }

  .intro-title {
    font-size: 20px;
    color: #999999;
  }

  .serial-num {
    position: absolute;
    bottom: 0;
    left: 10px;
    transition: transform .3s;
  }


  .intro-content {
    width: 880px;
    background-color: #ffffff;
    box-shadow: 0px 1px 10px 0px    rgba(0, 0, 0, 0.1);
    color: #666666;
    position: relative;
    overflow: hidden;
    perspective: 1200px;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background-color: #3a7f87;
    }
    .intro-content-inner {
      position: absolute;
      width: 100%;
      height: 100%;
      margin-top: 4px;
      padding: 35px 28px;
      box-sizing: border-box;
    }
  }


</style>
