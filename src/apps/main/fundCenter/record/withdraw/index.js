const SearchGrid = require('com/searchGrid')

import Timeset from 'com/timeset'

const WithdrawView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'mouseover .js-fc-img-container': 'showRemarkHandler',
    'mouseout .js-fc-img-container': 'hiddenRemarkHandler',
  },

  initialize () {
    _(this.options).extend({
      title: '报表查询',
      tableClass: 'table table-bordered table-center border-bottom',
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
      height: 504,
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

    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.withdrawList).map(function (info, index, list) {
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

  formatRowData(rowInfo, index) {
    const row = []
    const rowTop = (index * 40) + 63
    row.push(rowInfo.tradeNo)
    row.push(_(rowInfo.createTime).toTime())
    row.push(rowInfo.bankName)
    row.push(`<span class="text-account-cut">${_(rowInfo.amount).fixedConvert2yuan()}</span>`)
    const statusList = []
    if (rowInfo.flowStatus === 0) {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-line"></span></span></div>')
      statusList.push('<div class="inline-block fc-rc-status-img-container"></div>')
      } else if (rowInfo.flowStatus === 1) {
        statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
        statusList.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line">-</span></span>')
        statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-line"></span></span></div>')
        statusList.push('<div class="inline-block fc-rc-status-img-container"></div>')
    } else if (rowInfo.flowStatus === 2) {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-line"></span></span></div>')
      statusList.push('<div class="inline-block fc-rc-status-img-container"></div>')
    } else if (rowInfo.flowStatus === 3) {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button-unPass">未通过</span><span class="fc-rc-status-line-unPass">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-img"></span></span></div>')
      statusList.push('<div class="inline-block js-fc-img-container fc-rc-status-img-container "><i class="fa fa-exclamation-circle" aria-hidden="true"></i></div>' +
        `<div class="fc-rc-status-text-container hidden" style="top:${rowTop}px"><div class="fc-rc-status-text">${rowInfo.remark}</div></div>`)
    } else if (rowInfo.flowStatus === 4) {
      statusList.push('<div class="inline-block fc-rc-status-container"><span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
      statusList.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line-unPass">-</span></span>')
      statusList.push('<span class="fc-rc-status"><span class="fc-rc-status-button-unPass">出款失败</span><span class="fc-rc-status-img"></span></span></div>')
      statusList.push('<div class="inline-block js-fc-img-container fc-rc-status-img-container "><i class="fa fa-exclamation-circle" aria-hidden="true"></i></div>' +
        `<div class="fc-rc-status-text-container hidden" style="top:${rowTop}px"><div class="fc-rc-status-text">${rowInfo.remark}</div></div>`)
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

module.exports = WithdrawView
