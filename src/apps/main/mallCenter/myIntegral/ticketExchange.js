

const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const TicketExchangeView = SearchGrid.extend({

  template: require('./ticketExchange.html'),

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
          name: '兑换时间',
          width: '15%',
        },
        {
          name: '券类型',
          width: '10%',
        },
        {
          name: '券编号',
          width: '15%',
        },
        {
          name: '说明',
          width: '15%',
        },
        {
          name: '消耗积分值',
          width: '15%',
        },
        {
          name: '到期时间',
          width: '15%',
        },
        {
          name: '返利金额',
          width: '15%',
        },
      ],
      gridOps: {
        emptyTip: '亲，暂时没有记录~',
        // emptyClass:'sfa-mall-grid-empty'
      },
      ajaxOps: {
        url: '/mall/coupon/myCouponList.json',
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
        '所有页总计', '', '', '',
        _(gridData.dataTotal.totalIntegral).formatDiv(10000, { fixed: 2, clear: true }),
        '',
        _(gridData.dataTotal.totalBonus).convert2yuan(),
      ],
    }).hideLoading()
  },
  formatRowData (rowInfo) {
    const row = []

    row.push(_(rowInfo.exchangeDate).toTime())
    row.push(rowInfo.couponType === 1 ? '充值券' : (rowInfo.couponType === 2 ? '加奖券' : (rowInfo.couponType === 3 ? '补贴券'
      : (rowInfo.couponType === 4 ? '返水券' : (rowInfo.couponType === 5 ? '代金券' : '现金券')))))
    row.push(rowInfo.couponToken)
    row.push(rowInfo.couponDesc)
    row.push(_(rowInfo.requireIntegral).convert2yuan())
    row.push(_(rowInfo.validEndDate).toTime())
    row.push(rowInfo.status === 0 ? '统计中' : (rowInfo.status === 2 ? '已过期' : _(rowInfo.bonusAmount).convert2yuan()))
    return row
  },
})

module.exports = TicketExchangeView
