

const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

// var betStatusConfig = require('userCenter/misc/betStatusConfig');

const PersonalView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'change .js-fc-rr-channelId-type': 'channelTypeChangeHandler',
  },

  channelTypeChangeHandler(e) {
    const game = this.$('select[name="channelIdType"]').val()
    const channelId = game.substr(0, 1)
    const type = game.substr(1, 1)
    this.$('.js-ac-br-channelId').val(channelId)
    this.$('.js-ac-br-type').val(type)
  },

  initialize () {
    _(this.options).extend({

	  height: '370',

      columns: [
        {
          name: '交易流水号',
          width: '20%',
        },
        {
          name: '结算日期',
          width: '15%',
        },
        {
          name: '平台',
          width: '10%',
        },
        {
          name: '游戏名称',
          width: '15%',
        },
        {
          name: '投注金额',
          width: '15%',
        },
        {
          name: '返水比例',
          width: '10%',
        },
        {
          name: '返水金额',
          width: '15%',
        },

      ],
      gridOps: {
        emptyTip: '没有返水记录',
      },
      ajaxOps: {
        url: '/ticket/gameRebate/history.json',
        //        ,abort: false
      },
      reqData: {
        // subUser: 0
      },
      listProp: 'root.records',
      //      height: 345
    })
  },

  onRender() {
    // 初始化时间选择

    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'startDate',
      endTime: 'endDate',
      startTimeHolder: '起始日期',
      startDefaultDate: this.options.reqData.startTime ? this.options.reqData.startTime : _(moment().add('day', -1).startOf('day')).toDate(),
      endTimeHolder: '结束日期',
      endDefaultDate: this.options.reqData.endTime ? this.options.reqData.endTime : _(moment().add('day', -1).endOf('day')).toDate(),
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
    }).render()

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.records).map(function(info, index, list) {
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

        '<strong>所有页总计</strong>', '', '', '',
        gridData.dataTotal && gridData.dataTotal.betTotal, '', // amountTotal
        gridData.dataTotal && gridData.dataTotal.rebateBonusTotal,

      ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    // "tradeNo":"GG123456789",
    //   "day":1515121512,
    //   "userName":"frank",
    //   "userId":50,
    //   "channelId":1,
    //   "channelName":"AG",
    //   "typeId":2,
    //   "typeName":"真人",
    //   "bet":"200.00",
    //   "rebateBet":"200.00",
    //   "rebate":"5.5",
    //   "rebateAmount":"100.00",
    //   "status":0,
    //   "payDate":15151212
    row.push(rowInfo.tradeNo)
    row.push(_(rowInfo.day).toDate())
    row.push(_(rowInfo.channelId).getChannelById().channelName)
    row.push(rowInfo.gameName)
    row.push(rowInfo.rebateBet)
    row.push(`${rowInfo.rebate}%`)
    row.push(rowInfo.rebateAmount)

    return row
  },
})

module.exports = PersonalView
