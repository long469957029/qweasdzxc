import '../index.scss'

const rechargeService = require('../recharge/rechargeService')
const withdrawService = require('./withdrawService')
const WithdrawConfirmView = require('./withdrawConfirm')

const WithdrawView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-rc-next-step': 'submitHandler',
    'click .js-fc-rc-pre': 'preStepHandler',
    'keyup .js-wd-amount-input': 'amountChangeHandler',
    'click .js-select-bank-down': 'selectBankDownHandler',
    'click .js-wd-bank-item': 'changeBankHandler',
  },

  initialize() {

  },
  verifyPayPwdXhr (data) {
    return Global.sync.ajax({
      url: '/fund/moneypd/verify.json',
      data,
    })
  },
  getWithdrawXhr(data) {
    return Global.sync.ajax({
      url: '/fund/withdraw/withdraw.json',
      data,
    })
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
          if (!(res.root.hasBankCard && res.root.hasMoneyPwd)) {
            this.$('.jc-wd-set-tips-text').html(withdrawService.getPreWithdrawTips(res.root))
            this.$('.js-fc-wd-set-view').removeClass('hidden')
            this.$('.js-fc-wd-operate-view').addClass('hidden')
            if (res.root.hasBankCard && !res.root.hasMoneyPwd) {
              this.$('.js-wd-goTo-fundPwd').addClass('hidden')
            }
          } else {
            self.initWithdrawData(data)
            self.withdrawData = data
          }
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
    this.parsley = this.$('.js-fc-withdrawal-confirm-form').parsley({
      errorsWrapper: '<div class="tooltip parsley-errors-list"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })
  },
  initWithdrawData(data, bankId) {
    // 初始化银行卡列表
    const bankData = withdrawService.getBankData(data.cardList, bankId)
    this.$('.js-wd-bank-selected').html(bankData.selected)
    if (data.cardList.length < 2) {
      this.$('.js-wd-bank-items').addClass('hidden')
    } else {
      this.$('.js-wd-bank-items').html(bankData.bankItems)
    }
    // 显示可提款金额
    this.$('.js-tr-balance').html(_(data.validBalance).convert2yuan())
    // 获取温馨提示
    const selectedBankId = this.$('.js-wd-bank-selectedItem').data('bankid')
    const tipsData = withdrawService.getTips(data, selectedBankId)
    this.$('.js-wd-tips-content').html(tipsData.tipsHtml)
    // 提款金额添加上下限制
    this.$('.js-wd-amount-input').attr('data-parsley-max', _(data.validBalance).convert2yuan())
    this.$('.js-wd-amount-input').attr('data-parsley-min', tipsData.minInput)
    // 查看是否有协议分红冻结资金
    if (data.freezeMoney > 0) {
      this.$('.js-fc-wd-freezeMoney').html(`<span class="tips-img m-right-sm"></span><span class="tips-text">协议分红冻结金额${_(data.freezeMoney)}元</span>）`)
    }
    if (data.remainTimes <= 0) {
      this.$('.js-wd-fee').remove('hidden')
    }
  },
  submitHandler() {
    const self = this
    //
    // if (!this.canWithdraw) {
    //   Global.ui.notification.show('您已参与呼朋唤友系列活动，在活动任务未完成前，暂不可提现！', {
    //     notiType: 'cloud',
    //     btnContent: '了解详情',
    //     event() {
    //       window.open('activity.html?id=14')
    //     },
    //   })
    //
    //   return false
    // }
    if (!this.parsley.validate()) {
      return false
    }
    const payPwd = this.$('.js-wd-fundPwd-input').val()
    if (!payPwd || payPwd === '') {
      this.$('.js-fc-wd-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
        '<span class="parsley-error-text">资金密码不能为空</span><div>')
      return false
    }
    const data = {payPwd, type: '1'}
    self.verifyPayPwdXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // self.$('.js-uc-pwdToken').val(res.root);
          const cardId = this.$('.js-wd-bank-selectedItem').data('cardid')
          let cardInfo
          _(this.withdrawData.cardList).find((card) => {
            if (Number(cardId) === Number(card.cardId)) {
              cardInfo = cardId
              return true
            }
            return false
          })
          self.confirmHandler(payPwd, cardInfo)
        } else if (_(res.root).isNumber()) {
          if (res.root > 0) {
            this.$('.js-fc-wd-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
              `<span class="parsley-error-text">验证失败，您还有${res.root}次输入机会</span><div>`)
          }
          if (res.root === 0) {
            this.$('.js-fc-wd-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
              '<span class="parsley-error-text">验证失败，请一个小时后再尝试！</span><div>')
          }
        } else {
          this.$('.js-fc-wd-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
            `<span class="parsley-error-text">验证失败，${res.msg}</span><div>`)
        }
      })
  },
  confirmHandler(pwd, cardInfo) {
    // const $btnConfirm = this.$('.js-fc-confirm')
    //
    // $btnConfirm.button('loading')
    const data = {
      cardId: cardInfo,
      amount: this.$('.js-wd-amount-input').val(),
      payPwd: pwd,
      type: 'withdraw',
    }

    this.getWithdrawXhr(data)
      .always(() => {
        // $btnConfirm.button('reset')
      })
      .done((res) => {
        if (res && res.result === 0) {
          if (this.cur < this.conSize - 1) {
            this.slide(this.conInnerConWidth, this.cur + 1)
          }
          const withdrawConfirmView = new WithdrawConfirmView()
          this.$('.jc-wd-confirm-view').html(withdrawConfirmView.render().el)
          // self.render()
          // Global.m.oauth.check()
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
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

  preStepHandler() {
    if (this.cur > 0) {
      this.slide(this.conInnerConWidth, this.cur - 1)
    }
    this.render()
  },
  slide(conInnerConWidth, index) {
    this.$('.jc-wd-maskCon').animate({marginLeft: `${-index * conInnerConWidth}px`})
    this.cur = index
  },
  // 银行列表列表下拉事件
  selectBankDownHandler() {
    const con = this.$('.js-wd-bank-select').height()
    if (con < 100) {
      this.$('.js-wd-bank-select').addClass('side-down')
      this.$('.js-select-bank-down').addClass('up')
    } else {
      this.$('.js-wd-bank-select').removeClass('side-down')
      this.$('.js-select-bank-down').removeClass('up')
    }
  },
  // 银行卡列表重新选择事件
  changeBankHandler(e) {
    const $target = $(e.currentTarget)
    const cardId = $target.data('cardid')
    this.$('.js-wd-bank-select').removeClass('side-down').scrollTop(0)
    this.$('.js-select-bank-down').removeClass('up')
    this.initWithdrawData(this.withdrawData, cardId)
  },
})

export default WithdrawView
