<template>
  <div class="points-introduction">
    <div class="intro-top">
      <div class="top-main">
        <div class="top-title">
          <div class="sfa-pt-intro-title"></div>
        </div>
        <div class="top-brief">
          <div class="sfa-pt-intro-brief"></div>
        </div>
        <div class="top-pr">
          <div class="sfa-pt-intro-pr"></div>
        </div>
      </div>
      <div class="top-character"></div>
    </div>
    <div class="intro-main">
      <div class="intro-nav">
        <div class="intro-tab" @click="currentView = 'RecognizePoint'">
          <div class="intro-title">认识积分体系</div>
          <div class="sfa-pt-intro-right"></div>
          <div class="serial-num-1"></div>
        </div>
        <div class="intro-tab" @click="currentView = 'RecognizeMall'">
          <div class="intro-title">认识积分商城</div>
          <div class="sfa-pt-intro-right"></div>
          <div class="serial-num-2"></div>
        </div>
        <div class="intro-tab" @click="currentView = 'MoreFeature'">
          <div class="intro-title">更多特色功能</div>
          <div class="sfa-pt-intro-right"></div>
          <div class="serial-num-3"></div>
        </div>
      </div>
      <div class="intro-content">
        <comment :is="currentView"></comment>
      </div>
    </div>
  </div>
</template>

<script>

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
  .pt-page-scaleDown {
    animation: scaleDown .7s ease both;
  }
  .pt-page-scaleUpDown {
    animation: scaleUpDown .5s ease both;
  }
  .pt-page-delay300 {
    animation-delay: .3s;
  }
  @keyframes scaleUpDown {
    from { opacity: 0; -webkit-transform: scale(1.2); transform: scale(1.2); }
  }
  @keyframes scaleUpDown {
    from { opacity: 0; -webkit-transform: scale(1.2); transform: scale(1.2); }
  }
</style>
