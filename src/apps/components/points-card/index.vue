<template>
  <div class="points-card-wrapper" :class="displayType">
    <div class="points-card" :class="[cardInfo.type, {finished: isFinished}]"
         @mouseout="toggleBtn(false)">
      <div class="points-card-inner" @mouseover="toggleBtn(true)">
        <div class="points-top">
          <div class="card-value">
            {{formatCouponInfo.bigShowNum}}<span class="card-unit">{{formatCouponInfo.conditionType === 2 ? '%' : '元'}}</span>
          </div>
          <div class="card-badge">{{formatCouponInfo.couponName}}</div>
          <div class="card-badge " v-if="_.isNumber(couponInfo.levelLimit) && couponInfo.levelLimit >= 0">
            LV{{couponInfo.levelLimit}}
            <template v-if="1 === couponInfo.limitLevelType">以上</template>
          </div>
          <div class="card-left" v-if="couponInfo.maxNum && couponInfo.maxNum - couponInfo.useNum > 0 && displayType === 'mall'"><!--displayType:mall 只在积分商城显示，侧边栏不显示-->
            剩{{couponInfo.maxNum - couponInfo.useNum}}张
          </div>
          <div class="card-time-end" v-if="displayType === 'show' && (couponInfo.validEndDate-couponInfo.sysTime)<10800000"></div><!--即将到期-->
          <div v-else-if="isFinished" class="sfa-finished"></div>
        </div>
        <div class="points-center">
          <div class="points-range">{{formatCouponInfo.mainDesc}}</div>
        </div>


        <div class="points-bottom-wrapper">
          <transition-group name="fade"
                            enter-active-class="animated-quick fadeIn"
                            leave-active-class="animated-quick fadeOut"
          >
            <div class="points-bottom" v-show="!showBtn" key="show">
              <div class="points-type">{{formatCouponInfo.secondDesc}}</div>
              <div class="points-bottom-inner">
                <div v-if="countdownTime > 0" class="points-countdown-wrapper">
                  <span>距开始</span>
                  <countdown class="points-countdown" :time="countdownTime" tag="div"
                             @countdown-finished="couponInfo.sysTime = couponInfo.validStartDate">
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
                  {{couponInfo.validStartDate | toTime('MM.DD H:mm')}}-{{couponInfo.validEndDate | toTime('MM.DD H:mm')}}
                </div>
                <div class="points-value" v-if="displayType === 'mall'">
                  <span class="sfa sfa-points"></span>
                  {{couponInfo.requireIntegral | convert2yuan}}积分
                </div>
              </div>
            </div>
            <div v-show="showBtn" key="exchange" class="points-bottom-btn">
              <button class="btn btn-white exchange-btn" v-if="couponInfo.couponStatus === 1" @click="$emit('exchange', formatCouponInfo)">立即兑换</button>
              <button class="btn btn-white exchange-btn disabled" v-else>已兑换</button>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Countdown from '../countdown/index.vue'
  import {formatCoupon} from 'build'

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

    props: {
      couponInfo: {
        type: Object
      },
      displayType: {
        type: String,
        default: 'mall'
      }
    },
    data() {
      return {
        showBtn: false
      }
    },

    computed: {
      formatCouponInfo() {
        return formatCoupon({
          bigShowNum: this.couponInfo.bigShowNum,
          type: this.couponInfo.type,
          threholdAmount: this.couponInfo.threholdAmount,
          bonusPercentAmount: this.couponInfo.bonusPercentAmount,
          statType: this.couponInfo.statType,
          ticketId: this.couponInfo.statTicketId,
          gameType: this.couponInfo.gameType
        })
      },
      cardInfo() {
        return CARD_TYPE[this.couponInfo.couponType]
      },
      isFinished() {
        return this.couponInfo.couponStatus === 3
        // return this.couponInfo.maxNum && this.couponInfo.maxNum - this.couponInfo.useNum === 0
      },
      countdownTime() {
        if (this.couponInfo.validStartDate > this.couponInfo.sysTime) {
          return this.couponInfo.validStartDate - this.couponInfo.sysTime
        }
        return 0
      }
    },

    methods: {
      toggleBtn(flag) {
        if (this.displayType === 'mall'){
          if (!this.isFinished && this.countdownTime === 0) {
            this.showBtn = flag
          }
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

  $green: $new-main-deep-color;
  $gold: #bb8103;
  $red: #e84c4c;
  $blue: #4188d3;

  .points-card {
    width: 310px;
    height: 195px;
    margin: -13px -14px -23px -16px;
    display: inline-block;
    .points-card-inner {
      margin: 13px 14px 23px 16px;
      padding: 10px 0 0 10px;
    }

    &.green {
      background: url(./card-green.png);

      .card-left, .exchange-btn, .countdown-cell {
        color: $green;
      }
    }
    &.gold {
      background: url(./card-gold.png);
      .card-left, .exchange-btn, .countdown-cell {
        color: $gold;
      }
    }
    &.red {
      background: url(./card-red.png);
      .card-left, .exchange-btn, .countdown-cell {
        color: $red;
      }
    }
    &.blue {
      background: url(./card-blue.png);
      .card-left, .exchange-btn, .countdown-cell {
        color: $blue;
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
      padding-bottom: 5px;
    }

    .points-type {
      font-size: 14px;
      margin-bottom: 5px;
      height: 20px;
    }

    .points-card-inner {
      color: #ffffff;
    }

    .points-bottom-wrapper {
      position: relative;

      .points-bottom-inner {
        display: flex;
        align-items: center;
        height: 28px;
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
      line-height: 28px;
      text-align: center;
    }
  }
  .show {
    width: 270px;
    height: 140px;
    overflow: hidden;
    margin-top: 10px;
    .points-card {
      width: 255px;
      height: 140px;
      margin: 0;
      display: inline-block;
      overflow: hidden;
      .points-card-inner {
        width: 255px;
        height: 140px;
        margin: 0px;
        padding: 20px 0 10px 27px;
        .card-time-end {
          background: url(./card-time-end.png);
          width: 57px;
          height: 53px;
          position: absolute;
          top: -7px;
          right: 0;
        }
        .points-top {
          padding-top: 8px;
          padding-bottom: 0px;
          .card-value {
            font-size: 30px;
            line-height: 30px;
            .card-unit {

            }
          }
          .card-badge {
            height: 22px;
            line-height: 20px;
            background-color: rgba(184, 184, 186, .07);
            border-radius: 12px;
            border: solid 1px #ffffff;
            font-size: 12px;
            color: #fff;
            display: inline-block;
            padding: 0 5px;
            margin-right: 10px;
            opacity:0.8;
          }
        }
        .points-center {
          .points-range {
            font-size: 14px;
            padding-bottom: 0px;
            padding-top: 2px;
          }
        }
        .points-bottom-wrapper {
          .points-bottom {
            .points-type {
              font-size: 12px;
              margin-bottom: 0px;
              opacity:0.8;
            }
            .points-bottom-inner {
              height: 26px;
              opacity:0.8;
              .points-expire {

              }
            }
          }
        }
      }
    }
  }
</style>
