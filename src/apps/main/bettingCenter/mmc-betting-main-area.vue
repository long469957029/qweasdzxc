<template>
  <div class="width-100 bc-play-main">
    <div class="relative">
      <div class="sfa sfa-mmc-outer-border"></div>
      <div class="sfa-mmc-content-top opening-panel-inner">
        <span class="sfa sfa-bc-ssc-mmc"></span>
        <div class="opening-wrapper sfa-mmc-opening-panel">
          <div class="opening-flash" :class="`sfa-mmc-opening-flash-${flashIndex}`"></div>
          <div class="opening-content">
            <span class="opening-unit"></span>
            <span class="opening-unit"></span>
            <span class="opening-unit"></span>
            <span class="opening-unit"></span>
            <span class="opening-unit"></span>
          </div>
          <div class="sfa-mmc-simulation-btn"></div>
        </div>

        <div class="bc-entry-list pull-right m-right-md">
          <router-link :to="{name: 'analysis', params: {ticketId: ticketInfo.id}}" target="_blank"
                       class="entry-list-open">
            <!--跳转到历史分析-->
            <span class="sfa sfa-bc-icon-open-num vertical-middle"></span>
            开奖号码
          </router-link>
          <a :href="`trend.html?ticketId=${ticketInfo.id}`" target="_blank" class="entry-list-trend">
            <span class="sfa sfa-bc-icon-trend vertical-middle"></span>
            号码走势
          </a>
          <router-link :to="`#hc?page=${ticketInfo.type}`" class="router entry-list-des">
            <span class="sfa sfa-bc-icon-des vertical-middle"></span>
            游戏说明
          </router-link>
        </div>
      </div>
    </div>
    <div class="mmc-lottery-main">
      <div class="mmc-lottery-main-inner">

        <div class="bc-play-container clearfix">
          <div class="bc-play-left pull-left">
            <betting-rules class="inline-block" :component-type="componentType" :initial-rules="playLevels"></betting-rules>
            <div class="bc-play-select-area clearfix">
              <betting-advance-rules v-show="advanceShowMode === 'classic'"
                                     @modeChange="modeChange"></betting-advance-rules>

              <div class="bc-advance-mode-single" v-show="advanceShowMode === 'single'">
                <div class="bc-play-des">玩法说明：{{playInfo.playDes}}</div>
                <a class="advance-play-des" ref="winningExample">
                  <span class="sfa sfa-bc-light vertical-middle"></span>
                  中奖示例
                </a>
              </div>

              <div class="pull-right bc-advance-mode-main">
                <div :class="advanceShowMode === 'single' ? 'advance-bonus-single' : 'advance-bonus'">
                  单注奖金：
                  <animated-integer class="text-prominent font-sm" :value="bettingChoice.fBetBonus"></animated-integer>
                  元
                </div>
                <a class="advance-play-des" ref="playExample" v-show="advanceShowMode === 'classic'">
                  <span class="sfa sfa-bc-light vertical-middle"></span>
                  玩法说明
                </a>
              </div>
            </div>
            <div class="bc-line"></div>
            <div class="m-LR-smd">
              <div class="bc-play-area clearfix" :class="!_.isEmpty(playRule) ? 'loaded' : ''">
                <transition name="fade" mode="out-in"
                            enter-active-class="animated-quick fadeIn"
                            leave-active-class="animated-quick fadeOut"
                >
                  <betting-play-area-select :component-type="componentType" :play-rule="playRule"
                                            :ticket-info="ticketInfo" ref="areaSelect" :miss-optional="false"
                                            v-if="!_.isEmpty(playRule) && playRule.type === 'select'">
                  </betting-play-area-select>
                  <betting-play-area-input :component-type="componentType" :play-rule="playRule" ref="areaInput"
                                           v-else-if="!_.isEmpty(playRule) && playRule.type === 'input'"></betting-play-area-input>
                  <div class="height-100" v-html="loading" v-else></div>
                </transition>
              </div>
            </div>
          </div>

          <div class="bc-side-area pull-right" ref="bcSideArea"></div>
        </div>
        <div class="div-line"></div>

        <div class="bottom-panel text-inverse m-LR-smd m-TB-md">
          <div class="bottom-panel-top form-inline text-center">
            <select name="unit" class="select-default bc-unit-select" v-model="unit">
              <option value="10000">元</option>
              <option value="1000">角</option>
              <option value="100">分</option>
              <option value="10">厘</option>
            </select>
            <div class="inline-block m-LR-smd">
              <span class="vertical-middle bc-multi-range inline-block" ref="multiRange"></span>
              <label class="m-left-xs">倍</label>
            </div>

            <div class="inline-block m-LR-sm">
              <span>共</span>
              <animated-integer class="text-pleasant font-sm" :value="bettingChoice.statistics"></animated-integer>
              <span>注，金额</span>
              <animated-integer class="text-prominent font-sm" :value="bettingChoice.fPrefabMoney"></animated-integer>
              <span>元</span>
            </div>
            <select class="bc-m-select">
              <option value="">使用代金券</option>
            </select>
            连续开奖
            <select class="bc-m-select">
              <option v-for="openNum in continuousOpenSelectList" :key="openNum">{{openNum}}</option>
            </select>
            <label class="stop-checkbox">
              <custom-checkbox></custom-checkbox>
              中奖即停止
            </label>
          </div>
          <div class="bottom-panel-bottom text-center">
            <button class="sfa sfa-mmc-add-btn no-border" @click="lotteryAdd"
                    :disabled="pushing || !bettingInfo.sale || bettingInfo.pending"></button>
            <button class="sfa sfa-mmc-start-btn no-border" @click="lotteryBuy"
                    :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
            </button>
          </div>
        </div>

        <div class="m-bottom-xs m-left-md">
          <div class="sfa-mmc-betting-record">
            <static-grid :wrapper-class="lotteryGridOps.wrapperClass" :col-model="lotteryGridOps.colModel"
                         :height="lotteryGridOps.height" :emptyTip="lotteryGridOps.emptyTip" :rows="fPreviewList"
                         ref="lotteryGrid"></static-grid>
          </div>
        </div>
      </div>
    </div>
    <div class="sfa-mmc-content-bottom">
      <button class="sfa sfa-mmc-start-lg-btn no-border" v-if="firstOpen" @click="lotteryConfirm"
              :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
      </button>
      <button class="sfa sfa-mmc-again-btn no-border" v-else @click="lotteryConfirm"
              :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
      </button>
    </div>


    <!-- 确认投注 -->
    <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="confirm">
      <betting-confirm :ticket-info="ticketInfo" :betting-info="bettingInfo" :betting-choice="bettingChoice"
                       :betting-list="bettingChoice.previewList" :type="`normal`"
                       @bettingConfirm="bettingConfirm"></betting-confirm>
    </div>
  </div>
