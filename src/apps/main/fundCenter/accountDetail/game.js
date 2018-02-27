import SearchGrid from 'com/searchGrid'
import Timeset from 'com/timeset'

const MoneyDetailView = SearchGrid.extend({

  template: require('fundCenter/accountDetail/game.html'),

  events: {},

  initialize() {
    _(this.options).defaults({
      betDetailPrevUrl: '#gc/tr/detail/',
      chaseDetailPrevUrl: '#gc/cr/detail/',
    })

    _(this.options).extend({
      height: '515',
      tableClass: 'table table-bordered table-center border-bottom',
      columns: [
        {
          name: '交易流水号',
          width: '22%',
        },
        {
          name: '日期时间',
          width: '16%',
        },
        {
          name: '游戏',
          width: '9%',
        },
        {
          name: '类型',
          width: '12%',
        },
        {
          name: '变化金额',
          width: '14%',
        },
        // {
        //   name: '备注',
        //   width: '15%'
        // }
      ],
      // tip: '<div class="tip-hot"><span>提示</span> 帐户明细只保留30天数据。</div>',
      gridOps: {
        emptyTip: '没有账户明细',
      },
      ajaxOps: {
        url: '/fund/balance/gamehistory.json',
      },
      reqData: {
        channelId: this.options.channelId,
      },
    })
  },

  onRender() {
    // 初始化时间选择
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
      size: 'timer-record-input',
      showIcon: true,
    }).render()


    // this.$('select[name=tradeType]').html(_(tradingStatusConfig.get()).map(function(status) {
    //   return '<option value="' + status.id + '">' + status.searchName + '</option>';
    // }).join(''));

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.balanceList).map(function(bet, index, betList) {
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
    // 加上统计行
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      // columnEls: [
      //   '<strong>所有页总计</strong>',
      //   '', '', '',
      //   _(gridData.amountTotal).fixedConvert2yuan(),
      // ],
    }).hideLoading()
  },

  formatRowData(info) {
    const row = []

    row.push(info.tradeNo)

    row.push(_(info.createTime).toTime())

    // row.push(tradingStatusConfig.toZh(info.tradeType));
    row.push(info.game)
    let type = ''
    //! important 代码及描述是相对中心钱包的，因此对于平台来说需要反过来
    switch (info.tradeType) {
      case 114: type = '转出'; break
      case 118: type = '转入'; break
      case 107: type = '投注'; break
      default: break
    }
    row.push(type)
    if (info.amount >= 0) {
      row.push(`<span class="text-bold-pleasant">${_(info.amount).convert2yuan()}</span>`)
    } else {
      row.push(`<span class="">${_(info.amount).convert2yuan()}</span>`)
    }

    // row.push('<span class="text-bold-cool">+'+_(info.balance).convert2yuan()+'</span>');
    // var remark = info.remark;

    // if (remark.replace(/[\u4e00-\u9fa5]/g, '**').length>16) {
    // //if (info.remark.length > 5) {
    //   remark = remark.substring(0,16);
    //
    //   var newLen =remark.replace(/[*]/g,'').length;
    //   var subLen = 6+newLen/2;//当前宽度大约够显示16-17个字符，多减了两个位置留给省略号
    //   row.push('<div title="' + info.remark + '">' + info.remark.substr(0, subLen) + '...</div>');
    // } else {
    //   row.push(info.remark);
    // }

    return row
  },
})

module.exports = MoneyDetailView
