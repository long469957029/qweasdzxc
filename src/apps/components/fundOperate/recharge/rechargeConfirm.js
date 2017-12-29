require('../index.scss')

const RechargeConfirmView = Base.ItemView.extend({

  template: require('./rechargeConfirm.html'),

  events: {},

  onRender() {
    const type = this.options.type
    this.$('.js-rc-info-name').html(this.options.pname)
    this.$('.js-rc-info-amount').html(this.options.amount)
    if (type === 1 || type === 4 || type === 5) {
      this.$('.js-rc-confirm-info-bankName').html(`<span class="confirm-info-name">充值银行：</span><span class="js-rc-info-bank confirm-info-value">${this.options.bname}</span>`)
    }
  },
})

module.exports = RechargeConfirmView
