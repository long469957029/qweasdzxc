

const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const IntegralDetailsView = SearchGrid.extend({

  template: require('./integralDetails.html'),

  startOnLoading: true,

  events: {
  },
  serializeData() {
    return {
      loading: Global.ui.loader.get(),
    }
  },

  initialize () {
    _(this.options).extend({
      footerClass: 'mall-te-footer',
      tableClass: 'table table-bordered table-center no-margin',
      columns: [
        {
          name: '时间',
          width: '20%',
        },
        {
          name: '行为',
          width: '20%',
        },
        {
          name: '积分',
          width: '20%',
        },
        {
          name: '剩余积分',
          width: '20%',
        },
        {
          name: '备注',
          width: '20%',
        },
      ],
      gridOps: {
        emptyTip: '亲，暂时没有记录~',
        mptyClass: 'sfa-mall-grid-empty',
      },
      ajaxOps: {
        url: '/mall/integral/detailList.json',
        abort: false,
      },
      reqData: {
        pageSize: 10,
      },
      listProp: 'root.records',
      height: 500,
      pageStyle: 'mall',
    })
  },

  onRender() {
    const self = this
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'startDate',
      endTime: 'endDate',
      startDefaultDate: _(moment().startOf('day')).toDate(),
      endDefaultDate: _(moment().endOf('day')).toDate(),
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
      showIcon: true,
    }).render()
    const acctInfo = Global.memoryCache.get('acctInfo')
    const totalIntegral = _(Global.cookieCache.get(`${acctInfo.userId}integral`)).convert2yuan()
    this.$('.js-historical-points').html(totalIntegral)
    SearchGrid.prototype.onRender.apply(this, arguments)
  },
  renderGrid(gridData) {
    const num = 0
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
      trClass: 'mall-footer',
      columnEls: [
        '所有页总计', '',
        _(gridData.dataTotal.totalIntegral).formatDiv(10000, { fixed: 2, clear: true }),
        '', '',
      ],
    }).hideLoading()
  },
  formatRowData (rowInfo) {
    const row = []

    row.push(_(rowInfo.date).toTime())
    row.push(rowInfo.actionName)
    row.push(rowInfo.incomeIntegral === 0 ? (rowInfo.outcomeIntegral === 0 ? `<span class="">${_(rowInfo.incomeIntegral).convert2yuan()}</span>`
      : `<span class="">-${_(rowInfo.outcomeIntegral).convert2yuan()}</span>`) : `<span class="">${_(rowInfo.incomeIntegral).convert2yuan()}</span>`)
    row.push(_(rowInfo.integral).convert2yuan())
    row.push(_.isNull(rowInfo.remark) ? '' : rowInfo.remark)
    return row
  },
})

module.exports = IntegralDetailsView
