import '../index.scss'

const rechargeService = require('../recharge/rechargeService')
const withdrawService = require('./withdrawService')
const WithdrawConfirmView = require('./withdrawConfirm')

const WithdrawView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-rc-next-step': 'nextStepHandler',
    'click .js-fc-rc-pre': 'preStepHandler',
    'keyup .js-wd-amount-input': 'amountChangeHandler',
  },

  initialize() {

  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/fund/withdraw/info.json',
    })
  },
  onRender() {
    const self = this
    this.getInfoXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        const data = res && res.root || {}
        if (res && res.result === 0) {
          self.initWithdrawData(data)
          self.withdrawData = data
        } else {
          Global.ui.notification.show('服务器异常')
        }
      })
    // 生成充值页广告
    this.$('.jc-rc-activity').html(rechargeService.getFunActivity(this.options.ac))
    // 初始化内容滑动效果数据
    this.conInnerConWidth = 740
    this.conSize = this.$('.jc-wd-view').size()
    if (!this.cur) {
      this.cur = 0
    }
  },
  initWithdrawData(data) {
    // 初始化银行卡列表
    const bankData = withdrawService.getBankData(data.cardList)
    this.$('.js-wd-bank-selected').html(bankData.selected)
    if (data.cardList.length < 2) {
      this.$('.js-wd-bank-items').addClass('hidden')
    } else {
      this.$('.js-wd-bank-items').html(bankData.selected)
    }
    // 显示可提款金额
    this.$('.js-tr-balance').html(_(data.validBalance).convert2yuan())
    this.$('.js-wd-amount-input').attr('data-parsley-max', _(data.validBalance).convert2yuan())
    // 获取温馨提示
    const selectedBankId = this.$('.js-wd-bank-selectedItem')
    this.$('.js-wd-tips-content').html(withdrawService.getTips(data, selectedBankId))
    // 查看是否有协议分红冻结资金
    if (data.freezeMoney > 0) {
      this.$('.js-fc-wd-freezeMoney').html(`<span class="tips-img m-right-sm"></span><span class="tips-text">协议分红冻结金额${_(data.freezeMoney)}元</span>）`)
    }
  },
  amountChangeHandler() {
    const data = this.withdrawData
    if (data.remainTimes <= 0) {
      const selectedBankId = this.$('.js-wd-bank-selectedItem')
      const amount = this.$('.js-wd-amount-input')
      const feeData = withdrawService.getFeeData(data, amount, selectedBankId)
      this.$('.js-wd-feeLimit').html(feeData.fee)
      this.$('.js-wd-feeAmount').html(feeData.amount)
    }
  },
  // 点击充值确定按钮下一步操作判断
  nextStepHandler() {
    if (this.cur < this.conSize - 1) {
      this.slide(this.conInnerConWidth, this.cur + 1)
    }
    const withdrawConfirmView = new WithdrawConfirmView()
    this.$('.jc-wd-confirm-view').html(withdrawConfirmView.render().el)
  },
  preStepHandler() {
    if (this.cur > 0) {
      this.slide(this.conInnerConWidth, this.cur - 1)
    }
  },
  slide(conInnerConWidth, index) {
    this.$('.jc-wd-maskCon').animate({ marginLeft: `${-index * conInnerConWidth}px` })
    this.cur = index
  },
})

export default WithdrawView
