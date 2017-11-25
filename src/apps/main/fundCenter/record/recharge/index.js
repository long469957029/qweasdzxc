

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

// var betStatusConfig = require('userCenter/misc/betStatusConfig');

const RechargeView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      height: '310',
      columns: [
        {
          name: '交易流水号',
          width: '20%',
        },
        {
          name: '充值时间',
          width: '20%',
        },
        {
          name: '充值方式',
          width: '15%',
        },
        {
          name: '充值金额',
          width: '15%',
        },
        {
          name: '账户余额',
          width: '15%',
        },
        {
          name: '状态',
          width: '15%',
        },
      ],
      gridOps: {
        emptyTip: '没有充值记录',
      },
      ajaxOps: {
        url: '/fund/recharge/rechargelist.json',
        //        ,abort: false
      },
      reqData: {
        subUser: 0,
      },
      listProp: 'root.rechargeList',
      //      height: 345
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime ? this.options.reqData.startTime : _(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime ? this.options.reqData.endTime : _(moment().endOf('day')).toTime(),
    }).render()

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.rechargeList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      //      initPagination: true
      initPagination: false,
    })

    // 加上统计行

    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>所有页总计</strong>', '', '',
        gridData.amountTotal / 10000, '', '',
      ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []

    row.push(rowInfo.tradeNo)
    row.push(_(rowInfo.payTime).toTime())
    row.push(rowInfo.type)
    row.push(rowInfo.amount / 10000)
    row.push(rowInfo.balance / 10000)
    row.push(rowInfo.status)
    return row
  },
})

module.exports = RechargeView
