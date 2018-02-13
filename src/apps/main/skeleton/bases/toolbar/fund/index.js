import './index.scss'

const walletConf = require('com/fundOperate/transfer/walletConf')

const FundView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},
  getFundSummaryXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/summary.json',
      data,
    })
  },
  initialize() {
    this.AccountXhr = this.getFundSummaryXhr()
  },


  onRender() {
    const self = this
    $.when(this.AccountXhr).done((res) => {
      if (res.result === 0) {
        self.$('.jc-sidebar-amount-total').html(_(res.root.total).convert2yuan())// 总余额
        self.$('.jc-sidebar-amount-enable').html(_(res.root.validBalance).convert2yuan())// 可用余额
        this.renderGeneralData(res.root.gameBalance)
        if (res.root.optRecords.length > 0) {
          this.renderRecordData(res.root.optRecords)
        } else {
          this.$('.js-sideBar-record-empty').removeClass('hidden')
        }
      }
    })
  },
  renderGeneralData(data) {
    const self = this
    _(data).each((game) => {
      const channelId = game.channelId
      if (channelId === 0) {
        self.$('.jc-sidebar-center').html(_(game.balance).convert2yuan()) //  总钱包余额
      } else if (channelId === 1) {
        self.$('.jc-sidebar-ag').html(_(game.balance).convert2yuan()) // ag余额
      } else if (channelId === 2) {
        self.$('.jc-sidebar-ebet').html(_(game.balance).convert2yuan()) // ebet余额
      } else if (channelId === 3) {
        self.$('.jc-sidebar-bbin').html(_(game.balance).convert2yuan()) // bbin
      } else if (channelId === 4) {
        self.$('.jc-sidebar-pt').html(_(game.balance).convert2yuan()) // pt余额
      } else if (channelId === 5) {
        self.$('.jc-sidebar-mg').html(_(game.balance).convert2yuan()) // mg余额
      } else if (channelId === 6) {
        self.$('.jc-sidebar-gg').html(_(game.balance).convert2yuan()) // gg余额
      } else if (channelId === 7) {
        self.$('.jc-sidebar-188').html(_(game.balance).convert2yuan()) // 188余额
      }
    })
  },
  renderRecordData(data) {
    const itemHtml = []
    // 1:充值, 2:提现, 3:平台转账
    //  若 type == 1, 则 status = 0 代表待支付, status = 1 代表已到账, status = 2 代表已加款, status = 3 代表未到账
    //  若 type == 2, 则 status = 0 代表审核中, status = 1 代表已通过, status = 2 代表已出款, status = 3 代表未通过, status = 4 代表出款失败
    //  若 type == 3, 则 status = 0 代表处理中, status = 1 代表转账成功, status = 2 代表转账失败
    _(data).each((record) => {
      const html = []
      const createDate = _(record.date).toTime()
      const recordAmount = _(record.amount).formatDiv(10000, {fixed: 2})
      const recordRecord = record.remark
      if (record.type === 1) {
        html.push('<div class="js-sideBar-record-item operation-record-item">')
        html.push('<div class="record-action">充值</div>')
        html.push(`<div class="record-date">${createDate}</div>`)
        html.push('<div class="clearfix"></div>')
        html.push(`<div class="record-amount">${recordAmount}</div>`)
        html.push('<div class="record-progress">')
        if (record.status === 0) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已到账</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-line"></span></span></div>')
        } else if (record.status === 1) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已到账</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-line"></span></span></div>')
        } else if (record.status === 2) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已到账</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-line"></span></span></div>')
        } else {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">待支付</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button-unPass">未到账</span><span class="fc-rc-status-line-unPass">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已加款</span><span class="fc-rc-status-img"></span></span></div>')
        }
        html.push('</div><div class="clearfix"></div>')
        html.push(`<div class="record-remark ${(recordRecord === null)?'hidden':''}">备注：${recordRecord}</div><div class="clearfix"></div></div></div>`)
        itemHtml.push(html.join(''))
      } else if (record.type === 2) {
        html.push('<div class="js-sideBar-record-item operation-record-item">')
        html.push('<div class="record-action">提现</div>')
        html.push(`<div class="record-date">${createDate}</div>`)
        html.push('<div class="clearfix"></div>')
        html.push(`<div class="record-amount">${recordAmount}</div>`)
        html.push('<div class="record-progress">')
        if (record.status === 0) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-line"></span></span></div>')
        } else if (record.status === 1) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-line"></span></span></div>')
        } else if (record.status === 2) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-line"></span></span></div>')
        } else if (record.status === 3) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button-unPass">未通过</span><span class="fc-rc-status-line-unPass">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button">已出款</span><span class="fc-rc-status-img"></span></span></div>')
        } else if (record.status === 4) {
          html.push('<div class="inline-block fc-rc-status-container">' +
            '<span class="fc-rc-status active"><span class="fc-rc-status-button">审核中</span><span class="fc-rc-status-line">-</span></span>')
          html.push('<span class="fc-rc-status active"><span class="fc-rc-status-button">已通过</span><span class="fc-rc-status-line-unPass">-</span></span>')
          html.push('<span class="fc-rc-status"><span class="fc-rc-status-button-unPass">出款失败</span><span class="fc-rc-status-img"></span></span></div>')
        }
        html.push('</div><div class="clearfix"></div>')
        html.push(`<div class="record-remark ${(recordRecord === null)?'hidden':''}">备注：${recordRecord}</div><div class="clearfix"></div></div>`)
        itemHtml.push(html.join(''))
      } else if (record.type === 3) {
        html.push('<div class="js-sideBar-record-item operation-record-item">')
        const formName = walletConf.getId(record.fromChannelId).zhName
        const toName = walletConf.getId(record.toChannelId).zhName
        html.push(`<div class="record-action">${formName}转入${toName}</div>`)
        html.push(`<div class="record-date">${createDate}</div>`)
        html.push('<div class="clearfix"></div>')
        html.push(`<div class="record-amount">${recordAmount}</div>`)
        html.push('<div class="record-progress">')
        if (record.status === 0) {
          html.push('<span class="process-img"></span><span class="process-text">转账中</span>')
        } else if (record.status === 1) {
          html.push('<span class="success-img"></span><span class="success-text">转账成功</span>')
        } else if (record.status === 2) {
          html.push('<span class="fault-img"></span><span class="fault-text">转账失败</span>')
        }
        html.push('</div><div class="clearfix"></div>')
        html.push(`<div class="record-remark ${(recordRecord === null)?'hidden':''}">备注：${recordRecord}</div><div class="clearfix"></div></div>`)
        itemHtml.push(html.join(''))
      }
    })
    this.$('.js-sideBar-record-items').html(itemHtml.join(''))
  },
})

export default FundView
