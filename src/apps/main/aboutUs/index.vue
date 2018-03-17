<template>
  <div class="aboutUs-body">
    <div class="aboutUs-panel">
      <div class="ab-select-bar inline-block">
        <div class="ab-select-bar-desc">
          <!--<div class="ab-desc-text-lg inline-block">A</div>-->
          <!--<div class="inline-block">-->
            <!--<div class="ab-desc-text">关于我们</div>-->
            <!--<div><span class="ab-desc-text-sm">bout</span><span class="ab-desc-text-sm">us</span></div>-->
          <!--</div>-->
        </div>
        <div class="ab-select-bar-item" :class="{active: currentView === 'AboutUs'}" @click="toggleTabs(AboutUs)">
          <span class="item-img ab"></span>
          <span class="item-name">关于我们</span>
        </div>
        <div class="ab-select-bar-item" :class="{active: currentView === 'New'}" @click="toggleTabs(New)">
          <span class="item-img news"></span>
          <span class="item-name">品牌新闻</span>
        </div>
        <div class="ab-select-bar-item" :class="{active: currentView === 'RulesAndTerms'}"
             @click="toggleTabs(RulesAndTerms)">
          <span class="item-img rules"></span>
          <span class="item-name">规则与条款</span>
        </div>
        <div class="ab-select-bar-item" :class="{active: currentView === 'PrivacyPolicy'}"
             @click="toggleTabs(PrivacyPolicy)">
          <span class="item-img private"></span>
          <span class="item-name">隐私政策</span>
        </div>
        <div class="ab-select-bar-item" :class="{active: currentView === 'Responsibility'}"
             @click="toggleTabs(Responsibility)">
          <span class="item-img res"></span>
          <span class="item-name">博彩责任</span>
        </div>
      </div>
      <div class="aboutUs-content inline-block" :is="currentView" keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
  import AboutUs from "./aboutUs";
  import New from "./news";
  import PrivacyPolicy from "./privacyPolicy";
  import Responsibility from "./responsibility";
  import RulesAndTerms from "./rulesAndTerms";
  export default{
    name: 'index',

    data () {
      return {
        AboutUs: 'AboutUs',
        RulesAndTerms: 'RulesAndTerms',
        Responsibility: 'Responsibility',
        PrivacyPolicy: 'PrivacyPolicy',
        New: 'New',
        currentView: 'AboutUs',
      }
    },

    props: {},

    components: {
      RulesAndTerms,
      Responsibility,
      PrivacyPolicy,
      New,
      AboutUs
    },

    mounted: function () {
    },

    watch: {
      '$route': {
        handler(to) {
          this.currentView = to.query.page
          Velocity(document.body, 'scroll', {
            offset: 0,
            mobileHA: false
          })
        },
        immediate: true
      }
    },

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
.aboutUs-body {
  display: block;
  /*min-height: 584px;*/
  min-height: 850px;
  position: relative;
  background-color: #f9f9f9;
  .aboutUs-panel {
    background-color: #ffffff;
    font-size: 0;
    width: 1192px;
    margin: 0 auto;
    height: 100%;
    box-shadow: 0 0 4px rgba(0, 0, 0, .15);
    .ab-select-bar {
      float: left;
      width: 200px;
      /*min-height: 850px;*/
      background-color: #f8f8f8;
      /*.ab-select-bar-desc {
        padding: 45px 40px;
        border-bottom: 1px solid #e6e6e6;
        .ab-desc-text-lg {
          font-size: 30px;
          color: $im-line-color;
        }
        .ab-desc-text {
          font-size: 17px;
          color: $def-black-color;
          margin-bottom: -9px;
        }
        .ab-desc-text-sm {
          color: $im-line-color;
          font-size: 12px;
          margin-right: 3px;
        }
      }*/
      .ab-select-bar-desc {
        width: 200px;
        height: 132px;
        background: url('./misc/about-us-title.png') no-repeat center;
      }
      .ab-select-bar-item {
        cursor: pointer;
        padding: 20px 45px;
        background-color: #f8f8f8;
        border-left: 3px solid #f8f8f8;
        border-bottom: 1px solid #e6e6e6;
        .item-name {
          font-size: 14px;
          margin-left: 8px;
          color: #333333;
        }
        .item-img {
          display: inline-block;
          width: 18px;
          float: left;
          height: 18px;
          &.ab {
            background-image: url('./misc/au-gray.png');
          }
          &.news {
            background-image: url('./misc/au-new-gray.png');
          }
          &.rules {
            background-image: url('./misc/au-private-gray.png');
          }
          &.private {
            background-image: url('./misc/au-res-gray.png');
          }
          &.res {
            background-image: url('./misc/au-rule-gray.png');
          }
        }
        &.active {
          background-color: #ffffff;
          border-left: 3px solid #14b1bb;
          .item-name {
            color: #14b1bb;
          }
          .item-img {
            &.ab {
              background-image: url('./misc/au-green.png');
            }
            &.news {
              background-image: url('./misc/au-new-green.png');
            }
            &.rules {
              background-image: url('./misc/au-private-green.png');
            }
            &.private {
              background-image: url('./misc/au-res-green.png');
            }
            &.res {
              background-image: url('./misc/au-rule-green.png');
            }
          }
        }
      }
    }
    .aboutUs-content {
      background-color: #ffffff;
      width: 951px;
      min-height: 750px;
      padding: 20px 20px 100px 20px;
      border-left: 1px solid #e6e6e6;
    }
  }
}
</style>

