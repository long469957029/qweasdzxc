<template>
  <div class="center-body">
    <div class="center-content" :is="currentView" keep-alive>
    </div>
    <div class="center-bar">
      <div class="center-bar-container">
        <div class="select-nav-container inline-block ticket" :class="{active: currentView === 'TicketClient'}" @click="toggleTabs(TicketClient)">
          <div class="select-nav-img-ticket inline-block"></div>
          <div class="select-nav-text inline-block">
            <div class="select-nav-text-lg">无限彩票客户端</div>
            <div class="select-nav-text-sm">行业首创，横屏超酷体验</div>
          </div>
        </div>
        <div class="select-nav-container inline-block h5" :class="{active: currentView === 'H5Client'}" @click="toggleTabs(H5Client)">
          <div class="select-nav-img-h5 inline-block"></div>
          <div class="select-nav-text inline-block">
            <div class="select-nav-text-lg">H5移动网页版</div>
            <div class="select-nav-text-sm">无需下载即可玩，支持移动支付</div>
          </div>
        </div>
        <div class="select-nav-container inline-block mobile" :class="{active: currentView === 'MobileClient'}" @click="toggleTabs(MobileClient)">
          <div class="select-nav-img-mobile inline-block"></div>
          <div class="select-nav-text inline-block">
            <div class="select-nav-text-lg">无限手机客户端</div>
            <div class="select-nav-text-sm">手机原生应用,操作体验更流畅</div>
          </div>
        </div>
        <div class="select-nav-container inline-block ios" :class="{active: currentView === 'IOSTraining'}" @click="toggleTabs(IOSTraining)">
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
    min-width: 1200px;
    position: relative;
    background-color: #f9f9f9;
    .center-content {
      width: 1193px;
      margin: 0 auto;
      min-height: 760px;
    }
    .center-bar {
      bottom: 0;
      position: absolute;
      text-align: center;
      background-color: $def-white-color;
      width: 100%;
      .center-bar-container {
        width: 1200px;
        margin: 0 auto;
        font-size: 0;
        .select-nav-container {
          cursor: pointer;
          width: 238px;
          border-left: 1px solid #ececec;
          padding: 30px 30px;
          position: relative;
          vertical-align: middle;
          line-height: 27px;
          border-top: 2px solid #ffffff;
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
          &.ticket {
            &.active, &:hover {
              border-top: 2px solid #5ebaa1;
              color: #5ebaa1;
              background: linear-gradient(to bottom, #f1f1f1, white);
              .select-nav-text-lg {
                color: #5ebaa1;
              }
              .select-nav-text-sm {
                color: #5ebaa1;
              }
              .select-nav-img-ticket {
                background-image: url('./misc/mb-ticket-green.png');
              }
            }
          }
          &.h5 {
            &.active, &:hover {
              border-top: 2px solid #e6c15a;
              background: linear-gradient(to bottom, #f1f1f1, white);
              .select-nav-text-lg {
                color: #e6c15a;
              }
              .select-nav-text-sm {
                color: #e6c15a;
              }
              .select-nav-img-h5 {
                background-image: url('./misc/mb-h5-yellow.png');
              }
            }
          }
          &.mobile {
            &.active, &:hover {
              border-top: 2px solid #4c7295;
              background: linear-gradient(to bottom, #f1f1f1, white);
              .select-nav-text-lg {
                color: #4c7295;
              }
              .select-nav-text-sm {
                color: #4c7295;
              }
              .select-nav-img-mobile {
                background-image: url('./misc/mb-mobile-blue.png');
              }
            }
          }
          &.ios {
            border-right: 1px solid #ececec;
            &.active, &:hover {
              background: linear-gradient(to bottom, #f1f1f1, white);
              .select-nav-text-lg {
                color: #108189;
              }
              .select-nav-text-sm {
                color: #108189;
              }
              border-top: 2px solid #108189;
              .select-nav-img-ios {
                background-image: url('./misc/mb-ios-training.png');
              }
            }
          }
        }
      }
    }
  }
</style>

