<template>
  <div :class="'width-100 bc-play-main ' + wrapperClass">
    <betting-rules :initial-rules="playLevels"></betting-rules>
    <div class="bc-play-container clearfix">
      <div class="bc-play-left basic-inverse pull-left">
        <div class="bc-play-select-area clearfix">
          <betting-advance-rules></betting-advance-rules>
          <div class="pull-right bc-advance-mode-main">
            <div class="advance-bouns">
              单注奖金：<span class="font-md text-prominent">{{bettingChoice.fBetBonus}}</span>元
            </div>
            <a class="advance-play-des" ref="playExample">
              <span class="sfa sfa-bc-light vertical-middle"></span>
              玩法说明
            </a>
          </div>
        </div>
        <div class="bc-line"></div>
        <div class="m-LR-smd">
          <div class="bc-play-area clearfix" :class="!_.isEmpty(playRule) ? 'loaded' : ''">
            <betting-play-area-select :play-rule="playRule" :mark6-ticket-id-arr="mark6TicketIdArr" :ticket-info="ticketInfo" ref="areaSelect" v-if="!_.isEmpty(playRule) && playRule.type === 'select'"></betting-play-area-select>
            <betting-play-area-input :play-rule="playRule" ref="areaInput" v-else-if="!_.isEmpty(playRule) && playRule.type === 'input'"></betting-play-area-input>
            <div class="height-100" v-html="loading" v-else></div>
          </div>
        </div>

        <div class="div-line"></div>

        <div class="m-LR-smd m-top-md m-bottom-md">
          <div class="form-inline m-TB-xs">
            <select name="unit" class="select-default bc-unit-select" v-model="unit">
              <option value="10000">元</option>
              <option value="1000">角</option>
              <option value="100">分</option>
              <option value="10">厘</option>
            </select>
            <div class="inline-block m-left-smd">
              <span class="vertical-middle bc-multi-range inline-block" ref="multiRange"></span>
              <label class="m-left-xs">倍</label>
            </div>

            <div class="inline-block m-left-smd">
              <span>共</span>
              <span class="text-pleasant font-sm font-bold">{{bettingChoice.statistics}}</span>
              <span>注，金额</span>
              <span class="text-prominent font-sm font-bold">{{bettingChoice.fPrefabMoney}}</span>
              <span>元</span>
            </div>
            <select name="" class="m-left-smd bc-vouchers-select">
              <option value="">使用代金券</option>
            </select>
            <div class="pull-right m-right-sm">
              <button class="btn btn-orange bc-md-btn m-bottom-xs" data-loading-text="提交中" @click="lotteryBuy"
                      :disabled="!bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-btn-icon-bolt vertical-middle"></span>
                快捷投注
              </button>
              <button class="btn btn-cool bc-md-btn m-bottom-xs" @click="lotteryAdd" :disabled="!bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-btn-icon-add vertical-middle"></span> 添加号码
              </button>
            </div>
          </div>
        </div>

        <div class="m-bottom-xs m-left-md">
          <div class="clearfix bc-margin-xs">
            <div class="bc-lottery-preview border-table-all" ref="lotteryPreview"></div>
            <div class="overflow-hidden font-sm m-top-md p-top-sm text-center bc-operate-section clearfix">
                <span>
                  <span>预期盈利</span>
                  <span class="js-bc-total-rebateMoney text-prominent font-bold">0</span>
                  <span>元，</span>
                </span>
              <span>
                  <span>总投注 【</span>
                  <span class="js-bc-total-lottery text-pleasant font-bold">0</span>
                  <span>】 注， </span>
                </span>
              <span>
                  <span>总金额</span>
                  <span class="js-bc-total-money text-prominent m-left-xs m-right-xs font-bold">0</span>
                  <span>元</span>
                </span>
              <button class="js-bc-chase bc-chase btn-link inline-block cursor-pointer m-left-md relative" :disabled="!bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-checkmark vertical-middle"></span>
                我要追号
                <span class="ba-chase-tip">追号能提高中奖率</span>
              </button>
            </div>
            <div class="m-top-md p-top-sm text-center m-bottom-md">
              <button class="js-bc-btn-lottery-confirm btn btn-orange bc-jb-btn"
                      data-loading-text="提交中" :disabled="!bettingInfo.sale || bettingInfo.pending"> 确认投注
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref="bcSideArea" class="bc-side-area pull-right"></div>
    </div>
    <div class="bc-bottom-area js-bc-records"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as types from 'mutation-types'
  import betRulesConfig from 'bettingCenter/misc/betRulesConfig'

  //backbone旧组件
  import HisAnalysisView from './bettingCenter-historical-analysis'

  import bettingRules from './betting-rules'
  import bettingAdvanceRules from './betting-advance-rules'
  import bettingPlayAreaSelect from './betting-play-area-select'
  import bettingPlayAreaInput from './betting-play-area-input'

  let lotteryPreview
  let recordsOpenView

  export default {
    name: "betting-main-area",
    props: {
      ticketInfo: Object,
      mark6TicketIdArr: Array,
    },
    components: {
      bettingRules,
      bettingAdvanceRules,
      bettingPlayAreaSelect,
      bettingPlayAreaInput,
    },
    data() {
      return {
        wrapperClass: _.indexOf(this.mark6TicketIdArr, parseInt(this.ticketInfo.info.id)) > -1 ? 'mark6' : '',
        loading: Global.ui.loader.get(),
        unit: 10000,
        playRule: {}
      }
    },
    computed: mapState({
      playLevels: function() {
        return this.$store.getters.playLevels
      },
      limitMoney: 'rulesList.limitMoney',
      bettingChoice: 'bettingChoice',
      bettingInfo: 'bettingInfo',
    }),

    watch: {
      'bettingChoice.playId': {
        handler: function(newVal, oldVal) {
          this.playRule = betRulesConfig.get(newVal)

          recordsOpenView.updateByPlayRule(this.playRule)

          this.$store.commit(types.SET_CHECKOUT_CHOICE)

          const playInfo = this.$store.getters.playInfo(newVal, this.bettingChoice.groupId);

          this.$store.commit(types.SET_PLAY_INFO, playInfo)

          // 中奖举例
          if ($(this.$refs.playExample).data('popover')) {
            $(this.$refs.playExample).popover('destroy')
          }
          $(this.$refs.playExample).popover({
            trigger: 'hover',
            container: this.$el,
            html: true,
            content: `<div><span class="font-bold">玩法说明：</span>${playInfo.playDes}</div><div><span class="font-bold">中奖举例：</span>${playInfo.playExample.replace(/\|/g, '<br />')}</div>`,
            placement: 'bottom',
          })
        },
      },
      'bettingInfo.lastOpenId': {
        handler: function(newVal, oldVal) {
          recordsOpenView.update()
        }
      },
      unit: {
        handler: function(newVal, oldVal) {
          this.$store.commit(types.SET_UNIT, newVal)
        }
      },
    },

    methods: {
      lotteryBuy(e) {
        if (!this.bettingChoice.multiple) {
          Global.ui.notification.show('倍数为0，不能投注')
          return false
        }

        // this.rulesCollection.getPlayGroups(this.bettingChoice.levelId)
        // this.model.set({
        //   maxBetNums: this.rulesCollection.getPlayInfo(this.model.get('groupId'), this.model.get('playId')).maxBetNums,
        // })
        if (this.playRule.type === 'select') {
          this.$_addSelectLottery({ buy: true })
        } else {
          this.addInputLottery({ buy: true })
        }
        // do save
        const info = this.model.pick('buyInfo', 'buyList')
        let planId = self.infoModel.get('planId')
        const inputCount = _(info.buyList).reduce((_inputCount, previewInfo) => {
          if (previewInfo.type === 'input') {
            _inputCount += previewInfo.statistics
          }
          return _inputCount
        }, 0)

        if (inputCount > 100000) {
          Global.ui.notification.show('非常抱歉，目前平台单式投注只支持最多10万注单。')
          return false
        }
        if (_.isEmpty(info.buyList)) {
          Global.ui.notification.show('请至少选择一注投注号码！')
          return false
        }

        // 腾讯分分彩，金额限制1000元
        if (this.options.ticketId === 31 && _(info.buyInfo.totalMoney).formatDiv(10000) > ticketConfig.getComplete(31).info.betAmountLimit) {
          Global.ui.notification.show(`试运行期间，每期单笔投注不超过${ticketConfig.getComplete(31).info.betAmountLimit}元。`)
          this.model.emptyBuyBetting()
          return false
        }

        if (info.buyInfo.totalMoney > Global.memoryCache.get('acctInfo').balance + (Number(this.$userRedPackBtn.data('type')) === 1 ? (this.redMomey * 10000) : 0)) {
          Global.ui.notification.show('账号余额不足，请先<a href="#fc/re" class="router btn-link btn-link-hot"  data-dismiss="modal">充值</a>。')
          this.model.emptyBuyBetting()
          return false
        }

        if (Global.memoryCache.get('acctInfo').foundsLock) {
          Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" ' +
            'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
          return false
        }
        const maxBetNums = this.model.get('maxBetNums')
        if (maxBetNums && !_.isNull(maxBetNums) && Number(info.buyList[0].statistics) > maxBetNums) {
          Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${maxBetNums} 注，请重新选择  `)
          this.model.emptyBuyBetting()
          return false
        }

        // const commit_ticketInfo = this.options.ticketInfo
        // const commit_ticketName = this.options.ticketName
        // const commit_buyInfo = this.model.get('buyInfo')

        // $target.button('loading')
        self.model.buyBettingXhr(planId)
          .always(() => {
            $target.button('reset')
          })
          .done((res) => {
            if (res && res.result === 0) {
              self.bettingRecordsView.update()
              self.model.emptyBuyBetting()

              Global.m.oauth.check()

              Global.ui.notification.show('投注成功！', {
                type: 'success',
                hasFooter: false,
                displayTime: 800,
              })
              self.getUsePackStatus()
              // Global.ui.notification.show(self.commitTpl({
              //   ticketInfo: commit_ticketInfo,
              //   ticketName: commit_ticketName,
              //   planId: planId,
              //   totalInfo: commit_buyInfo
              // }), {
              //   hasFooter: false,
              //   displayTime:2000
              // });
            } else if (res.root && res.root.errorCode === 101) {
              Global.ui.notification.show('账号余额不足，请先<a href="#fc/re" class="router btn-link btn-link-hot"  data-dismiss="modal">充值</a>。')
              self.model.emptyBuyBetting()
            } else {
              Global.ui.notification.show(res.msg || '')
              self.model.emptyBuyBetting()
            }
          })

        function changePlanId(model, newPlanId) {
          planId = newPlanId
          // confirm.element.find('.js-bc-confirm-planId').text(planId);
        }
        this.infoModel.off('change:planId', changePlanId).on('change:planId', changePlanId)
      },

      $_addSelectLottery(opt) {
        const result = this.$refs.areaSelect.addBetting(opt)

        //提交成功
        if (result) {
          if (!_.isEmpty(result)) {
            if (result.MaxBetNums && !_.isNull(result.MaxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.MaxBetNums} 注，请重新选择  `)
            } else {
              Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加')
              this.$store.commit(types.SET_CHOICE_EMPTY)
            }
          } else {
            this.$store.commit(types.SET_CHOICE_EMPTY)
          }
        } else {
          Global.ui.notification.show('号码选择不完整，请重新选择！')
        }
      },

      $_addInputLottery(opt) {
        const result= this.$refs.areaInput.addBetting(opt)

        if (result) {
          if (!_.isEmpty(result)) {
            if (result.MaxBetNums && !_.isNull(result.MaxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.MaxBetNums} 注，请重新选择  `)
            } else {
              Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加')
            }
          }
          const html = ['<div class=" max-height-smd overflow-auto">']
          if (!_.isEmpty(bettingInfo.repeatNumbers)) {
            html.push(`<p class="word-break">以下号码重复，已进行自动过滤<br />${bettingInfo.repeatNumbers.join(',')}</p>`)
          }
          if (!_.isEmpty(bettingInfo.errorNumbers)) {
            html.push(`<p class="word-break">以下号码错误，已进行自动过滤<br />${bettingInfo.errorNumbers.join(',')}</p>`)
          }
          html.push('</div>')

          if (html.length > 2) {
            Global.ui.notification.show(html.join(''))
          }

          this.currentPlayAreaView.empty()
        } else {
          Global.ui.notification.show('号码选择不完整，请重新选择！')
        }
      },

      lotteryAdd(e) {
        if (!this.bettingChoice.multiple) {
          Global.ui.notification.show('倍数为0，不能投注')
          return false
        }

        if (this.playRule.type === 'select') {
          this.$_addSelectLottery()
        } else {
          this.$_addInputLottery()
        }
        // this.selectBcItemHandler()
      },
    },

    mounted: function() {
      $(this.$refs.multiRange).numRange({
        onChange: (num) => {
          this.$store.commit(types.SET_MULTIPLE, num)
        },
        onOverMax(maxNum) {
          Global.ui.notification.show(`您填写的倍数已超出平台限定的单注中奖限额<span class="text-pleasant">${
              _(this.limitMoney).convert2yuan()}</span>元，` +
            `已为您计算出本次最多可填写倍数为：<span class="text-pleasant">${maxNum}</span>倍`)
        },
      })

      lotteryPreview = $(this.$refs.lotteryPreview).staticGrid({
        tableClass: 'table table-dashed',
        colModel: [
          {
            label: '玩法', name: 'title', key: true, width: '15%',
          },
          {
            label: '投注内容', name: 'betNum', key: true, width: '17%',
          },
          { label: '注数', name: 'note', width: '10%' },
          { label: '倍数', name: 'multiple', width: '12.5%' },
          { label: '模式', name: 'mode', width: '12.5%' },
          { label: '投注金额', name: 'bettingMoney', width: '12.5%' },
          { label: '预期盈利', name: 'profit', width: '12.5%' },
          { label: '<div class="js-bc-lottery-clear bc-lottery-clear m-left-sm cursor-pointer">清除</div>', name: 'operate', width: '8%' },
        ],
        height: 110,
        startOnLoading: false,
        emptyTip: '暂未添加选号',
      }).staticGrid('instance')


      recordsOpenView = new HisAnalysisView({
        el: this.$refs.bcSideArea,
        ticketId: this.ticketInfo.info.id,
      }).render()
    }
  }
</script>

<style scoped>
.bc-chase {
  text-decoration: none;
  font-size: 12px;
  color: #666666;
}
</style>
