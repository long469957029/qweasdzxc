

const BettingChoiceModel = require('bettingCenter/models/bettingChoice')
const BettingInfoModel = require('bettingCenter/models/bettingInfo')

const BettingRecordsView = require('bettingCenter/views/bettingCenter-records')
const BettingChaseView = require('bettingCenter/views/bettingCenter-chase')
const ticketConfig = require('skeleton/misc/ticketConfig')
const betRulesConfig = require('bettingCenter/misc/betRulesConfig')

const BettingCenterView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter.html'),

  rulesTpl: _.template(require('bettingCenter/templates/bettingCenter-rules.html')),
  confirmTpl: _.template(require('bettingCenter/templates/bettingCenter-confirm.html')),
  commitTpl: _.template(require('bettingCenter/templates/bettingCenter-commit.html')),

  events: {
    'click .js-bc-btn-lottery-add': 'lotteryAddHandler',
    'click .js-bc-lottery-auto': 'lotteryAutoAddHandler',
    'click .js-bc-lottery-clear': 'lotteryClearHandler',
    'click .js-bc-lottery-preview-del': 'lotteryPreviewDelHandler',
    'click .js-bc-chase': 'lotteryChaseHandler',
    'click .js-bc-btn-lottery-confirm': 'lotteryConfirmHandler',
    'click .js-bc-btn-lottery-buy': 'lotteryBuyHandler',
    'click .js-bc-select-item': 'selectBcItemHandler',
    'click .js-bc-user-redPack-btn': 'checkUserRedPackHanler',
    'change .js-bc-unit-select-add': 'changeUnitSelect',
  },

  initialize () {
    this.model = new BettingChoiceModel()
    this.infoModel = new BettingInfoModel()
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()

    // 如果是六合彩加载生肖对应的球
    if (_.indexOf(this.mark6TicketIdArr, parseInt(this.options.ticketId, 10)) > -1) {
      this.getMark6SxNumber({ ticketId: this.options.ticketId })
    }

    this.getNewPlan()
    this.serializeData()
    this.model.set('ticketId', Number(this.options.ticketId))

    this.listenTo(this.infoModel, 'change:sale change:pending', this.renderSalePending)
    this.listenTo(this.infoModel, 'change:lastOpenId', this.renderLastPlan)

    this.listenTo(this.infoModel, 'change:leftSecond', this.updateCountdown)
    this.listenTo(this.infoModel, 'change:planId', this.renderBasicInfo)

    this.listenTo(this.model, 'change:playId', function(model, playId) {
      this.renderPlayArea()
      this.renderPlayInfo(this.rulesCollection.getPlayInfo(model.get('groupId'), playId))
    })

    this.listenTo(this.model, 'change:unit', this.renderPlayBetMode)

    this.listenTo(this.model, 'change:prefabMoney change:rebateMoney', this.renderSelectStatisticsInfo)

    this.listenTo(this.model, 'change:prefabMoney change:rebateMoney', this.selectBcItemHandler)
    this.listenTo(this.model, 'change:previewList', this.renderLotteryPreviewAdd)
    this.listenTo(this.model, 'change:previewList:del', this.renderLotteryPreviewDel)
    this.listenTo(this.model, 'change:totalInfo', this.renderTotalLotteryInfo)

    // this.listenTo(this.model,'change:maxBonus',this.renderBetMode);

    // 快捷入口
    this.on('entry:show router:back', function() {
      this.bettingRecordsView.update()
      if (this.$el.closest('html').length !== 0) {
        Global.newbieActivity.checkBetting()
      }
    })
  },

  onRender() {
    const self = this
    this.$planId = this.$('.js-bc-planId')
    this.$planIdStop = this.$('.js-bc-planId-stop')

    // playInfo
    // this.$playTip = this.$('.js-bc-play-tip')
    this.$playExample = this.$('.js-bc-play-example')
    this.$playBetMode = this.$('.js-bc-bet-mode')

    // playArea
    this.$playArea = this.$('.js-bc-play-area')

    //
    this.$statisticsLottery = this.$('.js-bc-statistics-lottery')
    this.$statisticsMoney = this.$('.js-bc-statistics-money')
    // this.$statisticsRebateMoney = this.$('.js-bt-statistics-rebateMoney')

    // 疑似失效属性
    this.$statisticsBonus = this.$('.js-bc-statistics-bonus')

    // betting preview
    this.$lotteryPreview = this.$('.js-bc-lottery-preview')

    // total
    this.$totalLottery = this.$('.js-bc-total-lottery')
    this.$totalMoney = this.$('.js-bc-total-money')
    // this.$totalRebateMoney = this.$('.js-bc-total-rebateMoney')

    this.$recordsContainer = this.$('.js-bc-records')

    //= =====
    this.$bcUserRed = this.$('.js-bc-user-red')
    this.$bcRedMoney = this.$('.js-bc-red-money')
    this.$btnAdd = this.$('.js-bc-btn-lottery-add')
    this.$btnConfirm = this.$('.js-bc-btn-lottery-confirm')
    this.$btnChase = this.$('.js-bc-chase')
    this.$btnBuy = this.$('.js-bc-btn-lottery-buy')
    this.$footer = $('#footer')
    this.$bcSideArea = this.$('.js-bc-side-area')

    this.initNumRange()

    this.lotteryPreview = this.$lotteryPreview.staticGrid({
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
    this.subscribe('bet', 'bet:updating', (data) => {
      self.selectNum(data)
    })
  },
  selectNum (data) {
    const self = this
    if (data && !_.isNull(data) && !_.isUndefined(data) && !_.isEmpty(data)) {
      this.ticketRuleId = data.ticketRuleId
      this.ticketPlayId = data.ticketPlayId
      this.selectDefaultPlay()
      if (data.num && !_.isNull(data.num) && !_.isUndefined(data.num)) {
        const numArr = data.num.split(',')
        if (data.num.indexOf('-') > -1) {
          _(numArr).each((item, index) => {
            if (item !== '-') {
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
  onShow() {
    if (this.$el.closest('html').length !== 0) {
      Global.newbieActivity.checkBetting()
    }
  },

  // sale优先级比pending高，pending:true时表示等待开奖
  renderSalePending(model) {
    const info = model.pick('sale', 'pending')
    const sale = info.sale
    const pending = info.pending
    this.$btnAdd.prop('disabled', !sale)
    this.$btnConfirm.prop('disabled', !sale)
    this.$btnChase.prop('disabled', !sale)
    this.$btnBuy.prop('disabled', !sale)

    if (sale) {
      this.getNewPlan()
      if (pending) {
        // 等待开奖时按钮不可点
        this.$btnAdd.prop('disabled', true)
        this.$btnConfirm.prop('disabled', true)
        this.$btnChase.prop('disabled', true)
        this.$btnBuy.prop('disabled', true)
        this.$planId.toggleClass('hidden', true)
        this.$planIdStop.toggleClass('hidden', true)
      }
    } else {
      // 停售的优先级更高
      this.infoModel.set('leftSecond', 0)
      this.updateCountdown()
      if (this.$el.closest('html').length !== 0) {
        Global.ui.notification.show('<p class="font-md">非常抱歉，目前此彩种暂停销售</p>' +
          '重新开启销售时间请留意平台公告。')
      }
    }
  },

  renderLastPlan() {
    this.bettingRecordsView.update()
  },

  _slotMachineEffect(openNum, show) {
    let startflag = false
    // var index=0;
    function reset(el) {
      el.css({ top: 0 })
    }
    function letGo(numCol, top, time) {
      $(numCol).animate({ top: -275 }, 600, 'linear', function () {
        $(this).css('top', 0).animate({ top }, time, 'linear')
      })
    }

    // $(".main3-btn").click(function () {
    let $numCols = ''
    if (!startflag) {
      if (show) {
        $numCols = $('.num-con')
      } else {
        $numCols = this.$lastResults2.find('.num-con')
      }

      startflag = true
      reset($numCols)
      _(openNum).each((num, index) => {
        const top = -(11 - num) * 25
        const time = index * 50 + 300
        letGo($numCols[index], top, time)
      })
      setTimeout(() => {
        startflag = false
      }, 1000)
      // index++;
    }
    // });
  },

  renderBasicInfo(model) {
    const planInfo = model.pick('planId', 'lastPlanId', 'sale', 'pending')

    if (this.infoModel.get('init')) {
      this.infoModel.changeToUpdate()
    } else if (this.$el.closest('html').length !== 0 && planInfo.sale && planInfo.lastPlanId !== planInfo.planId) {
      if (!planInfo.pending) {
        Global.ui.notification.show(
          `<span class="text-danger">${planInfo.lastPlanId}</span>期已截止<br/>当前期为<span class="text-danger">${planInfo.planId}</span>期<br/>投注时请注意期号！`,
          { id: 'ticketNotice', hasFooter: false, displayTime: 800 },
        )
        // setTimeout(function(){
        //   $('.modal-backdrop').remove();
        // },800);
      }
    }
  },

  renderBasicRules() {
    this.selectDefaultPlay()
  },

  // 加载号码球
  renderPlayArea() {
    const playRule = betRulesConfig.get(this.model.pick('playId'))
    // const page = playRule.page
    const levelId = this.model.get('levelId')
    const sxLevelIdArr = betRulesConfig.getMark6SpecialInfo().sxLevelIdArr
    // 如果是六合-生肖显示对应的生肖号码
    if (_.indexOf(sxLevelIdArr, parseInt(levelId, 10)) > -1) {
      if (this.options.mark6SxNumber) {
        playRule.list[0].items = this.options.mark6SxNumber
      }
      _(playRule.list[0].items).each((item) => {
        const arr = []
        _(item.nums).each((num) => {
          num = parseInt(num, 10)
          if (_.indexOf(playRule.list[0].htmlNeedInfo.sxColorArr.redArr, num) > -1) {
            arr.push('red')
          } else if (_.indexOf(playRule.list[0].htmlNeedInfo.sxColorArr.blueArr, num) > -1) {
            arr.push('blue')
          } else {
            arr.push('green')
          }
        })
        item.colorClass = arr
      })
    }
    const twLevelIdArr = betRulesConfig.getMark6SpecialInfo().twLevelIdArr
    // 如果是六合-头尾玩法显示对应的生肖号码
    if (_.indexOf(twLevelIdArr, parseInt(levelId, 10)) > -1) {
      _(playRule.list[0].items).each((item) => {
        const arr = []
        _(item.nums).each((num) => {
          num = parseInt(num, 10)
          if (_.indexOf(playRule.list[0].htmlNeedInfo.twColorArr.redArr, num) > -1) {
            arr.push('red')
          } else if (_.indexOf(playRule.list[0].htmlNeedInfo.twColorArr.blueArr, num) > -1) {
            arr.push('blue')
          } else {
            arr.push('green')
          }
        })
        item.colorClass = arr
      })
    }
    // 六合、无限六合彩
    // 特码-特码、正码-正码、正码-正码1、正码-正码2、正码-正码3、正码-正码4、正码-正码5、正码-正码6
    // const tm_zm_playIdArr = betRulesConfig.getMark6SpecialInfo().tm_zm_playIdArr
    // if ((_.indexOf(tm_zm_playIdArr, playId) > -1) && this.options.mark6SxNumber) {
    //   playRule.list[0].htmlNeedInfo.groupSelectData = this.options.mark6SxNumber
    // }

    if (this.currentPlayAreaView) {
      this.currentPlayAreaView.destroy()
    }

    if (_.isEmpty(playRule)) {
      return
    }

    playRule.ticketId = this.model.get('ticketId')

    // switch (playRule.type) {
    //   case 'select':
    //     this.currentPlayAreaView = new PlayAreaSelectView(playRule, page)
    //     break
    //   case 'input':
    //     this.currentPlayAreaView = new PlayAreaInputView(playRule)
    //     break
    //   default:
    //     break
    // }

    this.options.type = playRule.type

    this.currentPlayAreaView.on('statistic', function(statistics) {
      this.model.set({
        statistics,
      })
    }, this)

    this.$playArea.html(this.currentPlayAreaView.render().el).addClass('loaded')

    // console.log(this.model.pick('ticketId', 'levelId', 'groupId', 'playId'));
  },

  renderSelectStatisticsInfo() {
    const statisticsInfo = this.model.getStatisticsInfo()
    this.$statisticsLottery.text(statisticsInfo.statistics)
    this.$statisticsMoney.text(statisticsInfo.prefabMoney)
    // this.$statisticsRebateMoney.text(statisticsInfo.rebateMoney)
  },

  // 疑似失效方法
  renderMaxBonus(model, formatMaxBonus) {
    this.$statisticsBonus.text(_(formatMaxBonus).convert2yuan())
  },

  renderTotalLotteryInfo(model, totalInfo) {
    this.$totalLottery.text(totalInfo.totalLottery)
    this.$totalMoney.text(_(totalInfo.totalMoney).convert2yuan())
    // this.$totalRebateMoney.text(_(totalInfo.totalRebateMoney).convert2yuan())
  },

  getBonusMode(bonus, unit) {
    const bonusMode = _(bonus).chain().div(10000).mul(unit)
      .convert2yuan()
      .value()
    // if (betMethod) {
    //   bonusMode += `/${_(userRebate).div(10)}%`
    // } else {
    //   bonusMode += '/0.0%'
    // }
    return `${bonusMode}元`
  },
  changeUnitSelect(e) {
    const $target = $(e.currentTarget)
    const $row = $target.closest('.js-gl-static-tr')
    const val = $target.val()
    // this.model.delPrevBetting($row.index())
    console.log(`${$row.index()},${val}`)
  },
  renderLotteryPreviewAdd() {
    const previewList = this.model.get('previewList')
    const self = this

    const rows = _(previewList).map(function(previewInfo) {
      const title = `${previewInfo.levelName}_${previewInfo.playName}`
      let betNum = ''
      if (previewInfo.formatBettingNumber.length > 20) {
        betNum = `<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link">${ 
          previewInfo.formatBettingNumber.slice(0, 20)}...</a>`
      } else {
        betNum = previewInfo.formatBettingNumber
      }
      // const multipleDiv = `<div class="js-bc-betting-multiple-add-${index} p-top-xs"></div>`
      const modeSelect = `<select name="" class="js-bc-unit-select-add select-default bc-unit-select-add">
              <option value="10000" ${previewInfo.multiple === 10000 ? 'selected' : ''}>元</option>
              <option value="1000" ${previewInfo.multiple === 1000 ? 'selected' : ''}>角</option>
              <option value="100" ${previewInfo.multiple === 100 ? 'selected' : ''}>分</option>
              <option value="10" ${previewInfo.multiple === 10 ? 'selected' : ''}>厘</option>
            </select>`

      return {
        title,
        betNum,
        note: `${previewInfo.statistics}注`,
        multiple: previewInfo.multiple, // multipleDiv
        mode: modeSelect,
        bettingMoney: `${_(previewInfo.prefabMoney).convert2yuan()}元`,
        profit: this.getBonusMode(previewInfo.maxBonus, previewInfo.unit, previewInfo.userRebate, previewInfo.betMethod),
        operate: '<div class="js-bc-lottery-preview-del lottery-preview-del icon-block m-right-md pull-right"></div>',
      }
    }, this)

    const $rows = this.lotteryPreview.renderRow(rows)

    $rows.each(function(index, row) {
      const $row = $(row)
      const $detail = $row.find('.js-bc-betting-preview-detail')
      // const $multipleAdd = $row.find(`.js-bc-betting-multiple-add-${index}`)
      let betNumber = previewList[index].bettingNumber
      const is11X5 = (self.options.ticketInfo.title.indexOf('11选5') !== -1)
      betNumber = is11X5 ? betNumber : betNumber.replace(/ /g, '')

      const lotteryInfo = self.model.pick('ticketId', 'playId')
      if (_.indexOf(this.mark6TicketIdArr, parseInt(lotteryInfo.ticketId, 10)) > -1) {
        // 六合彩、无限六合彩
        // 特码-两面，特码-色波，正码-两面1，正码-两面2，正码-两面3，正码-两面4，正码-两面5，正码-两面6，生肖-特肖，生肖-一肖，头尾-头尾，总和-总和
        const tm_zm_sx_tw_zh_playIdArr = betRulesConfig.getMark6SpecialInfo().tm_zm_sx_tw_zh_playIdArr
        if (_.indexOf(tm_zm_sx_tw_zh_playIdArr, lotteryInfo.playId) > -1) {
          betNumber = previewList[index].formatBettingNumber
        }
      }
      // $multipleAdd.numRange({
      //   defaultValue: previewList[index].multiple,
      //   size: 'md',
      //   onChange(num) {
      //     self.changePreviewMultiple(index, num)
      //   },
      //   onOverMax(maxNum) {
      //     Global.ui.notification.show(`您填写的倍数已超出平台限定的单注中奖限额<span class="text-pleasant">
      //       ${_(self.rulesCollection.limitMoney).convert2yuan()}</span>元，已为您计算出本次最多可填写倍数为：<span class="text-pleasant">${maxNum}</span>倍`)
      //   },
      // })

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

  addSelectLottery(opt) {
    const bettingInfo = this.currentPlayAreaView.getBetting()
    const result = this.model.addPrevBet({
      lotteryList: bettingInfo.rowsResult,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'select',
      formatToNum: bettingInfo.formatToNum,
      formatToNumInfo: bettingInfo.formatToNumInfo,
    }, opt)

    if (result) {
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

  addInputLottery(opt) {
    const bettingInfo = this.currentPlayAreaView.getBetting()
    const result = this.model.addPrevBet({
      lotteryList: bettingInfo.passNumbers,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'input',
      formatToNum: bettingInfo.formatToNum,
    }, opt)

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
  },

  // event handlers

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
    // const $detail = $row.find('.js-bc-betting-preview-detail')
    // $detail.popover('destroy');
    $('.popover').remove()
    this.model.delPrevBetting($row.index())
  },

  lotteryChaseHandler() {
    const self = this
    const info = this.model.pick('previewList', 'totalInfo')

    if (_.isEmpty(info.previewList)) {
      Global.ui.notification.show('请至少选择一注投注号码！')
      return
    }

    // 腾讯分分彩，金额限制1000元
    if (this.options.ticketId === 31 && _(info.totalInfo.totalMoney).formatDiv(10000) > ticketConfig.getComplete(31).info.betAmountLimit) {
      Global.ui.notification.show(`试运行期间，每期单笔投注不超过${ticketConfig.getComplete(31).info.betAmountLimit}元。`)
      return false
    }

    if (Global.memoryCache.get('acctInfo').foundsLock) {
      Global.ui.notification.show('资金已锁定，请先<a id="js-open-fc-unlock" href="javascript:void(0);" ' +
        'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
      return false
    }
    let chaseView
    const $dialog = Global.ui.dialog.show({
      title: '追号',
      size: 'modal-lg',
      body: '<div class="js-bc-chase-container"></div>',
      bodyClass: 'p-top-xs no-p-left no-p-right no-p-bottom',
      footer: '',
    })

    const $chaseContainer = $dialog.find('.js-bc-chase-container')

    $dialog.on('hidden.modal', function() {
      $(this).remove()
      chaseView.destroy()
    })

    chaseView = new BettingChaseView({
      el: $chaseContainer,

      limitMoney: this.rulesCollection.limitMoney,
      ticketInfo: this.options.ticketInfo,
      planId: this.infoModel.get('planId'),
      ticketId: this.options.ticketId,
      previewList: info.previewList,
      totalLottery: this.model.get('totalInfo').totalLottery,
      usePack: 0,
    }).on('check:redPack', () => {
      self.getUsePackStatus()
    }).render()

    chaseView.listenTo(this.infoModel, 'change:planId', function() {
      const planInfo = self.infoModel.pick('planId', 'lastPlanId')
      if (planInfo.lastPlanId !== planInfo.planId) {
        this.trigger('change:planId', planInfo.lastPlanId)
      }
    })

    chaseView.on('submit:complete', () => {
      self.model.emptyPrevBetting()
      self.bettingRecordsView.update()
      $dialog.modal('hide')
    })
  },

  lotteryConfirmHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const info = this.model.pick('totalInfo', 'previewList')
    let planId = self.infoModel.get('planId')

    const inputCount = _(info.previewList).reduce((_inputCount, previewInfo) => {
      if (previewInfo.type === 'input') {
        _inputCount += previewInfo.statistics
      }
      return _inputCount
    }, 0)

    if (inputCount > 100000) {
      Global.ui.notification.show('非常抱歉，目前平台单式投注只支持最多10万注单。')
      return false
    }
    if (_.isEmpty(info.previewList)) {
      Global.ui.notification.show('请至少选择一注投注号码！')
      return false
    }


    // 腾讯分分彩，金额限制1000元
    if (this.options.ticketId === 31 && _(info.totalInfo.totalMoney).formatDiv(10000) > ticketConfig.getComplete(31).info.betAmountLimit) {
      Global.ui.notification.show(`试运行期间，每期单笔投注不超过${ticketConfig.getComplete(31).info.betAmountLimit}元。`)
      return false
    }

    if (Global.memoryCache.get('acctInfo').foundsLock) {
      Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" ' +
        'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
      return false
    }

    const confirm = $(document).confirm({
      title: '确认投注',
      content: this.confirmTpl({
        ticketInfo: this.options.ticketInfo,
        ticketName: this.options.ticketName,
        planId,
        totalInfo: this.model.get('totalInfo'),
        previewList: info.previewList,
      }),
      size: 'bc-betDetail-confirm-dialog',
      agreeCallback() {
        $target.button('loading')

        self.model.saveBettingXhr(planId)
          .always(() => {
            $target.button('reset')
          })
          .done((res) => {
            if (res && res.result === 0) {
              self.bettingRecordsView.update()
              self.model.emptyPrevBetting()

              Global.m.oauth.check()

              Global.ui.notification.show('投注成功！', {
                type: 'success',
                hasFooter: false,
                displayTime: 800,
              })
              self.getUsePackStatus()
            } else if (res.root && res.root.errorCode === 101) {
              Global.ui.notification.show('账号余额不足，请先<a href="#fc/re" class="router btn-link btn-link-pleasant"  data-dismiss="modal">充值</a>。')
            } else {
              Global.ui.notification.show(res.msg || '')
            }
          })
      },
    }).confirm('instance')
    function changePlanId(model, newPlanId) {
      planId = newPlanId
      confirm.element.find('.js-bc-confirm-planId').text(planId)
    }
    this.infoModel.off('change:planId', changePlanId).on('change:planId', changePlanId)
  },

  lotteryBuyHandler (e) {
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
  },

  /** 获取当前选中号码的元素 */
  selectBcItemHandler() {
    /** 奖金数组 从模型betChoice 获得 */
    let betBonus = this.model.get('betBonus')

    /** 判断奖金数组是否为空 */
    if (betBonus !== null) {
      /** 获取号码组数组 */
      const $items = this.$('.js-bc-select-item')
      const $options = this.$playBetMode.children('option')
      /** 判断当前 选号区 是 选中 还是 取消 状态 */
      if ($items.hasClass('active')) {
        const indexs = []
        /** 获取选中号码的下标数组 */
        $items.each((i, item) => {
          if ($(item).hasClass('active')) {
            indexs.push(i)
          }
        })
        /** 根据 indexs 从 betBonus 中选择出关键值组 */
        const selectBonus = _(betBonus).chain().sortBy((info) => {
          return info.betType
        }).filter((item, index) => {
          return _(indexs).contains(index)
        })
          .value()

        betBonus = _(selectBonus).max((item) => {
          return item.betMethodMax
        })

        $options.eq(0)
          .attr('data-max-bonus', betBonus.betMethodMax)
          .data('max-bonus', betBonus.betMethodMax)
          .attr('data-max', betBonus.betMultiLimitMax)
          .data('max', betBonus.betMultiLimitMax)
        $options.eq(1)
          .attr('data-max-bonus', betBonus.betMethodMin)
          .data('max-bonus', betBonus.betMethodMin)
          .attr('data-max', betBonus.betMultiLimitMin)
          .data('max', betBonus.betMultiLimitMin)

        // 返水率
        const userRebate = this.model.get('userRebate')
        // 单位
        const unit = this.model.get('unit')
        if (_.indexOf(this.mark6TicketIdArr, parseInt(this.model.get('ticketId'), 10)) > -1) {
          $options.eq(0).html('高奖金模式')
          $options.eq(1).html('高返点模式')
        } else {
          $options.eq(0).html(this.getBonusMode(betBonus.betMethodMax, unit, 0, 0))
          $options.eq(1).html(this.getBonusMode(betBonus.betMethodMin, unit, userRebate, 1))
        }
      } else {
        this.$('.js-wt-number').val(1)
        if (_.indexOf(this.mark6TicketIdArr, parseInt(this.model.get('ticketId'), 10)) > -1) {
          this.$playBetMode.html('<option value="0" data-max="1" data-max-bonus="0">高奖金模式</option><option value="1" data-max="1" data-max-bonus="0">高返点模式</option>')
        } else {
          this.$playBetMode.html('<option value="0" data-max="1" data-max-bonus="0">─ ─/0.0%</option><option value="1" data-max="1" data-max-bonus="0">─ ─/0.0%</option>')
        }
      }
      // 给select触发change事件
      this.$playBetMode.trigger('change')
    }
    return this.$playBetMode.html()
  },

  getTicketInfotXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketinfo.json',
      async: false,
      data,
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
  // 获取六合彩生肖对应的号码
  getMark6SxNumber(data) {
    let options = this.options
    Global.sync.ajax({
      url: '/ticket/ticketmod/spNum.json',
      async: false,
      data,
    }).done((res) => {
      if (res && res.result === 0) {
        options.mark6SxNumber = _.sortBy(res.root.spNums, 'id')
      }
      options = null
    })
  },
  // 六合彩号码球上的赔率数
  setMark6NumberOdds(maxBonus) {
    if (maxBonus) {
      const unit = this.model.get('unit')
      let odds = _(maxBonus).chain().div(10000).mul(unit)
        .div(2)
        .convert2yuan()
        .value()
      odds = Math.floor(odds * 100) / 100 // 保留2位小数
      return odds
    }
    return maxBonus
  },
})

module.exports = BettingCenterView