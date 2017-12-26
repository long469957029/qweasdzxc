<template>
  <div :class="'width-100 bc-play-main ' + wrapperClass">
    <betting-rules :initial-rules="playLevels"></betting-rules>

    <div class="bc-play-container clearfix">
      <div class="bc-play-left basic-inverse pull-left">
        <div class="bc-play-select-area clearfix">
          <betting-advance-rules v-show="advanceShowMode === 'classic'" @modeChange="modeChange"></betting-advance-rules>

          <div class="bc-advance-mode-single" v-show="advanceShowMode === 'single'">玩法说明：{{playInfo.playDes}}
            <a class="advance-play-des" ref="winningExample">
              <span class="sfa sfa-bc-light vertical-middle"></span>
              中奖示例
            </a>
          </div>

          <div class="pull-right bc-advance-mode-main">
            <div :class="advanceShowMode === 'single' ? 'advance-bonus-single' : 'advance-bonus'">
              单注奖金：<span class="text-prominent">{{bettingChoice.fBetBonus}}</span>元
            </div>
            <a class="advance-play-des font-md" ref="playExample" v-show="advanceShowMode === 'classic'">
              <span class="sfa sfa-bc-light vertical-middle"></span>
              玩法说明
            </a>
          </div>
        </div>
        <div class="bc-line"></div>
        <div class="m-LR-smd">
          <div class="bc-play-area clearfix" :class="!_.isEmpty(playRule) ? 'loaded' : ''">
            <betting-play-area-select :play-rule="playRule" :mark6-ticket-id-arr="mark6TicketIdArr" :ticket-info="ticketInfo" ref="areaSelect" v-if="!_.isEmpty(playRule) && playRule.type === 'select'">
                <div slot="lastMissNum" class="js-bc-missOption bc-missOption-btn active">当前遗漏</div>
                <div slot="maxMissNum" class="js-bc-missOption bc-missOption-btn">最大遗漏</div>
                <div slot="autoAdd" class="bc-missOption-btn" data-times="1" @click="autoAdd(1)">机选一注</div>
            </betting-play-area-select>
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
              <span class="text-pleasant font-sm">{{bettingChoice.statistics}}</span>
              <span>注，金额</span>
              <span class="text-prominent font-sm">{{bettingChoice.fPrefabMoney}}</span>
              <span>元</span>
            </div>
            <select name="" class="m-left-smd bc-vouchers-select">
              <option value="">使用代金券</option>
            </select>
            <div class="pull-right m-right-sm">
              <button class="btn btn-orange bc-md-btn m-bottom-xs" data-loading-text="提交中" @click="lotteryBuy"
                      :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-btn-icon-bolt vertical-middle"></span>
                快捷投注
              </button>
              <button class="btn btn-cool bc-md-btn m-bottom-xs" @click="lotteryAdd" :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-btn-icon-add vertical-middle"></span> 添加号码
              </button>
            </div>
          </div>
        </div>

        <div class="m-bottom-xs m-left-md">
          <div class="clearfix bc-margin-xs">
            <static-grid :wrapper-class="lotteryGridOps.wrapperClass" :col-model="lotteryGridOps.colModel" :height="lotteryGridOps.height" :emptyTip="lotteryGridOps.emptyTip" :rows="fPreviewList" ref="lotteryGrid"></static-grid>
            <div class="overflow-hidden font-sm m-top-md p-top-sm text-center bc-operate-section clearfix">
                <span>
                  <span>预期盈利</span>
                  <span class="text-prominent">{{bettingChoice.totalInfo.fTotalBetBonus}}</span>
                  <span>元，</span>
                </span>
              <span>
                  <span>总投注 【</span>
                  <span class="text-pleasant">{{bettingChoice.totalInfo.totalLottery}}</span>
                  <span>】 注， </span>
                </span>
              <span>
                  <span>总金额</span>
                  <span class="text-prominent m-left-xs m-right-xs">{{bettingChoice.totalInfo.fTotalMoney}}</span>
                  <span>元</span>
                </span>
              <button class="js-bc-chase bc-chase btn-link inline-block cursor-pointer m-left-md relative" :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
                <span class="sfa sfa-checkmark vertical-middle"></span>
                我要追号
                <span class="ba-chase-tip" @click="bettingChase">追号能提高中奖率</span>
              </button>
            </div>
            <div class="m-top-md p-top-sm text-center m-bottom-md">
              <button class="btn btn-orange bc-jb-btn" @click="lotteryConfirm"
                      data-loading-text="提交中" :disabled="pushing || !bettingInfo.sale || bettingInfo.pending"> 确认投注
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="bc-side-area pull-right" ref="bcSideArea"></div>
    </div>
    <div class="bc-bottom-area" ref="recordsContainer"></div>


    <!-- 追号 -->
    <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="chaseModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">×</span>
            </button>
            <h4 class="modal-title">
              <span class="portlet-icon sfa sfa-sub-title-user vertical-sub"></span> 追号
            </h4>
          </div>
          <div class="modal-body basic-inverse p-top-xs no-p-left no-p-right no-p-bottom">
            <betting-chase :ticket-id="ticketId" :limit-money="bettingChoice.limitMoney" :ticket-info="ticketInfo"
                           :planId="bettingInfo.planId" :preview-list="bettingChoice.previewList"
                           :total-lottery="bettingChoice.totalLottery" ref="bettingChase"
            ></betting-chase>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import betRulesConfig from 'bettingCenter/misc/betRulesConfig'
  import ticketConfig from 'skeleton/misc/ticketConfig'


  import BettingRules from './betting-rules'
  import BettingAdvanceRules from './betting-advance-rules'
  import BettingPlayAreaSelect from './betting-play-area-select'
  import BettingPlayAreaInput from './betting-play-area-input'
  import BettingChase from './betting-chase'


  //backbone旧组件
  import HisAnalysisView from './bettingCenter-historical-analysis'
  import BettingRecordsView from './bettingCenter-records'
  import confirmTpl from '../templates/bettingCenter-confirm.html'

  let recordsOpenView
  let bettingRecordsView

  export default {
    name: "betting-main-area",
    props: {
      ticketInfo: Object,
      mark6TicketIdArr: Array,
      ticketId: Number,
    },
    components: {
      StaticGrid,
      BettingRules,
      BettingAdvanceRules,
      BettingPlayAreaSelect,
      BettingPlayAreaInput,
      BettingChase,
    },
    data() {
      return {
        wrapperClass: _.indexOf(this.mark6TicketIdArr, parseInt(this.ticketId)) > -1 ? 'mark6' : '',
        loading: Global.ui.loader.get(),
        unit: 10000,
        playRule: {},
        playInfo: {},
        //提交中，禁用按钮
        pushing: false,

        lotteryGridOps: {
          wrapperClass: 'bc-lottery-preview table table-dashed',
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
            { label: '预期盈利', name: 'bonus', width: '12.5%' },
            { label: `<div class="js-lottery-clear bc-lottery-clear m-left-sm cursor-pointer">清除</div>`, name: 'operate', width: '8%' },
          ],
          height: 110,
          emptyTip: '暂未添加选号',
        },
        fPreviewList: [],

        advanceShowMode: 'classic', //classic | single
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
          bettingRecordsView.update()
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
              bettingRecordsView.update()

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

            bettingRecordsView.update()

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
                  // this.bettingRecordsView.update()
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


        // chaseView.on('submit:complete', () => {
        //   self.model.emptyPrevBetting()
        //   self.bettingRecordsView.update()
        //   $dialog.modal('hide')
        // })
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

      bettingRecordsView = new BettingRecordsView({
        el: this.$refs.recordsContainer,
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
    display: block;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    line-height: 23px;
    margin-right: 15px;
    color: #8094A6;
    float: right;
    text-align: center;
  }

  .bc-advance-mode-single {
    float: left;
    color: $prominent-secondary-btn-color;
    margin: 20px 0 0 20px;
    .advance-play-des{
      margin-left: 20px;

    }
  }

  .advance-bonus{
    margin-right: 40px;
    margin-top: 20px;
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
      }
    }
    .bc-advance-mode-main{
      width: 20%;
      font-size: $font-xs;
      color: $inverse-color;
    }
  }
</style>
