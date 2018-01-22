<template>
  <div class="center-body">
    <div class="center-content">
      <ticket-client :is="currentView" keep-alive></ticket-client>
      <h5-client></h5-client>
      <mobile-client></mobile-client>
      <i-o-s-training></i-o-s-training>
    </div>
    <div class="center-bar">
      <div class="center-bar-container">
        <div class="select-nav-container inline-block" @click="toggleTabs(TicketClient)">
          <div class="select-nav-img-ticket inline-block"></div>
          <div class="select-nav-text inline-block">
            <div class="select-nav-text-lg">无限彩票客户端</div>
            <div class="select-nav-text-sm">行业首创，横屏超酷体验</div>
          </div>
        </div>
        <div class="select-nav-container inline-block" @click="toggleTabs(H5Client)">
          <div class="select-nav-img-h5 inline-block"></div>
          <div class="select-nav-text inline-block">
            <div class="select-nav-text-lg">H5移动网页版</div>
            <div class="select-nav-text-sm">无需下载即可玩，支持移动支付</div>
          </div>
        </div>
        <div class="select-nav-container inline-block" @click="toggleTabs(MobileClient)">
          <div class="select-nav-img-mobile inline-block"></div>
          <div class="select-nav-text inline-block">
            <div class="select-nav-text-lg">无限手机客户端</div>
            <div class="select-nav-text-sm">手机原生应用,操作体验更流畅</div>
          </div>
        </div>
        <div class="select-nav-container inline-block" @click="toggleTabs(IOSTraining)">
          <div class="select-nav-img-ios inline-block"></div>
          <div class="select-nav-text inline-block">
            <div class="select-nav-text-lg">IOS安装教程</div>
            <div class="select-nav-text-sm">提示未受信任的开发者怎么办？</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import TicketClient from "./ticketClient";
  import H5Client from "./h5Client";
  import MobileClient from "./mobileClient";
  import IOSTraining from "./IOSTraining"
  export default{
    name: 'mobileBetCenter',

    data () {
      return {
        TicketClient: "TicketClient",
        H5Client: "H5Client",
        MobileClient: "MobileClient",
        IOSTraining: "IOSTraining",
        currentView: 'TicketClient',
      }
    },

    props: {},

    components: {
      MobileClient,
      H5Client,
      TicketClient,
      IOSTraining
    },

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {
      toggleTabs (tabText) {
        this.currentView = tabText;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .center-body {
    display: block;
    min-height: 584px;
    position: relative;
    background-color: #f9f9f9;
    .center-content {
      color: #333333;
    }
    .center-bar {
      bottom: 0;
      position: absolute;
      text-align: center;
      border-top: 1px solid #ececec;
      background-color: $def-white-color;
      width: 100vw;
      .center-bar-container {
        width: 1200px;
        margin: 0 auto;
        font-size: 0;
        .select-nav-container {
          width: 239px;
          border-left: 1px solid #ececec;
          padding: 30px 30px;
          position: relative;
          vertical-align: middle;
          line-height: 27px;
          .select-nav-text {
            text-align: left;
            .select-nav-text-lg {
              font-size: 14px;
              color: $new-inverse-color;
            }
            .select-nav-text-sm {
              font-size: 12px;
              color: $font-auxiliary-color;
            }
          }
          .select-nav-img-ticket {
            width: 60px;
            height: 60px;
            float: left;
            background-image: url('./misc/mb-ticket-gray.png');
          }
          .select-nav-img-h5 {
            width: 60px;
            height: 60px;
            float: left;
            background-image: url('./misc/mb-h5-gray.png');
          }
          .select-nav-img-mobile {
            width: 60px;
            height: 60px;
            float: left;
            background-image: url('./misc/mb-mobile-gray.png');
          }
          .select-nav-img-ios {
            width: 60px;
            height: 60px;
            float: left;
            background-image: url('./misc/mb-ios-training-gray.png');
          }
        }
      }
    }
  }
</style>

