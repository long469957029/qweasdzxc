<template>
  <div class="points-card" :class="[cardInfo.type, {finished: isFinished}]" @mouseover="toggleBtn(true)"
       @mouseout="toggleBtn(false)">
    <div class="points-card-inner">
      <div class="points-top">
        <div class="card-value">
          20<span class="card-unit">元</span>
        </div>
        <div class="card-badge">{{cardInfo.name}}</div>
        <div class="card-badge" v-if="limitLevelType > 0">LV{{limitLevelType}}</div>
        <div class="card-left" v-if="maxNum && maxNum - useNum > 0">剩{{maxNum - useNum}}张</div>
        <div v-else-if="isFinished" class="sfa-finished"></div>
      </div>
      <div class="points-center">
        <div class="points-range">无限分分彩</div>
      </div>


      <div class="points-bottom-wrapper">
        <transition name="fade"
                    enter-active-class="animated-quick fadeIn"
                    leave-active-class="animated-quick fadeOut"
        >
          <div class="points-bottom" v-if="!showBtn" key="show">
            <div class="points-type">投注满5000元即返</div>
            <div class="points-bottom-inner">
              <div v-if="isShowCountdown" class="points-countdown-wrapper">
                <span>距开始</span>
                <countdown class="points-countdown" :time="1000000" :interval="100" tag="div">
                  <template slot-scope="props">
                    <div class="countdown-cell">{{props.totalHours}}</div>
                    :
                    <div class="countdown-cell">{{props.minutes}}</div>
                    :
                    <div class="countdown-cell">{{props.seconds}}</div>
                  </template>
                </countdown>
              </div>
              <div class="points-expire" v-else>
                {{validStartDate | toTime('MM.DD H:mm')}}-{{validEndDate | toTime('MM.DD H:mm')}}
              </div>
              <div class="points-value">
                <span class="sfa sfa-points"></span>
                {{requireIntegral | convert2yuan}}积分
              </div>
            </div>
          </div>
          <div v-else key="exchange" class="points-bottom-btn">
            <button class="btn btn-white exchange-btn">立即兑换</button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import Countdown from '../countdown/index.vue'

  const CARD_TYPE = {
    '1': {
      name: '充值券',
      type: 'blue'
    },
    '2': {
      name: '加奖卡',
      type: 'green'
    },
    '3': {
      name: '补贴卡',
      type: 'green'
    },
    '4': {
      name: '返水卡',
      type: 'green'
    },
    '5': {
      name: '代金券',
      type: 'gold'
    },
    '6': {
      name: '现金券',
      type: 'red'
    },
  }

  export default {
    name: 'points-card',

    components: {
      Countdown,
    },

    props: [
      'couponType',
      'useNum',
      'maxNum',
      'limitLevelType',
      'requireIntegral',
      'validStartDate',
      'validEndDate',
      'leftTime',
    ],

    data() {
      return {
        showBtn: false
      }
    },

    computed: {
      cardInfo() {
        return CARD_TYPE[this.couponType]
      },
      isFinished() {
        return this.maxNum && this.maxNum - this.useNum === 0
      },
      isShowCountdown() {
        return true
        // return !!(this.currentDate > this.validStartDate && moment(this.currentDate).diff(moment(this.validStartDate), 'days'))
      }
    },

    methods: {
      toggleBtn(flag) {
        if (!this.isFinished) {
          this.showBtn = flag
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .points-card {
    width: 310px;
    height: 195px;
    margin: -13px -14px -35px -16px;
    display: inline-block;
    .points-card-inner {
      margin: 13px 14px 35px 16px;
      padding: 10px 0 0 10px;
    }

    &.green {
      background: url(./card-green.png);
      .card-left {
        color: #14b1bb;
      }
    }
    &.gold {
      background: url(./card-gold.png);
      .card-left {
        color: #bb8103;
      }
    }
    &.red {
      background: url(./card-red.png);
      .card-left {
        color: #e84c4c;
      }
    }
    &.blue {
      background: url(./card-blue.png);
      .card-left {
        color: #4188d3;
      }
    }

    &.finished {
      opacity: .4;
    }

    .sfa-points {
      background: url(./points.png);
      height: 23px;
      width: 23px;
    }
    .sfa-finished {
      background: url(./finished.png);
      width: 97px;
      height: 90px;
      position: absolute;
      right: 13px;
      top: 20px;
    }

    .card-value {
      font-size: 44px;
      color: #ffffff;
      margin-right: 20px;
      line-height: 36px;
    }

    .card-unit {
      font-size: 16px;
    }

    .card-badge {
      height: 24px;
      line-height: 24px;
      background-color: rgba(184, 184, 186, 0.07);
      border-radius: 12px;
      border: solid 1px #ffffff;
      font-size: 14px;
      color: #fff;
      display: inline-block;
      padding: 0 8px;
      margin-right: 10px;
    }

    .points-top {
      display: flex;
      padding-top: 13px;
      padding-bottom: 5px;
      position: relative;
      align-items: center;
    }

    .card-left {
      position: absolute;
      top: 5px;
      right: 0;
      background: #ffffff;
      padding: 3px 7px;
      border-radius: 3px 0 0 3px;
    }

    .points-range {
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 5px;
    }

    .points-type {
      font-size: 14px;
      margin-bottom: 10px;
      height: 20px;
    }

    .points-card-inner {
      color: #ffffff;
    }

    .points-bottom-wrapper {
      position: relative;

      .points-bottom-inner {
        display: flex;
      }

      .points-expire {
        flex: 1;
      }

      .points-value {
        margin-right: 10px;
        display: flex;
        align-items: flex-end;
        line-height: 13px;
      }
      .exchange-btn {
        width: 240px;
        height: 40px;
        box-shadow: 0px 1px 38px 0px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        color: $new-main-deep-color;
        font-size: 16px;
      }
      .points-bottom-btn {
        display: flex;
        justify-content: center;
        padding-right: 10px;
        padding-top: 7px;
        position: absolute;
        top: 0;
        left: 10px;
      }
    }

    .points-countdown-wrapper {
      display: flex;
      flex: 1;
      align-items: center;
    }

    .points-countdown {
      display: flex;
      padding-left: 5px;
      width: 100px;
      justify-content: space-around;
      align-items: center;
    }

    .countdown-cell {
      width: 26px;
      height: 28px;
      background-color: #ffffff;
      border-radius: 3px;
      font-size: 16px;
      color: $new-main-deep-color;
      line-height: 28px;
      text-align: center;
    }
  }
</style>
