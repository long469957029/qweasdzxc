

const SearchGrid = require('com/searchGrid')
import Timeset from 'com/timeset'
const tradingStatusConfig = require('fundCenter/misc/tradingStatusConfig')

const MoneyDetailView = SearchGrid.extend({

  template: require('fundCenter/accountDetail/center.html'),

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
          name: '类型',
          width: '9%',
        },
        {
          name: '收入/支出',
          width: '12%',
        },
        {
          name: '账户余额',
          width: '14%',
        },
        {
          name: '备注',
          width: '15%',
        },
      ],
      // tip: '<div class="tip-hot"><span>提示</span> 帐户明细只保留30天数据。</div>',
      gridOps: {
        emptyTip: '没有账户明细',
      },
      ajaxOps: {
        url: '/fund/balance/history.json',
      },
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
      size: 'timer-record-input',
      showIcon: true,
      minDate:_(moment().subtract(30, 'days')).toTime()
    }).render()

    this.$('select[name=tradeType]').html(_(tradingStatusConfig.get()).map((status) => {
      return `<option value="${status.id}">${status.searchName}</option>`
    }).join(''))

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
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      // columnEls: [
      //   '<strong>所有页总计</strong>',
      //   '', '',
      //   _(_(gridData.income).add(gridData.spending)).fixedConvert2yuan(),
      //   '', '',
      // ],
    }).hideLoading()
  },

  formatRowData(info) {
    const row = []
    // Number(info.tradeType) === 107 || info.tradeType === '投注'
    if (info.remark === '投注扣款' || info.remark === '中奖' || info.remark.indexOf('投注所得') !== -1 || info.remark === '用户撤单' || info.remark === '系统撤单') {
      row.push(`<a class="btn-link js-gl-bet-detail-dialog" data-id="${info.tradeNo}">${info.tradeNo}</a>`)
    } else if (info.remark === '追号扣款' || info.remark.indexOf('撤销追号') !== -1) { //
      row.push(`<a class="btn-link js-gl-chase-detail-dialog" data-no="${info.tradeNo}">${info.tradeNo}</a>`)
    } else {
      row.push(info.tradeNo)
    }
    row.push(_(info.createTime).toTime())

    // row.push(tradingStatusConfig.toZh(info.tradeType));
    row.push(info.tradeType)
    if (info.amount >= 0) {
      row.push(`<span class="text-prominent">+${_(info.amount).convert2yuan()}</span>`)
    } else {
      row.push(`<span class="text-cool">${_(info.amount).convert2yuan()}</span>`)
    }

    row.push(`<span class="">${_(info.balance).convert2yuan()}</span>`)
    let remark = info.remark

    if (remark.replace(/[\u4e00-\u9fa5]/g, '**').length > 16) {
    // if (info.remark.length > 5) {
      remark = remark.substring(0, 16)

      const newLen = remark.replace(/[*]/g, '').length
      const subLen = 6 + newLen / 2// 当前宽度大约够显示16-17个字符，多减了两个位置留给省略号
      row.push(`<div title="${info.remark}">${info.remark.substr(0, subLen)}...</div>`)
    } else {
      row.push(info.remark)
    }

    return row
  },
})

module.exports = MoneyDetailView
