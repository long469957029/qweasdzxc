require('../index.scss')
const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

// var betStatusConfig = require('userCenter/misc/betStatusConfig');

const RechargeView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'mouseover .js-fc-img-container': 'showRemarkHandler',
    'mouseout .js-fc-img-container': 'hiddenRemarkHandler',
  },

  initialize () {
    _(this.options).extend({
      height: '504',
      columns: [
        {
          name: '交易流水号',
          width: '20%',
        },
        {
          name: '时间',
          width: '20%',
        },
        {
          name: '方式',
          width: '20%',
        },
        {
          name: '金额',
          width: '18%',
        },
        {
          name: '状态',
          width: '22%',
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
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime(),
      size: 'timer-record-input',
      showIcon: true,
    }).render()
    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.rechargeList).map(function (info, index, list) {
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
      //   '<strong>所有页总计</strong>', '', '',
      //   gridData.amountTotal / 10000, '', '',
      // ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.tradeNo)
    row.push(_(rowInfo.payTime).toTime())
    if (rowInfo.type === 1 || rowInfo.type === 4 || rowInfo.type === 5 || rowInfo.type === 11) {
      row.push(`<span class="m-right-sm">${rowInfo.type}</span>[${rowInfo.bankName}]`)
    } else {
      row.push(`<span class="m-right-sm">${rowInfo.type}</span>`)
    }
    row.push(`<span class="text-account-add">+${_(rowInfo.amount) / 10000}</span>`)
    // row.push(rowInfo.balance / 10000)

    const statusList = []
    if (rowInfo.flowStatus === 0) {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已到账</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-line"></span></span></div>')
    } else if (rowInfo.flowStatus === 1) {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已到账</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-line"></span></span></div>')
    } else if (rowInfo.flowStatus === 2) {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已到账</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-line"></span></span></div>')
    } else {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button-unPass">未到账</span><span class="fc-rc-status-line-unPass">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-img"></span></span></div>')
    }
    row.push(statusList.join(''))
    return row
  },

  showRemarkHandler(e) {
    const $target = $(e.currentTarget)
    $target.closest('td').find('.fc-rc-status-text-container').removeClass('hidden')
  },
  hiddenRemarkHandler(e) {
    const $target = $(e.currentTarget)
    $target.closest('td').find('.fc-rc-status-text-container').addClass('hidden')
  },
})

module.exports = RechargeView
