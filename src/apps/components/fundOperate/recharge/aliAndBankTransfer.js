const rechargeService = require('./rechargeService')

const AliAndBankTransfer = Base.ItemView.extend({

  template: require('./aliAndBankTransfer.html'),

  events: {},
  getDobankrechargeXhr (data) {
    return Global.sync.ajax({
      url: '/fund/recharge/dobankrecharge.json',
      data,
    })
  },
  onRender() {
    const self = this
    const lastPayInfo = rechargeService.getPaymentInfo(this.options.type, this.options.tips)
    const feeData = rechargeService.doFeeData(lastPayInfo)
    this.$('.js-rc-confirm-tips-content').html(rechargeService.get(this.options.type, feeData.min, feeData.max, feeData.limit, feeData.maxLimit))
    if (this.options.type === 6) {
      this.$('.js-fc-re-gotoAliPay').removeClass('hidden')
    }
    const data = {
      amount: this.options.amount,
      name: this.options.name,
      paymentType: this.options.type,
      wap: 0,
      bankId: this.options.bankId,
    }
    this.getDobankrechargeXhr(data)
      .done((res) => {
        if (res.result === 0) {
          const root = res.root
          self.$('.jc-rc-info-name').html(root.name)
          self.$('.jc-rc-info-cardNo').html(root.cardNo)
          self.$('.jc-rc-info-bank').html(root.bankName)
          self.$('.jc-rc-info-bankAddress').html(root.bankBranchName)
          self.$('.jc-rc-info-amount').html(_(root.amount).convert2yuan())
          self.$('.jc-rc-info-keyword').html(root.keyword)
          // if (paymentType === 11) {
          //   self.$fcReBankTransferferPrompt.find('.js-starBank').html(selectBank.name)
          //   if (root.bankId === selectBank.type) {
          //     self.$fcReBankTransferferPrompt.find('.js-isSameBank').html('汇款到')
          //   } else {
          //     self.$fcReBankTransferferPrompt.find('.js-isSameBank').html('跨行汇款到')
          //   }
          //   self.$fcReBankTransferferPrompt.find('.js-endBank').html(root.bankName)
          //   self.$fcReBankUrl.attr('href', selectBank.url).html(selectBank.url)
          // }
          // _(self.$('.js-fe-re-copy')).each((btn, index) => {
          //   const $btn = $(btn)
          //   const text = $btn.closest('div').find('span').html()
          //   $btn.textCopy({
          //     text,
          //     notShowToolTip: true,
          //   })
          // })
          // self.$('.js-fc-re-formArea, .js-tip-info').toggle()
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
    // 请求充值页广告
    if (this.options.ac) {
      this.$('.jc-rc-confirm-activity').html(rechargeService.getFunActivity(self.activityList))
    } else {
      self.activityList = null
      rechargeService.getFunActivity(self.activityList)
    }
  },

})

module.exports = AliAndBankTransfer
