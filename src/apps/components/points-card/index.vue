<template>
  <div class="points-card-wrapper" :class="displayType">
    <div class="points-card" :class="[cardInfo.type, style]"
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
          <div class="card-left" v-if="formateCardLeft"><!--displayType:mall 只在积分商城可兑换时显示，侧边栏不显示-->
            剩{{couponInfo.maxNum - couponInfo.useNum}}张
          </div>
          <div :class="['card-time-end',{'lg': isMyCoupon}]" v-if="formateCardTimeEnd">
            <div class="card-time-end-txt" :class="['card-time-end-'+cardInfo.type, style]">即将到期</div>
          </div><!--即将到期-->
          <div class="sfa-icon sfa-finished"></div>
          <div class="sfa-icon sfa-grab-finished"></div>
          <div class="sfa-icon sfa-has-use"></div>
          <div class="sfa-icon sfa-has-expire"></div>
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
                <div class="points-value" v-if="displayType === 'mall' && !isMyCoupon">
                  <span class="sfa sfa-points"></span>
                  {{couponInfo.requireIntegral | convert2yuan}}积分
                </div>
                <div class="points-value" v-else-if="displayType === 'mall' && isMyCoupon">
                  <span class="cursor-pointer" :data-clipboard-text="couponInfo.couponToken"
                        ref="couponCopy" title="复制到剪切板">
                    <span class="sfa sfa-mall-copy vertical-bottom m-right-xs"></span>
                    券编号
                    <span class="copy-status" v-show="copyTip">{{copyTipText}}</span>
                  </span>
                </div>
              </div>
            </div>
            <div :class="`points-way way-${couponInfo.wayId > 3 ? 3 : couponInfo.wayId}`" key="way" v-if="isMyCoupon && couponInfo.status === 0 && !_(couponInfo.wayId).isNull()">
              <div :class="['points-way-detail',cardInfo.type]">{{formatCouponWay}}</div>
            </div>
            <div v-show="showBtn" key="exchange" class="points-bottom-btn">
              <button class="btn btn-white exchange-btn" v-if="couponInfo.couponStatus === 1"
                      @click="isLogin ? $emit('exchange', formatCouponInfo) : login()">立即兑换</button>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Countdown from '../countdown/index.vue'
  import checkLogin from '../../mixins/check-login'
  const Clipboard = require('clipboard')
  import {formatCoupon} from 'build'

  const CARD_TYPE = {
    '1': {
      type: 'blue'
    },
    '2': {
      type: 'green'
    },
    '3': {
      type: 'green'
    },
    '4': {
      type: 'green'
    },
    '5': {
      type: 'gold'
    },
    '6': {
      type: 'red'
    },
  }
  const CARD_WAY = {
    '0': {
      text:'积分商城兑换'
    },
    '1': {
      text:'幸运夺宝中奖'
    },
    '2': {
      text:'活动奖励'
    },
    '3': {
      text:'平台赠送'
    }
  }
  export default {
    name: 'points-card',

    mixins: [checkLogin],

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
      },
      isMyCoupon:{
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        showBtn: false,
        copyTip:false,
        copyTipText:'复制成功'
      }
    },

    computed: {
      formateCardLeft(){
        return this.displayType === 'mall' && this.couponInfo.couponStatus === 1 && this.couponInfo.maxNum && !this.isMyCoupon
      },
      formateCardTimeEnd(){
        return this.couponInfo.status === 0 && (this.displayType === 'show' || this.isMyCoupon)
          && (_(this.couponInfo.validEndDate).sub(this.couponInfo.sysTime) < 10800000)
      },
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
      formatCouponWay(){  // 目前后台返回的获取方式 种类太多 如果id大于3  默认显示为平台赠送
        return _(CARD_WAY[this.couponInfo.wayId]).isUndefined() ? '平台赠送' : CARD_WAY[this.couponInfo.wayId].text
      },
      cardInfo() {
        return CARD_TYPE[this.couponInfo.couponType]
      },
      isFinished() {
        //true代表已抢完或已兑换
        return this.couponInfo.couponStatus !== 1
        // return this.couponInfo.maxNum && this.couponInfo.maxNum - this.couponInfo.useNum === 0
      },
      style() {
        let className = ''
        if(this.isMyCoupon){
          className = this.couponInfo.status === 1 ? 'has-use' :
            this.couponInfo.status === 2 ? 'has-expire' : ''
        }else{
          className = this.couponInfo.couponStatus === 3 ? 'finished' :
            this.couponInfo.couponStatus === 2 ? 'grab-finished' : ''
        }
        return className

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
      },
    },
    mounted(){
      if(this.isMyCoupon){
        const clipboard = new Clipboard(this.$refs.couponCopy);
        clipboard.on('success', (e) => {
          this.copyTip = true
          e.clearSelection();
          setTimeout(() => {
            this.copyTip = false
          },1000)
        });
        clipboard.on('error', (e) => {
          this.copyTip = true
          this.copyTipText = '复制失败'
          setTimeout(() => {
            this.copyTip = false
          },1000)
        });
      }
    }
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
      opacity: .65;
      .sfa-finished {
        display: block;
      }
    }
    &.grab-finished {
      opacity: .65;
      .sfa-grab-finished {
        display: block;
      }
    }
    &.has-use {
      opacity: .65;
      .sfa-has-use {
        display: block;
      }
    }
    &.has-expire {
      opacity: .65;
      .sfa-has-expire {
        display: block;
      }
    }

    .sfa-points {
      background: url(./points.png);
      height: 23px;
      width: 23px;
    }
    .sfa-icon{
      width: 106px;
      height: 106px;
      position: absolute;
      right: 13px;
      top: 10px;
      display: none;
      &.sfa-finished {
         background: url(./finished.png) no-repeat;
       }
      &.sfa-grab-finished {
        background: url(./grab-finished.png) no-repeat;
      }
      &.sfa-has-use {
        background: url(./has-use.png) no-repeat;
      }
      &.sfa-has-expire {
        background: url(./has-expire.png) no-repeat;
      }
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
      .copy-status{
        position: absolute;
        padding: 3px 5px;
        background: $def-white-color;
        border-radius: 3px;
        font-size: $font-xs;
        color: $new-inverse-color;
        right: 5px;
        top: 52px;
        &:before{
          content: '';
          width: 0px;
          height: 0px;
          border: 5px solid transparent;
          border-bottom-color: $def-white-color;
          display: block;
          position: absolute;
          top: -10px;
          left:50%;
          margin-left: -2.5px;
        }
      }
      .exchange-btn {
        width: 240px;
        height: 40px;
        box-shadow: 0px 1px 38px 0px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        font-size: 16px;
        border: none;
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
      .points-way{
        position: absolute;
        width: 22px;
        height: 22px;
        top: -3px;
        right: 13px;
        cursor: pointer;
        z-index: 1;
        &.way-0{
          background: url('./icon-way-0.png') no-repeat;
        }
        &.way-1{
          background: url('./icon-way-1.png') no-repeat;
        }
        &.way-2{
          background: url('./icon-way-2.png') no-repeat;
        }
        &.way-3{
          background: url('./icon-way-3.png') no-repeat;
        }
        .points-way-detail{
          position: absolute;
          width: 22px;
          height: 27px;
          background-color: #fafafa;
          border-radius: 13px;
          opacity: 0;
          transition: width .5s;
          top: -4px;
          right: 0px;
          z-index: 2;
          font-size: $font-xs;
          text-align: center;
          line-height: 27px;
          overflow: hidden;
          &.green {
            color: $green;
          }
          &.gold {
            color: $gold;
          }
          &.red {
            color: $red;
          }
          &.blue {
            color: $blue;
          }
        }
        &:hover{
          .points-way-detail{
            opacity: 1;
            width: 120px;
          }
        }
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
    .card-time-end {
      background: url(./card-time-end.png) no-repeat;
      width: 57px;
      height: 53px;
      position: absolute;
      top: -7px;
      right: 0;
      overflow: hidden;
      &.lg{
        background: url(./card-time-end-lg.png) no-repeat;
        width: 70px;
        height: 66px;
        top: -16px;
        right: -7px;
        .card-time-end-txt {
          margin-left: 8px;
          margin-top: 16px;
          transform: rotate(43deg);
        }
      }
      .card-time-end-txt {
        width: 100%;
        text-align: center;
        font-size: 12px;
        transform: rotate(45deg);
        margin-left: 9px;
        margin-top: 10px;
      }
      .card-time-end-green {
        /*color: #12bebe;*/
        color: $green;
      }
      .card-time-end-gold {
        /*color: #4182d4;*/
        color: $gold;
      }
      .card-time-end-red {
        /*color: #d25c5c;*/
        color: $red;
      }
      .card-time-end-blue {
        /*color: #cc985c;*/
        color: $blue;
      }
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
