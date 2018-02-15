<template>
  <div class="width-100 bc-play-main">
    <betting-rules :initial-rules="playLevels"></betting-rules>

    <div class="bc-play-container clearfix">
      <div class="bc-play-left pull-left">
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
      <betting-history class="bc-side-area pull-right" :ticket-info="ticketInfo" :play-rule="playRule"
                       :last-open-id="bettingInfo.lastOpenId"
                       ref="bettingHisotry"></betting-history>
    </div>

    <!-- 确认投注 -->
    <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="confirm">
      <betting-confirm :ticket-info="ticketInfo" :betting-info="bettingInfo" :betting-choice="bettingChoice"
                       :betting-list="bettingChoice.buyList" :type="`handicap`"
                       @bettingConfirm="bettingConfirm"></betting-confirm>
    </div>
  </div>
</template>
<script>
  import betRulesConfig from 'bettingCenter/misc/betRulesConfig'
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
        loading: Global.ui.loader.get(),
        unit: 10000,
        playRule: {},
        playInfo: {},
        //提交中，禁用按钮
        pushing: false,
        fPreviewList: [],

        advanceShowMode: 'none', //classic | single
      }
    },
    computed: mapState({
      playLevels() {
        return this.$store.getters.playLevels
      },
      bettingChoice: 'bettingChoice',
      bettingInfo: 'bettingInfo',
    }),

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
            // Global.ui.notification.show(
            //   `<span class="text-danger">${oldPlanId}</span>期已截止<br/>当前期为<span class="text-danger">${newPlanId}</span>期<br/>投注时请注意期号！`,
            //   {id: 'ticketNotice', hasFooter: false, displayTime: 800},
            // )
            this.$store.commit(types.TOGGLE_DESKTOP_MESSAGE,{show:true,dataInfo:{type:4, oldPlanId, newPlanId}})
          }
        }
      },
      'bettingInfo.lastOpenId': {
        handler() {
          this.$refs.bettingHisotry.update()
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
        if (Global.memoryCache.get('acctInfo').foundsLock) {
          Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" ' +
            'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
          return false
        }

        $(this.$refs.confirm).modal({
          backdrop: 'static',
        })
      },

      bettingConfirm() {
        this.pushing = true

        $(this.$refs.confirm).modal('hide')

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
                displayTime: 800,
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
  .bc-play-main .bc-side-area {
    width: 278px;
    min-height: 845px;
  }
  .bc-play-container.clearfix {
    display: flex;
  }
</style>
