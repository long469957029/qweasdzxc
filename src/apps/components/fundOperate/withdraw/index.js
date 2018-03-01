import '../index.scss'

const rechargeService = require('../recharge/rechargeService')
const withdrawService = require('./withdrawService')
const WithdrawConfirmView = require('./withdrawConfirm')

const WithdrawView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-wd-next-step': 'submitHandler',
    'click .js-fc-wd-pre': 'preStepHandler',
    'keyup .js-wd-amount-input': 'amountChangeHandler',
    'click .js-wd-bank-select': 'selectBankDownHandler',
    'click .js-wd-bank-item': 'changeBankHandler',
  },

  initialize() {
    this.cur = 0
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
  getActivityInfo () {
    return Global.sync.ajax({
      url: '/info/activityCenter/fundList.json',
    })
  },
  onRender() {
    const self = this
    const securityStatus = Global.cookieCache.get('security')
    if (securityStatus !== 1) {
      this.$('.js-fc-wd-set-view').html(withdrawService.getPreWithdrawTips(securityStatus))
    } else {
      const ac = Global.memoryCache.get('rechargeAc')
      if (!ac) {
        $.when(this.getActivityInfo(), this.getInfoXhr()).done(function (res1, res2) {
          if (res1[0] && res1[0].result === 0) {
            // 生成充值页广告
            Global.memoryCache.set('rechargeAc', res1[0].root.records)
          } else {
            Global.ui.notification.show('服务器异常')
          }
          if (res2[0].result === 0) {
            self.initPanelCss(res2[0].root)
          } else {
            Global.ui.notification.show('服务器异常')
          }
        })
      } else {
        this.getInfoXhr()
          .always(() => {
            self.loadingFinish()
          })
          .done((res) => {
            const data = res && res.root || {}
            if (res && res.result === 0) {
              self.initPanelCss(data)
            } else {
              Global.ui.notification.show('服务器异常')
            }
          })
      }
      this.ac = Global.memoryCache.get('rechargeAc')
      this.$('.jc-rc-activity').html(rechargeService.getFunActivity(Global.memoryCache.get('rechargeAc')))
    }
    // 监听click事件
    window.addEventListener('click', (e) => {
      const $target = $(e.target)
      if ($target.hasClass('.js-wd-bank-select')) {
        this.selectBankDownHandler()
      }
      if (!$target.hasClass('.js-wd-bank-select')) {
        const height =  this.$('.js-wd-bank-select').height()
        if (height > 100) {
          this.$('.js-wd-bank-select').removeClass('side-down').scrollTop(0)
          this.$('.js-wd-bank-select').addClass('shrink')
          this.$('.js-select-bank-down').removeClass('up')
        }
      }
    }, false)
  },
  initPanelCss(data){
    this.$('.js-fc-wd-set-view').addClass('hidden')
    this.$('.js-fc-wd-operate-view').removeClass('hidden')
    // 生成充值页广告
    this.$('.jc-rc-activity').html(rechargeService.getFunActivity(this.ac))
    // 初始化内容滑动效果数据
    this.conInnerConWidth = 740
    this.conSize = this.$('.jc-wd-view').size()
    if (!this.cur || this.cur>=1) {
      this.cur = 0
    }
    this.parsley = this.$('.js-fc-withdrawal-confirm-form').parsley({
      errorsWrapper: '<div class="tooltip parsley-errors-list"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })
    this.initWithdrawData(data)
    this.withdrawData = data
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
    if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
      Global.ui.notification.show('试玩会员无法进行提现操作，请先注册正式游戏账号',{bStyle:'box-shadow: 0px 0px 6px 3px #ccc'})
      return false
    }
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
          setInterval(this.redirect())
          // self.render()
          // Global.m.oauth.check()
        } else {
          //Global.ui.notification.show(res.msg)
          this.$('.js-fc-wd-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
            `<span class="parsley-error-text text-hot">${res.msg}</span><div>`)
        }
      })
  },
  amountChangeHandler() {
    const data = this.withdrawData
    if (data && data.remainTimes <= 0) {
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
      this.$('.js-wd-bank-select').removeClass('shrink')
      this.$('.js-select-bank-down').addClass('up')
    } else {
      this.$('.js-wd-bank-select').removeClass('side-down').scrollTop(0)
      this.$('.js-wd-bank-select').addClass('shrink')
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
  redirect() {
    const self = this
    let time = 3
    clearInterval(this.countdown)
    this.countdown = setInterval(() => {
      time -= 1
      this.$('.js-tr-leftSecond').text(time)
      if (time < 0 && this.cur > 0) {
        self.countDownSecond = time
        clearInterval(self.countdown)
        this.preStepHandler()
      }
    }, 1000)
  },
})

export default WithdrawView
