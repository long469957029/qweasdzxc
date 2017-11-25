

const bankConfig = require('userCenter/misc/bankConfig')

const MoneyWithdrawalView = Base.ItemView.extend({

  template: require('fundCenter/withdraw/index.html'),

  className: 'fc-moneyWithdrawal-view',

  startOnLoading: true,

  cardItemTpl: _(require('fundCenter/withdraw/moneyWithdrawal-cardItem.html')).template(),
  confirmTpl: _(require('fundCenter/withdraw/moneyWithdrawal-confirm.html')).template(),

  events: {
    'submit .js-fc-withdraw-form': 'submitHandler',
    'submit .js-fc-withdrawal-confirm-form': 'confirmHandler',
    'click .js-fc-back': 'backHandler',
    'change .js-fc-wd-bankRadio': 'bankSelectedHandler',
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/fund/withdraw/info.json',
    })
  },

  getWithdrawXhr(data) {
    return Global.sync.ajax({
      url: '/fund/withdraw/withdraw.json',
      data,
    })
  },
  verifyPayPwdXhr (data) {
    return Global.sync.ajax({
      url: '/fund/moneypd/verify.json',
      data,
    })
  },

  canWithdraw: true,

  onRender() {
    const self = this
    // 校验用户的状态，如果是冻结的用户，不可以操作此页面
    const acctInfo = Global.memoryCache.get('acctInfo')

    this.$selectContainer = this.$('.js-fc-withdrawal-select')

    this.$form = this.$('.js-fc-withdraw-form')
    this.$btnSubmit = this.$('.js-fc-btn-submit')
    this.$cardList = this.$('.js-fc-cardList')
    this.$validBalance = this.$('.js-fc-validBalance')
    this.$serviceTime = this.$('.js-fc-serviceTime')
    this.$freezeMoney = this.$('.js-fc-wd-freezeMoney')
    this.cardList = {}

    this.$confirmContainer = this.$('.js-fc-withdrawal-confirm')

    if (!acctInfo || acctInfo.userStatus === 100) {
      this.$btnSubmit.prop('disabled', true)
      Global.ui.notification.show('用户已被冻结，无法进行提现操作。')
    }

    this.parsley = this.$form.parsley({
      errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })

    this.getInfoXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        const data = res && res.root || {}
        if (res && res.result === 0) {
          self.renderBasicInfo(data)
        } else {
          Global.ui.notification.show('服务器异常')
        }
      })

    Global.newbieActivity.checkWithdrawal()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          self.canWithdraw = data.withdraw
        }
      })
  },

  renderBasicInfo(data) {
    const self = this
    this.$validBalance.text(_(data.validBalance).convert2yuan())
    this.$('.js-fc-wd-amount').attr('data-parsley-max', _(data.validBalance).convert2yuan())
    const valTradeNum = data.remainTimes
    const setCharge = data.feeType// 手续费类型

    this.desTradeNum = ''
    if (setCharge == 'percent') {
      var chargeText = `超过次数按 <span class="text-pleasant">${_(data.fee).formatDiv(100)}%</span>收取手续费`
    }
    if (setCharge == 'fix') {
      var chargeText = `超过次数按每笔<span class="text-pleasant">${_(data.fee).formatDiv(10000)}元</span>收取手续费`
    }
    if (data.remainTimes <= 0) {
      self.$('.js-tx-number').removeClass('hidden')
      // 收取手续费
      self.$('.js-fc-wd-amount').on('input porpertychange', () => {
        const takeOut = self.$('.js-fc-wd-amount').val()
        if (Number(takeOut)) { // 输入的是数字，计算手续费
          const charge = _(data.fee).formatDiv(10000) // 手续费
          const maxMoney = Number(self.$('.js-zd-tx').text())// 超过金额收取手续费
          const maxChargeMoney = _(data.feeLimit).formatDiv(10000)// 最高手续费
          let chargeMoney = 0
          let trueMoney = 0
          if (takeOut >= maxMoney) {
            if (setCharge == 'percent') {
              chargeMoney = Math.floor(takeOut * charge) < maxChargeMoney ? Math.floor(takeOut * charge) : maxChargeMoney
            } else {
              chargeMoney = charge < maxChargeMoney ? charge : maxChargeMoney
            }
            trueMoney = takeOut - chargeMoney
            self.$('.js-tx-charge').text(chargeMoney)
            self.$('.js-tx-arrivalAmount').text(trueMoney)
          }
          self.$('.js-tx-charge').text(chargeMoney)
          self.$('.js-tx-arrivalAmount').text(trueMoney)
        }
      })
    }
    this.desTradeNum = `,今日还可以提现<span class="text-pleasant">${valTradeNum}次</span>,${chargeText}）`
    if (data.freezeMoney > 0) {
      this.$freezeMoney.html(`（协议分红冻结金额<span class="text-pleasant"> ${_(data.freezeMoney).convert2yuan()}元</span>）`)
    }

    this.$('.js-fc-wd-tradeNum').val(valTradeNum)
    if (valTradeNum === 0) {
      this.$('.js-fc-btn-submit').prop('disabled', true)
    }

    this.renderCardList(data.cardList)
    this.renderServiceTime(data)

    this.$effectiveTime = this.$('.js-fc-wd-effective-time')
    const $leftSeconds = this.$('.js-fc-wd-effective-time')
    _($leftSeconds).each((item, index) => {
      const $target = $(item)
      const $container = $target.closest('.js-fc-card-item')
      const $span = $container.find('.js-fc-wd-bankRadioSpan')
      const $pic = $container.find('.js-fc-card-pic')
      const $newCard = $container.find('.js-fc-wd-newCard')
      const $frozenTime = $container.find('.js-fc-wd-frozenTime')
      const cardInfo = bankConfig.get($pic.data('bankid'))
      let seconds = $target.data('second')
      $pic.attr('src', cardInfo.logo)
      // seconds = 100;
      const effectiveDate = new Date(new Date(1970, 0, 1).getTime() + _(seconds).formatMul(1000))
      let milliseconds = effectiveDate.getTime()
      setInterval(() => {
        milliseconds -= 1000
        $target.html(_(effectiveDate.setTime(milliseconds)).formatTime('HH:mm:ss'))

        if (--seconds <= 0) {
          $container.removeClass('unActive')
          $span.removeClass('invisible')
          $newCard.addClass('hidden')
          $frozenTime.addClass('hidden')
          $pic.attr('src', cardInfo.logo)
        }
      }, 1000)
    })


    if (!data.hasMoneyPwd || !data.hasBankCard) {
      this.$el.securityTip({
        content: '请补充完您的安全信息后再提现',
        hasMoneyPwd: data.hasMoneyPwd,
        hasBankCard: data.hasBankCard,
        body: this.$el,
      })
    }
    this.$('.js-fc-wd-tab-body').removeClass('hidden')
  },

  renderCardList(cardList) {
    this.cardList = cardList
    if (_(cardList).isEmpty()) {
      this.$cardList.html()
    } else {
      this.$cardList.html(_(cardList).map(function(card, index) {
        const bankInfo = bankConfig.get(card.bankId)
        return this.cardItemTpl(_(card).extend({
          pic: bankInfo ? bankInfo.logo : '',
          disPic: bankInfo ? bankInfo.disLogo : '',
          zhName: bankInfo ? bankInfo.zhName : '',
          index,
          bankId: card.bankId,
        }))
      }, this).join(''))
      this.$('.js-fc-wd-bankRadio').not('.invisible').eq(0).trigger('click')
    }
  },

  renderServiceTime(data) {
    this.$('.js-fc-wd-fullTimeService').val(data.fullTimeService)
    this.$('.js-fc-wd-startTime').val(data.startTime)
    this.$('.js-fc-wd-endTime').val(data.endTime)

    if (!data.fullTimeService) {
      if (data.startTime !== 0 || data.startTime !== data.endTime) {
        if (data.startTime > data.endTime) {
          this.$serviceTime.html(`1、平台每天提现时间为： ${data.startTime}:00 至 次日${data.endTime}:00。`)
        } else {
          this.$serviceTime.html(`1、平台每天提现时间为： ${data.startTime}:00 至 ${data.endTime}:00。`)
        }
        return
      }
    }

    this.$serviceTime.html('1、平台每天24小时均可提现。')
  },

  // event handlers

  submitHandler() {
    const self = this

    if (!this.canWithdraw) {
      Global.ui.notification.show('您已参与呼朋唤友系列活动，在活动任务未完成前，暂不可提现！', {
        notiType: 'cloud',
        btnContent: '了解详情',
        event() {
          window.open('activity.html?id=14')
        },
      })

      return false
    }

    /*    if(this.$('.js-fc-wd-tradeNum').val() === '' || Number(this.$('.js-fc-wd-tradeNum').val()) === 0) {
      Global.ui.notification.show('可提现次数不足。');
      return false;
    } */
    if (!this.parsley.validate()) {
      return false
    }
    if (!this.checkValidateTime()) {
      return false
    }

    const payPwd = this.$('.js-fc-wd-payPwd').val()
    if (!payPwd || payPwd === '') {
      Global.ui.notification.show('资金密码不能为空')
      return false
    }
    const data = { payPwd, type: '1' }
    self.verifyPayPwdXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // self.$('.js-uc-pwdToken').val(res.root);
          self.goToConfirm()
        } else if (_(res.root).isNumber()) {
          if (res.root > 0) {
            Global.ui.notification.show(`验证失败，您还有${res.root}次输入机会`)
          }
          if (res.root === 0) {
            Global.ui.notification.show('验证失败，请一个小时后再尝试！')
          }
        } else {
          Global.ui.notification.show(`验证失败，${res.msg}`)
        }
      })
  },

  goToConfirm() {
    const self = this
    const cardId = this.$('.js-fc-wd-bankRadio:checked').val()
    let cardInfo

    _(this.cardList).find((card, index, paymentList) => {
      if (Number(cardId) === Number(card.cardId)) {
        cardInfo = card

        return true
      }
    })

    this.$confirmContainer.html(this.confirmTpl({
      cardInfo,
      amount: self.$('.js-fc-wd-amount').val(),
    })).removeClass('hidden')

    this.$selectContainer.addClass('hidden')
  },

  backHandler() {
    this.$selectContainer.removeClass('hidden')
    this.$confirmContainer.addClass('hidden')
  },

  checkValidateTime() {
    let flag = false
    const fullTimeService = this.$('.js-fc-wd-fullTimeService').val()
    let startTime = this.$('.js-fc-wd-startTime').val()
    let endTime = this.$('.js-fc-wd-endTime').val()

    if (_(fullTimeService).isUndefined()) {
      flag = true
    } else if (_(fullTimeService).isString() && fullTimeService === '') {
      flag = true
    } else if (_(fullTimeService).isString() && fullTimeService === 'false') {
      const now = new Date().getHours() + 1
      if (startTime === '' || endTime === '') {
        flag = true
      } else {
        startTime = Number(startTime)
        endTime = Number(endTime)

        if (startTime < endTime) {
          if (now < startTime || now > endTime) {
            flag = true
          }
        } else if (endTime < now && now < startTime) {
          flag = true
        }
      }
    }
    if (flag) {
      Global.ui.notification.show(`非常抱歉，平台提现处理时间为：<br />${ 
        startTime}:00至${endTime}，请在规定时间发起提现`)

      return false
    }
    return true
  },

  bankSelectedHandler(e) {
    const self = this

    this.$btnSubmit.removeAttr('disabled')

    const cardId = this.$('.js-fc-wd-bankRadio:checked').val()
    _(this.cardList).find((card, index, paymentList) => {
      if (cardId === `${card.cardId}`) {
        let valMin = _(card.minMoneyLimit).convert2yuan()
        let valMax = _(card.maxMoneyLimit).convert2yuan()
        let desMin = ''
        let desMax = ''
        if (valMin === 0) {
          valMin = 1
          desMin = '（单笔最低提现金额无限制'
        } else {
          desMin = `（单笔最低提现金额<span class="text-pleasant"><span class="js-zd-tx">${valMin}</span>元</span>`
        }
        if (valMax === 0) {
          valMax = 5000000
          desMax = ',最高提现金额无限制'
        } else {
          desMax = `,最高提现限额<span class="text-pleasant">${valMax}元</span>`
        }
        self.$('.js-fc-wd-amount').attr('data-parsley-range', `[${valMin},${valMax}]`)
        self.$('.js-fc-wd-valDesc').html(desMin + desMax + self.desTradeNum)
        return true
      }
    })
  },


  confirmHandler() {
    const self = this

    const $btnConfirm = this.$('.js-fc-confirm')

    $btnConfirm.button('loading')

    const data = {
      cardId: this.$('.js-fc-wd-bankRadio:checked').val(),
      amount: this.$('.js-fc-wd-amount').val(),
      payPwd: this.$('.js-fc-wd-payPwd').val(),
      type: 'withdraw',
    }

    this.getWithdrawXhr(data)
      .always(() => {
        $btnConfirm.button('reset')
      })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.dialog.show({
            size: 'p-body-size',
            body: '<div class="p-left-lg m-bottom-lg m-top-lg">' +
            '<div class="p-dialog-body-logo"><span class="sfa sfa-dialog-success"></span></div>' +
            '<div class="p-dialog-body-title pull-left">提现申请成功！</div>' +
            '<div class="p-dialog-body-context">系统将在5分钟内处理您的提款，请耐心等待。</div>' +
            '<div class="m-top-lg m-bottom-lg"><button type="button" class="js-ac-ocm-copy ac-ocm-copy btn btn-sun p-dialog-btn-scale" data-dismiss="modal">关闭</button><a data-dismiss="modal" class="router" href = "#fc/wr" target="_self" ><div class=" p-dialog-record" >查看提现记录</div></a></div>' +
            '</div>',
            bodyClass: 'p-top-xs p-left-lg p-right-lg text-center ',
          })

          self.render()
          Global.m.oauth.check()
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },

  formatSeconds(value) {
    let theTime = parseInt(value)// 秒
    let theTime1 = 0// 分
    let theTime2 = 0// 小时
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60)
      theTime = parseInt(theTime % 60)
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60)
        theTime1 = parseInt(theTime1 % 60)
      }
    }
    const result = `${parseInt(theTime)}`
    if (theTime1 > 0) {
      theTime1 = `${parseInt(theTime1)}`
    }
    if (theTime2 > 0) {
      theTime2 = `${parseInt(theTime2)}`
    }
    return `${theTime2}:${theTime1}:${result}`
  },
})

module.exports = MoneyWithdrawalView
