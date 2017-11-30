

const BettingChoiceModel = require('bettingCenter/models/bettingChoice')
const BettingInfoModel = require('bettingCenter/models/bettingInfo')
const BettingRulesCollection = require('bettingCenter/collections/bettingRules')

const PlayAreaSelectView = require('bettingCenter/views/bettingCenter-playArea-select')
const PlayAreaInputView = require('bettingCenter/views/bettingCenter-playArea-input')
const BettingRecordsView = require('bettingCenter/views/bettingCenter-records')
const BettingChaseView = require('bettingCenter/views/bettingCenter-chase')
const ticketConfig = require('skeleton/misc/ticketConfig')
const betRulesConfig = require('bettingCenter/misc/betRulesConfig')

const Countdown = require('com/countdown')

const audio = {
  over: require('bettingCenter/misc/over.wav'),
  prize: require('bettingCenter/misc/prize.wav'),
  openCode: require('bettingCenter/misc/openCode.wav'),
}

const BettingCenterView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter.html'),

  rulesTpl: _.template(require('bettingCenter/templates/bettingCenter-rules.html')),
  confirmTpl: _.template(require('bettingCenter/templates/bettingCenter-confirm.html')),
  commitTpl: _.template(require('bettingCenter/templates/bettingCenter-commit.html')),

  events: {
    // 'click .js-bc-video': 'openVideoHandler',
    'click .js-bc-basic-rule': 'baseRuleChangeHandler',
    'click .js-bc-advance-rule': 'advanceRuleChangeHandler',
    'change .js-bc-bet-mode': 'betModeChangeHandler',
    'change .js-bc-unit-select': 'monetaryUnitChangeHandler',
    'click .js-bc-btn-lottery-add': 'lotteryAddHandler',
    'click .js-bc-lottery-auto': 'lotteryAutoAddHandler',
    'click .js-bc-lottery-clear': 'lotteryClearHandler',
    'click .js-bc-lottery-preview-del': 'lotteryPreviewDelHandler',
    'click .js-bc-chase': 'lotteryChaseHandler',
    'click .js-bc-btn-lottery-confirm': 'lotteryConfirmHandler',
    'click .js-bc-btn-lottery-buy': 'lotteryBuyHandler',
    'mouseover .js-bc-last-plan-results': 'bchgCalculateshow',
    'mouseout .js-bc-last-plan-results': 'bchgCalculatehide',
    'click .js-music': 'openMusicHandler',
    'click .js-bc-select-item': 'selectBcItemHandler',
    'click .js-bc-user-redPack-btn': 'checkUserRedPackHanler',
    'click .js-bc-quick-more': 'showTicketListHandler',
  },

  serializeData() {
    this.options.ticketInfo = ticketConfig.getComplete(this.options.ticketId)
    return {
      ticketInfo: this.options.ticketInfo,
      mark6TicketIdArr: this.mark6TicketIdArr,
      audio,
    }
  },

  initialize () {
    this.model = new BettingChoiceModel()
    this.infoModel = new BettingInfoModel()
    this.rulesCollection = new BettingRulesCollection()
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()
    /* if(this.options.ticketId == 34){
     this.rulesCollection.url = '/ticket/ticketmod/ticketplaylist2.json';
     } */

    // 如果是六合彩加载生肖对应的球
    if (_.indexOf(this.mark6TicketIdArr, parseInt(this.options.ticketId, 10)) > -1) {
      this.getMark6SxNumber({ ticketId: this.options.ticketId })
    }

    this.rulesCollection.fetch({
      abort: false,
      localCache: true,
      cacheName: `ticketList.${this.options.ticketId}`,
      data: {
        ticketId: this.options.ticketId,
      },
    })

    this.getNewPlan()
    this.serializeData()
    this.model.set('ticketId', Number(this.options.ticketId))

    this.listenTo(this.infoModel, 'change:sale change:pending', this.renderSalePending)
    this.listenTo(this.infoModel, 'change:lastOpenId', this.renderLastPlan)

    this.listenTo(this.infoModel, 'change:leftSecond', this.updateCountdown)
    this.listenTo(this.infoModel, 'change:planId', this.renderBasicInfo)
    // this.listenTo(this.infoModel, 'change:openVideoUrl', this.renderVideo)

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
      this.resizeFooter()
      this.resizeRecords()
    })

    this.listenTo(this.model, 'change:formatMaxMultiple', this.renderNumRange)
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

  getNewPlan() {
    this.infoModel.fetch({
      abort: false,
      type: 'post',
      data: {
        ticketId: this.options.ticketId,
      },
    })
  },

  onRender() {
    const self = this
    this.$countdown = this.$('.js-bc-countdown')
    this.$planId = this.$('.js-bc-planId')
    this.$planIdStop = this.$('.js-bc-planId-stop')
    this.$lastPlanId = this.$('.js-bc-last-planId')
    this.$lastResults = this.$('.js-bc-last-plan-results')
    this.$hgcalculate = this.$('.js-hgcalculate-example')
    // this.$lastResults2 = this.$('.js-bc-last-plan-results2');
    this.$quickTicketList = this.$('.js-quick-ticket-list')

    this.$saleStop = this.$('.js-bc-sale-stop')
    this.$salePending = this.$('.js-bc-sale-pending')

    // this.$videoMain = this.$('.js-bc-video-main')

    // rules
    this.$basicRules = this.$('.js-bc-basic-rules')
    this.$advanceRules = this.$('.js-bc-advance-rules')

    // playInfo
    // this.$playTip = this.$('.js-bc-play-tip')
    this.$playExample = this.$('.js-bc-play-example')
    this.$playBetMode = this.$('.js-bc-bet-mode')

    // playArea
    this.$playArea = this.$('.js-bc-play-area')

    // numRange
    this.$multiRange = this.$('.js-bc-multi-range')

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
    this.$userRedPackBtn = this.$('.js-bc-user-redPack-btn')
    this.$bcUserRed = this.$('.js-bc-user-red')
    this.$bcRedMoney = this.$('.js-bc-red-money')
    this.$btnAdd = this.$('.js-bc-btn-lottery-add')
    this.$btnConfirm = this.$('.js-bc-btn-lottery-confirm')
    this.$btnChase = this.$('.js-bc-chase')
    this.$btnBuy = this.$('.js-bc-btn-lottery-buy')
    this.$PlanTitle = this.$('.js-bc-plan-title')
    this.$PlanTitlePending = this.$('.js-bc-plan-title-pending')
    this.$bcMainAreaRight = this.$('.js-bc-main-area-right')
    this.$footer = $('#footer')

    this.initNumRange()

    this.renderCountdown()

    this.lotteryPreview = this.$lotteryPreview.staticGrid({
      tableClass: 'table table-dashed',
      colModel: [
        {
          label: '玩法/投注内容  ', name: 'title', key: true, width: '35%',
        },
        { label: '奖金模式', name: 'bonusMode', width: '20%' },
        { label: '注数/倍数/模式', name: 'mode', width: '20%' },
        { label: '投注金额', name: 'bettingMoney', width: '10%' },
        { label: '<div class="text-right js-bc-lottery-clear m-right-md cursor-pointer"><i class="fa fa-trash font-jb"></i> 清除</div>', name: 'operate', width: '15%' },
      ],
      height: 110,
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


    const status = Global.cookieCache.get('music-status')
    if (status === '0') {
      this.$('.js-music').removeClass('sfa-bc-muisc1')
      this.$('.js-music').addClass('sfa-bc-muisc')
      this.$('.js-music-status').val('0')
    }
    if (status === '1') {
      this.$('.js-music').removeClass('sfa-bc-muisc')
      this.$('.js-music').addClass('sfa-bc-muisc1')
      this.$('.js-music-status').val('1')
    }
    this.getUsePackStatus()
    // var ruleId = _.getUrl('ruleId');
    // if(ruleId && !_.isUndefined(ruleId) && !_.isNull(ruleId)){
    //   var data = {
    //     ticketRuleId:ruleId,
    //     ticketPlayId:_.getUrl('advance'),
    //     num:_.getUrl('betNum')
    //   }
    //   this.selectNum(data);
    // }
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

    this.$lastResults.toggleClass('hidden', !sale)
    // this.$lastResults2.toggleClass('hidden', !sale);
    this.$saleStop.toggleClass('hidden', sale)
    this.$salePending.toggleClass('hidden', !pending)

    this.$planId.toggleClass('hidden', !sale)
    this.$planIdStop.toggleClass('hidden', sale)
    this.$PlanTitlePending.toggleClass('hidden', !pending)

    if (sale) {
      this.getNewPlan()
      if (pending) {
        this.$lastResults.toggleClass('hidden', true)
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
      this.$salePending.toggleClass('hidden', true)
      this.infoModel.set('leftSecond', 0)
      this.updateCountdown()
      if (this.$el.closest('html').length !== 0) {
        Global.ui.notification.show('<p class="font-md">非常抱歉，目前此彩种暂停销售</p>' +
          '重新开启销售时间请留意平台公告。')
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

  renderCountdown() {
    const self = this
    let times = 1

    this.countdown = new Countdown({
      el: this.$countdown,
    }).render().on('change:leftTime', (e) => {
      // var curtLeftTime = moment().diff(moment(e.timeStamp));
      // var curtLeftTime = moment(self.infoModel.get('leftTime')).diff(moment(e.timeStamp));
      times -= 1
      if (times === 0) {
        const leftTime = moment.duration(e.finalDate.getTime() - new Date().getTime()).asSeconds()

        const status = self.$('.js-music-status').val()
        if (status === 0) {
          const ticketId = self.infoModel.get('ticketId') // 彩种
          if (parseInt(leftTime, 10) === 3) { // 虽然是倒数5秒的声音，但是判断为3才能吻合
            const url = window.location.href
            const index1 = url.indexOf('#bc')
            if (index1 > 0) {
              const str = url.substr(index1, url.length)
              if (str === (`#bc/${ticketId}`)) {
                document.getElementById('overAudio').play()
              }
            }
          }
        }

        self.trigger('change:leftTime', leftTime, self.infoModel.get('totalSecond'))
        // self.trigger('change:leftTime', self.infoModel.get('leftTime'), _(self.infoModel.get('totalSecond')).mul(1000));
        times = 1
      }
    })
  },

  renderLastPlan(model) {
    const self = this
    const planInfo = model.pick('lastOpenId', 'lastOpenNum', 'lastOrgOpenNum', 'pending')
    const ticket = model.pick('ticketId')
    this.$lastPlanId.html(planInfo.lastOpenId)
    if (planInfo.pending) {
      this.$lastPlanId.html(Number(planInfo.lastOpenId) + 1)
    }
    const options = this.options
    this.$lastResults.html(_(model.get('lastOpenNum')).map((num, key) => {
      if (ticket.ticketId === 18) {
        return `<span class="text-circle circle-sm">${num}</span>`
      } else if (_.indexOf(self.mark6TicketIdArr, parseInt(ticket.ticketId, 10)) > -1) {
        const numberColor = options.ticketInfo.info.numberColor
        let colorClass = 'green'
        if (_.indexOf(numberColor.redArr, parseInt(num, 10)) > -1) {
          colorClass = 'red'
        } else if (_.indexOf(numberColor.blueArr, parseInt(num, 10)) > -1) {
          colorClass = 'blue'
        }
        const spanDiv = `<span class="text-circle circle-mark6 ${colorClass}">${num}</span>`
        const separateDiv = '<span class="text-circle circle-mark6 separate">&nbsp;</span>'
        if (key === 5) {
          return spanDiv + separateDiv
        }
        return spanDiv
      }
      return `<span class="text-circle">${num}</span>`
    }))

    this.$ticketId = ticket.ticketId
    this.$showNumberDetail = this.options.ticketInfo.info.showNumberDetail

    // if(ticket.ticketId === 21){
    if (this.$showNumberDetail) {
      let count
      let result
      let first
      let last
      const openNun = planInfo.lastOrgOpenNum.split(',')
      $.each(openNun, (key, value) => {
        if (key === 0 || key === 4 || key === 8 || key === 12 || key === 16) {
          count = 0
          result = 0
        }
        count = `${count}+${value}`
        result += parseInt(value, 10)
        if (key === 3) {
          first = (`${result}`).substring(0, (`${result}`).length - 1)
          last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
          self.$('.js-bc-wan').html(`${count.replace('0+', '')}=${first}${last}`)
        } else if (key === 7) {
          first = (`${result}`).substring(0, (`${result}`).length - 1)
          last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
          self.$('.js-bc-qian').html(`${count.replace('0+', '')}=${first}${last}`)
        } else if (key === 11) {
          first = (`${result}`).substring(0, (`${result}`).length - 1)
          last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
          self.$('.js-bc-bai').html(`${count.replace('0+', '')}=${first}${last}`)
        } else if (key === 15) {
          first = (`${result}`).substring(0, (`${result}`).length - 1)
          last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
          self.$('.js-bc-shi').html(`${count.replace('0+', '')}=${first}${last}`)
        } else if (key === 19) {
          first = (`${result}`).substring(0, (`${result}`).length - 1)
          last = `<font color='red'>${(`${result}`).substring((`${result}`).length - 1, (`${result}`).length)}</font>`
          self.$('.js-bc-ge').html(`${count.replace('0+', '')}=${first}${last}`)
        }
      })
    }

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

    this.$planId.html(planInfo.planId)
    this.$PlanTitle.toggleClass('hidden', planInfo.pending)
    this.$PlanTitlePending.toggleClass('hidden', !planInfo.pending)

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

  // renderVideo() {
  //   this.$videoMain.toggleClass('hidden', !this.infoModel.getVideoUrl())
  // },

  renderBasicRules() {
    const playLevels = this.rulesCollection.getPlayLevels()

    this.$basicRules.html(this.rulesTpl({
      tabToolbarClass: 'tab-pill tab-pill-deep',
      ruleClass: 'js-bc-basic-rule',
      rules: playLevels.normalList,
    }))
    this.selectDefaultPlay()
  },

  selectDefaultPlay() {
    const self = this

    let defaultSelectInfo = null
    if (this.ticketRuleId && this.ticketPlayId && !_.isUndefined(this.ticketRuleId) && !_.isUndefined(this.ticketPlayId)) {
      defaultSelectInfo = {
        lastPlayId: this.ticketPlayId,
        groupId: this.ticketRuleId,
      }
    } else {
      this.getTicketInfotXhr({ ticketId: this.options.ticketId }).done((res) => {
        if (res.result === 0 && res.root.lastPlayId) {
          const lastPlayId = res.root.lastPlayId.toString()
          const groupId = lastPlayId.substring(0, lastPlayId.length - 4)
          defaultSelectInfo = {
            lastPlayId,
            groupId,
          }
        } else {
          defaultSelectInfo = self.options.ticketInfo.info.defaultSelectPlay.split(',')
        }
      })
    }

    // defaultSelectInfo = [0,1,3];

    if (!_(defaultSelectInfo).isEmpty()) {
      if (!_(defaultSelectInfo).isArray() && _(defaultSelectInfo).isObject()) {
        this.$basicRules.find(`.js-bc-basic-rule[data-id=${defaultSelectInfo.groupId}]`).trigger('click')
        this.$advanceRules.find(`.js-bc-advance-rule[data-id=${defaultSelectInfo.lastPlayId}]`).trigger('click')
      } else if (_(Number(defaultSelectInfo[0])).isFinite()) {
        this.$basicRules.find('.js-bc-basic-rule').eq(defaultSelectInfo[0]).trigger('click')
        if (_(Number(defaultSelectInfo[1])).isFinite()) {
          const levelRules = this.$advanceRules.find('.js-bc-rules-toolbar').eq(defaultSelectInfo[1])

          if (_(Number(defaultSelectInfo[2])).isFinite()) {
            levelRules.find('.js-bc-advance-rule').eq(defaultSelectInfo[2]).trigger('click')
          }
        }

        // 兼容默认玩法的中文名方式配置
      } else if (!_(Number(defaultSelectInfo[0])).isFinite() && _(defaultSelectInfo[0]).isString()) {
        const rule = _(this.$basicRules.find('.js-bc-basic-rule')).find((item) => {
          return $(item).html().indexOf(defaultSelectInfo[0]) >= 0
        })
        if (rule) {
          $(rule).trigger('click')
        }
      }
    } else {
      this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click')
    }
  },

  renderAdvanceRules(levelId) {
    const advanceRules = this.rulesCollection.getPlayGroups(levelId)
    this.levelId = levelId

    this.$advanceRules.html(_(advanceRules).map(function(rules) {
      return this.rulesTpl({
        tabToolbarClass: 'tab-pill tab-pill-main',
        ruleClass: 'js-bc-advance-rule',
        id: rules.id,
        title: rules.title,
        rules: rules.playList,
      })
    }, this))

    this.$advanceRules.find('.js-bc-advance-rule').eq(0).trigger('click')
  },

  /** 核心函数
   * 监听 playId 参数变动触发的 渲染游戏和各个组件
   * 参数 playInfo 是由bettingRules调出的 游戏规则 对象，包含了当前游戏模式下 所有的 信息，包括 奖金 赔率 最高倍数等 */
  renderPlayInfo(playInfo) {
    // 游戏说明
    // this.$playTip.text(playInfo.playDes)

    // 中奖举例
    if (this.$playExample.data('popover')) {
      this.$playExample.popover('destroy')
    }
    this.$playExample.popover({
      trigger: 'hover',
      container: this.$el,
      html: true,
      content: `<div><span class="font-bold">玩法说明：</span>${playInfo.playDes}</div><div><span class="font-bold">中奖举例：</span>${playInfo.playExample.replace(/\|/g, '<br />')}</div>`,
      placement: 'bottom',
    })

    // this.renderPlayBetMode(); 调换了一下顺序！！！！

    // 更改 bettingChoice 模型的 倍数 返水率 奖金组
    this.model.set({
      maxMultiple: playInfo.betMultiLimitMax,
      userRebate: playInfo.userRebate,
      betBonus: playInfo.betBonus,
      maxBetNums: playInfo.maxBetNums,
    })

    this.renderPlayBetMode()
  },

  renderNumRange(model, formatMaxMultiple) {
    this.$multiRange.numRange('setRange', 1, formatMaxMultiple)
  },

  // 渲染游戏模式
  renderPlayBetMode() {
    const unit = _(100000000).div(this.model.get('unit')) // 投注单位 元 角 分 厘
    const playInfo = this.rulesCollection.getCurrentPlay() // 彩种信息
    this.$playBetMode.html(_(playInfo.betMethodMax).chain().formatDiv(unit).floor(4)
      .value())
    // 赔率/返水率f
    // let modeHtml = ''
    // if (playInfo.betBonus === null) { // 是否有奖励数组，没有则用默认的双奖励，有则用数组奖励
    //   modeHtml += `<option value="0" data-max="${playInfo.betMultiLimitMax}" data-max-bonus="${playInfo.betMethodMax}">${_(playInfo.betMethodMax).chain().formatDiv(unit).floor(4)
    //     .value()}/0.0%</option>`
    //   if (Number(playInfo.userRebate) !== 0) {
    //     modeHtml += `<option value="1" data-max="${playInfo.betMultiLimitMin}" data-max-bonus="${playInfo.betMethodMin}">${
    //       _(playInfo.betMethodMin).chain().formatDiv(unit).floor(4)
    //         .value()}/${_(playInfo.userRebate).div(10)}%</option>`
    //   }
    //   // 六合彩特码、正码类型的号码球更改赔率数值，投注模式文字修改
    //   if (_.indexOf(this.mark6TicketIdArr, parseInt(this.model.get('ticketId'), 10)) > -1) {
    //     this.$playArea.find('.mark6-odds').html(this.setMark6NumberOdds(playInfo.betMethodMax))
    //     modeHtml = `<option value="0" data-max="${playInfo.betMultiLimitMax}" data-max-bonus="${playInfo.betMethodMax}">高奖金模式</option>`
    //     if (Number(playInfo.userRebate) !== 0) {
    //       modeHtml += `<option value="1" data-max="${playInfo.betMultiLimitMin}" data-max-bonus="${playInfo.betMethodMin}">高返点模式</option>`
    //     }
    //   }
    // } else { // 目前有多种奖励方式的 仅有 龙虎和
    //   modeHtml += this.selectBcItemHandler()
    // }
    //
    // const currentVal = this.$playBetMode.val()
    // this.$playBetMode.html(modeHtml)
    //
    // if (currentVal) { // 给select赋值并触发change事件
    //   this.$playBetMode.val(currentVal).trigger('change')
    // } else {
    //   this.$playBetMode.val(0).trigger('change')
    // }
  },
  // 加载号码球
  renderPlayArea() {
    const playId = this.model.pick('playId').playId
    const playRule = betRulesConfig.get(this.model.pick('playId'))
    const page = playRule.page
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
    const tm_zm_playIdArr = betRulesConfig.getMark6SpecialInfo().tm_zm_playIdArr
    if ((_.indexOf(tm_zm_playIdArr, playId) > -1) && this.options.mark6SxNumber) {
      playRule.list[0].htmlNeedInfo.groupSelectData = this.options.mark6SxNumber
    }

    if (this.currentPlayAreaView) {
      this.currentPlayAreaView.destroy()
    }

    if (_.isEmpty(playRule)) {
      return
    }

    playRule.ticketId = this.model.get('ticketId')

    switch (playRule.type) {
      case 'select':
        this.currentPlayAreaView = new PlayAreaSelectView(playRule, page)
        break
      case 'input':
        this.currentPlayAreaView = new PlayAreaInputView(playRule)
        break
      // case 'multiPage':
      //  this.currentPlayAreaView = new PlayAreaSelectView(playRule, page);
      //  break;
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

  updateCountdown() {
    const self = this

    const leftSecond = this.infoModel.get('leftSecond')
    const sale = this.infoModel.get('sale')
    const nextTime = _(sale ? leftSecond : 0).mul(1000)
    const leftTime = nextTime
    this.infoModel.set('leftTime', leftTime)

    clearInterval(self.timer)
    clearInterval(self.goToNextTimer)
    clearInterval(self.nextTimer)

    // alert(this.$ticketId)
    this.timer = _.delay(() => {
      self.getNewPlan()

      let status = Global.cookieCache.get('music-status')
      if (status === '0') {
        self.$('.js-music').removeClass('sfa-bc-muisc1')
        self.$('.js-music').addClass('sfa-bc-muisc')
        self.$('.js-music-status').val('0')
      }
      if (status === '1') {
        self.$('.js-music').removeClass('sfa-bc-muisc')
        self.$('.js-music').addClass('sfa-bc-muisc1')
        self.$('.js-music-status').val('1')
      }
      status = self.$('.js-music-status').val()
      if (status === 0) {
        const prize = self.infoModel.get('prize')
        const ticketId = self.infoModel.get('ticketId') // 彩种
        const lastOpenId = self.infoModel.get('lastOpenId')// 期号
        const lastOpenIdNumCache = Global.cookieCache.get(`lastOpenId${ticketId}`)

        //
        const url = window.location.href
        const index1 = url.indexOf('#bc')
        if (index1 > 0) {
          const str = url.substr(index1, url.length)

          if (str === (`#bc/${ticketId}`)) {
            if (lastOpenId !== lastOpenIdNumCache) {
              Global.cookieCache.set(`lastOpenId${ticketId}`, lastOpenId)
              const bcTag = Global.cookieCache.get('bcTag')
              // console.log(bcTag +"####"+str)
              if (bcTag === str) {
                if (lastOpenIdNumCache !== null && lastOpenIdNumCache !== '') {
                  if (prize > 0) {
                    // 播放中奖声音
                    // var audioElement = document.createElement('audio');
                    // audioElement.setAttribute('src', 'audio/prize.wav');
                    // audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
                    document.getElementById('prizeAudio').play()
                  } else {
                    // 播放开奖声音
                    // var audioElement = document.createElement('audio');
                    // audioElement.setAttribute('src', 'audio/openCode.wav');
                    // audioElement.setAttribute('autoplay', 'autoplay'); //打开自动播放
                    document.getElementById('openAudio').play()
                  }
                }
              } else {
                Global.cookieCache.set('bcTag', str)
              }
            }
          }
        }
      }
    }, 2200)

    // 只有销售时才进行倒计时
    if (sale) {
      this.goToNextTimer = _.delay(() => {
        self.infoModel.goToNextPlan()
      }, _(leftSecond).mul(1000))

      // 取得下一期的信息延迟一秒再做
      this.nextTimer = _.delay(() => {
        self.getNewPlan()
      }, _(leftSecond + 1).mul(1000))
    }

    this.infoModel.set('leftSecond', 0, {
      silent: true,
    })

    this.countdown.render(leftTime)
  },

  renderTotalLotteryInfo(model, totalInfo) {
    this.$totalLottery.text(totalInfo.totalLottery)
    this.$totalMoney.text(_(totalInfo.totalMoney).convert2yuan())
    // this.$totalRebateMoney.text(_(totalInfo.totalRebateMoney).convert2yuan())
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
      let title = `[${previewInfo.levelName}_${previewInfo.playName}] `
      if (previewInfo.formatBettingNumber.length > 20) {
        title += `<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link">${ 
          previewInfo.formatBettingNumber.slice(0, 20)}...</a>`
      } else {
        title += previewInfo.formatBettingNumber
      }

      return {
        title,
        bonusMode: this.getBonusMode(previewInfo.maxBonus, previewInfo.unit, previewInfo.userRebate, previewInfo.betMethod),
        mode: `${previewInfo.statistics}注/${previewInfo.multiple}倍/${previewInfo.formatUnit}`,
        bettingMoney: `${_(previewInfo.prefabMoney).convert2yuan()}元`,
        operate: '<div class="js-bc-lottery-preview-del lottery-preview-del icon-block m-right-md pull-right"></div>',
      }
    }, this)

    const $rows = this.lotteryPreview.renderRow(rows)

    $rows.each(function(index, row) {
      const $row = $(row)
      const $detail = $row.find('.js-bc-betting-preview-detail')
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

  // openVideoHandler(e) {
  //   //const $target = $(e.currentTarget)
  //
  //  // $target.attr('href', this.infoModel.getVideoUrl() || 'javascript:void(0)')
  // },

  baseRuleChangeHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    this.model.set({
      levelId: $target.data('id'),
      levelName: $target.data('title'),
    })
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

  // 赔率方式select
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
    if (_.indexOf(this.mark6TicketIdArr, parseInt(this.model.get('ticketId'), 10)) > -1) {
      const betBonus = this.model.get('betBonus')
      if (betBonus) {
        let betMethod = 'betMethodMax'
        if ($selectedOption.index() === 1) {
          betMethod = 'betMethodMin'
        }
        const selectItem = this.$('.js-bc-select-item')
        const self = this
        const playRule = betRulesConfig.get(this.model.pick('playId'))
        // 六合彩正码-两面类型的号码球更改赔率数值
        const zm_groupIdArr = betRulesConfig.getMark6SpecialInfo().zm_groupIdArr
        if (_.indexOf(zm_groupIdArr, parseInt(this.model.get('groupId'), 10)) > -1) {
          const playInfoBetBonu = _.pick(this.rulesCollection.getCurrentPlay(), 'betMethodMax', 'betMethodMin')
          selectItem.each((index, ele) => {
            const $ele = $(ele)
            const itemInfo = _.findWhere(playRule.formatToNumInfo, { name: $ele.data('num') })
            let betBonu = _.findWhere(betBonus, { betType: itemInfo.value })
            // 如果是红、蓝、绿球
            if (!betBonu) {
              betBonu = playInfoBetBonu
            }
            const odds = self.setMark6NumberOdds(betBonu ? betBonu[betMethod] : '')
            $ele.find('.mark6-odds').html(odds)
          })
        } else {
          // 六合彩除了特码、正码组下类型的号码球更改赔率数值
          selectItem.each((index, ele) => {
            const $ele = $(ele)
            const itemInfo = _.findWhere(playRule.formatToNumInfo, { name: $ele.data('num') })
            const betBonu = _.findWhere(betBonus, { betType: itemInfo.value })
            const odds = self.setMark6NumberOdds(betBonu ? betBonu[betMethod] : '')
            $ele.find('.mark6-odds').html(odds)
          })
        }
      } else {
        const bz_groupIdArr = betRulesConfig.getMark6SpecialInfo().bz_groupIdArr
        // 不中玩法右上角显示赔率
        if (_.indexOf(bz_groupIdArr, parseInt(this.model.get('groupId'), 10)) > -1) {
          this.$playArea.find('.mark6-bz-odds-value').html(this.setMark6NumberOdds($selectedOption.data('maxBonus')))
        } else {
          this.$playArea.find('.mark6-odds').html(this.setMark6NumberOdds($selectedOption.data('maxBonus')))
        }
      }
    }
  },

  monetaryUnitChangeHandler(e) {
    const $target = $(e.currentTarget)
    // $target.addClass('active').siblings().removeClass('active')

    this.model.set('unit', $target.val())
  },

  lotteryAddHandler() {
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
    this.selectBcItemHandler()
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

    if (info.totalInfo.totalMoney > Global.memoryCache.get('acctInfo').balance + (Number(this.$userRedPackBtn.data('type')) === 1 ? (this.redMomey * 10000) : 0)) {
      Global.ui.notification.show('账号余额不足，请先<a href="#fc/re" class="router btn-link btn-link-pleasant"  data-dismiss="modal" >充值</a>。')
      return false
    }

    if (Global.memoryCache.get('acctInfo').foundsLock) {
      Global.ui.notification.show('资金已锁定，请先<a id="js-open-fc-unlock" href="javascript:void(0);" ' +
        'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
      return false
    }
    if (Number(this.$userRedPackBtn.data('type')) === 1) {
      Global.ui.notification.show('红包不可用于追号')
    } else {
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
    }
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

    if (info.totalInfo.totalMoney > Global.memoryCache.get('acctInfo').balance + (Number(this.$userRedPackBtn.data('type')) === 1 ? (this.redMomey * 10000) : 0)) {
      Global.ui.notification.show('账号余额不足，请先<a href="#fc/re" class="router btn-link btn-link-pleasant"  data-dismiss="modal">充值</a>。')
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
    const self = this
    const $target = $(e.currentTarget)
    // do add
    if (!this.model.get('multiple')) {
      Global.ui.notification.show('倍数为0，不能投注')
      return false
    }
    this.rulesCollection.getPlayGroups(this.levelId)
    this.model.set({
      maxBetNums: this.rulesCollection.getPlayInfo(this.model.get('groupId'), this.model.get('playId')).maxBetNums,
    })
    if (this.options.type === 'select') {
      this.addSelectLottery({ buy: true })
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

    $target.button('loading')
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
  openMusicHandler() {
    // const music = $('.js-music')
    const status = this.$('.js-music-status').val()
    if (status === '0') {
      this.$('.js-music').removeClass('sfa-bc-muisc')
      this.$('.js-music').addClass('sfa-bc-muisc1')
      this.$('.js-music-status').val('1')
      Global.cookieCache.set('music-status', '1')
    }
    if (status === '1') {
      this.$('.js-music').removeClass('sfa-bc-muisc1')
      this.$('.js-music').addClass('sfa-bc-muisc')
      this.$('.js-music-status').val('0')
      Global.cookieCache.set('music-status', '0')
    }
  },

  bchgCalculateshow () {
    if (this.$showNumberDetail) {
      this.$hgcalculate.show()
    }
  },

  bchgCalculatehide () {
    if (this.$showNumberDetail) {
      this.$hgcalculate.hide()
    }
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

  // 六合彩切换玩法类型时，选号区内容过长，footer调整
  resizeFooter() {
    const scrollHeight = this.$playArea[0].scrollHeight
    if (scrollHeight > 0) {
      if (scrollHeight > 290) {
        this.$footer.addClass('mark6-footer')
      } else {
        this.$footer.removeClass('mark6-footer')
      }
    }
  },
  // 选择其他玩法时，调整最近开奖记录区的长度
  resizeRecords () {
    this.$recordsContainer.find('.slimScrollDiv,.js-wt-body-main').css({ height: this.$bcMainAreaRight.height() - 394 })
  },
  getUsePackStatus () {
    const self = this
    this.getUsePackInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.root && res.root !== 0) {
            self.redMomey = _(res.root).convert2yuan()
            if (self.options.ticketId === 34 || self.options.ticketId === 35) {
              self.$bcUserRed.addClass('m-right-lg p-right-lg')
            }
            self.$bcUserRed.removeClass('hidden')
            self.$bcRedMoney.html(`(${_(res.root).convert2yuan()})`)
          } else {
            self.$bcUserRed.addClass('hidden')
            self.model.set('usePack', 0)
          }
        }
      })
    Global.m.publish('redNum:updating')
  },
  checkUserRedPackHanler (e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    Number(type) === 0 ? $target.removeClass('sfa sfa-checkbox-def').addClass('sfa sfa-checkbox-on') : $target.removeClass('sfa sfa-checkbox-on').addClass('sfa sfa-checkbox-def')
    Number(type) === 0 ? $target.data('type', 1) : $target.data('type', 0)
    this.model.set('usePack', $target.data('type'))
  },
  showTicketListHandler (e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    if (type === 0) {
      $target.data('type', 1)
      this.$quickTicketList.addClass('quick-ticket-list-animate')
      $target.removeClass('sfa-bc-quick-more').addClass('sfa-bc-quick-close')
    } else {
      $target.data('type', 0)
      this.$quickTicketList.removeClass('quick-ticket-list-animate')
      $target.removeClass('sfa-bc-quick-close').addClass('sfa-bc-quick-more')
    }
  },
})

module.exports = BettingCenterView
