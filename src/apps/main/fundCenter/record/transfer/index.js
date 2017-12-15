

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

// var betStatusConfig = require('userCenter/misc/betStatusConfig');

const TransferView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      height: '370',
      columns: [
        {
          name: '交易流水号',
          width: '20%',
        },
        {
          name: '日期时间',
          width: '20%',
        },
        {
          name: '来自钱包',
          width: '15%',
        },
        {
          name: '转到钱包',
          width: '15%',
        },
        {
          name: '转账金额',
          width: '15%',
        },
        {
          name: '状态',
          width: '15%',
        },
      ],
      gridOps: {
        emptyTip: '没有转账记录',
      },
      ajaxOps: {
        url: '/fund/balance/transferhistory.json',
        //        ,abort: false
      },
      reqData: {
        subUser: 0,
      },
      listProp: 'root.dataList',
      //      height: 345
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
    const rowsData = _(gridData.dataList).map(function(info, index, list) {
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
      // columnEls: [
      //   '<strong>所有页总计</strong>', '', '', '',
      //   _(gridData.amountTotal).convert2yuan(), '',
      // ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    // {
    //   tradeNo:"xxxx",
    //     createTime:13333333,
    //   fromChannelId:1,
    //   toChannelId:3,
    //   amount:10000,
    //   status:1
    // }
    row.push(rowInfo.tradeNo)
    row.push(_(rowInfo.createTime).toTime())
    row.push(rowInfo.fromChannelId === 0 ? '中心钱包' : (_.getChannelById(rowInfo.fromChannelId).channelName))
    row.push(_.getChannelById(rowInfo.toChannelId).channelName)
    if (rowInfo.amount >= 0) {
      row.push(`<span class="text-add">+${_(rowInfo.amount).convert2yuan()}</span>`)
    } else {
      row.push(`<span class="text-cut">${_(rowInfo.amount).convert2yuan()}</span>`)
    }
    let status = ''
    switch (rowInfo.status) {
      case 0: status = '处理中'; break
      case 1: status = '转账成功'; break
      case 2: status = '转账失败'; break
      default: break
    }
    row.push(status)
    return row
  },
})

module.exports = TransferView
