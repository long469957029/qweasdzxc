<template>
  <div class="width-100 bc-play-main">
    <betting-rules :initial-rules="playLevels"></betting-rules>

    <div class="bc-play-container clearfix">
      <div class="bc-play-left basic-inverse pull-left">
        <betting-advance-rules class="hidden"></betting-advance-rules>
        <div class="m-LR-smd">
          <div class="bc-play-area clearfix" :class="!_.isEmpty(playRule) ? 'loaded' : ''">
            <betting-play-area-handicap :play-rule="playRule" :ticket-info="ticketInfo" ref="area"></betting-play-area-handicap>
          </div>
        </div>

        <div class="m-LR-smd m-top-md m-bottom-md">
          <div class="form-inline m-TB-xs">
            <div class="pull-right m-right-sm">
              <button class="btn btn-orange bc-md-btn m-bottom-xs" data-loading-text="提交中" @click="lotteryBuy"
                      :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-btn-icon-bolt vertical-middle"></span>
                投注
              </button>
              <button class="btn btn-cool bc-md-btn m-bottom-xs" @click="lotteryAdd" :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-btn-icon-add vertical-middle"></span> 重置
              </button>
            </div>
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
  import ticketConfig from 'skeleton/misc/ticketConfig'


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

          // 中奖举例
          if ($(this.$refs.playExample).data('popover')) {
            $(this.$refs.playExample).popover('destroy')
          }
          if ($(this.$refs.winningExample).data('popover')) {
            $(this.$refs.winningExample).popover('destroy')
          }

          $(this.$refs.playExample).popover({
            trigger: 'hover',
            container: this.$el,
            html: true,
            content: `<div><span class="font-bold">玩法说明：</span>${playInfo.playDes}</div><div><span class="font-bold">中奖举例：</span>${playInfo.playExample.replace(/\|/g, '<br />')}</div>`,
            placement: 'bottom',
          })

          $(this.$refs.winningExample).popover({
            trigger: 'hover',
            container: this.$el,
            html: true,
            content: `<div><span class="font-bold">中奖举例：</span>${playInfo.playExample.replace(/\|/g, '<br />')}</div>`,
            placement: 'bottom',
          })


          //提示框变化, 暂时这么写
          $('.js-bc-confirm-planId').text(newVal)
        },
      },
      'bettingInfo.planId': {
        handler: function(newPlanId, oldPlanId) {
          if (oldPlanId !== '------------' && !this.bettingInfo.pending) {
            Global.ui.notification.show(
              `<span class="text-danger">${oldPlanId}</span>期已截止<br/>当前期为<span class="text-danger">${newPlanId}</span>期<br/>投注时请注意期号！`,
              { id: 'ticketNotice', hasFooter: false, displayTime: 800 },
            )
          }
        }
      },
      'bettingInfo.lastOpenId': {
        handler: function() {
          recordsOpenView.update()
        }
      },
      unit: {
        handler: function(newVal) {
          this.$store.commit(types.SET_UNIT, newVal)
        }
      },
      'bettingChoice.formatMaxMultiple': {
        handler: function(newVal) {
          $(this.$refs.multiRange).numRange('setRange', 1, newVal)
        }
      },
      'bettingChoice.previewList': {
        handler: function(previewList) {
          this.fPreviewList = _(previewList).map(function(previewInfo, index) {
            const title = `${previewInfo.levelName}_${previewInfo.playName}`
            let betNum = ''
            if (previewInfo.formatBettingNumber.length > 20) {
              betNum = `<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link">${
                previewInfo.formatBettingNumber.slice(0, 20)}...</a>`
            } else {
              betNum = previewInfo.formatBettingNumber
            }
            const multipleDiv = `<div class="js-bc-preview-multiple-${index} p-top-xs"></div>`
            const modeSelect = `<select name="" class="js-bc-preview-unit select-default bc-unit-select-add">
              <option value="10000" ${previewInfo.unit === 10000 ? 'selected' : ''}>元</option>
              <option value="1000" ${previewInfo.unit === 1000 ? 'selected' : ''}>角</option>
              <option value="100" ${previewInfo.unit === 100 ? 'selected' : ''}>分</option>
              <option value="10" ${previewInfo.unit === 10 ? 'selected' : ''}>厘</option>
            </select>`

            return {
              title,
              betNum,
              note: `${previewInfo.statistics}注`,
              multiple: multipleDiv,
              // multiple: previewInfo.multiple,
              mode: modeSelect,
              bettingMoney: `${previewInfo.fPrefabMoney}元`,
              bonus: `${previewInfo.fBetBonus}元`,
              operate: `<div class="js-lottery-delete lottery-preview-del icon-block m-right-md pull-right" data-index="${index}"></div>`,
            }
          }, this)

          this.$nextTick(() => {
            this.$refs.lotteryGrid.getRows().forEach((row, index) => {
              const $row = $(row)
              const $detail = $row.find('.js-bc-betting-preview-detail')
              const $multipleAdd = $row.find(`.js-bc-preview-multiple-${index}`)
              let betNumber = previewList[index].bettingNumber
              if (_.indexOf(this.mark6TicketIdArr, parseInt(this.ticketId, 10)) > -1) {
                // 六合彩、无限六合彩
                // 特码-两面，特码-色波，正码-两面1，正码-两面2，正码-两面3，正码-两面4，正码-两面5，正码-两面6，生肖-特肖，生肖-一肖，头尾-头尾，总和-总和
                const tm_zm_sx_tw_zh_playIdArr = betRulesConfig.getMark6SpecialInfo().tm_zm_sx_tw_zh_playIdArr
                if (_.indexOf(tm_zm_sx_tw_zh_playIdArr, this.bettingChoice.playId) > -1) {
                  betNumber = previewList[index].formatBettingNumber
                }
              }

              if ($multipleAdd.numRange('instance')) {
                $multipleAdd.numRange('setRange', 1, previewList[index].formatMaxMultiple)
              } else {
                $multipleAdd.numRange({
                  defaultValue: previewList[index].multiple,
                  size: 'md',
                  max: previewList[index].formatMaxMultiple,
                  onChange: (num) => {
                    this.$store.commit(types.SET_PREVIEW_MULTIPLE, {num, index})
                  },
                  onOverMax: (maxNum) => {
                    //奖金限额一致
                    Global.ui.notification.show(`您填写的倍数已超出平台限定的单注中奖限额<span class="text-pleasant">
                  ${_(this.bettingChoice.limitMoney).convert2yuan()}</span>元，已为您计算出本次最多可填写倍数为：<span class="text-pleasant">${maxNum}</span>倍`)
                  },
                })
              }

              if ($detail.length) {
                $detail.popover({
                  title: '详细号码',
                  trigger: 'click',
                  html: true,
                  container: 'body',
                  content: `<div class="js-pf-popover">${betNumber}</div>`,
                  placement: 'right',
                })
              }
            });

            // $(this.$refs.lotteryPreview).scrollTop(0)
          })

          this.$store.commit(types.CALCULATE_TOTAL)
        },
        deep: true
      }
    },

    methods: {

      modeChange(mode) {
        this.advanceShowMode = mode
      },

      autoAdd(times) {
        if (!this.bettingChoice.multiple) {
          Global.ui.notification.show('倍数为0，不能投注')
          return false
        }

        const lotteryResults = this.$refs.areaSelect.create(times)

        this.$_addSelectLottery({
          type: 'auto',
          results: lotteryResults
        })
      },

      lotteryBuy() {
        if (!this.bettingChoice.multiple) {
          Global.ui.notification.show('倍数为0，不能投注')
          return false
        }

        if (this.playRule.type === 'select') {
          this.$_addSelectLottery({ type: 'buy' })
        } else {
          this.$_addInputLottery({ type: 'buy' })
        }

        //do save
        let planId = this.bettingInfo.planId
        const inputCount = _(this.bettingChoice.buyList).reduce((_inputCount, previewInfo) => {
          if (previewInfo.type === 'input') {
            _inputCount += previewInfo.statistics
          }
          return _inputCount
        }, 0)

        if (inputCount > 100000) {
          Global.ui.notification.show('非常抱歉，目前平台单式投注只支持最多10万注单。')
          return false
        }
        if (_.isEmpty(this.bettingChoice.buyList)) {
          Global.ui.notification.show('请至少选择一注投注号码！')
          return false
        }

        // 腾讯分分彩，金额限制1000元
        if (this.ticketId === 31 && _(this.bettingChoice.buyInfo.totalMoney).formatDiv(10000) > ticketConfig.getComplete(31).info.betAmountLimit) {
          Global.ui.notification.show(`试运行期间，每期单笔投注不超过${ticketConfig.getComplete(31).info.betAmountLimit}元。`)
          this.$store.commit(types.EMPTY_BUY_BETTING)
          return false
        }

        if (Global.memoryCache.get('acctInfo').foundsLock) {
          Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" ' +
            'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
          return false
        }
        const maxBetNums = this.bettingChoice.playInfo.maxBetNums
        if (maxBetNums && !_.isNull(maxBetNums) && Number(this.bettingChoice.buyList[0].statistics) > maxBetNums) {
          Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${maxBetNums} 注，请重新选择  `)
          this.$store.commit(types.EMPTY_BUY_BETTING)
          return false
        }

        this.pushing = true

        this.$store.dispatch('pushBetting', {
          planId,
          type: 'buyList'
        })
          .catch(() => {
            this.pushing = false
          })
          .then((res) => {
            this.pushing = false
            if (res && res.result === 0) {

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

      lotteryConfirm() {
        let planId = this.bettingInfo.planId

        const inputCount = _(this.bettingChoice.previewList).reduce((_inputCount, previewInfo) => {
          if (previewInfo.type === 'input') {
            _inputCount += previewInfo.statistics
          }
          return _inputCount
        }, 0)

        if (inputCount > 100000) {
          Global.ui.notification.show('非常抱歉，目前平台单式投注只支持最多10万注单。')
          return false
        }

        if (_.isEmpty(this.bettingChoice.previewList)) {
          Global.ui.notification.show('请至少选择一注投注号码！')
          return false
        }


        // 腾讯分分彩，金额限制1000元
        if (this.ticketId === 31 && this.bettingChoice.totalInfo.fTotalMoney > ticketConfig.getComplete(31).info.betAmountLimit) {
          Global.ui.notification.show(`试运行期间，每期单笔投注不超过${ticketConfig.getComplete(31).info.betAmountLimit}元。`)
          return false
        }

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
            planId: this.bettingInfo.playId,
            totalInfo: this.bettingChoice.totalInfo,
            previewList: this.bettingChoice.previewList,
          }),
          size: 'bc-betDetail-confirm-dialog',
          agreeCallback: () => {
            this.pushing = true

            this.$store.dispatch('pushBetting', {
              planId,
              type: 'previewList'
            })
              .catch(() => {
                this.pushing = false
              })
              .then((res) => {
                this.pushing = false

                if (res && res.result === 0) {
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

      bettingChase() {
        if (_.isEmpty(this.bettingChoice.previewList)) {
          Global.ui.notification.show('请至少选择一注投注号码！')
          return
        }

        // 腾讯分分彩，金额限制1000元
        if (this.ticketId === 31 && this.bettingChoice.totalInfo.fTotalMoney > ticketConfig.getComplete(31).info.betAmountLimit) {
          Global.ui.notification.show(`试运行期间，每期单笔投注不超过${ticketConfig.getComplete(31).info.betAmountLimit}元。`)
          return false
        }

        if (Global.memoryCache.get('acctInfo').foundsLock) {
          Global.ui.notification.show('资金已锁定，请先<a id="js-open-fc-unlock" href="javascript:void(0);" ' +
            'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
          return false
        }


        this.$refs.bettingChase.init()

        $(this.$refs.chaseModal).modal({
          backdrop: 'static',
        })
          .on('hidden.modal', function() {
            // chaseView.destroy()
          })
      },

      lotteryClear() {
        this.$store.commit(types.EMPTY_PREV_BETTING)
      },

      lotteryDelete(index) {
        this.$store.commit(types.EMPTY_PREV_BETTING, {
          index
        })
      },

      lotteryPreviewUnitChange(index, unit) {
        this.$store.commit(types.CHANGE_PREV_BETTING, {
          index,
          unit: Number(unit)
        })
      },

      $_emptySelect() {
        if (this.playRule.type === 'select') {
          this.$refs.areaSelect.empty()
        } else {
          this.$refs.areaInput.empty()
        }
      },

      $_addSelectLottery(opt) {
        this.$refs.areaSelect.addBetting(opt)

        const result = this.bettingChoice.addPrevBetResult
        //提交成功
        if (result) {
          if (!_.isEmpty(result)) {
            if (result.MaxBetNums && !_.isNull(result.MaxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.MaxBetNums} 注，请重新选择  `)
            } else {
              Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加')
              this.$refs.areaSelect.empty()
            }
          } else {
            this.$refs.areaSelect.empty()
          }
        } else {
          Global.ui.notification.show('号码选择不完整，请重新选择！')
        }
      },

      $_addInputLottery(opt) {
        const bettingInfo = this.$refs.areaInput.addBetting(opt)

        const result = this.bettingChoice.addPrevBetResult
        if (result) {
          if (!_.isEmpty(result)) {
            if (result.MaxBetNums && !_.isNull(result.MaxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.MaxBetNums} 注，请重新选择`)
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

          this.$refs.areaInput.empty()
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
      },
    },

    mounted: function() {
      $(this.$refs.multiRange).numRange({
        onChange: (num) => {
          this.$store.commit(types.SET_MULTIPLE, num)
        },
        onOverMax: (maxNum) => {
          Global.ui.notification.show(`您填写的倍数已超出平台限定的单注中奖限额<span class="text-pleasant">${
              _(this.bettingChoice.limitMoney).convert2yuan()}</span>元，` +
            `已为您计算出本次最多可填写倍数为：<span class="text-pleasant">${maxNum}</span>倍`)
        },
      })

      $(this.$el).on('click', '.js-lottery-clear', this.lotteryClear)
        .on('click', '.js-lottery-delete', (e) => {
          this.lotteryDelete($(e.currentTarget).closest('tr').index())
        })
        .on('change', '.js-bc-preview-unit', (e) => {
          this.lotteryPreviewUnitChange($(e.currentTarget).closest('tr').index(), e.currentTarget.value)
        })

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
