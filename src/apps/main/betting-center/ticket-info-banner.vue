<template>
  <div class="bc-main-area bg-deep clearfix">
    <div class="stop-selling" v-if="!bettingInfo.sale"></div>
    <div class="bc-area-ticket-info pull-left">
      <transition mode="out-in"
                  enter-active-class="animated-quick fadeIn"
                  leave-active-class="animated-quick fadeOut"
      >
        <div :class="['sfa',`sfa-bc-${ticketInfo.type}-${ticketInfo.mark}`]"
             :key="`${ticketInfo.type}-${ticketInfo.mark}`"></div>
      </transition>
    </div>
    <div class="bc-curt-plan-main pull-left">
      <div class="clearfix">
        <div class="bc-plan-title text-right m-right-sm pull-left" v-if="!bettingInfo.pending">
          第
          <span class="font-bold">{{bettingInfo.planId}}</span>
          期
          <div>
            <span
              :class="['sfa m-right-xs vertical-sub cursor-pointer', musicStatus ? 'sfa-bc-muisc' : 'sfa-bc-muisc1']"
              title="开奖声音" @click="openMusic"></span>投注截止
          </div>
        </div>
        <div class="bc-plan-title text-right m-right-sm pull-left" v-else>
          距离维护结束
          <div>时间还剩</div>
        </div>
        <div class="text-center m-bottom-md pull-left" ref="countdown"></div>
      </div>
    </div>
    <div class="bc-plan-main pull-left m-left-md">
      <div class="bc-plan-inner relative">
        <div class="bc-plan-title pull-left">
          第 <span class="font-bold">{{bettingInfo.pending ? Number(bettingInfo.lastOpenId) + 1 : bettingInfo.lastOpenId}}</span>
          期
          <div>开奖号码</div>
        </div>

        <keep-alive>
          <opening-balls :counts="ticketInfo.counts" :range="ticketInfo.range" :opening-balls="bettingInfo.lastOpenNum"
                         ref="openingArea" :size="ticketInfo.ballSize"
                         :default-opening="ticketInfo.defaultOpening" :auto-stop-rolling="!ticketInfo.openWhenTimeout"
                         v-if="ticketInfo.openingType === 'balls'" @mouseover.native="calculateStatus = true"
                         @mouseout.native="calculateStatus = false"
          ></opening-balls>
          <opening-dices-panel class="inline-block" v-else-if="ticketInfo.openingType === 'dices'" ref="openingArea"
                               :default-opening="ticketInfo.defaultOpening"
                               :opening-num="bettingInfo.lastOpenNum" :ticket-info="ticketInfo"
          ></opening-dices-panel>
          <opening-mark6-balls :counts="ticketInfo.counts" :opening-balls="bettingInfo.lastOpenNum" ref="openingArea"
                               :default-opening="ticketInfo.defaultOpening"
                               v-else-if="ticketInfo.openingType === 'mark-balls'"
          ></opening-mark6-balls>
        </keep-alive>

        <div class="bc-hgcalculate-example" v-if="ticketInfo.showNumberDetail&& calculateStatus">
          <div class="bc-hgcaculate-examplerow">万位:<span v-html="calculateInfo ? calculateInfo.wan : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">千位:<span v-html="calculateInfo ? calculateInfo.qian : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">百位:<span v-html="calculateInfo ? calculateInfo.bai : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">十位:<span v-html="calculateInfo ? calculateInfo.shi : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">个位:<span v-html="calculateInfo ? calculateInfo.ge : ''"></span></div>
        </div>
      </div>
    </div>
    <div class="bc-entry-list pull-right m-right-md">
      <router-link v-ripple :to="{name: 'analysis', params: {ticketId: ticketInfo.id}}" target="_blank" class="entry-list-open">
        <!--跳转到历史分析-->
        <span class="sfa sfa-bc-icon-open-num vertical-middle"></span>
        开奖号码
      </router-link>
      <a v-ripple :href="`trend.html?ticketId=${ticketInfo.id}`" target="_blank" class="entry-list-trend" v-if="ticketInfo.trend">
        <span class="sfa sfa-bc-icon-trend vertical-middle"></span>
        号码走势
      </a>
      <router-link v-ripple :to="{name: 'help', query: {page: ticketInfo.helpPage}}" class="router entry-list-des"
                   target="_blank">
        <span class="sfa sfa-bc-icon-des vertical-middle"></span>
        游戏说明
      </router-link>
    </div>
    <audio ref="countdownAudio" :src="audio.countdown"></audio>
    <audio ref="prizeAudio" :src="audio.prize"></audio>
    <audio ref="openAudio" :src="audio.openBall"></audio>
  </div>
