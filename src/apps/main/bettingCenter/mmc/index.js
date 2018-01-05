
import betRulesConfig from 'bettingCenter/misc/betRulesConfig'
import BettingRecordsView from 'bettingCenter/views/bettingCenter-records'

const BettingChoiceModel = require('bettingCenter/models/bettingChoice-mmc')
const BettingRulesCollection = require('bettingCenter/collections/bettingRules')

const PlayAreaSelectView = require('./bettingCenter-playArea-select')

const ticketConfig = require('skeleton/misc/ticketConfig')
const PlayAreaInputView = require('./bettingCenter-playArea-input')

require('./easing')
require('./index.scss')
require('./jquery-animate-plugin')

const BettingCenterView = Base.ItemView.extend({

  template: require('bettingCenter/mmc/index.html'),

  playLevelTpl: _.template(require('./bettingCenter-level-mmc.html')),
  rulesTpl: _.template(require('./bettingCenter-rules.html')),

  events: {
    'click .js-bc-basic-rule': 'baseRuleChangeHandler',
    'click .js-bc-play-toggle': 'togglePlayModeHandler',
    'click .js-bc-advance-rule': 'advanceRuleChangeHandler',
    'change .js-bc-bet-mode': 'betModeChangeHandler',
    'click .js-bc-monetary-unit': 'monetaryUnitChangeHandler',
    'click .js-bc-btn-lottery-add': 'lotteryAddHandler',
    'click .js-bc-lottery-auto': 'lotteryAutoAddHandler',
    'click .js-bc-lottery-clear': 'lotteryClearHandler',
    'click .js-bc-lottery-preview-del': 'lotteryPreviewDelHandler',
    'click .js-bc-btn-lottery-confirm': 'lotteryConfirmHandler',

    'click .js-bc-mmc-start': 'startlotteryHandler',
    'click .js-bc-mmc-reSelect-btn': 'reSelectHandler',
    'click .js-bc-mmc-bet-times': 'betTimesHandler',
    'click .js-bc-mmc-open-history-turn-page': 'openHistoryTurnPage',
    'change .js-bc-mmc-continue-lottery-times': 'lotteryTimesChange',
    'click .js-bc-user-redPack-btn': 'checkUserRedPackHanler',
  },

  serializeData() {
    return {
      ticketInfo: this.options.ticketInfo,
    }
  },

  getOpenHistoryXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/bet/openHistory.json',
      data,
    })
  },

  getTicketInfoXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketinfoMmc.json',
      data,
      async: false,
    })
  },
  initialize() {
    this.options.ticketInfo = ticketConfig.getComplete(this.options.ticketId)

    this.model = new BettingChoiceModel()
    // this.infoModel = new BettingInfoModel();
    this.rulesCollection = new BettingRulesCollection()
    this.rulesCollection.setTicketInfo(this.options.ticketInfo)

    this.model.set('ticketId', Number(this.options.ticketId))

    this.listenTo(this.rulesCollection, 'sync sync:fromCache', this.renderBasicRules)

    this.listenTo(this.model, 'change:levelId', function(model, levelId) {
      this.renderAdvanceRules(levelId)
    })

    this.listenTo(this.model, 'change:playId', function(model, playId) {
      this.renderPlayArea()
      this.renderPlayInfo(this.rulesCollection.getPlayInfo(model.get('groupId'), playId))

      this.model.set({
        statistics: 0,
      })
    })

    this.listenTo(this.model, 'change:formatMaxMultiple', this.renderNumRange)
    this.listenTo(this.model, 'change:unit', this.renderPlayBetMode)

    this.listenTo(this.model, 'change:prefabMoney change:rebateMoney', this.renderSelectStatisticsInfo)
    this.listenTo(this.model, 'change:previewList', this.renderLotteryPreviewAdd)
    this.listenTo(this.model, 'change:previewList:del', this.renderLotteryPreviewDel)
    this.listenTo(this.model, 'change:totalInfo', this.renderTotalLotteryInfo)


    // 修改背景
    const strHash = document.location.hash
    if (strHash.slice(0, 6) === '#bc/19') {
      $('body').addClass('mmc-Body')
    }

    window.onhashchange = function () {
      const strHash = document.location.hash
      if (strHash.slice(0, 6) === '#bc/19') {
        $('body').addClass('mmc-Body')
      } else {
        $('body').removeClass('mmc-Body')
      }

      if (strHash.slice(0, 3) !== '#bc') {
        $('.js-leftAd').addClass('hide')
      } else {
        $('.js-leftAd').removeClass('hide')
      }
    }

    // 快捷入口
    this.on('entry:show router:back', function() {
      this.bettingRecordsView.update()
    })
  },

  onRender() {
    const self = this
    $('#footer').css('display', 'none')
    this.rulesCollection.fetch({
      abort: false,
      localCache: true,
      cacheName: `ticketList.${this.options.ticketId}`,
      data: {
        ticketId: this.options.ticketId,
      },
    })
    this.refreshOpenHistory()

    this.canTrunPage = true
    this.isBegin = false
    // rules
    this.$rules = this.$('.js-bc-rules')
    this.$playToggle = this.$('.js-bc-play-toggle')
    this.$basicRules = this.$('.js-bc-basic-rules')
    this.$optionalRules = this.$('.js-bc-optional-rules')
    this.$advanceRules = this.$('.js-bc-advance-rules')

    // playInfo
    this.$playTip = this.$('.js-bc-play-tip')
    this.$playExample = this.$('.js-bc-play-example')
    this.$playBetMode = this.$('.js-bc-bet-mode')

    // playArea
    this.$playArea = this.$('.js-bc-play-area')

    // numRange
    this.$multiRange = this.$('.js-bc-multi-range')

    //
    this.$statisticsLottery = this.$('.js-bc-statistics-lottery')
    this.$statisticsMoney = this.$('.js-bc-statistics-money')
    this.$statisticsRebateMoney = this.$('.js-bt-statistics-rebateMoney')
    this.$statisticsBonus = this.$('.js-bc-statistics-bonus')

    // betting preview
    this.$lotteryPreview = this.$('.js-bc-lottery-preview')
    this.$lotteryCurrResultPreview = this.$('.js-bc-lottery-currResult-preview')
    this.$lotteryTotalResultPreview = this.$('.js-bc-lottery-totalResult-preview')


    // total
    this.$totalLottery = this.$('.js-bc-total-lottery')
    this.$totalMoney = this.$('.js-bc-total-money')
    this.$totalRebateMoney = this.$('.js-bc-total-rebateMoney')

    this.$reSelectBtn = this.$('.js-bc-mmc-reSelect-btn')

    this.$recordsContainer = this.$('.js-bc-records')

    //= =====
    this.$userRedPackBtn = this.$('.js-bc-user-redPack-btn')
    this.$bcUserRed = this.$('.js-bc-user-red')
    this.$bcRedMoney = this.$('.js-bc-red-money')
    this.$btnAdd = this.$('.js-bc-btn-lottery-add')
    this.$btnConfirm = this.$('.js-bc-btn-lottery-confirm')
    this.$btnStart = this.$('.js-bc-mmc-start')

    this.$OpenHistory = this.$('.js-bc-mmc-open-history')

    this.$CurrentResult = this.$('.js-bc-mmc-result-win')
    this.$CurrentResultMask = this.$('.js-bc-mmc-result-mask')
    this.$CurrentResultTotal = this.$('.js-bc-mmc-result-total')

    this.$LotteryTime = this.$('.js-bc-mmc-continue-lottery-times')
    this.$WinStop = this.$('.js-bc-mmc-win-stop')
    this.$LotteryTimeShow = this.$('.js-bc-mmc-lottery-time-show')

    this.initNumRange()
    this.getTicketInfoAndDeal()
    // this.renderCountdown();

    this.lotteryPreview = this.$lotteryPreview.staticGrid({
      tableClass: 'table table-dashed',
      colModel: [
        // {label: '玩法/投注内容  ', name: 'title', key: true, width: '43%'},
        {
          label: '玩法/投注内容  ', name: 'title', key: true, width: '55%',
        },
        // {label: '奖金模式', name: 'bonusMode', width: '20%'},
        { label: '注数/倍数/模式', name: 'mode', width: '45%' },
        // {label: '注数/倍数/模式', name: 'mode', width: '20%'}
        // {label: '投注金额', name: 'bettingMoney', width: '17%'}
      ],
      showHeader: false,
      height: 150,
      startOnLoading: false,
      emptyTip: '',
    }).staticGrid('instance')


    this.lotteryCurrResultPreview = this.$lotteryCurrResultPreview.staticGrid({
      tableClass: 'table table-dashed',
      colModel: [
        {
          label: '玩法/投注内容  ', name: 'title', key: true, width: '48%',
        },
        { label: '奖金模式', name: 'bonusMode', width: '12%' },
        { label: '注数', name: 'statistics', width: '12%' },
        { label: '倍数', name: 'multiple', width: '12%' },
        { label: '状态', name: 'status', width: '16%' },
      ],
      showHeader: false,
      height: 150,
      startOnLoading: false,
      emptyTip: '',
    }).staticGrid('instance')

    this.lotteryTotalResultPreview = this.$lotteryTotalResultPreview.staticGrid({
      tableClass: 'table table-dashed',
      colModel: [
        {
          label: '批次', name: 'title', key: true, width: '40%',
        },
        {
          label: '开奖结果  ', name: 'result', key: true, width: '45%',
        },
        { label: '状态', name: 'status', width: '15%' },
      ],
      showHeader: false,
      height: 150,
      startOnLoading: false,
      emptyTip: '',
    }).staticGrid('instance')

    this.bettingRecordsView = new BettingRecordsView({
      el: this.$recordsContainer,
      ticketId: this.options.ticketId,
    }).render()

    const sign = Global.localCache.get(`ticketList.${this.options.ticketId}`)

    if (sign) {
      this.rulesCollection.reset(this.rulesCollection.parse(Global.localCache.get(sign)))
      this.rulesCollection.trigger('sync:fromCache')
    }
    this.getUsePackStatus()
    // this.$form = this.$('.js-bc-mmc-times');
    // this.parsley = this.$form.parsley({
    //  errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>',
    //  errorTemplate: '<div class="tooltip-inner">',
    //  trigger: 'change'
    // });
    this.subscribe('bet', 'bet:updating', (data) => {
      self.selectNum(data)
    })
  },
  selectNum (data) {
    const self = this
    if (data && !_.isNull(data) && !_.isUndefined(data) && !_.isEmpty(data)) {
      // this.$('.js-bc-basic-rule[data-id='+ data.ticketRuleId +']').trigger('click');
      // this.$('.js-bc-advance-rule[data-id='+ data.ticketPlayId +']').trigger('click');
      this.ticketRuleId = data.ticketRuleId
      this.ticketPlayId = data.ticketPlayId
      this.selectDefaultPlay()
      if (data.num && !_.isNull(data.num) && !_.isUndefined(data.num)) {
        const numArr = data.num.split(',')
        if (data.num.indexOf('-') > -1) {
          _(numArr).each((item, index) => {
            if (item != '-') {
              const numList = item.split(' ')
              _(numList).each((list) => {
                self.$(`.js-bc-playArea-items-${index}`).find(`span[data-num=${list}]`).trigger('click')
              })
            }
          })
        } else {
          _(numArr).each((item) => {
            self.$('.js-bc-playArea-items-0').find(`span[data-num=${item}]`).trigger('click')
          })
        }
      }
    }
  },
  initNumRange() {
    const self = this
    this.$multiRange.numRange({
      onChange(num) {
        self.model.set('multiple', num)
      },
      onOverMax(maxNum) {
        Global.ui.notification.show(`您填写的倍数已超出平台限定的单注中奖限额<span class="text-pleasant">${ 
          _(self.rulesCollection.limitMoney).convert2yuan()}</span>元，` +
          `已为您计算出本次最多可填写倍数为：<span class="text-pleasant">${maxNum}</span>倍`)
      },
    })
  },


  renderBasicRules() {
    const playLevels = this.rulesCollection.getPlayLevels()

    this.$basicRules.html(this.playLevelTpl({
      ruleClass: 'js-bc-basic-rule',
      rules: playLevels.normalList,
    }))

    if (!_(playLevels.optionalList).isEmpty()) {
      this.$rules.removeClass('rule-hide-optional')
      this.$optionalRules.html(this.playLevelTpl({
        ruleClass: 'js-bc-basic-rule',
        rules: playLevels.optionalList,
      }))
    }

    this.selectDefaultPlay()
  },

  selectDefaultPlay() {
    let defaultSelectInfo = null
    if (this.ticketRuleId && this.ticketPlayId && !_.isUndefined(this.ticketRuleId) && !_.isUndefined(this.ticketPlayId)) {
      defaultSelectInfo = {
        lastPlayId: this.ticketPlayId,
        groupId: this.ticketRuleId,
      }
    } else if (this.ticketInfo && this.ticketInfo.lastPlayId) {
      const lastPlayId = this.ticketInfo.lastPlayId.toString()
      const groupId = lastPlayId.substring(0, lastPlayId.length - 4)
      defaultSelectInfo = {
        lastPlayId,
        groupId,
      }
    } else {
      defaultSelectInfo = this.options.ticketInfo.info.defaultSelectPlay.split(',')
    }

    if (!_(defaultSelectInfo).isEmpty()) {
      if (!_(defaultSelectInfo).isArray() && _(defaultSelectInfo).isObject()) {
        this.$basicRules.find(`.js-bc-basic-rule[data-id=${defaultSelectInfo.groupId}]`).trigger('click')
        this.$advanceRules.find(`.js-bc-advance-rule[data-id=${defaultSelectInfo.lastPlayId}]`).trigger('click')
      } else if (_(Number(defaultSelectInfo[0])).isFinite()) {
        const $basics = this.$basicRules.find('.js-bc-basic-rule')
        const $basicSelected = $basics.eq(defaultSelectInfo[0])

        if ($basicSelected.length) {
          $basicSelected.trigger('click')
        } else {
          this.$playToggle.eq(1).addClass('active').siblings().removeClass('active')
          this.$basicRules.addClass('hidden')
          this.$optionalRules.find('.js-bc-basic-rule').eq(Number(defaultSelectInfo[0]) - $basics.length).trigger('click')
          this.$optionalRules.removeClass('hidden')
        }
        if (_(Number(defaultSelectInfo[1])).isFinite()) {
          this.$advanceRules.find('.js-bc-advance-rule').eq(defaultSelectInfo[1]).trigger('click')
        }
      }
    } else {
      this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click')
    }
  },

  renderAdvanceRules(levelId) {
    const advanceRules = this.rulesCollection.getPlayGroups(levelId)
    const length = advanceRules.length
    this.levelId = levelId
    this.$advanceRules.html(_(advanceRules).map(function(rules, index) {
      let containerClass
      // 强制两排显示
      if (length > 2) {
        if (index === 1) {
          containerClass = 'inline-block'
        } else if (index === 2) {
          containerClass = 'inline-block no-padding'
        }
      }
      return this.rulesTpl({
        tabToolbarClass: 'tab-pill tab-pill-main',
        ruleClass: 'js-bc-advance-rule',
        containerClass,
        id: rules.id,
        title: rules.title,
        rules: rules.playList,
      })
    }, this))

    this.$advanceRules.find('.js-bc-advance-rule').eq(0).trigger('click')
  },

  renderPlayInfo(playInfo) {
    this.$playExample.text(playInfo.playExample).attr('title', playInfo.playExample)

    if (this.$playTip.data('popover')) {
      this.$playTip.popover('destroy')
    }

    this.$playTip.popover({
      trigger: 'hover',
      container: this.$el,
      html: true,
      content: playInfo.playDes.replace(/\|/g, '<br />'),
      placement: 'bottom',
    })

    this.renderPlayBetMode()
    // 初始化奖金
    this.model.set({
      maxMultiple: playInfo.betMultiLimitMax,
      userRebate: playInfo.userRebate,
      maxBetNums: playInfo.maxBetNums,
    })
  },

  renderNumRange(model, formatMaxMultiple) {
    this.$multiRange.numRange('setRange', 1, formatMaxMultiple)
  },

  renderPlayBetMode() {
    const unit = _(100000000).div(this.model.get('unit'))
    const playInfo = this.rulesCollection.getCurrentPlay()

    const betMethod = _(playInfo.betMethodMax).chain().formatDiv(unit).floor(4)
      .value()

    this.model.set({
      maxBonus: playInfo.betMethodMax,
      betMethod: 0, // 高奖金
      maxMultiple: playInfo.betMultiLimitMax,
    })

    this.$playBetMode.html(betMethod)
  },

  renderPlayArea() {
    const playRule = betRulesConfig.get(this.model.pick('playId'))

    if (this.currentPlayAreaView) {
      this.currentPlayAreaView.destroy()
    }

    if (_.isEmpty(playRule)) {
      return
    }

    switch (playRule.type) {
      case 'select':
        this.currentPlayAreaView = new PlayAreaSelectView(playRule)
        break
      case 'input':
        this.currentPlayAreaView = new PlayAreaInputView(playRule)
        break
      default:
        break
    }

    this.options.type = playRule.type

    this.currentPlayAreaView.on('statistic', function(statistics) {
      this.model.set({
        statistics,
      })
    }, this)

    this.$playArea.html(this.currentPlayAreaView.render().el).addClass('loaded')

    if (playRule.type === 'select') {
      this.$playArea.addClass('middle')
    } else {
      this.$playArea.removeClass('middle')
    }

    // console.log(this.model.pick('ticketId', 'levelId', 'groupId', 'playId'));
  },

  renderSelectStatisticsInfo() {
    const statisticsInfo = this.model.getStatisticsInfo()
    this.$statisticsLottery.text(statisticsInfo.statistics)
    this.$statisticsMoney.text(statisticsInfo.prefabMoney)
    this.$statisticsRebateMoney.text(statisticsInfo.rebateMoney)
  },

  renderMaxBonus(model, formatMaxBonus) {
    this.$statisticsBonus.text(_(formatMaxBonus).convert2yuan())
  },

  renderTotalLotteryInfo(model, totalInfo) {
    this.$totalLottery.text(totalInfo.totalLottery)
    this.$totalMoney.text(_(totalInfo.totalMoney).convert2yuan())
    this.$totalRebateMoney.text(_(totalInfo.totalRebateMoney).convert2yuan())
  },

  getBonusMode(bonus, unit, userRebate, betMethod) {
    let bonusMode = _(bonus).chain().div(10000).mul(unit)
      .convert2yuan()
      .value()
    if (betMethod) {
      bonusMode += `/${_(userRebate).div(10)}%`
    } else {
      bonusMode += '/0.0%'
    }
    return bonusMode
  },

  renderLotteryPreviewAdd() {
    const previewList = this.model.get('previewList')
    const self = this

    const rows = _(previewList).map(function(previewInfo) {
      let title = `【${previewInfo.levelName}_${previewInfo.playName}】 `
      if (previewInfo.formatBettingNumber.length > 20) {
        title += `<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link bc-betting-preview-detail">${ 
          previewInfo.formatBettingNumber.slice(0, 20)}...</a>`
      } else {
        title += previewInfo.formatBettingNumber
      }

      return {
        title,
        bonusMode: this.getBonusMode(previewInfo.maxBonus, previewInfo.unit, previewInfo.userRebate, previewInfo.betMethod),
        mode: `${previewInfo.statistics}注 / ${previewInfo.multiple}倍 / <span class="">${_(previewInfo.prefabMoney).convert2yuan()}</span>元` +
        '<div class="js-bc-lottery-preview-del lottery-preview-del icon-block m-right-lg pull-right"></div>',
      }
    }, this)

    const $rows = this.lotteryPreview.renderRow(rows)

    $rows.each(function(index, row) {
      const $row = $(row)
      const $detail = $row.find('.js-bc-betting-preview-detail')
      let betNumber = previewList[index].bettingNumber
      const is11X5 = (self.options.ticketInfo.title.indexOf('11选5') !== -1)
      betNumber = is11X5 ? betNumber : betNumber.replace(/ /g, '')
      if ($detail.length) {
        $detail.popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: this.$el,
          content: `<div class="js-pf-popover"><span class="word-break">${betNumber}</span></div>`,
          placement: 'right',
        })
      }
    })

    this.$lotteryPreview.scrollTop(0)
  },
  renderLotteryPreviewDel(model, index) {
    if (_.isUndefined(index)) {
      this.lotteryPreview.renderEmpty()
    } else {
      this.lotteryPreview.delRow(index)
    }
  },

  addSelectLottery() {
    const bettingInfo = this.currentPlayAreaView.getBetting()
    const result = this.model.addPrevBet({
      lotteryList: bettingInfo.rowsResult,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'select',
    })

    if (result) {
      // if (!_.isEmpty(result)) {
      //   Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加');
      // }
      // this.currentPlayAreaView.empty();
      //
      // this.$('.js-bc-select-item-title').removeClass('active');
      if (!_.isEmpty(result)) {
        if (result.MaxBetNums && !_.isNull(result.MaxBetNums)) {
          Global.ui.notification.show(`超过玩法投注限制，该玩法最高投注注数为${result.MaxBetNums} 注，请重新选择  `)
        } else {
          Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加')
          this.currentPlayAreaView.empty()
          this.$('.js-bc-select-item-title').removeClass('active')
        }
      } else {
        this.currentPlayAreaView.empty()
        this.$('.js-bc-select-item-title').removeClass('active')
      }
    } else {
      Global.ui.notification.show('号码选择不完整，请重新选择！')
    }
  },

  addInputLottery() {
    const bettingInfo = this.currentPlayAreaView.getBetting()
    const result = this.model.addPrevBet({
      lotteryList: bettingInfo.passNumbers,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'input',
    })

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

  destroy() {
    Base.ItemView.prototype.destroy.apply(this, arguments)
    clearInterval(this.timer)
    this.BeenDistoryed = true
    _(this.TimeOutArr).each((item, index) => {
      console.log(`distroy timeout:index=${index},item=${item}`)
      clearTimeout(item)
    })
  },

  // event handlers

  // openVideoHandler: function(e) {
  //  var $target = $(e.currentTarget);
  //
  //  $target.attr('href', this.infoModel.getVideoUrl() || 'javascript:void(0)');
  // },

  baseRuleChangeHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')

    this.model.set({
      levelId: $target.data('id'),
      levelName: $target.data('title'),
    })
  },

  togglePlayModeHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    $target.addClass('active').siblings().removeClass('active')
    if (type === 'normal') {
      this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click')
      this.$basicRules.removeClass('hidden')
      this.$optionalRules.addClass('hidden')
    } else {
      this.$optionalRules.find('.js-bc-basic-rule').eq(0).trigger('click')
      this.$basicRules.addClass('hidden')
      this.$optionalRules.removeClass('hidden')
    }
  },

  advanceRuleChangeHandler(e) {
    const $target = $(e.currentTarget)
    const $parent = $target.closest('.js-bc-rules-toolbar')

    this.$advanceRules.find('.js-bc-advance-rule').removeClass('active')

    $target.addClass('active')

    this.model.set({
      groupId: $parent.data('id'),
      groupName: $parent.data('title'),
      playId: $target.data('id'),
      playName: $target.data('title'),
    })
  },

  betModeChangeHandler(e) {
    const $target = $(e.currentTarget)
    const $selectedOption = $target.find(':selected')
    const maxMultiple = $selectedOption.data('max')

    this.model.set({
      maxBonus: $selectedOption.data('maxBonus'),
      // formatBonusMode: $target.find(':selected').text(),
      betMethod: Number($target.val()),
      maxMultiple,
    })

    // this.$multiRange.numRange('setRange', 1, maxMultiple);
  },

  monetaryUnitChangeHandler(e) {
    const $target = $(e.currentTarget)

    $target.addClass('active').siblings().removeClass('active')

    this.model.set('unit', $target.data('rate'))
  },

  lotteryAddHandler() {
    const status = this.$btnConfirm.data('status')

    if (status !== '1' && status !== 1) {
      return false
    }

    if (!this.model.get('multiple')) {
      Global.ui.notification.show('倍数为0，不能投注')
      return false
    }
    this.rulesCollection.getPlayGroups(this.levelId)
    this.model.set({
      maxBetNums: this.rulesCollection.getPlayInfo(this.model.get('groupId'), this.model.get('playId')).maxBetNums,
    })
    if (this.options.type === 'select') {
      this.addSelectLottery()
    } else {
      this.addInputLottery()
    }
  },

  lotteryAutoAddHandler(e) {
    const $target = $(e.currentTarget)

    if (!this.model.get('multiple')) {
      Global.ui.notification.show('倍数为0，不能投注')
      return false
    }

    const lotteryResults = this.currentPlayAreaView.create(Number($target.data('times')))
    const result = this.model.addAutoBets(lotteryResults)

    if (!_.isEmpty(result)) {
      Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加')
    }
  },

  lotteryClearHandler() {
    this.model.emptyPrevBetting()
  },

  lotteryPreviewDelHandler(e) {
    const $target = $(e.currentTarget)
    const $row = $target.closest('.js-gl-static-tr')
    this.model.delPrevBetting($row.index())
  },

  startlotteryHandler() {
    const status = this.$btnConfirm.data('status')// 按钮状态：当前事件仅处理“1-马上开奖，3-再玩一次”这两个状态，“2-停止”由另一事件处理。
    if (status === '2' || status === 2) {
      return false
    }
    this.lotteryConfirmHandler()
  },

  // 波动拉杆,或者点击按钮
  lotteryConfirmHandler() {
    const self = this
    const status = this.$btnConfirm.data('status')// 按钮状态：当前事件仅处理“1-马上开奖，3-再玩一次”这两个状态，“2-停止”由另一事件处理。
    if (status === '2' || status === 2) {
      this.UserStop = true// 定义变量标记，用户操作了停止按钮。
      // 停止中改为开奖中
      this.$btnConfirm.text('开奖中')
      this.$btnConfirm.prop('disabled', true)
      return false
    }
    this.BetinfoList = []
    this.TimeOutArr = []
    this.BeenDistoryed = false
    this.UserStop = false// 用户终止
    this.NetException = false// 网络异常
    this.BettingFail = false // 投注失败
    this.HasWin = false// 中奖
    this.TotalPrize = 0

    this.BetTimes = this.$LotteryTime.val()
    this.LeftTimes = this.BetTimes
    this.WinStop = this.$WinStop.prop('checked')
    const info = this.model.pick('totalInfo', 'previewList')
    if (this.isBegin) return false

    const inputCount = _(info.previewList).reduce((inputCount, previewInfo) => {
      if (previewInfo.type === 'input') {
        inputCount += previewInfo.statistics
      }
      return inputCount
    }, 0)

    if (inputCount > 100000) {
      Global.ui.notification.show('非常抱歉，目前平台单式投注只支持最多10万注单。')
      return false
    }
    if (_.isEmpty(info.previewList)) {
      Global.ui.notification.show('请至少选择一注投注号码！')
      return false
    }

    if (info.totalInfo.totalMoney > Global.memoryCache.get('acctInfo').balance + (Number(this.$userRedPackBtn.data('type')) === 1 ? (this.redMomey * 10000) : 0)) {
      Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal">充值</a>。')
      return false
    }

    if (Global.memoryCache.get('acctInfo').foundsLock) {
      Global.ui.notification.show('资金已锁定，请先' + '<a href="javascript:void(0);" onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>' + '。')
      return false
    }

    // var confirm = $(document).confirm({
    //  title: '确认投注',
    //  content: this.confirmTpl({
    //    ticketInfo: this.options.ticketInfo,
    //    ticketName: this.options.ticketName,
    //    totalInfo: this.model.get('totalInfo'),
    //    previewList: info.previewList
    //  }),
    //  //size: 'modal-md',
    //  agreeCallback: function() {
    //
    //  }
    // }).confirm('instance');

    if (status === '1' || status === 1) {
      this.toggleShowDealOnce()
    } else {
      this.$reSelectBtn.addClass('hidden')
      this.toggleStopButton()
    }


    this.dealCycle()
    this.getUsePackInfoXhr()
  },
  toggleShowDealOnce() {
    // 隐藏选号区域
    this.toggleMainAreaShow()
    // 隐藏选号记录
    this.togglePrevBettingShow()
    // 隐藏连续投注输入框
    this.toggleContinueLotteryShow()
    // 隐藏投注概要
    this.toggleBriefShow()
    // 切换按钮文字由‘马上开奖’为'停止'，'再玩一次'为‘马上开奖’
    this.toggleSoonButton()
  },
  // 连续投注当期数据显示， 开始摇奖动画，下单，显示结果，循环调用？循环||终止
  dealCycle() {
    this.isBegin = true
    this.isReturn = false// 由于后续对isBegin的状态更新相对请求返回会有延迟，导致可能在初始动画中如果使用isBegin变量的判断可能出现误差，因此引入此状态
    this.LeftTimes--
    this.BetinfoList.push({ status: '0' })
    this.BetRes = undefined
    this.showWinResult(false)
    this.showLastResult(false)
    this.showLotteryTime(true, this.BetTimes - this.LeftTimes)
    if (!this.BeenDistoryed) {
      // 1.开始动画
      this.startAnimate()
    }
    if (!this.BeenDistoryed) {
      // 2.开始投注
      this.startBetting()
    }
  },

  startAnimate() {
    const self = this
    // 1.显示本轮投注数据、状态
    self.showCurrIsBetting()
    // 2.处理拉杆及按钮状态
    this.$btnStart.addClass('active')
    self.$('.js-bc-btn-lottery-confirm').button('loadding')
    // 3.准备动画参数
    const easing1 = 'linear'
    this.delay = 9// 测试环境，动画持续最长10S（未被外部强制终止的情况），6s内返回，则固定为6s停止，6s后返回，则固定增加1s
    this.left = 9
    const height = 85// 转动图片中每个数字的高度
    this.$('.mmc-num').css('backgroundPosition', '50% 0')// 数字复位
    const result = '0,0,0,0,0'// 初始化动画结束的位置
    const resultArr = (`${result}`).split(',')
    // 4.依次让五个数字开始转动
    this.$('.mmc-num').each(function(index) {
      const $num = $(this)
      // 启动每个数字的动画延时为50ms

      const AnimateTimeOut = setTimeout(() => {
        // "50px"为偏移量，确保动画自动终止不会停在正常位置,位置定位10*height为转动一圈
        $num.animate({
          backgroundPosition: `50% ${(height * 10 * self.delay * self.delay) - (height * resultArr[index]) + 50}px`,
        }, {
          duration: 1000 * self.delay + index * 50,
          easing: easing1,
          complete() {
            if (index == 0) {
              if (!self.isReturn) {
                self.isBegin = false
                self.isReturn = true
                // TODEL 待删除
                clearInterval(self.leftSecondCount)
                self.openException()
                // 顺序，以下两句相关
                self.NetException = true
                self.showCurrResult()
                // 提示异常
                Global.ui.notification.show('网络出现异常，本次投注结果获取失败！请前往投注记录查看投注详情！', {
                  type: 'fail',
                })
                self.refreshOpenHistory()
              }
            }
          },
        })
      }, 50)

      self.TimeOutArr.push(AnimateTimeOut)
    })
    // TODEL  开发用于计时测试。待删除
    this.leftSecondCount = setInterval(() => {
      self.left--
      console.log(`this.left:${self.left}`)
    }, 1000)
  },

  openException() {
    const self = this
    // 先影藏一下数字，并停止5个数字的所有动画
    this.$('.mmc-num').addClass('hidden')
    this.$('.mmc-num').stop()
    // 号码复位，显示
    this.OpenExceptionTimeOut = setTimeout(() => {
      self.$('.mmc-num').css('backgroundPosition', '50% 0')
      self.$('.mmc-num').removeClass('hidden')
    }, 1000)
  },

  // 开始投注
  startBetting() {
    const self = this
    self.model.saveBettingXhr('mmc')
      .always(() => {
        self.$('.js-bc-btn-lottery-confirm').button('reset')
        self.$btnStart.removeClass('active')
      })
      .done((res) => {
        console.log(`请求已返回：${self.isReturn}--${self.isBegin}`)
        if (!self.isReturn && self.isBegin && !self.BeenDistoryed) {
          self.isReturn = true

          // 保存投注结果对象
          const betInfo = self.BetinfoList[self.BetTimes - self.LeftTimes - 1]
          if (res && res.result === 0) {
            // TODO .正常停止摇奖,显示号码，
            self.BetRes = res.root
            betInfo.result = res.root.openCode
            betInfo.status = '1'
            betInfo.bonus = res.root.winPrize
            self.normalStop(res.root ? res.root : { openCode: '0,0,0,0,0' })
          } else {
            // 1.异常终止
            betInfo.status = '2'
            self.BetRes = 0
            self.abend(res)
          }
        } else {
          // 请求成功，

        }
      })
  },

  // 正常终止,num为开奖号
  normalStop(root) {
    const self = this
    const easing2 = 'linear'// 动画类型
    const height = 100// 滚动动画中的每个数字的高度

    // TODEL  待删除，开发时测试用于获取接口延时开奖情况
    clearInterval(self.leftSecondCount)

    console.log(`this.left in stop:${self.left}`)
    console.log(`this.isBegin in stop:${self.isBegin}`)

    // 如果单次开奖还未终止
    if (self.isBegin) {
      const resultArr = (`${root.openCode}`).split(',')
      self.$('.mmc-num').each(function(index) {
        const $num = $(this)
        let second = 0.5
        const delay = 200
        const stopAnimateTimeout =
          setTimeout(() => {
            // 1.停止之前固定时间的动画
            $num.stop()
            $num.css('backgroundPosition', '50% 0')
            // $num.css('top',0);
            // 计算剩余动画持续的时间，如果未超过3s,则总计运行3s.如果超过3s则默认运行0.5s后停下来（为了持续动画效果）
            const maxSec = 2.5
            if (self.left > (9 - maxSec)) {
              second = maxSec + self.left - 9
            }

            // 2.开始新的动画，剩余几秒则滚动几圈
            $num.animate({
              backgroundPosition: `50% ${(height * 10 * 90 * (index + 1) * (index + 1)) - (height * resultArr[index])}px`,
            }, {
              duration: 1000 * second + (index) * delay,
              easing: easing2,
              complete() {
                if (index == 4) {
                  // 待第五个数字完全停止
                  // clearInterval(self.leftSecondCount);
                  self.isBegin = false
                  Global.m.oauth.check()
                  // 1.更新开奖状态
                  self.showCurrResult()
                  // TODO 2.更新开奖记录
                  self.refreshOpenHistory()
                }
              },
            })
          }, delay * index)
        self.TimeOutArr.push(stopAnimateTimeout)
      })
    }
  },

  // 异常终止
  abend(res) {
    if (this.isBegin) {
      // 更新开始状态
      this.isBegin = false
      this.BettingFail = true
      this.openException()

      // TODEL 待删除，开发时测试用于获取接口延时开奖情况
      clearInterval(this.leftSecondCount)
      this.refreshOpenHistory()
      // 1.异常停止摇奖
      if (res.root && res.root.errorCode === 101) {
        Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal">充值</a>。')
      } else {
        Global.ui.notification.show(res.msg || '')
      }
      this.showCurrResult()
    }
  },

  toggleMainAreaShow() {
    this.$('.js-bc-main-area').slideToggle(500)

    const $Addition = this.$('.js-bc-mmc-addition-area')

    if ($Addition.hasClass('bc-mmc-addition-border')) {
      $Addition.removeClass('bc-mmc-addition-border')
    } else {
      const timeout = setTimeout(() => {
        $Addition.addClass('bc-mmc-addition-border')
      }, 400)
      this.TimeOutArr.push(timeout)
    }
  },
  toggleContinueLotteryShow() {
    this._toggleShow(this.$('.js-bc-mmc-continue-lottery'))
  },
  toggleBriefShow() {
    this._toggleShow(this.$('.js-bc-total-brief'))
  },
  togglePrevBettingShow() {
    this._toggleShow(this.$lotteryPreview)
  },
  togglePrevBettingCurrResultShow() {
    this._toggleShow(this.$lotteryCurrResultPreview)
  },
  togglePrevBettingTotalResultShow() {
    this._toggleShow(this.$lotteryTotalResultPreview)
  },
  _toggleShow($target) {
    if ($target) {
      if ($target.hasClass('hidden')) {
        $target.removeClass('hidden')
      } else {
        $target.addClass('hidden')
      }
    }
  },
  // 切换按钮文字由‘马上开奖’为'停止'，'再玩一次'为‘马上开奖’
  toggleSoonButton() {
    this.UserStop = false
    if (this.$btnConfirm.data('status') === '1' || this.$btnConfirm.data('status') === 1) {
      this._setConfirmButton('2')
    } else {
      this._setConfirmButton('1')
    }
  },
  // 切换按钮文字由‘停止’为'再玩一次'，'再玩一次'为‘停止’
  toggleStopButton() {
    this.UserStop = false
    if (this.$btnConfirm.data('status') === '2') {
      this._setConfirmButton('3')
    } else {
      this._setConfirmButton('2')
    }
  },

  _setConfirmButton(status) {
    this.$btnConfirm.removeClass('disabled')
    this.$btnConfirm.prop('disabled', false)
    if (status === '1') {
      this.$btnConfirm.text('马上开奖')
      this.$btnConfirm.data('status', 1)
    } else if (status === '2') {
      this.$btnConfirm.text('停止')
      this.$btnConfirm.data('status', 2)
    } else if (status === '3') {
      this.$btnConfirm.text('再玩一次')
      this.$btnConfirm.data('status', 3)
    }
  },
  // 重新选号按钮事件
  reSelectHandler() {
    this.showLotteryTime(false)
    this.$reSelectBtn.addClass('hidden')
    this.$lotteryCurrResultPreview.addClass('hidden')
    this.$lotteryTotalResultPreview.addClass('hidden')
    this.toggleShowDealOnce()
    this.model.emptyPrevBetting()// 删除之前的选号
    this.showWinResult(false)
    this.showLastResult(false)
    this.$LotteryTime.val(1)
    this.$WinStop.prop('checked', false)
  },

  showCurrResult() {
    const self = this
    // 隐藏整体投注结果，清空投注结果
    this.$lotteryTotalResultPreview.addClass('hidden')
    this.$lotteryCurrResultPreview.removeClass('hidden')
    // 显示本轮订单中奖详情,中奖金额或未中奖
    this.renderlotteryCurrResultPreview()
    // TODO 刷新记录，判断是否中奖
    if (this.BetRes && this.BetRes.winPrize && Number(this.BetRes.winPrize) > 0) {
      this.TotalPrize = this.TotalPrize + this.BetRes.winPrize
      this.HasWin = true
      // 中奖才弹中奖提示
      this.showWinResult(true, this.BetRes.winPrize)
      // Global.ui.notification.show('<div class="bc-mmc-bet-result-win">单次中奖</div>', {
      //  type: 'success'
      // });
    } else {
      this.showWinResult(false)
    }

    // TODO 当期投注结果显示停留时间，待调整
    const delay = 1
    let flag = false
    flag = this.LeftTimes > 0 && !this.UserStop && !this.NetException && !this.BettingFail && !(this.WinStop && this.HasWin)// 新的一轮开始时，需要重置
    console.log(`showCurrResult: UserStop-${this.UserStop}`)
    if (flag) {
      // 5。未完毕，开启延时连续投注
      const GoOnLottery = setTimeout(() => {
        self.dealCycle()
      }, 1000 * delay)
      self.TimeOutArr.push(GoOnLottery)
    } else {
      setTimeout(() => {
        self.showTotalResult()
      }, 1000 * delay)
    }
  },

  showTotalResult() {
    // 1.显示‘再玩一次’，显示‘重新选号’
    this._setConfirmButton('3')
    this.$reSelectBtn.removeClass('hidden')
    if (((this.BetTimes == 1 && this.TotalPrize == 0) || this.BetTimes > 1) && !this.NetException && !this.BettingFail) {
      this.showLastResult(true, this.TotalPrize)
    }
    // 显示整体投注结果，当前最近一期为‘异常终止’，后续投注为“未投注”，之前投注为‘未中奖’或‘金额’
    if (this.BetTimes > 1) {
      // 2隐藏当前期投注结果,清除数据
      this.$lotteryCurrResultPreview.addClass('hidden')
      this.$lotteryTotalResultPreview.removeClass('hidden')
      this.renderlotteryTotalResultPreview()
    }
  },

  showCurrIsBetting() {
    // 隐藏整体投注结果，清空投注结果
    this.$lotteryTotalResultPreview.addClass('hidden')
    this.$lotteryCurrResultPreview.removeClass('hidden')
    // 显示当前期投注结果，开奖中，
    this.renderlotteryCurrResultPreview()
  },
  // TODO 更新开奖记录
  refreshOpenHistory() {
    const self = this
    this.getOpenHistoryXhr({
      pageSize: 10,
      ticketId: this.options.ticketId,
    }).done((res) => {
      if (res.result == 0) {
        const openedList = _(res.root).map((item) => {
          return item.lotteryResult
        })
        const html = []
        // openedList = ['34567','56789','89012','54682','56289','83321','34267','56089','89012','49023'];
        _(openedList).each((item, index) => {
          html.push(self.generateOpenHistoryHtml(item))
        })
        self.$OpenHistory.fadeOut('fast', () => {
          self.$OpenHistory.html(html.join(''))
          self.$OpenHistory.fadeIn()
        })
      }
    })
  },
  generateOpenHistoryHtml(result) {
    const html = []
    const resultArr = result.split(',')
    _(resultArr).each((item, index) => {
      html.push(`<span>${item}</span>`)
    })
    return `<div class="bc-mmc-open-history-num">${html.join('')}</div>`
  },

  // TODO
  renderlotteryCurrResultPreview() {
    const previewList = this.model.get('previewList')
    const self = this
    const size = _(previewList).size()
    const rows = _(previewList).map(function(previewInfo, index) {
      let title = `【${previewInfo.levelName}_${previewInfo.playName}】 `
      if (previewInfo.formatBettingNumber.length > 20) {
        title += `<a href="javascript:void(0)" class="js-bc-betting-curr-preview-detail btn-link ">${ 
          previewInfo.formatBettingNumber.slice(0, 20)}...</a>`
      } else {
        title += previewInfo.formatBettingNumber
      }
      let status = '开奖中'

      if (this.BetRes) {
        status = '未中奖'
        if (this.BetRes.openResultList && _(this.BetRes.openResultList).size() === size) {
          const bonus = this.BetRes.openResultList[index].winPrize
          if (Number(bonus) > 0) {
            status = `<span class="bc-mmc-gold-coin-win " ></span>中奖${_(bonus).convert2yuan()}元`
          }
        }
      } else if (this.BetRes === 0) {
        status = '投注失败'
      }

      return {
        title,
        bonusMode: previewInfo.formatUnit,
        statistics: `${previewInfo.statistics}注`,
        multiple: `${previewInfo.multiple}倍`,
        status,
      }
    }, this)

    const $rows = this.lotteryCurrResultPreview.renderRow(rows)

    $rows.each((index, row) => {
      const $row = $(row)
      const $detail = $row.find('.js-bc-betting-curr-preview-detail')
      let betNumber = previewList[index].bettingNumber
      const is11X5 = (self.options.ticketInfo.title.indexOf('11选5') !== -1)
      betNumber = is11X5 ? betNumber : betNumber.replace(/ /g, '')
      if ($detail.length) {
        $detail.popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: self.$el,
          content: `<div class="js-pf-popover"><span class="word-break">${betNumber}</span></div>`,
          placement: 'right',
        })
      }
    })

    this.$lotteryCurrResultPreview.scrollTop(0)
  },

  // TODO
  renderlotteryTotalResultPreview() {
    const betList = this.model.get('betList')
    const self = this
    const betTimes = _.range(0, this.BetTimes, 1)
    const rows = _(betTimes).map((index) => {
      const betInfo = self.BetinfoList[index] || {}
      let result = betInfo.result
      let status = betInfo.status
      const bonus = betInfo.bonus
      if (status === '0') {
        status = '待确认'
      } else if (status === '1') {
        if (bonus > 0) {
          status = `<span class="bc-mmc-gold-coin-win " ></span>中奖${_(bonus).convert2yuan()}元`
        } else {
          status = '未中奖'
        }
      } else if (status === '2') {
        status = '投注失败'// 异常失败
      } else {
        status = '未投注'// 用户取消，或者异常终止投注
      }

      if (result === '' || !result) {
        result = '<span class="bc-mmc-result-num">-</span><span class="bc-mmc-result-num">-</span><span class="bc-mmc-result-num">-</span>' +
          '<span class="bc-mmc-result-num">-</span><span class="bc-mmc-result-num">-</span>'
      } else {
        result = _(result.split(',')).reduce((memo, num) => {
          return `${memo}<span class="bc-mmc-result-num">${num}</span>`
        }, '')
      }

      return {
        title: `第${index + 1}次开奖`,
        result: `开奖号码${result}`,
        status,
      }
    })
    const $rows = this.lotteryTotalResultPreview.renderRow(rows)
    this.$lotteryTotalResultPreview.scrollTop(0)
  },

  betTimesHandler(e) {
    const $target = $(e.currentTarget)
    const times = $target.data('id')
    if (times > 0) {
      this.$LotteryTime.val(times)
    } else {
      e.stopPropagation()
      // e.preventDefault();
    }
  },
  openHistoryTurnPage(e) {
    const self = this
    if (!this.canTrunPage) {
      return
    }

    const type = $(e.currentTarget).data('type')
    const height = -31
    const $target = this.$OpenHistory
    const currentY = $target.position().top
    const speed = 500
    const easing = 'linear'
    if (type === 'up') {
      if (currentY > -280) {
        this.canTrunPage = false
        $target.animate({ top: currentY + height }, speed, easing, () => {
          self.canTrunPage = true
        })
      }
      // $target.fadeOut(speed,function() {
      //  $target.css('top', currentY + height);
      //  $target.fadeIn(speed);
      // });
    } else if (currentY < 0) {
      this.canTrunPage = false
      $target.animate({ top: currentY - height }, speed, easing, () => {
        self.canTrunPage = true
      })
    }
  },
  showWinResult(flag, prize) {
    if (flag) {
      this.$CurrentResultMask.addClass('hidden')
      this.$CurrentResult.removeClass('hidden')
      this.$CurrentResult.html(`<span>恭喜您，中奖金额为${_(prize).convert2yuan()}元！</span>`)
    } else {
      this.$CurrentResult.addClass('hidden')
      this.$CurrentResult.html('<span></span>')
    }
  },
  showLastResult(flag, prize) {
    if (flag) {
      this.$CurrentResult.addClass('hidden')
      if (prize > 0) {
        this.$CurrentResultTotal.removeClass('bc-mmc-result-lost-total')
        this.$CurrentResultTotal.addClass('bc-mmc-result-win-total')
        this.$CurrentResultTotal.html(`<span>总计中奖金额为<span class="bc-mmc-result-win-total-amount">${_(prize).convert2yuan()}</span>元</span>`)
      } else {
        this.$CurrentResultTotal.removeClass('bc-mmc-result-win-total')
        this.$CurrentResultTotal.addClass('bc-mmc-result-lost-total')
        this.$CurrentResultTotal.html('<span></span>')
      }
      this.$CurrentResultMask.removeClass('hidden')
    } else {
      this.$CurrentResultMask.addClass('hidden')
      this.$CurrentResultTotal.html('<span></span>')
    }
  },
  lotteryTimesChange(e) {
    const $target = $(e.currentTarget)
    const val = Number($target.val())
    if (val !== NaN && _(val).isNumber()) {
      if (Number(val) > 50) {
        $target.val(50)
      } else if (Number(val) < 1) {
        $target.val(1)
      } else {
        $target.val(_(val).floor(0))
      }
    } else {
      $target.val(1)
    }
  },
  showLotteryTime(flag, time) {
    if (flag && time > 0) {
      this.$LotteryTimeShow.removeClass('hidden')
      this.$LotteryTimeShow.html(`第<span class="bc-mmc-bet-times-num">${time}</span>次开奖`)
    } else if (!flag) {
      this.$LotteryTimeShow.addClass('hidden')
      this.$LotteryTimeShow.html('')
    }
  },
  getTicketInfoAndDeal() {
    const self = this
    this.getTicketInfoXhr({ ticketId: this.options.ticketId }).done((res) => {
      res.result === 0 ? self.ticketInfo = res.root : self.ticketInfo = null
      if (res.result === 0) {
        if (res.root && res.root.sale) {

        } else {
          self.$btnAdd.prop('disabled', true)
          self.$btnConfirm.prop('disabled', true)
          self.$btnStart.prop('disabled', true)
          self.$('.js-bc-mmc-num-box').addClass('hidden')

          self.$('.js-bc-mmc-num-box-stop').removeClass('hidden')
        }
      } else {
        self.$btnAdd.prop('disabled', true)
        self.$btnConfirm.prop('disabled', true)
        self.$btnStart.prop('disabled', true)
        self.$('.js-bc-mmc-num-box').addClass('hidden')
        self.$('.js-bc-mmc-num-box-stop').removeClass('hidden')
      }
    })
  },
  getUsePackInfoXhr () {
    return Global.sync.ajax({
      url: '/info/redpack/ticketamount.json',
      data: {
        ticketId: this.options.ticketId,
      },
    })
  },
  getUsePackStatus () {
    const self = this
    this.getUsePackInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.root && res.root != 0) {
            self.$bcUserRed.removeClass('hidden')
            self.$bcRedMoney.html(`(${_(res.root).convert2yuan()})`)
          } else {
            self.$bcUserRed.addClass('hidden')
          }
        }
      })
  },
  checkUserRedPackHanler (e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    Number(type) === 0 ? $target.removeClass('sfa sfa-checkbox-def').addClass('sfa sfa-checkbox-on') : $target.removeClass('sfa sfa-checkbox-on').addClass('sfa sfa-checkbox-def')
    Number(type) === 0 ? $target.data('type', 1) : $target.data('type', 0)
    this.model.set('usePack', $target.data('type'))
  },

})

module.exports = BettingCenterView
