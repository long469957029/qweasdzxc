

const SearchGrid = require('com/searchGrid')

const TicketSelectGroup = require('com/ticketSelectGroup')

const Timeset = require('com/timeset')

const ReportManageView = SearchGrid.extend({

  template: require('./ticketProfitAndLoss.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      height: 380,
      title: '报表查询',
      tableClass: 'table table-similar table-bordered table-center',
      columns: [
        {
          name: '用户名',
          width: '10%',
        },
        {
          name: '充值',
          width: '10%',
          sortable: true,
          id: 1,
        },
        {
          name: '提现',
          width: '10%',
          sortable: true,
          id: 2,
        },
        {
          name: '投注',
          width: '10%',
          sortable: true,
          id: 3,
        },
        {
          name: '中奖',
          width: '10%',
          sortable: true,
          id: 4,
        },
        {
          name: '返点',
          width: '10%',
          sortable: true,
          id: 5,
        },
        {
          name: '活动',
          width: '9%',
          sortable: true,
          id: 7,
        },
        {
          name: '盈亏',
          width: '12%',
          sortable: true,
          id: 6,
        },
        // {
        //   name: '操作',
        //   width: '9%'
        // }
      ],
      // tip: '<div class="tip-hot"><span>提示</span>报表只保留最近35天的数据。</div>',
      gridOps: {
        emptyTip: '没有资金变更记录',
      },
      ajaxOps: {
        url: '/info/gamereport/gameprofit.json',
      },
      subOps: {
        url: '/info/gamereport/gameprofitdetail.json',
        data: ['userId'],
      },
      reqData: {
        channelId: 0,
      },
    })
  },

  onRender () {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-ac-timeSel'),
      startTime: 'startTime',
      endTime: 'endTime',
      startTimeHolder: '起始日期',
      startDefaultDate: _(moment()).toDate(),
      endTimeHolder: '结束日期',
      endDefaultDate: _(moment()).toDate(),
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
      showIcon: true,
    }).render()

    new TicketSelectGroup({
      el: this.$('.js-ac-ticket-select'),
    })

    // 初始化彩种
    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    let dataList
    if (gridData.dataList) {
      dataList = gridData.dataList
    } else {
      dataList = [gridData]
    }

    const rowsData = _(dataList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false,
    })

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map((parent) => {
        return {
          data: {
            userId: parent.userId,
          },
          label: parent.userName,
        }
      })
      this.renderBread()
    }
    //
    // this.grid.addFooterRows({
    //  trClass: 'tr-footer',
    //  columnEls: [
    //    '<strong>总计</strong>',
    //    _(gridData.rechargeTotal).convert2yuan({fixed:2}),
    //    _(gridData.withdrawTotal).convert2yuan({fixed:2}),
    //    _(gridData.betTotal).fixedConvert2yuan(),
    //    _(gridData.prizeTotal).convert2yuan(),
    //    _(gridData.bonusTotal).convert2yuan(),
    //    _(gridData.activityTotal).convert2yuan(),
    //    _(gridData.profitAndLossTotal).convert2yuan(),
    //    ''
    //  ]
    // })
    //  .hideLoading();
    this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    if (this.hasSub() && rowInfo.username === this.getCurtSub().label || !rowInfo.hasSubUser) {
      row.push(rowInfo.username)
    } else {
      row.push(`<a class="js-pf-sub btn-link" data-label="${rowInfo.username 
      }" data-user-id="${rowInfo.userId}" href="javascript:void(0)">${ 
        rowInfo.username}</a>`)
    }

    row.push(_(rowInfo.recharge).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.withdraw).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.bet).fixedConvert2yuan())
    row.push(_(rowInfo.prize).convert2yuan({ clear: false }))
    row.push(_(rowInfo.rebate).convert2yuan({ clear: false }))
    row.push(_(rowInfo.activity).convert2yuan({ clear: false }))
    row.push(_(rowInfo.profit).convert2yuan({ clear: false }))
    // row.push('<a href="' + _.addHrefArgs('#ac/betting/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">投注</a>&nbsp;&nbsp;' +
    //   '<a  href="' + _.addHrefArgs('#ac/account/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">账变</a>');

    return row
  },
})

module.exports = ReportManageView