</template>

<script>
  import OpeningBalls from 'com/opening-balls'
  import AnimateCountdown from 'com/countdown/animate-countdown'
  import OpeningMark6Balls from 'com/opening-mark6-balls'
  import OpeningDicesPanel from './opening-dices-panel'


  import countdown from './misc/countdown.mp3'
  import prize from './misc/prize.wav'
  import openBall from './misc/openBall.mp3'

  export default {
    name: "ticket-info-banner",

    components: {
      OpeningBalls,
      OpeningDicesPanel,
      OpeningMark6Balls,
    },

    props: {
      ticketInfo: Object,
    },
    data() {
      return {
        musicStatus: !!Global.cookieCache.get('music-status'),
        //上期号码计算浮动框显示状态
        calculateStatus: false,
        countdown: {},
        audio: {countdown, prize, openBall},
        timer: null,
        goToNextTimer: null,
        nextTimer: null,
        playCountdownTimer: null
      }
    },

    watch: {
      'bettingInfo.leftSecond': {
        handler(newVal) {
          if (newVal) {
            this.$_updateCountdown()

            //如果需要在倒计时结束就开始开奖则设置
            if (this.checkRolling()) {
              this.$refs.openingArea.rolling()
            }
          }
        }
      },
      'ticketInfo'() {
        clearInterval(this.timer)
        clearInterval(this.goToNextTimer)
        clearInterval(this.nextTimer)
        this.stopCountdownAudio()
      },
      'bettingInfo.lastOpenId'(current, prev) {
        if (this.musicStatus) {
          if (current !== '-' && prev !== '-') {
            if (this.bettingInfo.prize > 0) {
              // 播放中奖声音
              this.$refs.prizeAudio.play()
            } else {
              // 播放开奖声音
              this.$refs.openAudio.play()
            }
          }
        }
      }
    },

    computed: mapState({
      bettingInfo: 'bettingInfo',

      calculateInfo(state) {
        //新加坡2分彩 彩种显示用
        if (this.ticketInfo && this.ticketInfo.showNumberDetail) {
          let calculateInfo = {
            ge: '',
            shi: '',
            bai: '',
            qian: '',
            wan: ''
          }
          let count
          let result
          let first
          let last
          const openNun = state.bettingInfo.lastOrgOpenNum.split(',')
          $.each(openNun, (key, value) => {
            if (key === 0 || key === 4 || key === 8 || key === 12 || key === 16) {
              count = 0
              result = 0
            }
            count = `${count}+${value}`
            result += parseInt(value, 10)
            if (key === 3) {
              first = (`${result}`).substring(0, (`${result}`).length - 1)
              last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
              calculateInfo.wan = `${count.replace('0+', '')}=${first}${last}`
            } else if (key === 7) {
              first = (`${result}`).substring(0, (`${result}`).length - 1)
              last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
              calculateInfo.qian = `${count.replace('0+', '')}=${first}${last}`
            } else if (key === 11) {
              first = (`${result}`).substring(0, (`${result}`).length - 1)
              last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
              calculateInfo.bai = `${count.replace('0+', '')}=${first}${last}`
            } else if (key === 15) {
              first = (`${result}`).substring(0, (`${result}`).length - 1)
              last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
              calculateInfo.shi = `${count.replace('0+', '')}=${first}${last}`
            } else if (key === 19) {
              first = (`${result}`).substring(0, (`${result}`).length - 1)
              last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
              calculateInfo.ge = `${count.replace('0+', '')}=${first}${last}`
            }
          })
          return calculateInfo;
        }
      }
    }),

    methods: {
      openMusic() {
        this.musicStatus = !this.musicStatus;
        Global.cookieCache.set('music-status', this.musicStatus)
      },

      $_renderCountdown() {
        return new AnimateCountdown({
          el: this.$refs.countdown,
        }).render().on('change:leftTime', (e) => {
          const leftTime = moment.duration(e.finalDate.getTime() - new Date().getTime()).asSeconds()

          if (this.musicStatus) {
            if (Math.floor(leftTime) <= 4) { // 虽然是倒数5秒的声音，但是判断为3才能吻合
              this.playCountdownAudio(Math.floor(leftTime))
            }
          }
        })
      },

      playCountdownAudio(countdown) {
        this.playCountdownTimer = _.delay(() => {
          if (countdown >= 0) {
            this.$refs.countdownAudio.play()
            this.playCountdownAudio(--countdown)
          } else {
            this.stopCountdownAudio()
          }
        }, 1000)
      },

      stopCountdownAudio() {
        clearInterval(this.playCountdownTimer)
      },

      $_updateCountdown() {
        const leftSecond = this.bettingInfo.leftSecond
        const sale = this.bettingInfo.sale
        const nextTime = _(sale ? leftSecond : 0).mul(1000)
        const leftTime = nextTime
        this.bettingInfo.leftTime = leftTime

        clearInterval(this.timer)
        clearInterval(this.goToNextTimer)
        clearInterval(this.nextTimer)

        this.timer = _.delay(() => {
          this.$store.dispatch(types.GET_TICKET_INFO, {
            ticketId: this.bettingInfo.ticketId,
            type: this.bettingType
          })
        }, 7000)

        // 只有销售时才进行倒计时
        if (this.bettingInfo.sale) {
          this.goToNextTimer = _.delay(() => {

            this.$store.commit('GO_TO_NEXT_PLAN');

            //如果需要在倒计时结束就开始开奖则设置
            if (this.checkRolling()) {
              this.$refs.openingArea.rolling()
            }

          }, _(leftSecond).mul(1000))

          // 取得下一期的信息延迟一秒再做
          this.nextTimer = _.delay(() => {
            this.$store.dispatch(types.GET_TICKET_INFO, {
              ticketId: this.bettingInfo.ticketId,
              type: this.bettingType
            })
          }, _(leftSecond + 1).mul(1000))
        }

        this.countdown.render(leftTime)
      },

      checkRolling() {
        if (this.ticketInfo.openWhenTimeout) {
          const distance = this.$_checkPlanIdDistance(this.bettingInfo.planId, this.bettingInfo.lastOpenId)
          if (distance === 2 || distance === (this.ticketInfo.totalPriods - 1)) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },

      $_checkPlanIdDistance(currentPlanId, lastPlanId) {
        const current = currentPlanId.substr(-4)
        const last = lastPlanId.substr(-4)
        return Math.abs(Number(current) - Number(last))
      }
    },

    beforeDestroy() {
      clearInterval(this.timer)
      clearInterval(this.goToNextTimer)
      clearInterval(this.nextTimer)
    },

    mounted() {
      this.countdown = this.$_renderCountdown()
    },
  }

</script>

<style lang="scss" scoped>


  .bc-main-area {
    height: 140px;
    position: relative;
    .bc-area-ticket-info {
      width: 180px;
      margin: 15px 40px 0;
    }
    .bc-curt-plan-main {
      margin-top: 40px;
    }
    .bc-entry-list {
      padding-top: 10px;
      a {
        display: block;
        width: 95px;
        height: 28px;
        line-height: 28px;
        border-radius: 20px;
        color: $def-white-color;
        margin-top: 10px;
        text-align: center;
        background-color: #129fa8;
        transition: all .3s;
        &:hover {
          background-color: #108e96;
        }
      }
    }
    .betting-mode {
      color: $new-black-color;
    }
  }

  .bc-plan-main {
    margin-top: 40px;
    .bc-plan-title {
      margin-right: 18px;
      text-align: right;
      display: inline-block;
      margin-bottom: 25px;
      position: relative;
      vertical-align: top;
    }
    .bc-last-plan-results {
      .text-circle {
        font-family: Tahoma, Arial, "Microsoft YaHei UI", "Microsoft Yahei", sans-serif;
        position: relative;
        &:after {
          content: '';
          width: 18px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.15);
          box-shadow: 0 0 20px rgba(0, 0, 0, 1);
          position: absolute;
          bottom: -10px;
          left: 11px;
          transform: rotateX(65deg);
        }
      }
    }
    .bc-hgcalculate-example {
      margin: 3px;
      position: absolute;
      left: 150px;
      top: 50px;
      background-color: #fff;
      color: #000;
      border: 1px solid #666;
      z-index: 1;

    }
  }

  .stop-selling {
    width: 208px;
    height: 295px;
    display: block;
    background: url(./misc/stop-selling.png);
    position: absolute;
    top: -70px;
    right: 25px;
    z-index: 1;

    animation: rotate 5s infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotateY(0);
    }
    50% {
      transform: rotateY(0);
    }
    100% {
      transform: rotateY(720deg);
    }
  }
</style>
