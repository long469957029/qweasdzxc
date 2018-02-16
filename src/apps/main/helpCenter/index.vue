<template>
  <div class="helpCenter-body">
    <div class="helpCenter-panel">
      <div class="hc-select-bar inline-block">
        <div class="hc-select-bar-desc">
          <div class="hc-desc-text-lg inline-block">H</div>
          <div class="inline-block">
            <div class="hc-desc-text">帮助中心</div>
            <div><span class="hc-desc-text-sm">elp</span><span class="hc-desc-text-sm">center</span></div>
          </div>
        </div>
        <div class="hc-select-bar-item" @click="checkTab(1)" :class="['res-desc-btn',{'active': tType === 1}]">
          <span class="item-img new"></span>
          <span class="item-name">新手上路</span>
        </div>
        <div class="hc-list-item" v-show="tType === 1">
          <ul>
            <li :class="{active: currentView === 'DepositProcess'}" @click="toggleTabs(DepositProcess)">存款流程</li>
            <li :class="{active: currentView === 'DrawingProcess'}" @click="toggleTabs(DrawingProcess)">提款流程</li>
            <li :class="{active: currentView === 'LotteryProcess'}" @click="toggleTabs(LotteryProcess)">购彩流程</li>
            <li :class="{active: currentView === 'DwFAQ'}" @click="toggleTabs(DwFAQ)">存提款FAQ</li>
            <li :class="{active: currentView === 'lotteryFAQ'}" @click="toggleTabs(lotteryFAQ)">彩票投注FAQ</li>
            <li :class="{active: currentView === 'DnsCourse'}" @click="toggleTabs(DnsCourse)">防DNS劫持教程</li>
          </ul>
        </div>
        <div class="hc-select-bar-item" @click="checkTab(2)" :class="['res-desc-btn',{'active': tType === 2}]">
          <span class="item-img lottery"></span>
          <span class="item-name">彩票玩法</span>
        </div>
        <div class="hc-list-item" v-show="tType === 2">
          <ul>
            <li :class="{active: currentView === 'SscLottery'}" @click="toggleTabs(SscLottery)">时时彩玩法</li>
            <li :class="{active: currentView === 'SyxwLottery'}" @click="toggleTabs(SyxwLottery)">11选5玩法</li>
            <li :class="{active: currentView === 'DpLottery'}" @click="toggleTabs(DpLottery)">3D/低频彩玩法</li>
            <li :class="{active: currentView === 'Pk10Lottery'}" @click="toggleTabs(Pk10Lottery)">PK10玩法</li>
            <li :class="{active: currentView === 'KsLottery'}" @click="toggleTabs(KsLottery)">快三玩法</li>
          </ul>
        </div>
        <div class="hc-select-bar-item" @click="checkTab(3)" :class="['res-desc-btn',{'active': tType === 3}]">
          <span class="item-img lmp"></span>
          <span class="item-name">双面盘玩法</span>
        </div>
        <div class="hc-list-item" v-show="tType === 3">
          <ul>
            <li :class="{active: currentView === 'SscPlayer'}" @click="toggleTabs(SscPlayer)">时时彩玩法</li>
            <li :class="{active: currentView === 'Pk10Player'}" @click="toggleTabs(Pk10Player)">PK10玩法</li>
            <li :class="{active: currentView === 'LhcPlayer'}" @click="toggleTabs(LhcPlayer)">六合彩玩法</li>
          </ul>
        </div>
      </div>
      <div class="helpCenter-content inline-block" :is="currentView" keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
  import DepositProcess from "./depositProcess";//存款流程
  import DrawingProcess from "./drawingProcess";//提款流程
  import LotteryProcess from "./lotteryProcess";//购彩流程
  import DwFAQ from "./dwFAQ";//存提款FAQ
  import lotteryFAQ from "./lotteryFAQ";//彩票投注FAQ
  import DnsCourse from "./dnsCourse";//防DNS劫持教程
  import SscLottery from "./sscLottery";//时时彩玩法
  import SyxwLottery from "./syxwLottery";//11选5玩法
  import DpLottery from "./dpLottery";//3D/低频彩玩法
  import Pk10Lottery from "./Pk10Lottery";//PK拾玩法
  import KsLottery from "./ksLottery";//快三玩法
  import SscPlayer from "./sscPlayer";//时时彩玩法
  import Pk10Player from "./pk10Player";//PK10玩法
  import LhcPlayer from "./lhcPlayer";//六合彩玩法

  export default{
    name: 'index',

    data () {
      return {
        DepositProcess: 'DepositProcess',
        DrawingProcess: 'DrawingProcess',
        LotteryProcess: 'LotteryProcess',
        DwFAQ: 'DwFAQ',
        lotteryFAQ: 'lotteryFAQ',
        DnsCourse: 'DnsCourse',
        SscLottery: 'SscLottery',
        SyxwLottery: 'SyxwLottery',
        DpLottery: 'DpLottery',
        Pk10Lottery: 'Pk10Lottery',
        KsLottery: 'KsLottery',
        SscPlayer: 'SscPlayer',
        Pk10Player: 'Pk10Player',
        LhcPlayer: 'LhcPlayer',

        currentView: 'DepositProcess',
        tType: 1,
      }
    },

    props: {},

    components: {
      DepositProcess,
      DrawingProcess,
      LotteryProcess,
      DwFAQ,
      lotteryFAQ,
      DnsCourse,
      SscLottery,
      SyxwLottery,
      DpLottery,
      Pk10Lottery,
      KsLottery,
      SscPlayer,
      Pk10Player,
      LhcPlayer,
    },

    mounted () {
        this.$nextTick(() => {
        })
    },

    watch: {
      '$route'(to) {
        this.currentView = to.query.page
      }
    },

    computed: {},

    filters: {},

    methods: {
      toggleTabs (tabText) {
        this.currentView = tabText;
      },
      checkTab (tType){
        this.tType = tType
      },
    }
  }
