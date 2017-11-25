

const TabView = require('com/tabView')

const quickPayConfig = require('fundCenter/misc/quickPayConfig')
const bankConfig = require('userCenter/misc/bankConfigForFund')

const RechargeView = TabView.extend({

  template: require('fundCenter/recharge/index.html'),
  events: {
    'click .js-fc-re-payment-type': 'paymentTypeChangeHandler',
    'click .js-fc-re-bank': 'bankSelectHandler',
    'click .js-ac-statistic-type': 'quickAmountHandler',
    'click .js-fc-re-commit': 'confirmHandler',
    'keyup .js-fc-re-amount': 'keyOnChangeHandler',
    'click .js-fc-re-next': 'nextHandler',
    'click .js-fc-re-gotoAliPay': 'gotoAliPayHandler',
    'click .js-fc-re-gotoBank': 'gotoBankHandler',
    'click .js-activity-state': 'activityState',

    'click .js-fc-re-cancel': 'cancelnopayHandler',
    'click .js-donopay-btn': 'donopayBtnHandler',
    'click .js-unPaymentOrder-close': 'closeUnPaymentHandler',
    // 'change .js-fc-re-bankList':'bankSelectHandler',
    'click .js-pay-type-btn': 'payTypeHanler',
    'click .js-fc-re-bankList-select': 'showBankListHandler',
    'click .js-fc-re-bankList-bg': 'hideBankListHandler',
  },


  keyOnChangeHandler () {
    if (this.$hasFare) {
      let amount = $('.js-fc-re-amount').val()
      let fare = Number(amount) > this.FeeChargeAmount ? _(amount).chain().formatMul(this.$feeLimit).formatDiv(100, { fixed: 4 })
        .value() : 0

      if (fare >= this.$maxFeeLimit) {
        fare = this.$maxFeeLimit
      }

      // 支付宝转账、银行卡转账，返还手续费
      const paymentType = this.paymentInfo.paymentType
      if (paymentType == 6 || paymentType == 11) {
        amount = _.add(amount, fare)
      } else {
        amount -= fare
      }
      this.$fareResult.html(isNaN(fare) ? 0 : fare)
      this.$amountResult.html(isNaN(amount) ? 0 : amount)
    }
  },

  startOnLoading: true,
  activityList: null,

  className: 'js-fc-recharge-view fc-recharge',

  getRechargeBaseInfoXhr() {
    return Global.sync.ajax({
      url: '/fund/recharge/rechargetype.json',
    })
  },

  getActivityInfo (argument) {
    return Global.sync.ajax({
      async: false,
      url: '/info/rechargeBonus/info.json',
    })
  },


  getNopaydetailXhr(sync) {
    return Global.sync.ajax({
      url: '/fund/recharge/nopaydetail.json',
      async: !sync,
    })
  },

  getCancelnopayXhr(data) {
    return Global.sync.ajax({
      url: '/fund/recharge/cancelnopay.json',
      data,
    })
  },

  getDonopaybankXhr(data) {
    return Global.sync.ajax({
      url: '/fund/recharge/donopaybankrecharge.json',
      data,
    })
  },


  onRender() {
    const self = this
    this.$PaymentContainer = this.$('.js-fc-re-tabs')
    this.$paymentCaptions = this.$('.js-payment-captions')
    this.$BankContainer = this.$('.js-fc-re-bankList')
    this.$BankContainerBg = this.$('.js-fc-re-bankList-bg')
    this.$QuickAmountContainer = this.$('.js-fc-re-quickAmounts')
    this.$fareResult = this.$('.js-fare-result')
    this.$amountResult = this.$('.js-jine-result')
    this.$fareAlert = this.$('.js-fare-alert')

    this.$userName = this.$('.js-fc-re-userName')
    this.$userNameTipAilpay = this.$('.js-fc-re-userName-tip-alipay')
    this.$userNameTipBank = this.$('.js-fc-re-userName-tip-bank')
    this.$btnCommit = this.$('.js-fc-re-commit')
    this.$btnNext = this.$('.js-fc-re-next')
    this.$reName = this.$('.js-fc-re-name')
    this.$recName = this.$('.js-fc-re-recName')
    this.$reNum = this.$('.js-fc-re-num')
    this.$cardInfo = this.$('.js-fc-re-cardInfo')
    this.$cardAddress = this.$('.js-fc-re-cardAddress')
    this.$reMoney = this.$('.js-fc-re-money')
    this.$rePs = this.$('.js-fc-re-ps')
    this.$fcReFormArea = this.$('.js-fc-re-formArea')
    this.$tipInfo = this.$('.js-tip-info')
    this.$fcReAliPayTransferPrompt = this.$('.js-fc-re-aliPayTransfer-prompt')
    this.$fcReBankTransferferPrompt = this.$('.js-fc-re-bankTransfer-prompt')
    this.$fcReGotoAliPayDiv = this.$('.js-fc-re-gotoAliPay-div')
    this.$fcReGotoBankDiv = this.$('.js-fc-re-gotoBank-div')
    this.$fcReBankUrlDiv = this.$('.js-fc-re-bankUrl-div')
    this.$fcReBankUrl = this.$('.js-fc-re-bankUrl')
    this.$fcReLookTransferTutorial = this.$('.js-fc-re-lookTransferTutorial')
    this.$fcReFeeTitle = this.$('.js-fc-re-fee-title')

    this.$unPaymentBgDiv = this.$('.js-unPaymentOrder-bg')
    this.$importantPromptBgDiv = this.$('.js-important-prompt-bg')
    this.$paymentTypeDiv = this.$('.js-paymentType')
    this.$payTypeDiv = this.$('.js-payType')
    this.$rechargeTypeDiv = this.$('.js-rechargeType')
    this.$accountNameDiv = this.$('.js-accountName')
    this.$accountNumDiv = this.$('.js-accountNum')
    this.$amountDiv = this.$('.js-amount')
    this.$keywordDiv = this.$('.js-keyword')
    this.$donopayBtnDiv = this.$('.js-donopay-btn')
    this.$donopayOpenDiv = this.$('.js-donopay-open')

    this.$jsFcPayType = this.$('.js-fc-re-payType')
    this.$jsFcRechargeType = this.$('.js-fc-re-rechargeType')
    this.$jsFcAccountName = this.$('.js-fc-re-accountName')
    this.$jsFcAccountNum = this.$('.js-fc-re-accountNum')
    this.$jsFcRefresh = this.$('.js-fc-re-refresh')
    this.$jsPayType = this.$('.js-fc-pay-type')
    this.$jsPayAlipay = this.$('.js-pay-type-alipay')
    this.$jsPayWeixin = this.$('.js-pay-type-weixin')
    this.$jsBankListSelect = this.$('.js-fc-re-bankList-select')
    this.$jsFcReTipList = this.$('.js-fc-re-tip-list')
    this.bankIcon = ''

    this.getRechargeBaseInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          self.generateTab(res.root.paymentList, res.root.onlyBankPay)
          self.paymentList = res.root.paymentList
          if (res.root.lastPaymentType) {
            self.$(`.js-fc-re-payment-type[data-payment-type=${res.root.lastPaymentType}]`).trigger('click')
          } else {
            self.$('.js-fc-re-payment-type:first').trigger('click')
          }
          // 默认触发一次点击事件 默认是第一个（银联支付一）
          self.$('.js-fc-re-payment-type:first').trigger('click')
          // 银联支付一 银联支付二 银联支付三
          self.$paymentCaptions.find('.js-caption-type-1').find('a:first').bind('click', (e) => {
            self.paymentTypeChangeHandler(e)
          })
          self.$paymentCaptions.find('.js-caption-type-1').find('a:first').next().bind('click', (e) => {
            self.paymentTypeChangeHandler(e)
          })
          self.$paymentCaptions.find('.js-caption-type-1').find('a:last').bind('click', (e) => {
            self.paymentTypeChangeHandler(e)
          })
          // 微信小额支付一和二，三
          self.$paymentCaptions.find('.js-captionsub-type-3').bind('click', function(e) {
            self.$(this).addClass('active')
            self.$(this).siblings().removeClass('active')
            self.paymentTypeChangeHandler(e)
          })
          self.$paymentCaptions.find('.js-captionsub-type-7').bind('click', function(e) {
            self.$(this).addClass('active')
            self.$(this).siblings().removeClass('active')
            self.paymentTypeChangeHandler(e)
          })
          self.$paymentCaptions.find('.js-captionsub-type-10').bind('click', function(e) {
            self.$(this).addClass('active')
            self.$(this).siblings().removeClass('active')
            self.paymentTypeChangeHandler(e)
          })
          // 微信大额支付一和二,三
          self.$paymentCaptions.find('.js-caption-type-7>a:first-child').bind('click', function() {
            self.$(this).addClass('active')
            self.$(this).siblings().removeClass('active')
          })
          self.$paymentCaptions.find('.js-caption-type-7>a:first-child').next().bind('click', function() {
            self.$(this).addClass('active')
            self.$(this).siblings().removeClass('active')
          })
          self.$paymentCaptions.find('.js-caption-type-7>a:last-child').bind('click', function() {
            self.$(this).addClass('active')
            self.$(this).siblings().removeClass('active')
          })
          self.$paymentCaptions.find('.js-caption-type-1').find('a:first').trigger('click')
        }
        self.$fcReFormArea.height(self.$('.js-fc-re-form').height() - self.$PaymentContainer.height())
        if (res.root.hasNoPay) {
          self.nopaydetail()
        } else {
          self.$unPaymentBgDiv.addClass('hidden')
        }
      })

    this.getActivityInfo().done((res) => {
      if (res.result == 0) {
        self.activityList = res.root.rechargeConfList.length == 0 ? null : res.root.rechargeConfList
      } else if (res.result == 1) {
        self.activityList = null
      }
    })
  },
  initPaymentPage(e) {
    const $target = $(e.currentTarget)
    const paymentId = $target.data('paymentId')
    const paymentType = $target.data('paymentType')
    let activityList = '<ul class="js-fc-re-rechargeActivity fc-re-rechargeActivity">'

    this.$('input[name="paymentId"]').val(paymentId)
    this.$('input[name="paymentType"]').val(paymentType)

    const payment = _(this.paymentList).findWhere({
      paymentType,
    })
    this.paymentInfo = {
      paymentId,
      paymentType,
    }
    if (this.activityList != null) {
      if (paymentType == 1) {
        activityList = this.addActivity(1)
        this.cleanActivity()
        this.$('.js-fc-re-rechargeActivity').replaceWith(activityList)
      } else if (paymentType == 4) {
        activityList = this.addActivity(4)
        this.cleanActivity()
        this.$('.js-fc-re-rechargeActivity').replaceWith(activityList)
      } else if (paymentType == 5) {
        activityList = this.addActivity(5)
        this.cleanActivity()
        this.$('.js-fc-re-rechargeActivity').replaceWith(activityList)
      } else if (paymentType == 6) {
        activityList = this.addActivity(6)
        this.cleanActivity()
        this.$('.js-fc-re-rechargeActivity').replaceWith(activityList)
      } else if (paymentType == 9) {
        activityList = this.addActivity(9)
        this.cleanActivity()
        this.$('.js-fc-re-rechargeActivity').replaceWith(activityList)
      } else if (paymentType == 11) {
        activityList = this.addActivity(11)
        this.cleanActivity()
        this.$('.js-fc-re-rechargeActivity').replaceWith(activityList)
      } else {
        this.$('.js-fc-re-rechargeActivity').replaceWith('<ul class="js-fc-re-rechargeActivity fc-re-rechargeActivity"></ul>')
      }
    }

    $('.js-activity-state').each((index, item) => {
      const $item = $(item)
      if ($item.data('type') == $('.js-fc-re-amount').val()) {
        $item.addClass('activity-current').siblings().removeClass('activity-current')
      }
    })


    if (paymentType === 6) {
      this.$fcReLookTransferTutorial.attr('href', '#nb/detail/20501')
      this.$fcReLookTransferTutorial.removeClass('hidden')
      this.$fcReFeeTitle.html('返还手续费：')
      this.$tipInfo.hide()
      this.$fcReFormArea.show()
      this.$userName.removeClass('hidden')
      // this.$userNameTipAilpay.removeClass('hidden');
      // this.$userNameTipBank.addClass('hidden');
      this.$jsFcReTipList.html('<label class="block m-left-lg p-left-lg">2.晚上<span class="text-hot">23:30-01:00</span>，使用支付宝转账到银行卡时如果提示第二天到账，请勿付款</label>' +
        '<label class="block m-left-lg p-left-lg">3.平台账户会不定时更换，请在获得最新信息后充值，否则损失自负</label>' +
        '<label class="block m-left-lg p-left-lg">4.在积分商城兑换充值券后，充值才可享受奖励</label>')
      this.$btnNext.removeClass('hidden')
      this.$btnCommit.addClass('hidden')
      this.$reName.attr('required', true)
      this.$fcReAliPayTransferPrompt.removeClass('hidden')
      this.$fcReBankTransferferPrompt.addClass('hidden')
      this.$fcReGotoAliPayDiv.removeClass('hidden')
      this.$fcReGotoBankDiv.addClass('hidden')
      this.$fcReBankUrlDiv.addClass('hidden')

      if (payment.lastName) {
        this.$reName.val(payment.lastName)
      }
    } else if (paymentType === 11) {
      this.$fcReLookTransferTutorial.attr('href', '#nb/detail/20502')
      this.$fcReLookTransferTutorial.removeClass('hidden')
      this.$fcReFeeTitle.html('返还手续费：')
      this.$userName.addClass('hidden')
      this.$userNameTipBank.addClass('hidden')
      this.$tipInfo.hide()
      this.$fcReFormArea.show()
      const bankList = [
        {
          bankCode: 'boc', bankId: 5, bankName: '中国银行', bankUrl: 'https://ebsnew.boc.cn',
        },
        {
          bankCode: 'abc', bankId: 4, bankName: '农业银行', bankUrl: 'https://perbank.abchina.com/EbankSite/startup.do',
        },
        {
          bankCode: 'icbc', bankId: 2, bankName: '工商银行', bankUrl: 'https://mybank.icbc.com.cn',
        },
        {
          bankCode: 'ccb', bankId: 3, bankName: '建设银行', bankUrl: 'https://ibsbjstar.ccb.com.cn/CCBIS/V6/common/login.jsp',
        },
        {
          bankCode: 'comm', bankId: 6, bankName: '交通银行', bankUrl: 'https://pbank.95559.com.cn/personbank/logon.jsp', 
        },
        {
          bankCode: 'cmb', bankId: 1, bankName: '招商银行', bankUrl: 'https://pbsz.ebank.cmbchina.com/CmbBank_GenShell/UI/GenShellPC/Login/Login.aspx',
        },
        {
          bankCode: 'cmbc', bankId: 10, bankName: '民生银行', bankUrl: 'https://nper.cmbc.com.cn/pweb/static/login.html',
        },
        {
          bankCode: 'cib', bankId: 12, bankName: '兴业银行', bankUrl: 'https://personalbank.cib.com.cn',
        },
        {
          bankCode: 'spdb', bankId: 9, bankName: '浦发银行', bankUrl: 'https://ebank.spdb.com.cn/nbper/prelogin.do', 
        },
        {
          bankCode: 'gdb', bankId: 7, bankName: '广发银行', bankUrl: 'https://ebanks.cgbchina.com.cn/perbank/',
        },
        {
          bankCode: 'ecitic', bankId: 13, bankName: '中信银行', bankUrl: 'https://i.bank.ecitic.com/perbank6/signIn.do', 
        },
        {
          bankCode: 'ceb', bankId: 8, bankName: '光大银行', bankUrl: 'https://www.cebbank.com/per/prePerlogin.do?ident=gr&_locale=zh_CN',
        },
        {
          bankCode: 'post', bankId: 14, bankName: '邮政储蓄', bankUrl: 'https://pbank.psbc.com', 
        },
        {
          bankCode: 'pingan', bankId: 11, bankName: '平安银行', bankUrl: 'https://bank.pingan.com.cn/ibp/bank/index.html#home/home/index',
        },
      ]
      payment.bankList = bankList
      this.$btnNext.removeClass('hidden')
      this.$btnCommit.addClass('hidden')
      this.$fcReAliPayTransferPrompt.addClass('hidden')
      this.$fcReBankTransferferPrompt.removeClass('hidden')
      this.$fcReGotoAliPayDiv.addClass('hidden')
      this.$fcReGotoBankDiv.removeClass('hidden')
      this.$fcReBankUrlDiv.removeClass('hidden')
      this.$reName.removeAttr('required')
      // this.$userNameTipBank.removeClass('hidden');
      // this.$userNameTipAilpay.addClass('hidden');
      this.$jsFcReTipList.html('<label class="block m-left-lg p-left-lg">2.平台账户会不定时更换，请在获得最新信息后充值，否则损失自负</label>' +
        '<label class="block m-left-lg p-left-lg">3.在积分商城兑换充值券后，充值才可享受奖励</label>')
    } else {
      this.$fcReLookTransferTutorial.addClass('hidden')
      this.$fcReFeeTitle.html('手续费：')
      this.$userName.addClass('hidden')
      // this.$userNameTipAilpay.addClass('hidden');
      // this.$userNameTipBank.addClass('hidden');
      this.$jsFcReTipList.html('<label class="block m-left-lg p-left-lg">2.在积分商城兑换充值券后，充值才可享受奖励</label>')
      this.$btnNext.addClass('hidden')
      this.$btnCommit.removeClass('hidden')
      this.$reName.removeAttr('required')
      this.$tipInfo.hide()
      this.$fcReFormArea.show()
    }

    this.generateQuickAmount(payment.keyAmount, paymentType)
    this.generateBankTab(payment)
    let maxAmount = _(payment.maxMoneyLimit).convert2yuan({ fixed: 0 })
    let minAmount = _(payment.minMoneyLimit).convert2yuan({ fixed: 0 })

    if (minAmount === 0) {
      minAmount = 1
    }
    if (maxAmount === 0) {
      maxAmount = 1000000
    }

    this.$feeLimit = parseFloat(payment.feeLimit) / 100
    this.$maxFeeLimit = _(payment.maxFeeLimit).convert2yuan({ fixed: 0 })
    this.$hasFare = payment.feeOpen
    this.FeeChargeAmount = _(payment.feeChargeAmount).convert2yuan({ fixed: 0 })

    this.$('.js-fc-re-amount').attr('data-parsley-range', `[${minAmount},${maxAmount}]`)

    if (this.$hasFare) {
      this.$fareAlert.removeClass('hidden')
      // 支付宝转账、银行卡转账，显示返还手续费
      if (paymentType == 6 || paymentType == 11) {
        this.$('.js-fc-re-amountLimit-tip').html(`1.单次充值金额最低<span class="text-hot">${minAmount}</span>元，最高<span class="text-hot">${maxAmount}</span>元，返还<span class="text-hot">${this.$feeLimit}</span>%手续费，最高不超过<span class="text-hot">${this.$maxFeeLimit}</span>元`)// 高于<span class="text-hot">' + this.FeeChargeAmount + '</span>元
      } else {
        this.$('.js-fc-re-amountLimit-tip').html(`1.单次充值金额最低<span class="text-hot">${minAmount}</span>元，最高<span class="text-hot">${maxAmount}</span>元，收取<span class="text-hot">${this.$feeLimit}</span>%手续费，最高不超过<span class="text-hot">${this.$maxFeeLimit}</span>元`)// 高于<span class="text-hot">' + this.FeeChargeAmount + '</span>元
      }
    } else {
      this.$fareAlert.addClass('hidden')
      this.$('.js-fc-re-amountLimit-tip').html(`1.单次充值金额最低<span class="text-hot">${minAmount}</span>元，最高<span class="text-hot">${maxAmount}</span>元，免手续费`)
    }

    this.$('.js-fc-re-amount').removeClass('parsley-error')
    this.$('.tooltip').remove()

    // this.$('.js-info-quickAmounts').html('（最低 <font color="red">'+minAmount+'</font> 元，最高 <font color="red">'+maxAmount+'</font> 元）');

    const $form = this.$('.js-fc-re-form')
    $form.parsley().reset()
    this.$('.js-fc-re-amount').val(maxAmount < 5000 ? maxAmount : 5000)
    this.$('.js-fc-re-amount').trigger('keyup')
  },

  cleanActivity () {
    this.$('.js-fc-re-rechargeActivity').replaceWith('<ul class="js-fc-re-rechargeActivity fc-re-rechargeActivity"></ul>')
  },
  addActivity (num) {
    let activityList = '<ul class="js-fc-re-rechargeActivity fc-re-rechargeActivity">'
    let paymentType = 0
    _(this.activityList).map((items, index) => {
      if (items.paymentType == num) {
        paymentType += 1
        if (paymentType == 2 || paymentType == 3) {
          activityList += `<li class="js-ac-statistic-type js-activity-state" data-type="${parseInt(items.rechargeAmount)}"><span>充${parseInt(items.rechargeAmount)}返${parseInt(items.bonusAmount)}元</span><br/>无流水要求，即充即返<b></b></li>`
        } else {
          activityList += `<li class="js-ac-statistic-type js-activity-state" data-type="${parseInt(items.rechargeAmount)}"><span>充${parseInt(items.rechargeAmount)}返${parseInt(items.bonusAmount)}元</span><br/>无流水要求，即充即返</li>`
        }
      }
    })
    activityList += '</ul>'

    return activityList
  },
  activityState (e) {
    const $target = $(e.currentTarget)
    if ($target.hasClass('activity-current')) {
      $target.removeClass('activity-current')
      this.$('.js-fc-re-amount').val('')
    } else {
      $target.addClass('activity-current').siblings().removeClass('activity-current')
    }
  },

  generateTab(paymentList, onlyBankPay) {
    const html = []
    const paymentInfoArr = []
    const captions = []
    _(paymentList).map((payment) => {
      const paymentInfo = quickPayConfig.get(payment.paymentType)
      paymentInfo.paymentType = payment.paymentType
      paymentInfo.paymentId = payment.paymentId
      paymentInfo.payType = payment.type
      // onlyBankPay表示只有银联充值方式
      if (paymentInfo && (!onlyBankPay || (onlyBankPay && !paymentInfo.risky))) {
        paymentInfo.paymentType = payment.paymentType
        paymentInfo.paymentId = payment.paymentId
        paymentInfoArr.push(paymentInfo)
      }
      // paymentInfoArr.push(paymentInfo);
    })

    // paymentInfoArr = _.sortBy(paymentInfoArr, 'sortId');
    const bankpayInfoArr = []
    let otherpayInfoArr = []
    const weixinInfoArr = []
    _(paymentInfoArr).each((payment, index) => {
      if (payment.type === 1 || payment.type === 4 || payment.type === 5) {
        bankpayInfoArr.push(payment)
      } else if (payment.type === 3 || payment.type === 7 || payment.type === 10) {
        weixinInfoArr.push(payment)
      } else {
        otherpayInfoArr.push(payment)
      }
    })
    weixinInfoArr.length > 0 ? otherpayInfoArr.unshift(weixinInfoArr[0]) : ''
    bankpayInfoArr.length > 0 ? otherpayInfoArr.unshift(bankpayInfoArr[0]) : ''
    // var infoOtherpayInfoArr=otherpayInfoArr.pop();
    // otherpayInfoArr.splice(1,0,infoOtherpayInfoArr);
    otherpayInfoArr = _.sortBy(otherpayInfoArr, 'sortId')
    const paymentTypes = []
    _(otherpayInfoArr).each((payment, index) => {
      const paymentInfo = quickPayConfig.get(payment.paymentType)
      html.push(`<li data-index="${index}" class=" js-fc-re-payment-type fc-re-payment-type tab-select${index === 0 ? ' active' : '' 
      }" data-payment-type="${payment.paymentType}" data-payment-id="${payment.paymentId}" data-payment-pay-type="${payment.payType}"><div class="new-payment"></div>`)
      html.push(`<a href="javascript:void(0)" class="js-select js-select-${index} fc-re-nav-tab-a ${index === 0 ? 'tab-select1' : 'tab-select'}" >`)
      html.push(`<span class="${paymentInfo.className}">${payment.zhName.indexOf('银联支付') > -1 ? '银联支付<span class="sfa sfa-recommend vertical-middle"></span>'
        : (payment.zhName.indexOf('微信支付') > -1 ? '微信支付' : (payment.zhName === '扫码支付' ? '扫码支付<span class="sfa sfa-fc-new vertical-middle"></span>' : payment.zhName))}</span>`)
      html.push('</a>')
      html.push('</li>')

      // 选项卡下面的标题
      if (payment.zhName.indexOf('银联支付') > -1) {
        if (bankpayInfoArr.length > 1) {
          captions.push(`<div class="js-caption-type-list js-caption-type-${payment.paymentType} ${index === 0 ? '' : 'hidden'} ${payment.className}">`)
          for (var i = 0; i < bankpayInfoArr.length; i++) {
            captions.push(`<a class="js-captionsub-type-${bankpayInfoArr[i].paymentType}" data-payment-type="${bankpayInfoArr[i].paymentType}" data-payment-id="${bankpayInfoArr[i].paymentId}">`)
            captions.push(`<span>${bankpayInfoArr[i].zhName}</span>`)
            captions.push('</a>')
          }
          captions.push('</div>')
        }
      } else if (payment.zhName.indexOf('微信') > -1) {
        if (weixinInfoArr.length > 1) {
          captions.push(`<div class="js-caption-type-list js-caption-type-${payment.paymentType} ${index === 0 ? '' : 'hidden'} ${payment.className}">`)
          for (var i = 0; i < weixinInfoArr.length; i++) {
            captions.push(`<a class="js-captionsub-type-${weixinInfoArr[i].paymentType}" data-payment-type="${weixinInfoArr[i].paymentType}" data-payment-id="${weixinInfoArr[i].paymentId}">`)
            captions.push(`<span>${weixinInfoArr[i].zhName}</span>`)
            captions.push('</a>')
          }
          captions.push('</div>')
        }
      } else {
        captions.push(`<a class="js-caption-type-list js-caption-type-${payment.paymentType} hidden ${payment.className}">`)
        // captions.push('<span>' + payment.zhName + '</span>');
        captions.push('</a>')
      }
    })
    this.$PaymentContainer.html(html.join(''))

    this.$paymentCaptions.html(captions.join(''))
  },
  generateBankTab(payment) {
    if (!_(payment.bankList).isEmpty()) {
      const bankList = payment.bankList
      const html = []
      let bankActiveIndex = 0
      _(bankList).each((bank, index) => {
        bank.bankUrl = bank.bankUrl ? bank.bankUrl : ''
        const bankInfo = bankConfig.get(bank.bankId)
        if (payment.lastBankId && payment.lastBankId == bank.bankId) {
          bankActiveIndex = index
          // bankActiveIndex = bank.bankId;
        }
        // if ((index + 1) % 4 === 1) {
        //   html.push('<tr>')
        // }
        // html.push('<td class="js-fc-re-bank fc-re-bank" data-type="' + bankInfo.id + '" data-code="' + bank.bankCode + '" data-url="' + bank.bankUrl + '" data-name="' + bank.bankName + '">');
        // html.push('<span class="' + bankInfo.className + '">' + bankInfo.zhName + '</span>');
        // html.push('</td>');
        // if ((index + 1) % 4 === 0) {
        //   html.push('</tr>')
        // }
        html.push(`<div class="js-fc-re-bank fc-re-bank" data-type="${bankInfo.id}" data-code="${bank.bankCode}" data-url="${bank.bankUrl}" data-name="${bank.bankName}" data-icon="${bankInfo.className}">` +
          `<span class="fc-bank-icon ${bankInfo.className}"></span>` +
          `<span class="fc-bank-name">${bankInfo.zhName}</span>` +
          '</div>')
        // html.push('<option value="'+ bankInfo.id +'|'+bank.bankCode+'|'+bank.bankName+'|'+bank.bankUrl+'">'+ bankInfo.zhName +'</option>');
      })

      this.$BankContainer.html(html.join(''))
      this.$jsBankListSelect.removeClass('hidden')
      this.$('.js-fc-re-bank').eq(bankActiveIndex).trigger('click')
      // this.$BankContainer.val(bankActiveIndex);
      $('.js-fc-bkselect').removeClass('hidden')
    } else {
      this.$BankContainer.html('').addClass('hidden')
      this.$BankContainerBg.addClass('hidden')
      this.$jsBankListSelect.addClass('hidden')
      $('.js-fc-bkselect').addClass('hidden')
    }
  },
  generateQuickAmount(keyAmount, paymentType) {
    const self = this
    const html = []
    _(keyAmount).each((amount, index) => {
      html.push(`<li class="js-ac-statistic-type " data-type="${amount}">`)
      html.push(self.formatAmount(amount))
      html.push('</li>')
    })
    this.$QuickAmountContainer.html(html.join(''))
  },
  paymentTypeChangeHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    const index = $target.data('index')
    // $(".js-select-"+index).addClass();
    // this.$('.js-caption-type-list').addClass('hidden');
    const $currentCaption = this.$paymentCaptions.find(`.js-caption-type-${$target.data('paymentType')}`)
    const $currentCaptionSub = this.$paymentCaptions.find(`js-captionsub-type-${$target.data('paymentType')}`)
    if ($target.find('a').text().indexOf('银联支付') > -1 || $target.find('span').text().indexOf('银联支付') > -1) {
      $currentCaptionSub.addClass('active').siblings().removeClass('active')
      $currentCaption.removeClass('hidden').siblings().addClass('hidden')
      this.$('.js-caption-type-1,.js-caption-type-4,.js-caption-type-5').removeClass('hidden')
      this.$('.js-caption-type-3,.js-caption-type-7,.js-caption-type-10').addClass('hidden')
    } else if ($target.find('a').text().indexOf('微信支付') > -1 || $target.find('a').text().indexOf('微信大额支付') > -1) {
      this.$paymentCaptions.find(`.js-caption-type-${$target.data('paymentType')}>a:first-child`).trigger('click')
      // $currentCaptionSub.addClass('active').siblings().removeClass('active');
      $currentCaption.removeClass('hidden').siblings().addClass('hidden')
      this.$('.js-caption-type-1,.js-caption-type-4,.js-caption-type-5').addClass('hidden')
      this.$('.js-caption-type-3,.js-caption-type-7,.js-caption-type-10').removeClass('hidden')
    } else {
      $currentCaption.siblings().addClass('hidden')
    }
    if ($target.data('payment-type') === 12) {
      this.$jsPayType.removeClass('hidden')
      const payType = $target.data('payment-pay-type')
      if (!_.isUndefined(payType) && !_.isNull(payType)) {
        if (Number(payType) === 0) {
          this.$jsPayAlipay.removeClass('hidden')
          this.$jsPayWeixin.removeClass('hidden')
          this.$jsPayAlipay.trigger('click')
        } else if (Number(payType) === 2) {
          this.$jsPayAlipay.removeClass('hidden')
          this.$jsPayAlipay.trigger('click')
        } else if (Number(payType) === 1) {
          this.$jsPayWeixin.removeClass('hidden')
          this.$jsPayWeixin.trigger('click')
        }
      }
    } else {
      this.$jsPayType.addClass('hidden')
      this.$jsPayAlipay.addClass('hidden')
      this.$jsPayWeixin.addClass('hidden')
    }
    // $(".js-font").css('color', '#333333');
    $('.js-select').removeClass('tab-select1')
    $('.js-select').addClass('tab-select')

    // $(".js-font-"+index).css('color', '##17c0c8');
    $(`.js-select-${index}`).removeClass('tab-select')
    $(`.js-select-${index}`).addClass('tab-select1')


    this.initPaymentPage(e)
    // 切换校验是否包含未支付订单
    this.nopaydetail()
  },
  formatAmount(amount) {
    let str = String(amount)
    const l = str.length
    if (str.slice(l - 4, l) === '0000') {
      str = str.replace(/0000$/, '万')
    } else if (str.slice(l - 3, l) === '000') {
      str = str.replace(/000$/, '仟')
    }
    return str
  },

  quickAmountHandler(e) {
    const $target = $(e.currentTarget)
    const amount = $target.data('type')
    this.$('.js-fc-re-amount').val(amount)
    this.keyOnChangeHandler()
  },

  bankSelectHandler(e) {
    const $target = $(e.currentTarget)
    // this.$('.js-fc-re-bankList').find('td').removeClass('active');
    $target.addClass('active').siblings().removeClass('active')
    this.$BankContainer.addClass('hidden')
    this.$BankContainerBg.addClass('hidden')
    this.$('.js-select-down').removeClass('up')
    // var bankInfo = $target.val().split('|');
    const bankId = $target.data('type')
    const bankCode = $target.data('code')
    this.$('.js-ch-bank-icon').removeClass(this.bankIcon)
    this.bankIcon = $target.data('icon')
    const bankName = $target.data('name')
    this.$('.js-ch-bank-icon').addClass(this.bankIcon)
    this.$('.js-cj-bank-name').html(bankName)
    this.$('input[name="bankId"]').val(bankId)

    this.$('input[name="bankCode"]').val(bankCode)
  },

  confirmHandler() {
    if (this.nopaydetail(true)) {
      return 
    }
    const $form = this.$('.js-fc-re-form')
    const clpValidate = $form.parsley().validate()
    let paymentInfo

    if (clpValidate) {
      $form.submit()
      const amount = this.$('.js-fc-re-amount').val()
      $('.js-fc-re-modal').closest('.modal').modal('hide')

      paymentInfo = quickPayConfig.get(this.paymentInfo.paymentType)

      const $dialog = Global.ui.dialog.show({
        body: `${'<div class=" fc-re-resultShow text-center">' +
        '<div class="text-center fc-re-result-title">温馨提示<span class="js-unPaymentOrder-close sfa sfa-dialog-close unPaymentOrder-close" data-dismiss="modal"></span></div>' +
        '<div  class="m-top-lg text-center font-md m-bottom-md"><span>支付方式：</span>'}${paymentInfo.zhName}</div>` +
        `<div class="m-bottom-md font-md text-center fc-result-money"><span>充值金额：</span><span class="text-hot">${amount}元</span></div>` +
        '<div class="text-center m-top-lg">' +
        '<div class="text-center"><button type="button" class="js-fc-re-succ fc-re-result-btn fc-re-succ m-right-md">继续充值</button></div>' +
        '<div class="m-top-lg text-center">' +
        '<div class="js-gl-service inline-block fc-re-fail m-right-lg cursor-pointer"><span class="sfa sfa-kefu vertical-middle m-right-sm"></span>联系客服</div>' +
        '<div class="js-fc-re-look-result inline-block m-left-lg fc-re-look-result cursor-pointer"><span class="sfa sfa-recharge vertical-middle m-right-sm"></span>查看充值结果</div>' +
        '</div>' +
        '</div></div>',
        bodyClass: 'no-border no-padding no-bg',
        anySize: '565',
        anyPosition: '60',
        footer: '',
      })

      $dialog.on('hidden.modal', function() {
        $(this).remove()
      })

      $dialog.off('click.rechargeSucc')
        .on('click.rechargeSucc', '.js-fc-re-succ', () => {
          // 提交充值完成通知，
          $dialog.modal('hide')
          Global.router.goTo('#fc/re')
        })

      $dialog.off('click.rechargeFail')
        .on('click.rechargeFail', '.js-gl-service', () => {
          $dialog.modal('hide')
          // window.open('#hc?page=quick-top-up');
        })
      $dialog.off('click.lookResult')
        .on('click.lookResult', '.js-fc-re-look-result', () => {
          // 提交充值完成通知，
          $dialog.modal('hide')
          Global.router.goTo('#fc/rr')
        })
    }
  },
  nextHandler () {
    if (this.nopaydetail(true)) {
      return 
    }
    const self = this
    const $form = this.$('.js-fc-re-form')
    const clpValidate = $form.parsley().validate()

    const paymentType = this.$('input[name="paymentType"]').val()
    // var selectBank =  paymentType==11 ? this.$(".js-fc-re-bankList").val().split('|') : '';
    const selectBank = this.$('.js-fc-re-bank.active').data()

    if (clpValidate) {
      const data = {
        amount: this.$('.js-fc-re-amount').val(),
        name: this.$('.js-fc-re-name').val(),
        paymentType,
        wap: 0,
      }

      if (selectBank) {
        data.bankId = selectBank.type
      }

      this.getDobankrechargeXhr(data)
        .done((res) => {
          if (res.result === 0) {
            const root = res.root
            self.$recName.html(root.name)
            self.$reNum.html(root.cardNo)
            self.$cardInfo.html(root.bankName)
            self.$cardAddress.html(root.bankBranchName)
            self.$reMoney.html(_(root.amount).convert2yuan())
            self.$rePs.html(root.keyword)
            if (paymentType == 11) {
              self.$fcReBankTransferferPrompt.find('.js-starBank').html(selectBank.name)
              if (root.bankId == selectBank.type) {
                self.$fcReBankTransferferPrompt.find('.js-isSameBank').html('汇款到')
              } else {
                self.$fcReBankTransferferPrompt.find('.js-isSameBank').html('跨行汇款到')
              }
              self.$fcReBankTransferferPrompt.find('.js-endBank').html(root.bankName)
              self.$fcReBankUrl.attr('href', selectBank.url).html(selectBank.url)
            }
            _(self.$('.js-fe-re-copy')).each((btn, index) => {
              const $btn = $(btn)
              const text = $btn.closest('div').find('span').html()
              $btn.textCopy({
                text,
                notShowToolTip: true,
              })
            })
            self.$('.js-fc-re-formArea, .js-tip-info').toggle()
          } else {
            Global.ui.notification.show('未知错误')
          }
        })
      // this.$('.js-fc-re-modal').closest('.modal').modal('hide');

      // $dialog.on('hidden.modal', function() {
      //   $(this).remove();
      // });
      //
      // $dialog.off('click.rechargeSucc')
      //     .on('click.rechargeSucc', '.js-fc-re-succ', function() {
      //       //提交充值完成通知，
      //       $dialog.modal('hide');
      //       Global.router.goTo('#fc/ad?tradeType=100');
      //     });
      //
      // $dialog.off('click.rechargeFail')
      //     .on('click.rechargeFail', '.js-fc-re-fail', function() {
      //       $dialog.modal('hide');
      //       window.open('#hc?page=withdraw-flow');
      //     });
    }
  },
  getDobankrechargeXhr (data) {
    return Global.sync.ajax({
      url: '/fund/recharge/dobankrecharge.json',
      data,
    })
  },
  gotoAliPayHandler () {
    window.open('https://www.alipay.com')
  },
  gotoBankHandler () {
    window.open(this.$fcReBankUrl.html())
  },
  // 初始化未支付订单详情
  nopaydetail (sync) {
    const self = this
    let paymentTypeName = ''
    let payBankName = ''
    let flag = false
    this.getNopaydetailXhr(sync)
      .done((res) => {
        if (res.result === 0) {
          const root = res.root
          self.$unPaymentBgDiv.removeClass('hidden')
          self.tradeid = root.tradeId
          self.paymenttype = root.paymentType
          self.paybankid = root.payBankId

          if (root.canPay) {
            self.$donopayBtnDiv.removeClass('hidden')
            if (self.paymenttype == 6) {
              self.$donopayOpenDiv.attr('href', 'https://www.alipay.com')
            } else if (self.paymenttype == 11) {
              if (self.paybankid == 5) {
                self.$donopayOpenDiv.attr('href', 'http://www.boc.cn/')
              } else if (self.paybankid == 4) {
                self.$donopayOpenDiv.attr('href', 'http://www.abchina.com/')
              } else if (self.paybankid == 2) {
                self.$donopayOpenDiv.attr('href', 'http://www.icbc.com.cn/')
              } else if (self.paybankid == 3) {
                self.$donopayOpenDiv.attr('href', 'http://www.ccb.com/')
              } else if (self.paybankid == 6) {
                self.$donopayOpenDiv.attr('href', 'http://www.bankcomm.com/')
              } else if (self.paybankid == 1) {
                self.$donopayOpenDiv.attr('href', 'http://www.cmbchina.com/')
              } else if (self.paybankid == 10) {
                self.$donopayOpenDiv.attr('href', 'http://www.cmbc.com.cn/')
              } else if (self.paybankid == 12) {
                self.$donopayOpenDiv.attr('href', 'http://www.cib.com.cn/')
              } else if (self.paybankid == 9) {
                self.$donopayOpenDiv.attr('href', 'http://www.spdb.com.cn/')
              } else if (self.paybankid == 7) {
                self.$donopayOpenDiv.attr('href', 'http://www.cgbchina.com.cn/')
              } else if (self.paybankid == 13) {
                self.$donopayOpenDiv.attr('href', 'http://www.citicbank.com/')
              } else if (self.paybankid == 8) {
                self.$donopayOpenDiv.attr('href', 'http://www.cebbank.com/')
              } else if (self.paybankid == 14) {
                self.$donopayOpenDiv.attr('href', 'http://www.psbc.com')
              } else if (self.paybankid == 11) {
                self.$donopayOpenDiv.attr('href', 'http://bank.pingan.com/')
              }
            }
          } else {
            self.$donopayBtnDiv.addClass('hidden')
          }

          if (root.paymentType == 1) {
            paymentTypeName = '银联支付一'
          } else if (root.paymentType == 4) {
            paymentTypeName = '银联支付二'
          } else if (root.paymentType == 5) {
            paymentTypeName = '银联支付三'
          } else if (root.paymentType == 2) {
            paymentTypeName = '支付宝支付'
          } else if (root.paymentType == 6) {
            paymentTypeName = '支付宝转账'
          } else if (root.paymentType == 3) {
            paymentTypeName = '微信支付一'
          } else if (root.paymentType == 7) {
            paymentTypeName = '微信支付二'
          } else if (root.paymentType == 10) {
            paymentTypeName = '微信支付三'
          } else if (root.paymentType == 8) {
            paymentTypeName = '信用卡支付'
          } else if (root.paymentType == 9) {
            paymentTypeName = '快捷支付'
          } else if (root.paymentType == 11) {
            paymentTypeName = '银行卡转账'
          } else if (root.paymentType == 12) {
            paymentTypeName = '扫码支付'
          }

          if (root.payBankId == 5) {
            payBankName = '中国银行'
          } else if (root.payBankId == 4) {
            payBankName = '农业银行'
          } else if (root.payBankId == 2) {
            payBankName = '工商银行'
          } else if (root.payBankId == 3) {
            payBankName = '建设银行'
          } else if (root.payBankId == 6) {
            payBankName = '交通银行'
          } else if (root.payBankId == 1) {
            payBankName = '招商银行'
          } else if (root.payBankId == 10) {
            payBankName = '民生银行'
          } else if (root.payBankId == 12) {
            payBankName = '兴业银行'
          } else if (root.payBankId == 9) {
            payBankName = '浦发银行'
          } else if (root.payBankId == 7) {
            payBankName = '广发银行'
          } else if (root.payBankId == 13) {
            payBankName = '中信银行'
          } else if (root.payBankId == 8) {
            payBankName = '光大银行'
          } else if (root.payBankId == 14) {
            payBankName = '邮政储蓄'
          } else if (root.payBankId == 11) {
            payBankName = '平安银行'
          }

          self.$paymentTypeDiv.html(paymentTypeName)
          self.$payTypeDiv.html(payBankName)
          self.$rechargeTypeDiv.html(root.rechargeType)
          self.$accountNameDiv.html(root.accountName)
          self.$accountNumDiv.html(root.accountNum)
          self.$amountDiv.html(_(root.amount).convert2yuan())
          self.$keywordDiv.html(root.keyword)

          if (root.paymentType == 6 || root.paymentType == 11) {
            if (root.paymentType == 6) {
              self.$jsFcPayType.addClass('hidden')
              self.$jsFcRechargeType.removeClass('hidden')
              self.$jsFcAccountName.removeClass('hidden')
              self.$jsFcAccountNum.removeClass('hidden')
              self.$jsFcRefresh.removeClass('hidden')
            } else {
              self.$jsFcPayType.removeClass('hidden')
              self.$jsFcRechargeType.removeClass('hidden')
              self.$jsFcAccountName.removeClass('hidden')
              self.$jsFcAccountNum.removeClass('hidden')
              self.$jsFcRefresh.removeClass('hidden')
            }
          } else {
            self.$jsFcPayType.addClass('hidden')
            self.$jsFcRechargeType.addClass('hidden')
            self.$jsFcAccountName.addClass('hidden')
            self.$jsFcAccountNum.addClass('hidden')
            self.$jsFcRefresh.addClass('hidden')
          }
          flag = true
        }
      })
    return flag
  },
  // 马上付款
  donopayBtnHandler () {
    const self = this

    this.getDonopaybankXhr({
      tradeId: self.tradeid,
    })
      .done((res) => {
        if (res.result === 0) {
          // if (self.paymenttype==6){
          //   window.open('https://www.alipay.com');
          // }else if (self.paymenttype==11){
          //   if(self.paybankid==5){
          //       window.open('http://www.boc.cn/');
          //   }else if(self.paybankid==4){
          //       window.open('http://www.abchina.com/');
          //   }else if(self.paybankid==2){
          //       window.open('http://www.icbc.com.cn/');
          //   }else if(self.paybankid==3){
          //       window.open('http://www.ccb.com/');
          //   }else if(self.paybankid==6){
          //       window.open('http://www.bankcomm.com/');
          //   }else if(self.paybankid==1){
          //       window.open('http://www.cmbchina.com/');
          //   }else if(self.paybankid==10){
          //       window.open('http://www.cmbc.com.cn/');
          //   }else if(self.paybankid==12){
          //       window.open('http://www.cib.com.cn/');
          //   }else if(self.paybankid==9){
          //       window.open('http://www.spdb.com.cn/');
          //   }else if(self.paybankid==7){
          //       window.open('http://www.cgbchina.com.cn/');
          //   }else if(self.paybankid==13){
          //       window.open('http://www.citicbank.com/');
          //   }else if(self.paybankid==8){
          //       window.open('http://www.cebbank.com/');
          //   }else if(self.paybankid==14){
          //       window.open('http://www.psbc.com');
          //   }else if(self.paybankid==11){
          //       window.open('http://bank.pingan.com/');
          //   }
          // }
        } else {
          Global.ui.notification.show(res.msg)
          self.$unPaymentBgDiv.addClass('hidden')
        }
      })
  },
  // 撤销订单
  cancelnopayHandler () {
    const self = this

    this.getCancelnopayXhr({
      tradeId: self.tradeid,
    })
      .done((res) => {
        const data = res.root || {}
        if (res && res.result === 0) {
          Global.ui.notification.show('充值撤销成功')
          self.$unPaymentBgDiv.addClass('hidden')
        } else {
          Global.ui.notification.show('充值撤销失败')
        }
      })
  },
  closeUnPaymentHandler(e) {
    this.$unPaymentBgDiv.addClass('hidden')
  },
  payTypeHanler (e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    $target.addClass('active').siblings().removeClass('active')
    this.$('input[name="bankCode"]').val(type)
  },
  showBankListHandler (e) {
    this.$BankContainer.removeClass('hidden')
    this.$BankContainerBg.removeClass('hidden')
    this.$('.js-select-down').addClass('up')
  },
  hideBankListHandler () {
    this.$BankContainer.addClass('hidden')
    this.$BankContainerBg.addClass('hidden')
    this.$('.js-select-down').removeClass('up')
  },
})

module.exports = RechargeView

