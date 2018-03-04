<template>
  <div class="width-100 bc-play-main">
    <betting-rules :initial-rules="playLevels" ></betting-rules>

    <div class="bc-play-container clearfix">
      <div class="bc-play-left">
        <betting-advance-rules :type="'single-hidden'"></betting-advance-rules>
        <div class="m-LR-smd">
          <div class="bc-play-area clearfix" :class="!_.isEmpty(playRule) ? 'loaded' : ''">
            <betting-play-area-handicap :play-info="playInfo" :play-rule="playRule" :ticket-info="ticketInfo"
                                        :pushing="pushing" :sale="bettingInfo.sale" :pending="bettingInfo.pending"
                                        ref="area" @lotteryBuy="lotteryBuy"></betting-play-area-handicap>
          </div>
        </div>

        <!-- 路珠 -->
        <road-balls-analysis :ticket-info="ticketInfo" v-if="ticketInfo.roadBalls"></road-balls-analysis>
      </div>
      <betting-history class="bc-side-area" :ticket-info="ticketInfo" :play-rule="playRule" :height="660"
                       :last-open-id="bettingInfo.lastOpenId"
                       ref="bettingHisotry"></betting-history>
    </div>

    <!-- 确认投注 -->
    <div v-transfer-dom>
      <x-dialog v-model="showConfirmModal">
        <betting-confirm slot="all" :ticket-info="ticketInfo" :betting-info="bettingInfo" :betting-choice="bettingChoice"
                         :betting-list="bettingChoice.buyList.length ? bettingChoice.buyList[0].formattedList : []" :type="`handicap`"
                         @bettingConfirm="bettingConfirm"></betting-confirm>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import betRulesConfig from './misc/betRulesConfig'
  import RoadBallsAnalysis from './road-balls-analysis'
  import BettingRules from './betting-rules'
  import BettingAdvanceRules from './betting-advance-rules'
  import BettingPlayAreaHandicap from './betting-play-area-handicap'
  import BettingConfirm from "./betting-confirm"
  import BettingHistory from "./betting-history"

  export default {
    name: "betting-main-area-handicap",

    props: {
      ticketInfo: Object,
      ticketId: Number,
    },
    components: {
      BettingRules,
      BettingConfirm,
      BettingAdvanceRules,
      BettingPlayAreaHandicap,
      RoadBallsAnalysis,
      BettingHistory,
    },
    data() {
      return {
        unit: 10000,
        playRule: {},
        playInfo: {},
        //提交中，禁用按钮
        pushing: false,

        advanceShowMode: 'none', //classic | single
        showConfirmModal: false,
      }
    },
    computed: {
      ...mapState({
        foundsLock: state => state.loginStore.foundsLock,
        bettingChoice: 'bettingChoice',
        bettingInfo: 'bettingInfo',
      }),
      ...mapGetters([
        'playLevels',
      ])
    },

    watch: {
      'bettingChoice.playId': {
        handler(playId) {
          if (playId === -1) {
            return
          }
          this.playRule = betRulesConfig.get(playId)

          this.$store.commit(types.SET_CHECKOUT_CHOICE)

          this.playInfo = this.$store.getters.playInfo(playId, this.bettingChoice.groupId);

          const playInfo = this.playInfo

          this.$store.commit(types.SET_MAX_BONUS, playInfo.betMethodMax)
          this.$store.commit(types.SET_PLAY_INFO, playInfo)

          this.clearAll()
        },
      },
      'bettingInfo.planId': {
        handler(newPlanId, oldPlanId) {
          if (this.$el.offsetWidth && newPlanId !== '------------' && oldPlanId !== '------------' && !this.bettingInfo.pending) {
            this.$store.commit(types.TOGGLE_DESKTOP_MESSAGE, {
              show: true,
              dataInfo: {
                type: 3,
                oldPlanId,
                newPlanId
              }
            })
          }
        }
      },
      'bettingInfo.lastOpenId': {
        handler(current, prev) {
          if (current !== '-') {
            this.$refs.bettingHisotry.update()
          }
        }
      },
    },

    beforeCreate() {
      this.$store.commit(types.CHECKOUT_TICKET_INFO)
    },

    methods: {

      clearAll() {
        this.$refs.area.clearAll()
      },

      lotteryBuy() {
        const result = this.bettingChoice.addPrevBetResult

        //提交成功
        if (result) {
          if (!_.isEmpty(result)) {
            if (result.maxBetNums && !_.isNull(result.maxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.maxBetNums} 注，请重新选择  `)
            }
          }
        } else {
          Global.ui.notification.show('号码选择不完整，请重新选择！')
        }

        //do save
        if (this.foundsLock) {
          Global.ui.notification.show('资金已锁定，暂不能进行投注操作')
          return false
        }


        this.showConfirmModal = true
      },

      bettingConfirm() {
        this.pushing = true

        this.showConfirmModal = false

        this.$store.dispatch(types.PUSH_BETTING, {
          planId: this.bettingInfo.planId,
          type: 'buyList'
        })
          .catch(() => {
            this.pushing = false
          })
          .then((res) => {
            this.pushing = false

            if (res && res.result === 0) {

              this.$refs.area.clearAll()
              this.$store.commit(types.EMPTY_PREV_BETTING)

              Global.m.oauth.check()

              Global.ui.notification.show('投注成功！', {
                type: 'success',
                hasFooter: false,
                closeBtn: false,
                displayTime: 800,
                size: 'modal-xs',
              })
            } else {
              if (res.msg.indexOf('余额不足') > -1) {
                Global.ui.notification.show(res.msg || '', {
                  btnContent: '充值',
                  event: () => {
                    $('.header-main .js-header-recharge').trigger('click.fundDialog')
                  }
                })
              } else {
                Global.ui.notification.show(res.msg || '')
              }
            }
          })
      },
    },
  }
</script>

<style lang="scss" scoped>

  .bc-play-container {
    display: flex;
  }
</style>
