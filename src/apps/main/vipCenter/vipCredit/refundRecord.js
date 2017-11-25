

const RefundRecordView = Base.ItemView.extend({
  template: require('./refundRecord.html'),

  events: {
    'click .js-checkout': 'checkoutHandler',
  },

  onRender() {
    const self = this
    this.giridXhr().done((res) => {
      const data = res.root.dataList
      if (res && res.result === 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].status == '待还款') {
            const d = new Date(data[i].applyDate)
            const year = d.getFullYear()
            const day = d.getDate()
            const month = +d.getMonth() + 1
            const hour = d.getHours()
            const minute = d.getMinutes()
            const second = d.getSeconds()
            self.Renderable([{
              BorrowDate: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
              loanMoney: (data[i].loanMoney) / 10000,
              betFlowStandard: (data[i].betFlowStandard) / 10000,
              finishFlow: (data[i].finishFlow) / 10000,
              surplusFlow: (data[i].surplusFlow) / 10000,
              status: data[i].status,
              checkout: `<input type='hidden' value='${data[i].betFlowStandard / data[i].loanMoney}' class='js-mm-0'></input><input type='hidden' value='${data[i].tradeId}' class='js-tt-0'><button class='js-checkout'>申请结算</button></input>`,
            }])
            break
          } else {
            self.$('.js-refundRecord-gird').html('')
            break
          }
        }
      }
    })
    this.checkoutNumXHR()
      .done((res) => {
        if (res && res.result === 0) {
          const proportion = res.root.proportion
          const proportionNum = proportion.split(':')
          self.$('.js-proportion').html(proportionNum[0])
        }
      })
  },
  giridXhr() {
    return Global.sync.ajax({
      url: '/acct/vip/repaymentList.json',
    })
  },
  checkoutXhr(tradeId) { // 结算时请求数据
    return Global.sync.ajax({
      url: '/acct/vip/applySettle.json',
      data: {
        tradeId,
      },
    })
  },
  checkoutNumXHR() { // 结算说明
    return Global.sync.ajax({
      url: '/acct/vip/repayment.json',
    })
  },
  checkoutHandler(tradeId) { // 申请结算
    const self = this
    const index = $(this).parent().prevAll().length
    self.checkoutNumXHR()
      .done((res) => {
        if (res && res.result === 0) {
          const repaymentDiscount = res.root.dataList[0].repaymentDiscount
          const loanMoney = res.root.dataList[0].loanMoney
          $(document).confirm({
            content: `您当前投注可以抵扣还款金额为:${repaymentDiscount / 10000}元，需要从账户余额中扣款金额为:${(loanMoney - repaymentDiscount) / 10000}元，请确定是否要继续还款？`,
            agreeCallback() {
              const tradeId = $(`.js-tt-${index}`).val()
              self.checkoutXhr(tradeId)
                .done((res) => {
                // var self1 = self;
                  if (res && res.result === 0) {
                    if (res.root === 0) {
                      Global.ui.notification.show('结算成功', {
                        type: 'success',
                      })
                      self.onRender()
                    } else {
                      Global.ui.notification.show('对不起，您的余额不足，请充值后再来还款')
                    }
                  } else {
                    Global.ui.notification.show(`结算失败，有可能是：<br>${res.msg}`)
                  }
                })
            },
          })
        }
      })
  },
  Renderable(tableInfo) { // 表格渲染插件
    const self = this
    this.$('.js-refundRecord-gird').staticGrid({
      tableClass: 'table table-bordered table-center',
      colModel: [
        { label: '借款日期', name: 'BorrowDate', width: '20%' },
        { label: '借款金额', name: 'loanMoney', width: '15%' },
        { label: '投注流水要求', name: 'betFlowStandard', width: '15%' },
        { label: '已完成流水', name: 'finishFlow', width: '15%' },
        { label: '剩余流水', name: 'surplusFlow', width: '15%' },
        { label: '借款状态', name: 'status', width: '10%' },
        { label: '操作', name: 'checkout', width: '10%' },
      ],
      row: tableInfo,
    })
  },
})

module.exports = RefundRecordView
