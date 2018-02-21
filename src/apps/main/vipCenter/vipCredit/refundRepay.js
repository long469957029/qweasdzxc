const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const betStatusConfig = require('userCenter/misc/betStatusConfig')

const RefundRecordView = SearchGrid.extend({

  template: require('./applyRepay.html'),

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '借款日期',
          width: '25%',
        },
        {
          name: '借款金额',
          width: '10%',
        },
        {
          name: '投注流水要求',
          width: '15%',
        },
        {
          name: '已完成流水',
          width: '15%',
        },
        {
          name: '剩余流水',
          width: '15%',
        },
        {
          name: '借款状态',
          width: '25%',
        },
      ],
      gridOps: {
        emptyTip: '没有记录',
      },
      ajaxOps: {
        url: '/acct/vip/repaymentList.json',
        abort: false,
      },
      viewType: 'team',
      reqData: {
        subUser: 1,
      },
      listProp: 'root.dataList',
      height: 360,
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime ? this.options.reqData.startTime : _(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime ? this.options.reqData.endTime : _(moment().endOf('day')).toTime(),
    }).render()
    if (this.options.reqData.username) {
      this.$('input[name="username"]').val(this.options.reqData.username)
    }

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
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    if ((rowInfo.status).indexOf('结清') > 0) {
      // var d=new Date(rowInfo.applyDate);
      // var year=d.getFullYear();
      // var day=d.getDate();
      // var month=+d.getMonth()+1;
      // var hour=d.getHours();
      // var minute=d.getMinutes();
      // var second=d.getSeconds();
      // row.push(year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
      row.push(_(rowInfo.applyDate).toTime())

      // row.push(rowInfo.applyDate);
      row.push(rowInfo.loanMoney / 10000)
      row.push(rowInfo.betFlowStandard / 10000)
      row.push(rowInfo.finishFlow / 10000)
      row.push(rowInfo.surplusFlow / 10000)
      row.push(rowInfo.status)
    }
    return row
  },
})

module.exports = RefundRecordView
