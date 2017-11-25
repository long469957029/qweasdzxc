

const ApplyView = Base.ItemView.extend({

  template: require('./apply.html'),

  events: {
    'click .js-submit': 'submitHandler',
  },

  initialize() {

  },

  getConfigXhr() {
    return Global.sync.ajax({
      url: '/acct/vip/creditFundConifg.json',
    })
  },

  onRender() {
    const self = this
    this.getConfigXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const monthlyCredit = res.root.monthlyCredit
          const totalLoanMoney = res.root.totalLoanMoney
          const loanMoneyLimit = res.root.loanMoneyLimit
          if ((monthlyCredit - totalLoanMoney) >= loanMoneyLimit) {
            self.$('.js-amount2').html(loanMoneyLimit / 10000)
          } else if ((monthlyCredit - totalLoanMoney) < 0) {
            self.$('.js-amount2').html(0)
          } else {
            self.$('.js-amount2').html((monthlyCredit - totalLoanMoney) / 10000)
          }
        }
        if (res.msg == '对不起，您当前VIP等级不能申请借款') {
          self.$('.js-amount2').html(0)
          Global.ui.notification.show(res.msg)
        }
      })
  },

  saveLoanXhr(money) {
    return Global.sync.ajax({
      url: '/acct/vip/saveLoanAplly.json',
      data: {
        money,
      },
    })
  },

  submitHandler() {
    const self = this
    const money = this.$('.js-money').val()
    const reg = /^[0-9]*$/

    if (!reg.test(money) || money == '') {
      Global.ui.notification.show('请输入正整数')
    } else {
      this.saveLoanXhr(money).done((res) => {
        if (res && res.result == 0) {
          Global.ui.notification.show(res.msg, {
            type: 'success',
          })
        } else {
          // Global.ui.notification.show('结算失败，有可能是：<br>' + res.msg);
          Global.ui.notification.show('请输入正整数')
        }
      })
    }
  },

})

module.exports = ApplyView
