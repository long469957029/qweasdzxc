

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

const WithdrawView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      title: '报表查询',
      columns: [
        {
          name: '交易流水号',
          width: '16%',
        },
        {
          name: '提现时间',
          width: '16%',
        },
        {
          name: '提现银行',
          width: '10%',
        },
        {
          name: '金额',
          width: '10%',
        },
        {
          name: '余额',
          width: '11%',
        },
        {
          name: '状态',
          width: '8%',
        },
        {
          name: '备注',
          width: '15%',
        },
      ],
      //      tip: '<div class="tip-hot"><span>提示</span>   </div>',
      gridOps: {
        emptyTip: '没有提现记录',
      },
      ajaxOps: {
        url: '/fund/withdraw/withdrawlist.json',
        abort: false,
      },
      reqData: {
        subUser: 0,
      },
      listProp: 'root.withdrawList',
      height: 310,
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

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.withdrawList).map(function(info, index, list) {
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
      // columnEls: ['<strong>所有页总计</strong>', '', '',
      //   _(gridData.amountTotal).fixedConvert2yuan(),
      //   '', '', '',
      // ],
    })
      .hideLoading()
    this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.tradeNo)
    row.push(_(rowInfo.createTime).toTime())
    row.push(rowInfo.bankName)
    row.push(_(rowInfo.amount).fixedConvert2yuan())
    row.push(_(rowInfo.balance).fixedConvert2yuan())
    row.push(rowInfo.status)
    row.push(rowInfo.remark)
    return row
  },
})

module.exports = WithdrawView
