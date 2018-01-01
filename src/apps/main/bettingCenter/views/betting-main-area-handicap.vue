<template>
  <div class="width-100 bc-play-main">
    <betting-rules :initial-rules="playLevels"></betting-rules>

    <div class="bc-play-container clearfix">
      <div class="bc-play-left pull-left">
        <betting-advance-rules :type="'single-hidden'"></betting-advance-rules>
        <div class="m-LR-smd">
          <div class="bc-play-area clearfix" :class="!_.isEmpty(playRule) ? 'loaded' : ''">
            <betting-play-area-handicap :play-rule="playRule" :ticket-info="ticketInfo" :pushing="pushing" :sale="bettingInfo.sale" :pending="bettingInfo.pending"
                                        ref="area" @lotteryBuy="lotteryBuy"></betting-play-area-handicap>
          </div>
        </div>
      </div>
      <div class="bc-side-area pull-right" ref="bcSideArea"></div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import betRulesConfig from 'bettingCenter/misc/betRulesConfig'

  import BettingRules from './betting-rules'
  import BettingAdvanceRules from './betting-advance-rules'
  import BettingPlayAreaHandicap from './betting-play-area-handicap'


  //backbone旧组件
  import HisAnalysisView from './bettingCenter-historical-analysis'
  import confirmTpl from '../templates/bettingCenter-confirm.html'

  let recordsOpenView

  export default {
    name: "betting-main-area-handicap",
    props: {
      ticketInfo: Object,
      ticketId: Number,
    },
    components: {
      BettingRules,
      BettingAdvanceRules,
      BettingPlayAreaHandicap,
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
      playLevels: function() {
        return this.$store.getters.playLevels
      },
      bettingChoice: 'bettingChoice',
      bettingInfo: 'bettingInfo',
    }),

    watch: {
      'bettingChoice.playId': {
        handler: function(newVal) {
          this.playRule = betRulesConfig.get(newVal)

          recordsOpenView.updateByPlayRule(this.playRule)

          this.$store.commit(types.SET_CHECKOUT_CHOICE)

          this.playInfo = this.$store.getters.playInfo(newVal, this.bettingChoice.groupId);

          const playInfo = this.playInfo

          this.$store.commit(types.SET_PLAY_INFO, playInfo)

          this.clearAll()
        },
      },
      'bettingInfo.planId': {
        handler: function(newPlanId, oldPlanId) {
          if (oldPlanId !== '------------' && !this.bettingInfo.pending) {
            Global.ui.notification.show(
              `<span class="text-danger">${oldPlanId}</span>期已截止<br/>当前期为<span class="text-danger">${newPlanId}</span>期<br/>投注时请注意期号！`,
              { id: 'ticketNotice', hasFooter: false, displayTime: 800 },
            )

            //提示框变化, 暂时这么写
            $('.js-bc-confirm-planId').text(newVal)
          }
        }
      },
      'bettingInfo.lastOpenId': {
        handler: function() {
          recordsOpenView.update()
        }
      },
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

        $(document).confirm({
          title: '确认投注',
          content: _(confirmTpl).template()({
            ticketInfo: this.ticketInfo,
            ticketName: this.ticketInfo.info.zhName,
            planId: this.bettingInfo.planId,
            totalInfo: this.bettingChoice.totalInfo,
            previewList: this.bettingChoice.buyList,
          }),
          size: 'bc-betDetail-confirm-dialog',
          agreeCallback: () => {
            this.pushing = true

            this.$store.dispatch('pushBetting', {
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
                } else if (res.root && res.root.errorCode === 101) {
                  Global.ui.notification.show('账号余额不足，请先<a href="#fc/re" class="router btn-link btn-link-hot"  data-dismiss="modal">充值</a>。')
                } else {
                  Global.ui.notification.show(res.msg || '')
                }

                this.$_emptySelect();
              })
          },
        })
      },
    },

    mounted: function() {
      recordsOpenView = new HisAnalysisView({
        el: this.$refs.bcSideArea,
        ticketId: this.ticketId,
      }).render()
    }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .bc-chase {
    text-decoration: none;
    font-size: 12px;
    color: #666666;
  }

  .advance-play-des{
    width: 86px;
    height: 23px;
    display: inline-block;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    line-height: 23px;
    color: #8094A6;
    text-align: center;
    margin: 5px 40px 0 0;
    float: right;
  }

  .bc-advance-mode-single {
    float: left;
    color: $prominent-secondary-btn-color;
    margin: 20px 0 0 20px;
    .advance-play-des{
      margin: 0 0 0 20px;
    }
  }

  .advance-bonus{
    margin-right: 40px;
    margin-top: 15px;
    float: right;
  }
  .advance-bonus-single{
    margin-right: 40px;
    margin-top: 20px;
    float: right;
  }

  .bc-play-select-area {
    min-height: 70px;

    .bc-advance-rules {
      color: #666666;
      width: 80%;
      .tab-toolbar {
        &:last-of-type {
          margin-bottom: 3px;
        }
      }
    }

    .tab-toolbar {
      .tab-group {
        margin-left: 100px;
        .tab {
          font-size: 14px;
        }
      }
    }
    .bc-advance-mode-main{
      width: 20%;
      font-size: $font-xs;
      color: $inverse-color;
    }
  }
</style>