</script>

<style lang="scss" scoped>
.helpCenter-body {
  display: block;
  /*min-height: 584px;*/
  min-height: 850px;
  position: relative;
  background-color: #f9f9f9;
  .helpCenter-panel {
    background-color: #ffffff;
    font-size: 0;
    width: 1192px;
    margin: 0 auto;
    height: 100%;
    box-shadow: 0 0 5px rgba(0, 0, 0, .4);
    .hc-select-bar {
      float: left;
      width: 200px;
      /*min-height: 850px;*/
      background-color: #f8f8f8;
      .hc-select-bar-desc {
        padding: 45px 40px;
        border-bottom: 1px solid #e6e6e6;
        .hc-desc-text-lg {
          font-size: 45px;
          color: $im-line-color;
        }
        .hc-desc-text {
          font-size: 20px;
          color: $def-black-color;
          margin-bottom: -5px;
        }
        .hc-desc-text-sm {
          color: $im-line-color;
          font-size: 12px;
          margin-right: 3px;
        }
      }
      .hc-select-bar-item {
        cursor: pointer;
        padding: 17px 45px;
        /*border-left: 3px solid #f8f8f8;*/
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
          &.new {
            background-image: url('./misc/hc-new-gray.png');
          }
          &.lottery {
            background-image: url('./misc/hc-lottery-gray.png');
          }
          &.lmp {
            background-image: url('./misc/hc-lmp-gray.png');
          }
        }
        &.active {
          /*background-color: #ffffff;*/
          /*border-left: 3px solid #14b1bb;*/
          .item-name {
            color: #14b1bb;
          }
          .item-img {
            &.new {
              background-image: url('./misc/hc-new-green.png');
            }
            &.lottery {
              background-image: url('./misc/hc-lottery-green.png');
            }
            &.lmp {
              background-image: url('./misc/hc-lmp-green.png');
            }
          }
        }
      }
      .hc-list-item {
        cursor: pointer;
        background-color: #ffffff;
        color: $new-inverse-color;
        font-size: 12px;
        ul, li {
          width: 100%;
          list-style: none;
        }
        li {
          width: 125px;
          height: 49px;
          line-height: 49px;
          border-bottom: 1px solid $im-line-color;
          padding-left: 75px;
          position: relative;
          &:before{
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: $def-gray-color;
            position: absolute;
            top: 22px;
            left: 60px;
            display: block;
          }
          /*&:last-child{
            border-bottom: none;
          }*/
          &.active {
            color: $main-deep-color;
            &:before{
              background-color: $main-deep-color !important;
            }
          }
        }
      }
    }
    .helpCenter-content {
      background-color: #ffffff;
      width: 951px;
      min-height: 750px;
      padding: 20px 20px 100px 20px;
      border-left: 1px solid #e6e6e6;
    }
  }
}
</style>

