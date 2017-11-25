

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

const TicketSelectGroup = require('com/ticketSelectGroup')

const betStatusConfig = require('userCenter/misc/betStatusConfig')

const BettingRecordsView = SearchGrid.extend({

  template: require('userCenter/templates/bettingRecords.html'),

  events: {
    'click .js-uc-betDetail-off': 'offbBetDetailHandler',
  },

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '投注时间',
          width: '16%',
        },
        {
          name: '彩种',
          width: '12%',
        },
        {
          name: '玩法',
          width: '12%',
        },
        {
          name: '期号',
          width: '12%',
        },
        {
          name: '开奖号码',
          width: '11%',
        },
        {
          name: '投注内容',
          width: '11%',
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
      gridOps: {
        emptyTip: '没有投注记录',
      },
      ajaxOps: {
        url: '/ticket/bethistory/userbethistory.json?_t=1',
        abort: false,
      },
      listProp: 'root.betList',
      tip: '<div class="tip-hot"><span>注意</span> 投注记录只保留最近30天。</div>',
      height: 280,
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
    }).render()

    // 初始化彩种选择
    new TicketSelectGroup({
      el: this.$('.js-uc-ticket-select-group'),
    })

    this.$('select[name=betStatus]').html(_(betStatusConfig.get()).map((betStatus) => {
      return `<option value="${betStatus.id}">${betStatus.zhName}</option>`
    }).join(''))

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

    // 加上统计行
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>所有页总计</strong>', '', '', '', '', '',
        _(gridData.betMoneyTotal).fixedConvert2yuan(),
        _(gridData.prizeMoneyTotal).convert2yuan(),
      ],
    }).hideLoading()

    _(gridData.betList).map((items, index) => {
      if ((items.betNum).length >= 16) {
        if (index == 0 || index == 1) {
          $('.js-uc-betDetail-betNum').eq(num).popover({
            title: '详细号码<span class="js-uc-betDetail-off" style="float:right;cursor:pointer">X</span>',
            trigger: 'click',
            html: true,
            content: `<div class="js-pf-popover"><span class="word-break">${items.betNum}</span></div>`,
            placement: 'bottom',
          })
        } else {
          $('.js-uc-betDetail-betNum').eq(num).popover({
            title: '详细号码<span class="js-uc-betDetail-off" style="float:right;cursor:pointer">X</span>',
            trigger: 'click',
            html: true,
            content: `<div class="js-pf-popover"><span class="word-break">${items.betNum}</span></div>`,
            placement: 'top',
          })
        }
        num++
      }
    })
  },

  offbBetDetailHandler (e) {
    $('.js-uc-betDetail-betNum').popover('hide')
  },

  formatRowData(rowInfo) {
    const row = []
    // 投注时间
    row.push(`<a class="router btn-link" href="${_.getUrl(`/detail/${rowInfo.ticketTradeNo}`)}">${_(rowInfo.betTime).toTime()}</a>`)
    // 彩种
    row.push(rowInfo.ticketName)
    // 玩法
    row.push(rowInfo.playName)
    // 开奖期号
    if (rowInfo.ticketPlanId === 'mmc') {
      row.push('/')
    } else {
      row.push(rowInfo.ticketPlanId)
    }
    // 开奖号码
    row.push(rowInfo.ticketResult)
    // 投注内容
    if ((rowInfo.betNum).length >= 16) {
      row.push('<a class="js-uc-betDetail-betNum btn-link btn-link-cool">详细号码</a>')
    } else {
      row.push(rowInfo.betNum)
    }
    // 投注金额
    row.push(_(rowInfo.betTotalMoney).fixedConvert2yuan())
    // 0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
    // 状态
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
      status = `<span class="text-bold-pleasant">${_(rowInfo.prizeTotalMoney).convert2yuan()}</span>`
    }
    row.push(status)
    /* row.push(rowInfo.chaseId ? '是' : '否');
    row.push(_(rowInfo.betTime).toTime()); */

    return row
  },
})

module.exports = BettingRecordsView
