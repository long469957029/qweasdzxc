const rechargeService = require('./rechargeService')
var Clipboard = require('clipboard')
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
          if(root.bankId != 102){
            self.$('.js-rc-aliAndBankTransfer-info').removeClass('hidden')
            self.$('.js-fc-re-gotoAliPay').removeClass('hidden')
            self.$('.js-rc-ali-title').removeClass('ali-title')
            self.$('.jc-rc-info-name').html(root.name)
            self.$('.jc-rc-info-cardNo').html(root.cardNo)
            self.$('.jc-rc-info-bank').html(root.bankName)
            self.$('.jc-rc-info-bankAddress').html(root.bankBranchName)
            self.$('.jc-rc-info-amount').html(_(root.amount).convert2yuan())
            self.$('.jc-rc-info-keyword').html(root.keyword)
            self.$('.jc-rc-info-copy-name').attr('data-clipboard-text',root.name)
            self.$('.jc-rc-info-copy-cardNo').attr('data-clipboard-text',root.cardNo)
            self.$('.jc-rc-info-copy-amount').attr('data-clipboard-text',_(root.amount).convert2yuan())
            self.$('.jc-rc-info-copy-keyword').attr('data-clipboard-text',root.keyword)
          }else{
            self.$('.js-rc-aliScanCode-info').removeClass('hidden')
            self.$('.js-fc-re-gotoAliPay').addClass('hidden')
            self.$('.js-rc-ali-title').addClass('ali-title')
            self.$('.js-ali-qr-code').attr('src',root.cardNo)
            self.$('.js-rc-ali-user-name').html(root.name)
            self.$('.js-rc-ali-amount').html('<span class="sfa sfa-jpy"></span>' + _(root.amount).convert2yuan())
            self.$('.jc-rc-info-keyword').html(root.keyword)
            self.$('.jc-rc-info-copy-keyword').attr('data-clipboard-text',root.keyword)
          }

          const clipboard = new Clipboard('.jc-rc-info-copy');
          clipboard.on('success', function(e) {
            $(e.trigger).find('span').addClass('copySuccess')
            setTimeout(() => {
              $(e.trigger).find('span').removeClass('copySuccess')
            },1000)
            e.clearSelection();
          });

          clipboard.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
          });
        } else {
          Global.ui.notification.show('网络异常，请稍后再试。')
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
