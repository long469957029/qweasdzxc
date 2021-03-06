

const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const VipCashView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '发放时间',
          width: '25%',
        },
        {
          name: '礼金名称',
          width: '25%',
        },
        {
          name: '金额',
          width: '25%',
        },
        {
          name: '备注',
          width: '25%',
        },
      ],
      gridOps: {
        emptyTip: '没有记录',
      },
      ajaxOps: {
        url: '/acct/vip/queryGiftsList.json',
        abort: false,
      },
      reqData: {
        subUser: 0,
      },
      listProp: 'root.dataList',
      height: 378,
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.startTime ? this.options.startTime : _(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.endTime ? this.options.endTime : _(moment().endOf('day')).toTime(),
    }).render()

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.dataList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info,
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
        '', '<div class="text-hot">总计</div>',
        `<div class="text-hot">${gridData.totalMoney / 10000}</div>`,
        '',
      ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.sendTime)
    row.push(rowInfo.giftsType)
    row.push(rowInfo.money / 10000)
    row.push(rowInfo.remark)
    return row
  },
})

module.exports = VipCashView
