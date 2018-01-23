<template>
  <div>
    <div class="h5-Client-Container">
      <div class="container-left inline-block">
        <div class="container-left-text">
          <div class="container-left-word"></div>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-title" v-if="showLine1">
              <span class="title-name inline-block">HTML5移动网页版</span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content" v-if="showLine2">
              <span class="text-circle"></span>
              <span class="text-desc">移动网页版全面支持各类游戏机存提款等资金操作，无论您是在使用手机、<br></span>
              <span class="text-desc-line2">IPad、Surface或者其他移动设备，我们的产品均已完美覆盖！</span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content" v-if="showLine3">
              <span class="text-circle"></span>
              <span class="text-desc">无需安装下载，移动设备浏览器直接打开使用即可。</span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content2" v-if="showLine4">
              <div><span class="text-desc-eng">COMING</span><span class="text-desc-eng">SONG</span></div>
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
    name: 'h5Client',

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
  .h5-Client-Container {
    min-height: 760px;
    padding-top: 100px;
    .container-left {
      width: 550px;
      padding: 0 30px;
      .container-left-word {
        position: absolute;
        width: 446px;
        top: 150px;
        height: 100px;
        background-image: url('./misc/mb-h5-word.png');
      }
      .container-left-title {
        position: relative;
        padding-top: 100px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 85px;
        .title-name {
          vertical-align: top;
          font-size: 30px;
          color: #333333;
        }
      }
      .container-left-content {
        padding: 7px 0;
        .text-circle {
          width: 5px;
          height: 5px;
          border-radius: 50px;
          margin-right: 8px;
          background-color: #e6c15a;
          float: left;
          margin-top: 13px;
        }
        .text-desc {
          font-size: 14px;
          color: $new-inverse-color;
          line-height: 30px;
        }
        .text-desc-line2 {
          margin-left: 14px;
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
        }
        .text-desc {
          margin-top: 5px;
          font-size: 27px;
          color: $font-auxiliary-color;
          margin-right: 12px;
        }

      }
    }
    .container-right {
      background-image: url('./misc/mb-h5.png');
      float: right;
      width: 574px;
      height: 502px;
    }
  }
</style>