</template>

<script>
  import {CustomCheckbox} from 'build'
  import betRulesConfig from 'bettingCenter/misc/betRulesConfig'


  import BettingRules from './betting-rules'
  import BettingAdvanceRules from './betting-advance-rules'
  import BettingPlayAreaSelect from './betting-play-area-select'
  import BettingPlayAreaInput from './betting-play-area-input'
  import BettingConfirm from "./betting-confirm";


  //backbone旧组件
  import HisAnalysisView from './bettingCenter-historical-analysis'

  let recordsOpenView

  export default {
    name: "mmc-betting-main-area",
    props: {
      ticketInfo: Object,
      ticketId: Number,
    },
    components: {
      CustomCheckbox,
      BettingConfirm,
      StaticGrid,
      BettingRules,
      BettingAdvanceRules,
      BettingPlayAreaSelect,
      BettingPlayAreaInput,
    },
    data() {
      return {
        componentType: 'mmc',
        loading: Global.ui.loader.get(),
        firstOpen: true,
        unit: 10000,
        continuousOpenSelectList: [1, 5, 10, 15, 20, 25],
        playRule: {},
        playInfo: {},
        //提交中，禁用按钮
        pushing: false,
        flashIndex: 0,

        lotteryGridOps: {
          wrapperClass: 'bc-lottery-preview mmc',
          colModel: [
            {
              label: '玩法', name: 'title', key: true, width: '15%',
            },
            {
              label: '投注内容', name: 'betNum', key: true, width: '17%',
            },
            {label: '注数', name: 'note', width: '10%'},
            {label: '倍数', name: 'multiple', width: '12.5%'},
            {label: '模式', name: 'mode', width: '12.5%'},
            {label: '投注金额', name: 'bettingMoney', width: '12.5%'},
            {label: '预期盈利', name: 'bonus', width: '12.5%'},
            {
              label: `<div class="js-lottery-clear bc-lottery-clear m-left-sm cursor-pointer">清空</div>`,
              name: 'operate',
              width: '8%'
            },
          ],
          height: 192,
          showEmpty: true,
          emptyTip: '<div class="sfa sfa-empty vertical-middle"></div> 暂未添加选号',
        },
        fPreviewList: [],

        advanceShowMode: 'classic', //classic | single

        showChaseModal: false,
      }
    },
    computed: mapState({
      playLevels: function () {
        return this.$store.getters.playLevels
      },
      bettingChoice: 'bettingChoice',
      bettingInfo: 'bettingInfo',
    }),

    watch: {
      'bettingChoice.playId': {
        handler: function (playId) {
          if (playId === -1) {
            return
          }
          this.playRule = betRulesConfig.get(playId)

          recordsOpenView.updateByPlayRule(this.playRule)

          this.$store.commit(types.SET_CHECKOUT_CHOICE)

          this.playInfo = this.$store.getters.playInfo(playId, this.bettingChoice.groupId);

          const playInfo = this.playInfo

          this.$store.commit(types.SET_MAX_BONUS, playInfo.betMethodMax)
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
            content: `<div class="bc-popover-exp font-sm text-default">玩法说明：<span class="text-inverse">${playInfo.playDes}</span></div>
<div class="font-sm text-default">中奖举例：<span class="text-inverse">${playInfo.playExample.replace(/\|/g, '<br />')}</span></div>`,
            placement: 'bottom',
          })

          $(this.$refs.winningExample).popover({
            trigger: 'hover',
            container: this.$el,
            html: true,
            content: `<div class="font-sm text-default">中奖举例：<span class="text-inverse">${playInfo.playExample.replace(/\|/g, '<br />')}</span></div>`,
            placement: 'bottom',
          })

          this.$store.dispatch('getColdHot', {ticketId: this.ticketInfo.id})
          this.$store.dispatch('getCurrentMiss', {ticketId: this.ticketInfo.id})
        },
      },
      'bettingInfo.planId': {
        handler: function (newPlanId, oldPlanId) {
          if (this.$el.offsetWidth && newPlanId !== '------------' && oldPlanId !== '------------' && !this.bettingInfo.pending) {
            Global.ui.notification.show(
              `<span class="text-danger">${oldPlanId}</span>期已截止<br/>当前期为<span class="text-danger">${newPlanId}</span>期<br/>投注时请注意期号！`,
              {id: 'ticketNotice', hasFooter: false, displayTime: 800},
            )
          }
        }
      },
      'bettingInfo.lastOpenId': {
        handler: function () {
          recordsOpenView.update()
        }
      },
      unit: {
        handler: function (newVal) {
          this.$store.commit(types.SET_UNIT, newVal)
        }
      },
      'bettingChoice.formatMaxMultiple': {
        handler: function (newVal) {
          $(this.$refs.multiRange).numRange('setRange', 1, newVal)
        }
      },
      'bettingChoice.previewList': {
        handler: function (previewList) {
          this.fPreviewList = _(previewList).map(function (previewInfo, index) {
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

    beforeCreate() {
      this.$store.commit(types.CHECKOUT_TICKET_INFO)
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
          this.$_addSelectLottery({type: 'buy'})
        } else {
          this.$_addInputLottery({type: 'buy'})
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
              Global.ui.notification.show('账号余额不足，请先<a href="#/fc/re" class="router btn-link btn-link-hot"  data-dismiss="modal">充值</a>。')
            } else {
              Global.ui.notification.show(res.msg || '')
            }

            this.$_emptySelect();
          })
      },

      lotteryConfirm() {
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

        $(this.$refs.confirm).modal({
          backdrop: 'static',
        })
      },

      bettingConfirm() {
        this.pushing = true


        $(this.$refs.confirm).modal('hide')

        this.$store.dispatch('pushBetting', {
          planId: this.bettingInfo.planId,
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
              Global.ui.notification.show('账号余额不足，请先<a href="#/fc/re" class="router btn-link btn-link-hot"  data-dismiss="modal">充值</a>。')
            } else {
              Global.ui.notification.show(res.msg || '')
            }

            this.$_emptySelect();
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
            if (result.maxBetNums && !_.isNull(result.maxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.maxBetNums} 注，请重新选择  `)
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
            if (result.maxBetNums && !_.isNull(result.maxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.maxBetNums} 注，请重新选择`)
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

    mounted: function () {
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

      this.flashTimer = setInterval(() => {
        ++this.flashIndex
        if (this.flashIndex >= 5) {
          this.flashIndex = 0
        }
      }, 300)
    },

    destroyed() {
      clearInterval(this.flashTimer)
    }
  }
</script>

<style lang="scss" scoped>


  .opening-panel-inner {
    top: 30px;
    position: relative;
    left: 32px;
  }

  .sfa-bc-ssc-mmc {
    position: relative;
    left: 80px;
    top: -50px;
  }

  .opening-unit {
    width: 82px;
    height: 107px;
  }

  .mmc-lottery-main {
    position: relative;
    top: -35px;
    left: 33px;
    width: 1190px;
    background: url(./misc/mmc-content-slice.png) repeat-y center center;
  }

  .bottom-panel-top {
    margin-bottom: 28px;
  }

  .sfa-mmc-outer-border {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
    animation: opacity 1s infinite alternate;
  }

  .opening-wrapper {
    position: relative;
    top: -72px;
    left: 40px;
    display: inline-block;
  }

  .opening-flash {
    position: relative;
    top: 15px;
    left: 28px;
    display: inline-block;
  }

  .opening-content {
    display: inline-block;
  }

  .sfa-mmc-simulation-btn {
    position: relative;
    top: 0;
    display: inline-block;
    left: 50px;
    cursor: pointer;
  }

  .mmc-lottery-main-inner {
    width: 1100px;
    position: relative;
    left: 28px;
  }

  .sfa-mmc-betting-record {
    margin-left: 22px;
    position: relative;
    z-index: 1;
  }

  .bc-lottery-preview {
    width: 960px;
    position: relative;
    left: 24px;
    top: 20px;
  }

  .bc-entry-list {
    position: relative;
    top: 55px;
    right: 80px;
    a {
      width: 112px;
      height: 32px;
      background-color: rgba(39, 118, 136, 0.5);
      box-shadow: 0px -1px 1px 0px rgba(255, 255, 255, 0.17),
      inset 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
      display: block;
      border-radius: 16px;
      color: $def-white-color;
      line-height: 32px;
      margin-bottom: 15px;
      text-align: center;
      &:hover {
        background-color: #108e96;
      }
    }
  }

  .stop-checkbox {
    font-size: 12px;
    color: $new-inverse-color;
  }

  .sfa-mmc-add-btn {
    margin-right: 15px;
  }

  .bc-play-main {
    user-select: none;
    .bc-play-left {
      width: 849px;
      border-right: 1px solid $def-line-color;
      .bc-line {
        width: 100%;
        height: 3px;
        background: linear-gradient(to bottom, #dcdcdc, #f0f0f0);
      }
    }
    .bc-side-area {
      width: 250px;
      min-height: 556px;
    }
    .bc-basic-rules {
      .tab-toolbar {
        margin-bottom: 0;
        padding-left: 10px;
        .tab.active {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      }
    }
    .bc-play-area {
      position: relative;
      height: 100px;
      &.loaded {
        height: auto;
      }
    }

    .bc-unit-select-add {
      width: 58px;
      height: 20px;
      padding-left: 8px;
      border-radius: 3px;
      color: $def-black-color;
      margin: 2px 0;
      font-size: 12px;
    }

    .bc-multi-range {
      height: 30px;
    }
    .bc-jb-btn {
      font-size: $font-md;
      width: 180px;
      height: 48px;
      border-bottom: 3px solid rgba(0, 0, 0, 0.4);
      font-weight: 600;
    }
    .bc-bottom-area {
      width: 100%;
      height: 257px;
      overflow: hidden;
    }
    .bc-records-tabs-list {
      width: 100%;
      height: 36px;
      background-color: $sec-line-color;
      .bc-records-tab {
        display: inline-block;
        width: 140px;
        height: 36px;
        font-size: $font-md;
        color: $def-black-color;
        line-height: 36px;
        position: relative;
        text-align: center;
        &.active {
          background-color: $def-white-color;
          &:before {
            content: '';
            width: 100%;
            height: 3px;
            position: absolute;
            background-color: $main-deep-color;
            top: 0;
            left: 0;
          }
        }
      }
    }
    .bc-records-tables {
      width: 100%;
      height: 168px;
      table {
        thead {
          border-bottom: 1px solid $def-line-color;
        }
        th {
          color: $new-inverse-color;
        }
        tr {
          border-bottom: 1px dashed $sec-line-color;
        }
      }
    }
    .his-main {
      th {
        position: relative;
        &:after {
          width: 1px;
          height: 15px;
          content: '';
          background-color: $def-line-color;
          display: block;
          position: absolute;
          right: 0px;
          top: 11px;
        }
        &:last-child {
          &:after {
            display: none;
          }
        }
      }
      td {
        padding: 13px 3px;
      }
      .open-nums {
        max-width: 150px;
        span {
          width: 20px;
          height: 20px;
          border: 1px solid $third-line-color;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
          float: left;
          margin-left: 4px;
          margin-bottom: 2px;
        }
        .key-num {
          border-color: $new-main-deep-color;
          color: $new-main-deep-color;
        }
      }
    }
  }

  .sfa-mmc-content-bottom {
    position: relative;
    text-align: center;
    top: -230px;
    left: 32px;
  }

  .advance-play-des {
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
    position: relative;
    top: -2px;
  }

  .bc-advance-mode-single {
    float: left;
    color: $prominent-secondary-btn-color;
    margin: 20px 0 0 20px;
    .advance-play-des {
      margin: 0 0 0 20px;
    }
  }

  .bc-play-des {
    display: inline-block;
    max-width: 600px;
  }

  .advance-bonus {
    margin-right: 40px;
    margin-top: 15px;
  }

  .advance-bonus-single {
    margin-right: 40px;
    margin-top: 20px;
    float: right;
  }

  .bc-play-select-area {
    min-height: 70px;

    .bc-advance-rules {
      color: #666666;
      max-width: 80%;
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
    .bc-advance-mode-main {
      font-size: $font-xs;
      color: $inverse-color;
    }
  }

  @mixin select-def {
    color: $new-inverse-color;
    border-radius: 5px;
  }

  .bc-unit-select {
    width: 70px;
    height: 30px;
    padding-left: 12px;
    margin-left: 5px;
    @include select-def;
  }

  .bc-m-select {
    width: 106px;
    height: 30px;
    font-size: 12px;
    margin-right: 20px;
    @include select-def;
  }

  .sfa-mmc-start-lg-btn {
    position: relative;
    top: 260px;
    background-color: transparent;
  }

  .bc-md-btn {
    font-size: $font-sm;
    width: 120px;
    padding: 5px 10px;
    font-weight: 600;
    transform: translateY(-5px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  }

  @keyframes opacity {
    from {
      opacity: 0.6;
    }

    to {
      opacity: 1;
    }
  }
</style>
