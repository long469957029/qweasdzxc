const SearchGrid = require('com/searchGrid')

const TicketSelectGroup = require('com/ticketSelectGroup')

const Timeset = require('com/timeset')

const ReportManageView = SearchGrid.extend({

  template: require('./sumProfitAndLoss.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      height: 600,
      title: '报表查询',
      tableClass: 'table table-similar table-bordered table-center',
      columns: [
        {
          name: '用户名',
          width: '14%',
        },
        {
          name: '彩票',
          width: '8%',
        },
        {
          name: 'AG',
          width: '8%',
        },
        {
          name: 'EBET',
          width: '8%',
        },
        {
          name: 'BBIN',
          width: '8%',
        },
        {
          name: 'PT',
          width: '8%',
        },
        {
          name: 'MG',
          width: '8%',
        },
        {
          name: 'AG',
          width: '8%',
        },
        {
          name: 'GG',
          width: '8%',
        },
        {
          name: '总盈亏',
          width: '8%',
        },
      ],
      // tip: '<div class="tip-hot"><span>提示</span>报表只保留最近35天的数据。</div>',
      gridOps: {
        emptyTip: '没有资金变更记录',
      },
      ajaxOps: {
        url: '/info/gamereport/teamprofit.json',
        // url: '/info/gamereport/teamprofitdetail.json',
      },
      reqData: {
        // userId: Global.memoryCache.get('acctInfo').userId,
        pageSize: 15,
      },
      subOps: {
        url: '/info/gamereport/teamprofitdetail.json',
        data: ['userId'],
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

    const rowsData = _(dataList).map(function (fundTrace, index, betList) {
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
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>总计</strong>',
        _(gridData.ticketTotal).convert2yuan({ fixed: 2 }),
        _(gridData.agTotal).convert2yuan({ fixed: 2 }),
        _(gridData.ebetTotal).convert2yuan({ fixed: 2 }),
        _(gridData.bbinTotal).convert2yuan({ fixed: 2 }),
        _(gridData.ptTotal).convert2yuan({ fixed: 2 }),
        _(gridData.mgTotal).convert2yuan({ fixed: 2 }),
        _(gridData.agFishTotal).convert2yuan({ fixed: 2 }),
        _(gridData.ggFishTotal).convert2yuan({ fixed: 2 }),
        _(gridData.profitTotal).convert2yuan({ fixed: 2 }),
      ],
    })
      .hideLoading()
    // this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    if (this.hasSub() && rowInfo.username === this.getCurtSub().label || !rowInfo.hasSubUser) {
      row.push(rowInfo.username)
    } else {
      row.push(`<a class="js-pf-sub btn-link" data-label="${rowInfo.username}" 
        data-user-id="${rowInfo.userId}" href="javascript:void(0)">${rowInfo.username}</a>`)
    }
    row.push(_(rowInfo.ticket).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.ag).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.ebet).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.bbin).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.pt).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.mg).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.agFish).convert2yuan({ fixed: 2, clear: false }))
    row.push(_(rowInfo.ggFish).convert2yuan({ fixed: 2, clear: false }))
    // row.push(_(rowInfo.s188).convert2yuan({fixed:2, clear: false}));
    row.push(_(rowInfo.profit).convert2yuan({ fixed: 2, clear: false }))
    return row
  },
})

module.exports = ReportManageView
