

const SearchGrid = require('com/searchGrid')

const TicketSelectGroup = require('com/ticketSelectGroup')

import Timeset from 'com/timeset'

const ReportManageView = SearchGrid.extend({

  template: require('./gameProfitAndLoss.html'),

  events: {
  },

  initialize () {
    _(this.options).extend({
      height: 492,
      title: '报表查询',
      tableClass: 'table table-similar table-bordered table-center border-bottom',
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
        // url: '/info/gamereport/gametypeprofit.json',
        url: '/info/gamereport/gametypeprofitdetail.json',
      },
      reqData: {
        channelId: this.options.channelId,
        type: this.options.type,
        userId: Global.memoryCache.get('acctInfo').userId,
      },
      subOps: {
        url: '/info/gamereport/gametypeprofitdetail.json',
        data: ['userId'],
      },
      cover: false,
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
      minDate:_(moment().subtract(35, 'days')).toTime()
    }).render()
    this.$checkBox = this.$('#js-no-data-game')
    new TicketSelectGroup({
      el: this.$('.js-ac-ticket-select'),
    })
    this.$('.js-no-data').attr('id', `js-no-data-game-${this.options.channelId}${this.options.type}`)
    this.$('.js-checkbox-label').attr('for', `js-no-data-game-${this.options.channelId}${this.options.type}`)
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
    let noHaveData = 0
    _(rowsData).each((item, index) => {
      if (_.isUndefined(rowsData[index].columnEls)) {
        noHaveData += 1
      }
    })
    if (noHaveData === rowsData.length) {
      this.$('.js-wt-empty-container').removeClass('hidden')
    }
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
       _(gridData.rechargeTotal).convert2yuan({fixed:2}),
       _(gridData.withdrawTotal).convert2yuan({fixed:2}),
       _(gridData.betTotal).fixedConvert2yuan(),
       _(gridData.prizeTotal).convert2yuan(),
       _(gridData.rebateTotal).convert2yuan(),
       _(gridData.activityTotal).convert2yuan(),
       _(gridData.profitTotal).convert2yuan()
     ]
    })
     .hideLoading();
    // this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    if (this.$checkBox.is(':checked')) {
      if (rowInfo.recharge === 0 && rowInfo.withdraw === 0 && rowInfo.bet === 0 && rowInfo.prize === 0
        && rowInfo.rebate === 0 && rowInfo.activity === 0 && rowInfo.profit === 0) {
        return
      }
    }
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

    return row
  },
})

module.exports = ReportManageView
