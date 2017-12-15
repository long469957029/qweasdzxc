const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

const TicketSelectGroup = require('com/ticketSelectGroup')

const trackStatusConfig = require('userCenter/misc/trackStatusConfig')

const TrackRecordsView = SearchGrid.extend({

  template: require('fundCenter/gameRecord/trackRecords.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '追号时间',
          width: '18%',
        },
        {
          name: '彩种',
          width: '15%',
        },
        {
          name: '玩法',
          width: '12%',
        },
        {
          name: '开始奖期',
          width: '14%',
        },
        {
          name: '追号进度',
          width: '10%',
        },
        {
          name: '追号总金额',
          width: '12%',
        },
        {
          name: '中奖金额',
          width: '10%',
        },
        {
          name: '追号状态',
          width: '9%',
        },
      ],
      gridOps: {
        emptyTip: '没有追号记录',
      },
      ajaxOps: {
        url: '/ticket/bethistory/userchasehistory.json',
      },
      // tip: '<div class="tip-hot"><span>注意</span> 追号记录只保留最近30天。</div>',
      height: 280,
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTimeHolder: '起始日期',
      startDefaultDate: _(moment().add('day', 0)).toDate(),
      endTimeHolder: '结束日期',
      endDefaultDate: _(moment().add('day', 0)).toDate(),
      startOps: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      endOps: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      showIcon: true,
    }).render()

    // 初始化彩种选择
    new TicketSelectGroup({
      el: this.$('.js-uc-ticket-select-group'),
    })

    this.$('select[name=chaseStatus]').html(_(trackStatusConfig.get()).map((betStatus) => {
      return `<option value="${betStatus.id}">${betStatus.zhName}</option>`
    }).join(''))

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.chaseList).map(function (bet, index, betList) {
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
      // columnEls: [
      //   '<strong>所有页总计</strong>', '', '', '', '',
      //   _(gridData.chaseMoneyTotal).convert2yuan(),
      //   _(gridData.prizeMoneyTotal).convert2yuan(),
      //   '',
      // ],
    }).hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    // 追号时间
    row.push(`<a class="router btn-link" href="${_.getUrl(`/detail/${rowInfo.ticketTradeNo}`)}/id/${rowInfo.ticketChaseId}">${_(rowInfo.chaseTime).toTime()}</a>`)
    // 彩种
    row.push(rowInfo.ticketName)
    // 玩法
    row.push(rowInfo.playName)
    // 开奖奖期
    if (rowInfo.ticketPlanId === 'mmc') {
      row.push('/')
    } else {
      row.push(rowInfo.ticketPlanId)
    }
    // 追号进度
    row.push(`${rowInfo.chaseBetCount}/${rowInfo.chaseAllPeriods}`)
    // 追号总金额
    row.push(_(rowInfo.chaseAllMoney).fixedConvert2yuan())
    // 中奖金额
    let chasePrizeMoney = ''
    if (rowInfo.chasePrizeMoney === 0 || rowInfo.chasePrizeMoney === null) {
      chasePrizeMoney = '0'
    } else {
      chasePrizeMoney = `<span class="text-add">${_(rowInfo.chasePrizeMoney).convert2yuan()}</span>`
    }
    row.push(chasePrizeMoney)
    // 追号状态
    switch (rowInfo.chaseStatus) {
      case 0:
        rowInfo.formatChaseStatus = '未开始'
        break
      case 1:
        rowInfo.formatChaseStatus = '进行中'
        break
      case 2:
        rowInfo.formatChaseStatus = '已完成'
        break
      case 3:
        rowInfo.formatChaseStatus = '已中止'
        break
      default:
        break
    }
    row.push(rowInfo.formatChaseStatus)
    return row
  },
})

module.exports = TrackRecordsView
