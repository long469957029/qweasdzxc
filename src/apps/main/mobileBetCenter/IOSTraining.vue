<template>
  <div>
    <div class="ios-Container">
      <div class="container-word"></div>
      <div class="ticket-ios-panel">
        <div class="container-title">IOS9系统安装教程</div>
        <div class="container-desc">苹果手机安装过程中遇到<span class="container-desc-imp">【未信任的企业及开发者】</span>时可根据以下教程迅速安装</div>
        <div class="container-pic-container">
          <div class="container-pic-step1 inline-block"></div>
          <div class="container-pic-right inline-block">
            <div class="container-pic-right-img inline-block"></div>
          </div>
          <transition enter-active-class="animated-slow fadeInLeft">
            <div v-if="showStep2" class="container-pic-step2 inline-block"></div>
          </transition>
          <transition enter-active-class="animated-slow fadeInLeft">
            <div v-if="showStep3" class="container-pic-step3 inline-block"></div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'IOSTraining',

    data () {
      return {
        showStep2: false,
        showStep3: false,
      }
    },

    props: {
    },

    components: {},

    created () {
      // 显示步骤2
      setTimeout(() => {
        this.showStep2 = true;
      }, 0);
      // 显示步骤3
      setTimeout(() => {
        this.showStep3 = true;
      }, 500);
    },
    watch: {},

    computed: {
    },

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .ios-Container {
    min-height: 791px;
    padding-top: 68px;
    .container-word {
      text-align: center;
      position: absolute;
      width: 478px;
      height: 100px;
      left: 50%;
      margin-left: -246px;
      background-image: url('./misc/mb-ios-word.png');
    }
    .ticket-ios-panel {
      padding: 0px 172px;
      .container-title {
        position: relative;
        text-align: center;
        margin-top: 52px;
        margin-bottom: 35px;
        font-size: 34px;
        color: $def-black-color;
      }
      .container-desc {
        text-align: center;
        font-size: 14px;
        margin-bottom: 30px;
        color: $new-inverse-color;
        .container-desc-imp {
          margin: 0 10px;
        }
      }
      .container-pic-step1 {
        width: 252px;
        height: 440px;
        background-image: url('./misc/mb-step1.png');
      }
      .container-pic-right {
        text-align: center;
        vertical-align: top;
        position: relative;
        margin-left: 20px;
        margin-right: 25px;
        .container-pic-right-img {
          width: 36px;
          margin-top: 205px;
          height: 22px;
          background-image: url('./misc/mb-right.png');
        }
      }
      .container-pic-step2 {
        width: 252px;
        height: 440px;
        background-image: url('./misc/mb-step2.png');
      }
      .container-pic-step3 {
        width: 252px;
        height: 440px;
        background-image: url('./misc/mb-step3.png');
      }
    }
  }
</style>

