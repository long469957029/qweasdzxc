
const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const ticketCfg = require('skeleton/misc/ticketConfig')

const TicketDetailView = SearchGrid.extend({

  template: require('./ticketDetail.html'),

  events: {},

  initialize() {
    _(this.options).extend({
      height: '300',
      tableClass: 'table table-bordered table-center no-margin',
      columns: [
        {
          name: '时间',
          width: '20%',
        },
        {
          name: '类型',
          width: '10%',
        },
        {
          name: '彩种',
          width: '10%',
        },
        {
          name: '收入',
          width: '20%',
        },
        {
          name: '支出',
          width: '20%',
        },
        {
          name: '剩余金额',
          width: '20%',
        },
      ],
      gridOps: {
        emptyTip: '暂无彩票红包明细',
      },
      ajaxOps: {
        url: '/info/redpack/balanceList.json',
      },
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'startDate',
      endTime: 'endDate',
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
      showToday: true,
    }).render()
    const ticketList = _(ticketCfg.getAll()).sortBy((item, index) => {
      return item.id
    })
    this.$('select[name=ticketId]').html(`<option value="">全部</option>${_(ticketList).map((status) => {
      return `<option value="${ status.id}">${ status.zhName}</option>`
    }).join('')}`)

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.records).map(function(bet, index, betList) {
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
      trClass: 'tr-cool',
      columnEls: [
        '<strong>所有页总计</strong>',
        '', '',
        _(gridData.dataTotal.inComeTotal).convert2yuan(),
        _(gridData.dataTotal.outComeTotal).convert2yuan(),
        '',
      ],
    })
      .hideLoading()
  },

  formatRowData(info) {
    const row = []

    row.push(_(info.time).toTime('YYYY-MM-DD H:mm:ss'))
    row.push(info.type === 1 ? '接收红包' : '使用红包')
    row.push(info.ticketName)
    row.push(_(info.inCome).convert2yuan())
    row.push(_(info.outCome).convert2yuan())
    row.push(_(info.balance).convert2yuan())
    return row
  },
})

module.exports = TicketDetailView
