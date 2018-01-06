
const BettingChaseView = require('bettingCenter/views/bettingCenter-chase')

const betRulesConfig = require('bettingCenter/misc/betRulesConfig')

const BettingCenterView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter.html'),

  events: {
    'click .js-bc-lottery-auto': 'lotteryAutoAddHandler',
    'click .js-bc-chase': 'lotteryChaseHandler',
  },

  initialize () {
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()

    // 如果是六合彩加载生肖对应的球
    if (_.indexOf(this.mark6TicketIdArr, parseInt(this.options.ticketId, 10)) > -1) {
      this.getMark6SxNumber({ ticketId: this.options.ticketId })
    }

    this.listenTo(this.infoModel, 'change:sale change:pending', this.renderSalePending)

    this.listenTo(this.infoModel, 'change:planId', this.renderBasicInfo)

    this.listenTo(this.model, 'change:playId', function(model, playId) {
      this.renderPlayArea()
      this.renderPlayInfo(this.rulesCollection.getPlayInfo(model.get('groupId'), playId))
    })

    this.listenTo(this.model, 'change:unit', this.renderPlayBetMode)

    this.listenTo(this.model, 'change:prefabMoney change:rebateMoney', this.renderSelectStatisticsInfo)

    this.listenTo(this.model, 'change:previewList', this.renderLotteryPreviewAdd)
    this.listenTo(this.model, 'change:previewList:del', this.renderLotteryPreviewDel)
    this.listenTo(this.model, 'change:totalInfo', this.renderTotalLotteryInfo)

    // this.listenTo(this.model,'change:maxBonus',this.renderBetMode);
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

    // betting preview
    this.$lotteryPreview = this.$('.js-bc-lottery-preview')


    //= =====
    this.$bcUserRed = this.$('.js-bc-user-red')
    this.$bcRedMoney = this.$('.js-bc-red-money')
    this.$btnAdd = this.$('.js-bc-btn-lottery-add')
    this.$btnConfirm = this.$('.js-bc-btn-lottery-confirm')
    this.$btnChase = this.$('.js-bc-chase')
    this.$btnBuy = this.$('.js-bc-btn-lottery-buy')
    this.$footer = $('#footer')

    const sign = Global.localCache.get(`ticketList.${this.options.ticketId}`)

    if (sign) {
      this.rulesCollection.reset(this.rulesCollection.parse(Global.localCache.get(sign)))
      this.rulesCollection.trigger('sync:fromCache')
    }


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

  // sale优先级比pending高，pending:true时表示等待开奖
  renderSalePending(model) {
    if (sale) {
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

  // event handlers

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
