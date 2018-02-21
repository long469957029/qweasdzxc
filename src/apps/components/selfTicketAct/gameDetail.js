

const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const ticketCfg = require('skeleton/misc/ticketConfig')

const GameDetailView = SearchGrid.extend({

  template: require('./gameDetail.html'),

  events: {},

  initialize() {
    _(this.options).extend({
      height: '300',
      columns: [
        {
          name: '时间',
          width: '20%',
        },
        {
          name: '类型',
          width: '15%',
        },
        {
          name: '发放金额',
          width: '15%',
        },
        {
          name: '流水要求',
          width: '15%',
        },
        {
          name: '到期时间',
          width: '20%',
        },
        {
          name: '状态',
          width: '15%',
        },
      ],
      gridOps: {
        emptyTip: '暂无游戏红包明细',
      },
      ajaxOps: {
        url: '/info/redpack/balanceGameList.json',
      },
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'sendStartDate',
      endTime: 'sendEndDate',
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
    }).render()

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
        '',
        _(gridData.dataTotal.redpackAmountTotal).convert2yuan(),
        '',
        '', '',
      ],
    })
      .hideLoading()
  },

  formatRowData(info) {
    const row = []

    row.push(_(info.time).toTime('YYYY-MM-DD H:mm:ss'))
    row.push(info.redpackName)
    row.push(_(info.repackAmount).convert2yuan())
    row.push(_(info.threholdBet).convert2yuan())
    row.push(_(info.endTime).toTime())
    row.push(info.status === 0 ? '未领取' : (info.status === 1 ? '已领取' : '已过期'))
    return row
  },
})

module.exports = GameDetailView
