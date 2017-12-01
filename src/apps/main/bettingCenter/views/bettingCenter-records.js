

const ticketConfig = require('skeleton/misc/ticketConfig')

const BettingRecordsView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter-records.html'),

  events: {
    'click .js-bc-records-tab': 'toggleTabHandler',
  },

  height: 256,

  tableClass: 'table table-dashed table-center no-margin',

  initialize() {
    this.options.type = 'draw'
  },

  onRender() {
    this.$bettingRecords = this.$('.js-bc-betting-records')
    this.$drawRecords = this.$('.js-bc-draw-records')
    this.renderDrawRecords()
  },

  renderBettingRecords() {
    const self = this
    if (!this.bettingRecords) {
      this.bettingRecords = this.$bettingRecords.staticGrid({
        tableClass: this.tableClass,
        colModel: [
          // {label: '投注时间', name: 'betTime', width: '10%', formatter: function(val) {
          //  return _(val).toTime();
          // }},
          // {label: '彩种', name: 'ticketName', width: '10%'},
          {
            label: '期号',
            name: 'ticketPlanId',
            width: '40%',
            formatter(val, index, bet) {
              return `<a class="router btn-link btn-link-light" href="#bc/br/detail/${self.options.ticketId}/${bet.ticketTradeNo}">${val}</a>`
            },
          },
          {
            label: '投注金额',
            name: 'betTotalMoney',
            width: '32%',
            formatter(val) {
              return _(val).fixedConvert2yuan()
            },
          },
          {
            label: '状态',
            name: 'prizeTotalMoney',
            width: '28%',
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
          // {label: '是否追号', name: 'chaseId', width: '10%', formatter: function(val) {
          //  return val ? '是' : '否';
          // }}
        ],
        emptyTip: '最近无投注记录',
        url: '/ticket/bethistory/userbethistory.json',
        abort: false,
        height: this.height,
        data: {
          pageSize: 30,
          ticketId: this.options.ticketId,
        },
        dataProp: 'root.betList',
      }).staticGrid('instance')
    } else {
      this.bettingRecords.update()
    }
  },

  renderDrawRecords() {
    if (!this.drawRecords) {
      let gridTable = {}
      const sscTicketIdArr = _(ticketConfig.getSccList()).pluck('id')
      const c115TicketIdArr = _(ticketConfig.getChoose5List()).pluck('id')
      const dpcTicketIdArr = _(ticketConfig.getLowList()).pluck('id')
      // var bjpk10TicketIdArr = _(ticketConfig.getHappyList()).pluck('id');
      const bjpk10TicketIdArr = _(ticketConfig.getBjPkList()).pluck('id')
      const quick3TicketIdArr = _(ticketConfig.getQuickList()).pluck('id')
      const mark6TicketIdArr = _(ticketConfig.getMark6List()).pluck('id')

      if (_(sscTicketIdArr).indexOf(this.options.ticketId) !== -1) {
        gridTable = this._renderSSCLotteryRecord()
      } else if (_(c115TicketIdArr).indexOf(this.options.ticketId) !== -1) {
        gridTable = this._render115LotteryRecord()
      } else if (_(dpcTicketIdArr).indexOf(this.options.ticketId) !== -1) {
        if (_(mark6TicketIdArr).indexOf(this.options.ticketId) !== -1) {
          gridTable = this._renderMark6LotteryRecord()
        } else {
          gridTable = this._renderDPCLotteryRecord()
        }
      } else if (_(bjpk10TicketIdArr).indexOf(this.options.ticketId) !== -1) {
        gridTable = this._renderbjpk10LotteryRecord()
      } else if (_(quick3TicketIdArr).indexOf(this.options.ticketId) !== -1) {
        gridTable = this._render115LotteryRecord()
      }

      this.drawRecords = this.$drawRecords.staticGrid(gridTable).staticGrid('instance')
    } else {
      this.drawRecords.update()
    }
  },

  _renderMark6LotteryRecord () {
    return {
      tableClass: this.tableClass,
      colModel: [
        { label: '期号', name: 'ticketPlanId', width: '35%' },
        {
          label: '开奖号',
          name: 'ticketOpenNum',
          width: '50%',
          formatter (val) {
            const numArr = val.split(',')
            _(numArr).each((num, index) => {
              numArr[index] = `<span class='mark6Num'>${num}</span>`
            })
            return numArr.join()
          },
        },
        {
          label: '和值',
          name: 'ticketOpenNum',
          width: '15%',
          formatter (val) {
            const numArr = val.split(',')
            const sumVal = _.reduce(numArr, (memo, num) => {
              return memo + parseInt(num, 10)
            }, 0)
            return sumVal
          },
        },
      ],
      url: '/ticket/ticketmod/openhistory.json',
      emptyTip: '最近无开奖记录',
      abort: false,
      initRemote: false,
      height: this.height,
      data: {
        pageSize: 30,
        ticketId: this.options.ticketId,
      },
      dataProp: 'root.openedList',
    }
  },

  _renderSSCLotteryRecord () {
    return {
      tableClass: this.tableClass,
      colModel: [
        { label: '期号', name: 'ticketPlanId', width: '42%' },
        { label: '开奖号', name: 'ticketOpenNum', width: '24%' },
        { label: '前三', name: 'qianSan', width: '17%' },
        {
          label: '后三',
          name: 'houSan',
          width: '17%',
          formatter (val) {
            return val
          },
        },
      ],
      url: '/ticket/ticketmod/openhistory.json',
      emptyTip: '最近无开奖记录',
      abort: false,
      initRemote: false,
      height: this.height,
      data: {
        pageSize: 30,
        ticketId: this.options.ticketId,
      },
      dataProp: 'root.openedList',
    }
  },
  _render115LotteryRecord () {
    return {
      tableClass: this.tableClass,
      colModel: [
        { label: '期号', name: 'ticketPlanId', width: '50%' },
        { label: '开奖号', name: 'ticketOpenNum', width: '50%' },
      ],
      url: '/ticket/ticketmod/openhistory.json',
      abort: false,
      height: this.height,
      initRemote: false,
      data: {
        pageSize: 84,
        ticketId: this.options.ticketId,
      },
      dataProp: 'root.openedList',
    }
  },
  _renderDPCLotteryRecord() {
    return {
      tableClass: this.tableClass,
      colModel: [
        { label: '期号', name: 'ticketPlanId', width: '10%' },
        { label: '开奖号', name: 'ticketOpenNum', width: '10%' },
        { label: '三星', name: 'qianSan', width: '10%' },
      ],
      url: '/ticket/ticketmod/openhistory.json',
      abort: false,
      height: this.height,
      initRemote: false,
      data: {
        pageSize: 20,
        ticketId: this.options.ticketId,
      },
      dataProp: 'root.openedList',
    }
  },
  _renderbjpk10LotteryRecord () {
    return {
      tableClass: this.tableClass,
      colModel: [
        { label: '期号', name: 'ticketPlanId', width: '30%' },
        { label: '开奖号', name: 'ticketOpenNum', width: '70%' },
      ],
      url: '/ticket/ticketmod/openhistory.json',
      abort: false,
      height: this.height,
      initRemote: false,
      data: {
        pageSize: 84,
        ticketId: this.options.ticketId,
      },
      dataProp: 'root.openedList',
    }
  },

  // common APIs
  update() {
    const resizeHeight = $('.js-bc-main-area-right').height() - 394
    if (this.options.type === 'draw') {
      this.renderDrawRecords()
      this.$bettingRecords.addClass('hidden')
      this.$drawRecords.removeClass('hidden')
      this.resizeRecords(this.$drawRecords, resizeHeight)
    } else {
      this.renderBettingRecords()
      this.$bettingRecords.removeClass('hidden')
      this.$drawRecords.addClass('hidden')
      this.resizeRecords(this.$bettingRecords, resizeHeight)
    }
  },

  // event handlers
  toggleTabHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    this.options.type = $target.data('type')
    this.update()
  },
  // 调整最近开奖记录区的长度
  resizeRecords ($parent, resizeHeight) {
    $parent.find('.slimScrollDiv,.js-wt-body-main').css({ height: resizeHeight, 'min-height': this.options.height })
  },
})

module.exports = BettingRecordsView
