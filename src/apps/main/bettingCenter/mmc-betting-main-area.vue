<template>
  <div class="width-100 bc-play-main">
    <div class="relative">
      <div class="sfa sfa-mmc-outer-border"></div>
      <div class="opening-panel-inner" :class="!selectStatus ? 'sfa-mmc-content-opening' : 'sfa-mmc-content-top'">
        <span class="sfa sfa-bc-ssc-mmc"></span>
        <div class="opening-wrapper sfa-mmc-opening-panel">
          <div class="opening-flash" :class="`sfa-mmc-opening-flash-${flashIndex}`"></div>
          <mmc-opening-num-group class="opening-content" :counts="ticketInfo.counts" :range="ticketInfo.range" :opening-balls="lastOpening"
                         :default-opening="ticketInfo.defaultOpening" @openCompleted="openCompleted"
          ></mmc-opening-num-group>
          <div class="sfa-mmc-simulation-btn" @click="simulationOpening"></div>
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
        <div :class="lever ? 'sfa-mmc-lever-down' : 'sfa-mmc-lever'">
        </div>
      </div>
    </div>
    <div class="mmc-lottery-main" ref="main">
      <div class="mmc-lottery-main-open" ref="mainOpen">
        <div class="opening-title" v-if="opening">第<span class="opening-title-inner">{{currentOpeningCount}}</span>/{{openingCount}}期 正在开奖</div>
        <div class="opening-title cursor-pointer" v-else @click="reSelect">重新选号</div>
        <div class="opening-main">
          <div class="opening-panel">
            <div class="opening-panel-title">
              <span class="opening-icon sfa sfa-mmc-betting-content">
                投注内容
              </span>
              <span class="font-sm m-left-sm">
                投注<span class="text-cool">{{openingCount}}</span>次，共<span class="text-prominent">{{fTotalMoney}}</span>元
              </span>
            </div>
            <div class="opening-group" ref="previewGroup">
              <div class="opening-cell" v-for="(preview, index) in fPreviewList">
                <div class="opening-left">【{{preview.title}}】</div>
                <div class="opening-center" v-html="preview.betNum"></div>
                <div class="opening-right">{{preview.bettingMoney}}</div>
                <div class="opening-operate cursor-pointer" @click="lotteryDelete(index)">
                  <span class="sfa sfa-mmc-delete" v-show="!opening"></span>
                </div>
              </div>
            </div>

          </div>
          <div class="opening-panel">
            <div class="opening-panel-title">
              <span class="opening-icon sfa sfa-mmc-opening-result">
                开奖结果
              </span>
              <span class="font-sm m-left-sm">
                开奖<span class="text-cool">{{currentOpeningCount}}</span>次，中奖<animated-integer class="text-prominent" :value="fTotalWinPrize"></animated-integer>元
              </span>
            </div>
            <transition-group class="opening-group" ref="openingGroup" name="opening-cell" tag="div">
              <div class="opening-cell" v-for="(openingResult, i) in fOpeningResultList" :key="openingResult.index">
                <div class="opening-left">{{openingResult.title}}</div>
                <div class="opening-center" v-if="!openingResult.completed">
                  --------- 正在开奖  ---------
                </div>
                <div class="opening-center" v-else>
                  <span class="text-circle text-circle-xs" :class="{'circle-winning': !opening && i === 0}"
                        v-for="num in openingResult.fOpenCode">{{num}}</span>
                </div>
                <div class="opening-right text-prominent " v-if="openingResult.completed && openingResult.winPrize">
                  中奖{{openingResult.fWinPrize}}元
                </div>
                <div class="opening-right" v-else>{{openingResult.completed ? '未中奖' : ''}}</div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
      <div class="mmc-lottery-main-inner" ref="mainInner">

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
            <select class="bc-m-select" v-model="openingCount">
              <option v-for="openNum in continuousOpenSelectList" :key="openNum">{{openNum}}</option>
            </select>
            <label class="stop-checkbox">
              <custom-checkbox v-model="stopWhenWinning"></custom-checkbox>
              中奖即停止
            </label>
          </div>
          <div class="bottom-panel-bottom text-center">
            <button class="sfa sfa-mmc-add-btn no-border" @click="lotteryAdd"
                    :disabled="pushing || !bettingInfo.sale || bettingInfo.pending"></button>
            <button class="sfa sfa-mmc-start-btn no-border" @click="lotteryAddAndConfirm"
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
      <button class="bottom-lg-btn sfa sfa-mmc-start-lg-btn no-border"
              v-if="selectStatus" @click="lotteryConfirm"
              :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
      </button>
      <button class="bottom-lg-btn sfa sfa-mmc-stopping-btn no-border" v-else-if="stopping"
              :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
      </button>
      <button class="bottom-lg-btn sfa sfa-mmc-stop-btn no-border"
              v-else-if="opening" @click="lotteryStop"
              :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
      </button>
      <button class="bottom-lg-btn sfa sfa-mmc-again-btn no-border" v-else @click="lotteryConfirmAgain"
              :disabled="pushing || !bettingInfo.sale || bettingInfo.pending">
      </button>
    </div>

    <!-- 最后开奖结果 -->
    <div class="modal-result modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="finalResult">
      <div class="final-result-wrapper">
        <div class="final-result-inner sfa-mmc-winning" v-if="totalWinPrize">
          <span class="final-result-close sfa sfa-mmc-result-close" data-dismiss="modal"></span>
          <div class="winning-result">总计中奖金额为<br />
          <span class="winning-prize">{{fTotalWinPrize}}</span> 元
          </div>
        </div>
        <div class="final-result-inner sfa-mmc-lose" v-else>
          <span class="final-result-close sfa sfa-mmc-result-close" data-dismiss="modal"></span>
          <div class="lose-result">
            祝您下次好运！
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {pushMmcSimulationBettingApi} from 'api/betting'
  import {CustomCheckbox, StaticGrid} from 'build'
  import MmcOpeningNumGroup from "bettingCenter/mmc-opening-num-group";
  import betRulesConfig from './misc/betRulesConfig'


  import BettingRules from './betting-rules'
  import BettingAdvanceRules from './betting-advance-rules'
  import BettingPlayAreaSelect from './betting-play-area-select'
  import BettingPlayAreaInput from './betting-play-area-input'


  //backbone旧组件
  import HisAnalysisView from './bettingCenter-historical-analysis'

  let recordsOpenView

  //TODO 连续开奖选择
  //TODO nav
  export default {
    name: "mmc-betting-main-area",
    props: {
      ticketInfo: Object,
      ticketId: Number,
      componentType: String,
    },
    components: {
      MmcOpeningNumGroup,
      CustomCheckbox,
      StaticGrid,
      BettingRules,
      BettingAdvanceRules,
      BettingPlayAreaSelect,
      BettingPlayAreaInput,
    },
    data() {
      return {
        lever: false,
        loading: Global.ui.loader.get(),
        unit: 10000,
        continuousOpenSelectList: [1, 5, 10, 15, 20, 25],
        //开奖次数
        openingCount: 1,
        //总投注金额
        fTotalMoney: 0,
        //总中奖金额
        totalWinPrize: 0,
        fTotalWinPrize: 0,
        totalOpeningCount: 0,
        //当前正在开奖期数
        currentOpeningCount: 1,
        //手动停止
        stopping: false,
        playRule: {},
        playInfo: {},
        //提交中，禁用按钮
        pushing: false,
        simulationOpen: false,
        //开奖中
        opening: false,
        //中奖时停止
        stopWhenWinning: false,
        selectStatus: true,
        flashIndex: 0,
        //最后开奖结果
        showFinalResult: true,

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

        lastOpening: ['0', '0', '0', '0', '0'],
        fOpeningResultList: []
      }
    },
    computed: {
      ...mapState({
        playLevels() {
          return this.$store.getters.playLevels
        },
        bettingChoice: 'bettingChoice',
        bettingInfo: 'bettingInfo',
      })
    },

    watch: {
      opening: {
        handler(current) {
          if (current) {
            Velocity(this.$refs.main, {
              height: 500
            })
            Velocity(this.$refs.mainInner, {
              opacity: 0,
            })
            Velocity(this.$refs.mainOpen, {
              opacity: 1,
            })
          }
        },
      },
      selectStatus(selectStatus) {
        if (selectStatus) {

          Velocity(this.$refs.main, {
            height: 1005
          })
          Velocity(this.$refs.mainInner, {
            opacity: 1,
          })
          Velocity(this.$refs.mainOpen, {
            opacity: 0,
          })
        }
      },
      'bettingChoice.playId': {
        handler: function (playId) {
          if (playId === -1) {
            return
          }
          this.playRule = betRulesConfig.get(playId)

          recordsOpenView.updateByPlayRule(this.playRule)
          recordsOpenView.update()

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
          let totalMoney = 0
          this.fPreviewList = _(previewList).map(function (previewInfo, index) {
            const title = `${previewInfo.levelName}_${previewInfo.playName}`
            let betNum = ''
            if (previewInfo.formatBettingNumber.length > 20) {
              betNum = `<a href="javascript:void(0)" class="js-bc-betting-preview-detail-${index} btn-link">${
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

            totalMoney += previewInfo.prefabMoney

            return {
              title,
              betNum,
              note: `${previewInfo.statistics}注`,
              multiple: multipleDiv,
              mode: modeSelect,
              bettingMoney: `${previewInfo.fPrefabMoney}元`,
              bonus: `${previewInfo.fBetBonus}元`,
              operate: `<div class="js-lottery-delete lottery-preview-del icon-block m-right-md pull-right" data-index="${index}"></div>`,
            }
          }, this)

          this.fTotalMoney = _.convert2yuan(totalMoney * this.openingCount)

          this.$nextTick(() => {
            this.$refs.lotteryGrid.getRows().forEach((row, index) => {
              const $row = $(row)
              const $detail = $(this.$el).find(`.js-bc-betting-preview-detail-${index}`)
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
      /**
       * 重新选号
       */
      reSelect() {
        this.$store.commit(types.EMPTY_PREV_BETTING)
        this.selectStatus = true
        this.fOpeningResultList = []
      },
      /**
       * 开奖全部完成
       */
      openCompleted() {
        if (this.simulationOpen) {
          this.simulationOpen = false
          recordsOpenView.update()
          return
        }

        this.fOpeningResultList[0].completed = true
        this.totalWinPrize += this.fOpeningResultList[0].winPrize
        this.fTotalWinPrize = _.convert2yuan(this.totalWinPrize)
        if (this.currentOpeningCount < this.totalOpeningCount && !this.stopping && !(this.stopWhenWinning && this.fOpeningResultList[0].winPrize)) {
          ++this.currentOpeningCount
          this.$_pushBetting()
        } else {
          this.stopping = false
          this.opening = false
          recordsOpenView.update()

          this.toggleFinalResult(true)
        }
      },

      toggleFinalResult(flag = true) {
        $(this.$refs.finalResult).modal()
        // this.$refs.finalResult
        this.showFinalResult = flag
      },

      /**
       *
       */
      lotteryStop() {
        this.stopping = true
      },

      $_prepareOpening() {
        this.opening = true
        this.pushing = true
        this.selectStatus = false
        this.totalOpeningCount = this.openingCount
        this.currentOpeningCount = 1
        this.totalWinPrize = 0
        this.fTotalWinPrize = 0
      },

      toggleLever() {
        this.lever = true
        _.delay(() => {
          this.lever = false
        }, 200)
      },
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

      simulationOpening() {
        if (this.simulationOpen || this.opening || this.pushing) {
          return
        }
        this.simulationOpen = true
        this.pushing = true

        this.toggleLever()
        pushMmcSimulationBettingApi(({data}) => {
          this.pushing = false
          if (data && data.result === 0) {
            this.lastOpening = data.root.openCode.split(',')
          }
        }, () => {
          this.simulationOpen = false
          this.pushing = false
        })
      },

      $_formatOpeningResult(openingResult, index) {
        return Object.assign({
          index: index,
          title: `【第${index}次开奖】`,
          completed: false,
          fOpenCode: openingResult.openCode.split(','),
          fWinPrize: _.convert2yuan(openingResult.winPrize),
        }, openingResult)
      },

      lotteryConfirmAgain() {
        this.fOpeningResultList = []
        this.lotteryConfirm()
      },

      lotteryConfirm() {
        if (this.opening || this.pushing) {
          return
        }

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


        if (Global.memoryCache.get('acctInfo').foundsLock) {
          Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" ' +
            'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
          return false
        }
        if (!this.opening) {
          this.toggleLever()
        }

        this.$_prepareOpening()

        this.$_pushBetting()
      },

      $_pushBetting() {
        this.toggleLever()
        this.$store.dispatch(types.PUSH_MMC_BETTING, {
          type: 'previewList'
        })
          .catch(() => {
            this.pushing = false
          })
          .then((res) => {
            this.pushing = false

            if (res && res.result === 0) {

              Global.m.oauth.check()

              const fOpeningReuslt = this.$_formatOpeningResult(res.root, this.currentOpeningCount)
              this.fOpeningResultList.unshift(fOpeningReuslt)
              this.lastOpening = fOpeningReuslt.fOpenCode

            } else if (res.root && res.root.errorCode === 101) {
              Global.ui.notification.show('账号余额不足，请先<a href="#/fc/re" class="router btn-link btn-link-hot"  data-dismiss="modal">充值</a>。')
            } else {
              Global.ui.notification.show(res.msg || '')
            }
          })
      },

      lotteryClear() {
        this.$store.commit(types.EMPTY_PREV_BETTING)
      },

      lotteryDelete(index) {
        this.$store.commit(types.EMPTY_PREV_BETTING, {
          index
        })
        this.$nextTick(() => {
          if (_.isEmpty(this.fPreviewList)) {
            this.reSelect()
          }
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
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.maxBetNums} 注，请重新选择`)
              return false
            } else {
              Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加')
              this.$refs.areaSelect.empty()
              return true
            }
          } else {
            this.$refs.areaSelect.empty()
            return true
          }
        } else {
          Global.ui.notification.show('号码选择不完整，请重新选择！')
          return false
        }
      },

      $_addInputLottery(opt) {
        const bettingInfo = this.$refs.areaInput.addBetting(opt)

        const result = this.bettingChoice.addPrevBetResult
        if (result) {
          if (!_.isEmpty(result)) {
            if (result.maxBetNums && !_.isNull(result.maxBetNums)) {
              Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.maxBetNums} 注，请重新选择`)
              return false
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
          return true
        } else {
          Global.ui.notification.show('号码选择不完整，请重新选择！')
          return false
        }
      },

      lotteryAdd() {
        if (!this.bettingChoice.multiple) {
          Global.ui.notification.show('倍数为0，不能投注')
          return false
        }

        if (this.playRule.type === 'select') {
          return this.$_addSelectLottery()
        } else {
          return this.$_addInputLottery()
        }
      },

      lotteryAddAndConfirm() {
        if (this.lotteryAdd()) {
          this.lotteryConfirm()
        }
      }
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
        title: '最近开奖号码',
      }).render()

      recordsOpenView.height = 430

      this.flashTimer = setInterval(() => {
        ++this.flashIndex
        if (this.flashIndex >= 5) {
          this.flashIndex = 0
        }
      }, 300)

      $(this.$refs.previewGroup).slimScroll({
        height: 310,
        railVisible: true,
        size: '14px',
        color: '#f2f4f4',
        railColor: '#d9d9d9',
        distance: '10px',
        opacity: 1,
        railOpacity: 1,
      })
      $(this.$refs.openingGroup).slimScroll({
        height: 310,
        railVisible: true,
        size: '14px',
        color: '#f2f4f4',
        railColor: '#d9d9d9',
        distance: '10px',
        opacity: 1,
        railOpacity: 1,
      })
    },

    destroyed() {
      clearInterval(this.flashTimer)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~base/styles/_spritesMMC';

  .opening-panel-inner {
    top: 30px;
    position: relative;
    left: 32px;
  }
  .sfa-mmc-content-opening {
    z-index: 2;
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
    top: -40px;
    left: 33px;
    width: 1190px;
    background: url(./misc/mmc-content-slice.png) repeat-y center center;
    overflow: hidden;
  }

  .bottom-panel-top {
    margin-bottom: 28px;
  }

  .sfa-mmc-outer-border {
    position: absolute;
    top: 0;
    left: 0;
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
    &:hover {
      @include sprite($sfa-mmc-simulation-hover-btn);
    }
  }

  .mmc-lottery-main-inner {
    width: 1100px;
    position: relative;
    left: 28px;
  }
  .mmc-lottery-main-open {
    position: absolute;
    opacity: 0;
    left: 70px;
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
  .sfa-mmc-lever {
    position: absolute;
    right: -18px;
    top: 37px;
  }
  .sfa-mmc-lever-down {
    position: absolute;
    right: -18px;
    top: 53px;
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

  .bottom-lg-btn {
    position: absolute;
    top: 260px;
    left: 338px;
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

  .opening-title {
    z-index: 22;
    position: relative;
    text-align: center;
    font-family: AdobeHeitiStd-Regular;
    font-size: 24px;
    font-weight: normal;
    letter-spacing: -1px;
    color: #fffdc9;
    margin-right: 20px;
    .opening-title-inner {
      color: #ffc600;
    }
  }

  .opening-main {
    color: #666;
    position: relative;
    z-index: 2;
    text-align: center;
    top: 50px;
  }

  .opening-panel {
    display: inline-block;
    vertical-align: top;
    border-right: 1px solid #e6e6e6;
    &:last-of-type {
      border-right: 0;
    }
  }

  .opening-panel-title {
    text-align: left;
    margin-bottom: 15px;
    padding: 0 30px;
    width: 451px;
  }

  .opening-group {
    width: 451px;
    height: 310px;
    overflow: auto;
    padding: 0 30px;
  }

  .opening-cell {
    display: flex;
    height: 50px;
    line-height: 50px;
    background-color: #f2f4f4;
    box-shadow: inset 0px 1px 1px 0 rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    margin-bottom: 15px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .opening-operate {
    width: 40px;
    .sfa {
      position: relative;
      top: 5px;
    }
  }

  .opening-cell {
    transition: all 1s;
  }
  .opening-cell-enter, .opening-cell-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .opening-left {
    width: 121px;
  }

  .opening-center {
    width: 185px;
    flex-grow: 1;
  }

  .opening-right {
    width: 105px;
    flex-grow: 1;
  }
  .opening-icon {
    line-height: 42px;
    text-indent: 36px;
    font-size: 16px;
  }

  .sfa {
    outline: 0;
  }
  .text-circle {
    color: $new-inverse-color;
    background-color: rgba(117, 117, 117, 0.18);
    box-shadow: inset 0px 1px 2px 0px
    rgba(105, 105, 105, 0.07);

  }
  .circle-winning {
    color: $def-white-color;
    background-color: $new-main-deep-color;
    box-shadow: inset 0px 1px 2px 0px
    rgba(105, 105, 105, 0.4);
  }

  .final-result-wrapper {
    margin: 7% auto 0;
  }
  .final-result-inner {
    position: relative;
    margin: 0 auto;
  }

  .winning-result {
    position: relative;
    top: 140px;
    font-size: 18px;
    line-height: 30px;
    color: #f09932;
    width: 130px;
    text-align: center;
    margin: 0 auto;
    .winning-prize {
      font-size: 24px;
    }
  }
  .lose-result {
    color: $new-inverse-color;
    font-size: 18px;
    position: relative;
    width: 139px;
    margin: 0 auto;
    text-align: center;
    top: 164px;
  }
  .final-result-close {
    cursor: pointer;
    position: absolute;
    top: -23px;
    right: -10px;
  }
  .modal-result {
    width: 260px;
    left: 50%;
    margin-left: -130px;
    top: 15% !important;
  }


  /*@keyframes opacity {*/
    /*from {*/
      /*opacity: 0.6;*/
    /*}*/

    /*to {*/
      /*opacity: 1;*/
    /*}*/
  /*}*/
</style>

<style lang="scss">
  .opening-panel-title {
    .slimScrollBar {
      width: 10px !important;
      right: 12px !important;;
    }
  }
</style>
