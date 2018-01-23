<template>
  <div>
    <div class="mobile-Container">
      <div class="container-left inline-block">
        <div class="container-left-text">
          <div class="container-left-word"></div>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-title" v-if="showLine1">
              <span class="title-name inline-block">无限手机客户端</span>
              <span class="title-logo-apple inline-block"></span>
              <span class="title-logo-andrews inline-block"></span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content" v-if="showLine2">
              <span class="text-circle"></span>
              <span class="text-desc">纯原生应用，全面覆盖各类游戏，让您真正体验裤兜里的快乐</span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content" v-if="showLine3">
              <span class="text-circle"></span>
              <span class="text-desc">新版本手机客户端具有消耗流量少、访问速度快、兼有所有手<br></span>
              <span class="text-desc-line2">机系统等特点...</span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content2" v-if="showLine4">
              <div><span class="text-desc-eng">COMING</span><span class="text-desc-eng">SOON</span></div>
              <div><span class="text-desc">即将上线</span><span class="text-desc">···</span></div>
            </div>
          </transition>
        </div>
      </div>
      <div class="container-right inline-block"></div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'mobileClient',

    data () {
      return {
        showLine1: false,
        showLine2: false,
        showLine3: false,
        showLine4: false,
      }
    },

    props: {},

    components: {},

    mounted () {
      this.$nextTick(() => {
      })
    },
    created () {
      // 显示第一行
      setTimeout(() => {
        this.showLine1 = true;
      }, 0);
      // 显示第二行
      setTimeout(() => {
        this.showLine2 = true;
      }, 500);
      // 显示第三行
      setTimeout(() => {
        this.showLine3 = true;
      }, 500);
      // 显示第四行
      setTimeout(() => {
        this.showLine4 = true;
      }, 500);
    },
    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .mobile-Container {
    min-height: 760px;
    padding-top: 100px;
    .container-left {
      width: 550px;
      padding: 0 30px;
      .container-left-word {
        position: absolute;
        width: 408px;
        top: 150px;
        height: 100px;
        background-image: url('./misc/mb-mobile-word.png');
      }
      .container-left-title {
        padding-top: 100px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 85px;
        position: relative;
        .title-name {
          vertical-align: top;
          font-size: 30px;
          color: #333333;
        }
        .title-logo-apple {
          width: 34px;
          height: 35px;
          margin-left: 10px;
          background-image: url('./misc/mb-apple-blue.png');
        }
        .title-logo-andrews {
          width: 34px;
          height: 35px;
          background-image: url('./misc/mb-andrews-blue.png');
        }
      }
      .container-left-content {
        padding: 7px 0;
        .text-circle {
          width: 5px;
          height: 5px;
          border-radius: 50px;
          margin-right: 8px;
          background-color: #4c7295;
          float: left;
          margin-top: 13px;
        }
        .text-desc {
          font-size: 14px;
          color: $new-inverse-color;
          line-height: 30px;
        }
        .text-desc-line2 {
          margin-left: 13px;
          line-height: 30px;
          font-size: 14px;
          color: $new-inverse-color;
        }
      }
      .container-left-content2 {
        margin-top: 40px;
        line-height: 28px;
        .text-desc-eng {
          font-size: 25px;
          color: #cccccc;
          margin-right: 12px;
          font-family: PingFangSC-Regular, sans-serif!important;
          font-weight: 100;
        }
        .text-desc {
          margin-top: 5px;
          font-size: 27px;
          font-family: PingFangSC-Regular, sans-serif!important;
          font-weight: 100;
          color: $font-auxiliary-color;
          margin-right: 12px;
        }

      }
    }
    .container-right {
      background-image: url('./misc/mb-mobile.png');
      float: right;
      width: 502px;
      height: 502px;
    }
  }
</style>

