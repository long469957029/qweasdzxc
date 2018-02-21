const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const betStatusConfig = require('userCenter/misc/betStatusConfig')

const TicketSelectGroup = require('com/ticketSelectGroup')

const teamBettingRecordView = SearchGrid.extend({

  template: require('agencyCenter/bettingRecord/ticketRecord.html'),

  className: '',

  events: {
    'click .js-subUser': 'subUserHandler',
    'click .js-uc-betDetail-off': 'offbBetDetailHandler',
  },

  initialize() {
    _(this.options).extend({
      footerClass: 'border-cool-top',
      height: 492,
      title: '团队投注记录',
      tableClass: 'table table-similar table-bordered table-center',
      columns: [
        {
          name: '投注时间',
          width: '16%',
        },
        {
          name: '用户名',
          width: '10%',
        },
        {
          name: '彩种',
          width: '10%',
        },
        {
          name: '玩法',
          width: '10%',
        },
        {
          name: '期号',
          width: '12%',
        },
        {
          name: '开奖号码',
          width: '10%',
        },
        {
          name: '投注内容',
          width: '10%',
        },
        {
          name: '投注金额',
          width: '8%',
        },
        {
          name: '状态',
          width: '8%',
        },
      ],
      // gridOps: {
      //  emptyTip: '无记录'
      // },
      ajaxOps: {
        url: '/ticket/bethistory/userTeamBetHistory.json',
      },
      reqData: {
        pageSize: 12,
        betType: this.options.type
      },
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
      showIcon: true,
      size: 'input-ml',
    }).render()
    this.$('input[name="userName"]').val(this.options.userName)

    this.$('select[name=betStatus]').html(_(betStatusConfig.get()).map((betStatus) => {
      return `<option value="${betStatus.id}">${betStatus.zhName}</option>`
    }).join(''))

    // 初始化彩种选择
    new TicketSelectGroup({
      el: this.$('.js-uc-ticket-select-group'),
      type: this.options.type
    })

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    let num = 0
    const rowsData = _(gridData.betList).map(function(bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })
      .hideLoading()
    _(gridData.betList).each((items, index) => {
      if ((items.betNum).length >= 16) {
        const placement = index < 4 ? 'bottom' : 'top'
        $('.js-uc-betDetail-betNum').eq(num).popover({
          // title: '详细号码<span class="js-uc-betDetail-off" style="float:right;cursor:pointer">X</span>',
          trigger: 'focus',
          html: true,
          content: `<span class="inline-block text-account-add">详细号码：</span><span class="js-pf-popover inline-block word-break ">${items.betNum}</span>`,
          placement,
        })
        num += 1
      }
    })

    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>总计</strong>',
        '',
        '',
        '',
        '',
        '',
        '',
        _(gridData.betMoneyTotal).convert2yuan(),
        _(gridData.prizeMoneyTotal).convert2yuan(),
      ],
    })
      .hideLoading()
  },
  offbBetDetailHandler () {
    $('.js-uc-betDetail-betNum').popover('hide')
  },
  formatRowData(rowInfo,index) {
    const row = []
    row.push(`<a class="btn-link js-gl-bet-detail-dialog" data-id="${rowInfo.ticketTradeNo}">${_(rowInfo.betTime).toTime()}</a>`)
    row.push(rowInfo.userName)
    row.push(rowInfo.ticketName)
    row.push(rowInfo.playName)
    row.push(rowInfo.ticketPlanId)
    row.push(rowInfo.ticketResult)
    // row.push(rowInfo.betNum);
    if ((rowInfo.betNum).length >= 16) {
      row.push(`<a tabindex="${index}" class="js-uc-betDetail-betNum btn-link btn-link-cool">详细号码</a>`)
    } else {
      row.push(rowInfo.betNum)
    }
    row.push(_(rowInfo.betTotalMoney).fixedConvert2yuan())
    // 0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
    let status = ''
    if (rowInfo.ticketBetStatus === 2) {
      status = '用户撤单'
    } else if (rowInfo.ticketBetStatus === 3) {
      status = '系统撤单'
    } else if (rowInfo.hasException) {
      status = '等待开奖'
    } else if (rowInfo.ticketResult === null) {
      if (rowInfo.ticketOpenStatus > 0) {
        status = '未中奖'
      } else {
        status = '等待开奖'
      }
    } else if (rowInfo.prizeTotalMoney === 0) {
      status = '未中奖'
    } else {
      status = `<span class="text-bold-prominent">${_(rowInfo.prizeTotalMoney).convert2yuan()}</span>`
    }
    row.push(status)

    return row
  },

  subUserHandler (e) {
    const $target = $(e.currentTarget)
    if ($target.is(':checked')) {
      $target.val(1)
    } else {
      $target.val(0)
    }
  },
})

module.exports = teamBettingRecordView
