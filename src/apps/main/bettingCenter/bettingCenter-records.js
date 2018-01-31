const BettingRecordsView = Base.ItemView.extend({

  template: require('./bettingCenter-records.html'),

  events: {
    'click .js-bc-records-tab': 'toggleTabHandler',
    'click .js-bc-betting-preview-detail': 'popupHandler'
  },

  height: 125,

  tableClass: 'table table-similar table-center no-margin',

  initialize() {
    this.options.type = 'betting'
  },

  onRender() {
    this.$bettingRecords = this.$('.js-bc-betting-records')
    this.$drawRecords = this.$('.js-bc-draw-records')
    this.renderBettingRecords()
  },

  updateTicketId(ticketId) {
    this.options.ticketId = ticketId
    this.bettingRecords.options.data.ticketId = ticketId
  },

  renderBettingRecords() {
    if (!this.bettingRecords) {
      this.bettingRecords = this.$bettingRecords.staticGrid({
        tableClass: this.tableClass,
        colModel: [
          {
            label: '投注时间',
            name: 'betTime',
            width: '12%',
            formatter(val) {
              return _(val).toTime()
            },
          },
          {
            label: '玩法',
            name: 'playName',
            width: '10%',
          },
          {
            label: '期号',
            name: 'ticketPlanId',
            width: '12%',
            // formatter(val, index, bet) {
            //   return `<a class="router btn-link btn-link-inverse" href="#bc/br/detail/${self.options.ticketId}/${bet.ticketTradeNo}">${val}</a>`
            // },
          },
          {
            label: '开奖号码 ',
            name: 'ticketResult',
            width: '12%',
          },
          {
            label: '投注内容 ',
            name: 'betNum',
            width: '12%',
            formatter(val) {
              let betNum = val
              let tryCompact = betNum.split(' ')
              if (tryCompact[0].length === 1) {
                betNum = tryCompact.join('')
              }
              if (val.length > 20) {
                betNum = `<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link" data-num="${val}">${
                  betNum.slice(0, 20)}...</a>`
              }
              return betNum
            },
          },
          {
            label: '投注金额',
            name: 'betTotalMoney',
            width: '10%',
            formatter(val) {
              return _(val).fixedConvert2yuan()
            },
          },
          {
            label: '状态',
            name: 'prizeTotalMoney',
            width: '10%',
            formatter(val, index, bet) {
              // 0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
              let status = ''
              if (bet.ticketBetStatus === 2) {
                status = '用户撤单'
              } else if (bet.ticketBetStatus === 3) {
                status = '系统撤单'
              } else if (bet.hasException) {
                status = '等待开奖'
              } else if (bet.ticketResult === null) {
                if (bet.ticketOpenStatus > 0) {
                  status = '未中奖'
                } else {
                  status = '等待开奖'
                }
              } else if (bet.prizeTotalMoney === 0) {
                status = '未中奖'
              } else {
                status = `<span class="text-pink">${_(bet.prizeTotalMoney).convert2yuan()}</span>`
              }
              return status
            },
          },
          {
            label: '操作 ',
            name: 'ticketTradeNo',
            width: '10%',
            formatter(ticketTradeNo, index, bet) {
              let btnlist = `<a class="btn btn-link btn-link-inverse js-gl-bet-detail-dialog" data-id="${ticketTradeNo}">查看</a>`
              if (bet.canCancel) {
                btnlist = `<a class="btn btn-link btn-link-inverse js-bc-records-cancel" data-id="${ticketTradeNo}">撤单</a> / ${btnlist}`
              }
              return btnlist
            },
          },
        ],
        emptyTip: '最近无投注记录',
        url: '/ticket/bethistory/userbethistory.json',
        abort: false,
        height: this.height,
        data: {
          pageSize: 10,
          ticketId: this.options.ticketId,
        },
        dataProp: 'root.betList',
      }).staticGrid('instance')
    } else {
      this.bettingRecords.update()
    }
  },

  renderChaseHandler() {
    if (!this.bettingChaseRecords) {
      this.bettingChaseRecords = this.$drawRecords.staticGrid({
        tableClass: this.tableClass,
        colModel: [
          {
            label: '追号时间',
            name: 'chaseTime',
            width: '12%',
            formatter(val) {
              return _(val).toTime()
            },
          },
          {
            label: '彩种',
            name: 'ticketName',
            width: '10%',
            formatter(val) {
              return val
            },
          },
          {
            label: '玩法',
            name: 'playName',
            width: '10%',
          },
          {
            label: '开始奖期',
            name: 'ticketPlanId',
            width: '12%',
          },
          {
            label: '追号进度',
            name: 'chaseAllPeriods',
            width: '12%',
            formatter(val, index, bet) {
              return `${bet.chaseBetCount}/${bet.chaseAllPeriods}`
            },
          },
          {
            label: '追号总金额',
            name: 'chaseAllMoney',
            width: '12%',
            formatter(val, index, bet) {
              return `${_(bet.chaseBetMoney).convert2yuan()}/${_(bet.chaseAllMoney).convert2yuan()}`
            },
          },
          {
            label: '中奖金额',
            name: 'chasePrizeMoney',
            width: '12%',
            formatter(val) {
              return val === 0 ? '—' : _(val).fixedConvert2yuan()
            },
          },
          {
            label: '追号状态',
            name: 'chaseStatus',
            width: '10%',
            formatter(val) {
              let html = ''
              if (val === 0) {
                html = '未开始'
              } else if (val === 1) {
                html = '进行中'
              } else if (val === 2) {
                html = '已完成'
              } else {
                html = '已终止'
              }
              return html
            },
          },
          {
            label: '操作',
            name: 'ticketChaseId',
            width: '10%',
            formatter(val, index, bet) {
              return `<a class="btn-link btn-link-inverse js-gl-chase-detail-dialog"  data-id="${bet.ticketChaseId}" >查看</a>`
            },
          },
        ],
        emptyTip: '无追号记录',
        url: 'ticket/bethistory/userchasehistory.json',
        abort: false,
        showHeader: true,
        height: this.height,
        data: {
          pageSize: 20,
          ticketId: this.options.ticketId,
        },
        dataProp: 'root.chaseList',
      }).staticGrid('instance')
    } else {
      this.bettingChaseRecords.update()
    }
  },

  // common APIs
  update() {
    // const resizeHeight = $('.js-bc-main-area-right').height() - 394
    if (this.options.type === 'chase') {
      this.renderChaseHandler()
      this.$bettingRecords.addClass('hidden')
      this.$drawRecords.removeClass('hidden')
      // this.resizeRecords(this.$drawRecords, resizeHeight)
    } else {
      this.renderBettingRecords()
      this.$bettingRecords.removeClass('hidden')
      this.$drawRecords.addClass('hidden')
      // this.resizeRecords(this.$bettingRecords, resizeHeight)
    }
  },

  // event handlers
  toggleTabHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    this.options.type = $target.data('type')
    this.update()
  },
  popupHandler(e) {
    if (!$(e.currentTarget).data('popover')) {
      $(e.currentTarget).popover({
        title: '详细号码',
        trigger: 'click',
        html: true,
        container: 'body',
        content: `<div class="js-pf-popover">${e.currentTarget.dataset.num}</div>`,
        placement: 'right',
      }).popover('show')
    }
  }
})

export default BettingRecordsView
