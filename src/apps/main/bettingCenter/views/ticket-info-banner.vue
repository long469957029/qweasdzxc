<template>
  <div class="bc-main-area bg-deep clearfix">
    <div class="bc-area-ticket-info pull-left">
      <div class="sfa sfa-bc-ssc-cq"></div>
      <div class="ticket-info">10:00-20:00/共130期</div>
    </div>
    <div class="bc-curt-plan-main pull-left">
      <div class="clearfix">
        <div class="bc-plan-title text-right m-right-sm pull-left" v-if="!bettingInfo.pending">
          第
          <span>{{bettingInfo.planId}}</span>
          期
          <div>
            <span :class="['sfa m-right-xs vertical-sub cursor-pointer', musicStatus ? 'sfa-bc-muisc' : 'sfa-bc-muisc1']" title="开奖声音" @click="openMusic"></span>投注截止
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
      <div class="bc-plan-inner relative clearfix">
        <div class="bc-plan-title pull-left">
          第 <span>{{bettingInfo.pending ? Number(bettingInfo.lastOpenId) + 1 : bettingInfo.lastOpenId}}</span> 期
          <div>开奖号码</div>
        </div>

        <div class="bc-last-plan-results pull-left" v-show="bettingInfo.sale && !bettingInfo.pending" v-html="formatLastOpenNum" @mouseover="calculateToggle(true)" @mouseout="calculateToggle(false)">
          <span class="text-circle">-</span>
          <span class="text-circle">-</span>
          <span class="text-circle">-</span>
          <span class="text-circle">-</span>
          <span class="text-circle">-</span>
        </div>
        <div class="bc-hgcalculate-example " v-show="ticketInfo.info.showNumberDetail&& calculateStatus">
          <div class="bc-hgcaculate-examplerow">万位:<span v-html="calculateInfo ? calculateInfo.wan : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">千位:<span v-html="calculateInfo ? calculateInfo.qian : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">百位:<span v-html="calculateInfo ? calculateInfo.bai : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">十位:<span v-html="calculateInfo ? calculateInfo.shi : ''"></span></div>
          <div class="bc-hgcaculate-examplerow">个位:<span v-html="calculateInfo ? calculateInfo.ge : ''"></span></div>
        </div>
        <div class="pull-left" v-show="!bettingInfo.sale">
          <span class="text-circle">暂</span>
          <span class="text-circle">停</span>
          <span class="text-circle">销</span>
          <span class="text-circle">售</span>
        </div>
        <div class="pull-left" v-show="bettingInfo.sale && bettingInfo.pending">
          <span class="text-circle">等</span>
          <span class="text-circle">待</span>
          <span class="text-circle">开</span>
          <span class="text-circle">奖</span>
        </div>
      </div>
    </div>
    <div class="bc-entry-list pull-right m-right-md">
      <a href="#bc/1" class="entry-list-open">
        <!--跳转到历史分析-->
        <span class="sfa sfa-bc-icon-open-num vertical-middle"></span>
        开奖号码
      </a>
      <a :href="'trend.html?ticketId=' + ticketInfo.info.id" target="_blank" class="entry-list-trend">
        <span class="sfa sfa-bc-icon-trend vertical-middle"></span>
        号码走势
      </a>
      <a :href="'#hc?page=' + ticketParameter" class="router entry-list-des">
        <span class="sfa sfa-bc-icon-des vertical-middle"></span>
        游戏说明
      </a>
    </div>
    <audio ref="overAudio" :src="audio.over"></audio>
    <audio ref="prizeAudio" :src="audio.prize"></audio>
    <audio ref="openAudio" :src="audio.openCode"></audio>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AnimateCountdown from 'com/countdown/animate-countdown'

  let timer
  let goToNextTimer
  let nextTimer

  export default {
    name: "ticket-info-banner",
    props: {
      ticketInfo: Object,
      ticketParameter: String,
      mark6TicketIdArr: Array,
      audio: Object
    },
    data() {
      return {
        musicStatus: !!Global.cookieCache.get('music-status'),
        //上期号码计算浮动框显示状态
        calculateStatus: false,
        // calculateInfo: {
        //   ge: '',
        //   shi: '',
        //   bai: '',
        //   qian: '',
        //   wan: ''
        // },
        countdown: {}
      }
    },
    computed: mapState({
      bettingInfo: 'bettingInfo',
      //上期开奖号码
      //TODO 还需重构,把html逻辑分离出去
      formatLastOpenNum(state) {
        return _(state.bettingInfo.lastOpenNum).map((num, key) => {
          if (state.bettingInfo.ticketId === 18) {
            return `<span class="text-circle circle-sm">${num}</span>`
          } else if (_.indexOf(state.mark6TicketIdArr, parseInt(state.bettingInfo.ticketId, 10)) > -1) {
            const numberColor = state.ticketInfo.info.numberColor
            let colorClass = 'green'
            if (_.indexOf(numberColor.redArr, parseInt(num, 10)) > -1) {
              colorClass = 'red'
            } else if (_.indexOf(numberColor.blueArr, parseInt(num, 10)) > -1) {
              colorClass = 'blue'
            }
            const spanDiv = `<span class="text-circle circle-mark6 ${colorClass}">${num}</span>`
            const separateDiv = '<span class="text-circle circle-mark6 separate">&nbsp;</span>'
            if (key === 5) {
              return spanDiv + separateDiv
            }
            return spanDiv
          }
          return `<span class="text-circle">${num}</span>`
        }).join(' ')
      },

      calculateInfo(state) {
        if (this.ticketInfo && this.ticketInfo.info.showNumberDetail) {
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
      calculateToggle(status) {
        this.calculateStatus = status;
      },

      $_renderCountdown() {
        let times = 1

        return new AnimateCountdown({
          el: this.$refs.countdown,
        }).render().on('change:leftTime', (e) => {
          times -= 1
          if (times === 0) {
            const leftTime = moment.duration(e.finalDate.getTime() - new Date().getTime()).asSeconds()

            if (this.musicStatus) {
              if (parseInt(leftTime, 10) === 3) { // 虽然是倒数5秒的声音，但是判断为3才能吻合
                const url = window.location.href
                const index1 = url.indexOf('#bc')
                if (index1 > 0) {
                  const str = url.substr(index1, url.length)
                  if (str === (`#bc/${this.bettingInfo.ticketId}`)) {
                    this.$refs.overAudio.play()
                  }
                }
              }
            }

            // self.trigger('change:leftTime', leftTime, totalSecond)
            times = 1
          }
        })
      },

      //TODO 倒计时逻辑里面包含了开奖音效逻辑
      $_updateCountdown() {
        const leftSecond = this.bettingInfo.leftSecond
        const sale = this.bettingInfo.sale
        const nextTime = _(sale ? leftSecond : 0).mul(1000)
        const leftTime = nextTime
        this.bettingInfo.leftTime = leftTime

        clearInterval(timer)
        clearInterval(goToNextTimer)
        clearInterval(nextTimer)

        timer = _.delay(() => {
          this.$store.dispatch('getTicketInfo', {ticketId: this.bettingInfo.ticketId})

          if (this.musicStatus) {
            const lastOpenIdNumCache = Global.cookieCache.get(`lastOpenId${this.bettingInfo.ticketId}`)

            //
            const url = window.location.href
            const index1 = url.indexOf('#bc')
            if (index1 > 0) {
              const str = url.substr(index1, url.length)

              if (str === (`#bc/${this.bettingInfo.ticketId}`)) {
                if (this.bettingInfo.lastOpenId !== lastOpenIdNumCache) {
                  Global.cookieCache.set(`lastOpenId${this.bettingInfo.ticketId}`, this.bettingInfo.lastOpenId)
                  const bcTag = Global.cookieCache.get('bcTag')
                  if (bcTag === str) {
                    if (lastOpenIdNumCache !== null && lastOpenIdNumCache !== '') {
                      if (this.bettingInfo.prize > 0) {
                        // 播放中奖声音
                        this.$refs.prizeAudio.play()
                      } else {
                        // 播放开奖声音
                        this.$refs.openAudio.play()
                      }
                    }
                  } else {
                    Global.cookieCache.set('bcTag', str)
                  }
                }
              }
            }
          }
        }, 5300)

        // 只有销售时才进行倒计时
        if (this.bettingInfo.sale) {
          goToNextTimer = _.delay(() => {

            this.$store.commit('GO_TO_NEXT_PLAN');
          }, _(leftSecond).mul(1000))

          // 取得下一期的信息延迟一秒再做
          nextTimer = _.delay(() => {
            this.$store.dispatch('getTicketInfo', {ticketId: this.bettingInfo.ticketId})
          }, _(leftSecond + 1).mul(1000))
        }

        // this.infoModel.set('leftSecond', 0, {
        //   silent: true,
        // })

        this.countdown.render(leftTime)
      }
    },

    mounted() {
      this.countdown = this.$_renderCountdown()
    },

    watch: {
      'bettingInfo.leftSecond': {
        handler(newVal, oldVal) {
          this.$_updateCountdown()
        }
      }
    }
  }

</script>

<style scoped>

</style>
