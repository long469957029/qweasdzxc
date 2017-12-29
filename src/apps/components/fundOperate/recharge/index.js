import '../index.scss'

// const PaymentSubTypeView = require('./paymentSubType')
const rechargeService = require('./rechargeService')
const RechargeConfirmView = require('./rechargeConfirm')
const AliAndBankTransfer = require('./aliAndBankTransfer')

const RechargeView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-rc-next-step': 'nextStepHandler',
    'click .js-fc-rc-pre': 'preStepHandler',
    'click .js-select-type-down': 'selectTypeDownHandler',
    'click .js-select-bank-down': 'selectBankDownHandler',
    'click .js-rc-select-quickSet': 'selectQuickSetHandler',
    'keyup .js-rc-money-input': 'amountChangeHandler',
    'click .js-fc-rc-payType-item': 'changeTypeHandler',
    'click .js-fc-rc-bank-item': 'changeBankHandler',
    'click .jc-rc-info-copy': 'copySuccessHandler',
    'click .js-fc-rc-recharge-submit': 'confirmHandler',
    'click .js-fc-re-gotoAliPay': 'gotoAliPayHandler',
  },
  getRechargeBaseInfoXhr() {
    return Global.sync.ajax({
      url: '/fund/recharge/rechargetype.json',
    })
  },
  gotoAliPayHandler () {
    window.open('https://www.alipay.com')
  },
  initialize() {
  },

  onRender() {
    const self = this
    // 请求充值基础数据（已开通支付方式，银行等）
    this.getRechargeBaseInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          // 获取上次采用的支付方式,初始化面板
          self.initPaymentData(res.root.lastPaymentType, res.root.paymentList)
          // self.initPaymentType(res.root.paymentList)
          this.paymentList = res.root.paymentList
        }
        // if (res.root.hasNoPay) {
        //   self.nopaydetail()
        // } else {
        //   self.$unPaymentBgDiv.addClass('hidden')
        // }
      })
    // 生成充值页广告
    this.$('.jc-rc-activity').html(rechargeService.getFunActivity(this.options.ac))
    // 初始化内容滑动效果数据
    this.conInnerConWidth = 740
    this.conSize = this.$('.jc-fc-rc-view').size()
    if (!this.cur) {
      this.cur = 0
    }
    this.platformParsley = this.$('.js-fc-tr-form').parsley({
      errorsWrapper: '<div class="tooltip parsley-errors-list"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })
  },
  // 获取上次采用的支付方式,初始化面板
  initPaymentData(type, data) {
    // 1.初始化支付列表
    const paymentData = rechargeService.getPaymentTypeList(type, data)
    // 初始化已选中框
    this.$('.js-fc-rc-payType-selected').html(paymentData.selectedItem)
    // 初始化其他方式
    this.$('.js-fc-rc-payType-items').html(paymentData.items)

    // 2 遍历获取上一次支付信息
    const lastPayInfo = rechargeService.getPaymentInfo(type, data)
    const feeData = rechargeService.doFeeData(lastPayInfo)

    // 3.初始化支付方式子类型
    // 判断方式选择不同支付方式div显示状态
    if (type === 1 || type === 4 || type === 5 || type === 11) { // 银联支付一/二/三，显示银行列表
      const bankData = rechargeService.getBankList(type, data)
      // 初始化已选银行
      this.$('.js-fc-rc-bank-selected').html(bankData.selectedItem)
      // 初始化其他银行
      this.$('.js-fc-rc-bank-items').html(bankData.items)
      // 判断其他类型div状态并控制显示
      if (this.$('.jc-rc-leftBar-subType-area').is(':hidden')) {
        this.$('.jc-rc-leftBar-subType-area').removeClass('hidden')
        this.$('.jc-rc-leftBar-bottom-area').css('top', '205px')
      }
      if (!this.$('.jc-rc-leftBar-aliPay-select').is(':hidden')) {
        this.$('.jc-rc-leftBar-aliPay-select').addClass('hidden')
      }
      if (this.$('.js-fc-re-bankList-select').is(':hidden')) {
        this.$('.js-fc-re-bankList-select').removeClass('hidden')
      }
    } else if (type === 6) { // 支付宝转账 ，显示存款人姓名
      if (this.$('.jc-rc-leftBar-subType-area').is(':hidden')) {
        this.$('.jc-rc-leftBar-subType-area').removeClass('hidden')
        this.$('.jc-rc-leftBar-bottom-area').css('top', '205px')
      }
      if (!this.$('.js-fc-re-bankList-select').is(':hidden')) {
        this.$('.js-fc-re-bankList-select').addClass('hidden')
      }
      if (this.$('.jc-rc-leftBar-aliPay-select').is(':hidden')) {
        this.$('.jc-rc-leftBar-aliPay-select').removeClass('hidden')
      }
    } else { // 快捷支付/支付宝/微信/QQ扫码/银联扫码/京东扫码/信用卡支付，不包含显示内容
      if (!this.$('.jc-rc-leftBar-subType-area').is(':hidden')) {
        this.$('.jc-rc-leftBar-subType-area').addClass('hidden')
      }
      this.$('.jc-rc-leftBar-bottom-area').css('top', '125px')
    }
    // 4 获取充值初始化金额
    const amountList = rechargeService.getQuickAmountHtml(lastPayInfo, type)
    this.$('.js-rc-money-input').val(amountList.amount)
    this.$('.js-rc-money-input').attr('data-parsley-range', `[${feeData.min},${feeData.max}]`) // 初始化充值金额最大最小金额校验
    // 5 遍历取快捷金额配置
    this.$('.js-rc-leftBar-quickPay-select').html(amountList.setHtml)
    // 6 返回手续费与到账金额
    const feeList = rechargeService.getFee(amountList.amount, feeData.charge, feeData.limit, feeData.maxLimit, type)
    this.$('.js-payMoney-feeLimit-value').html(feeList.fareValue)
    this.$('.js-payMoney-feeAccount-value').html(feeList.amountValue)
    // 7 返回温馨提示
    this.$('.js-rc-tips-content').html(rechargeService.get(type, feeData.min, feeData.max, feeData.limit, feeData.maxLimit))
  },
  // 提交充值请求
  confirmHandler() {
    const $form = this.$('.jc-rc-recharge-form')
    this.$('input[name="paymentId"]').val(this.$('.js-fc-rc-payType-selectedItem').data('id'))
    this.$('input[name="paymentType"]').val(this.$('.js-fc-rc-payType-selectedItem').data('type'))
    this.$('input[name="bankId"]').val(this.$('.js-fc-rc-payType-selectedItem').data('type'))
    const clpValidate = $form.parsley().validate()
    // let paymentInfo
    if (clpValidate) {
      $form.submit()
    }
  },
  // 点击充值确定按钮下一步操作判断
  nextStepHandler() {
    if (this.cur < this.conSize - 1) {
      this.slide(this.conInnerConWidth, this.cur + 1)
    }
    const paymentId = this.$('.js-fc-rc-payType-selectedItem').data('type')
    const paymentName = this.$('.js-fc-rc-payType-selectedItem').data('name')
    const payAmount = this.$('.js-rc-money-input').val()
    if (paymentId === 11) {
      const bId = this.$('.js-fc-rc-bank-selectedItem').data('id')
      const aliAndBankTransferView = new AliAndBankTransfer({
        type: paymentId, bankId: bId, amount: payAmount, ac: this.options.ac, tips: this.paymentList,
      })
      this.$('.jc-rc-confirm-view').html(aliAndBankTransferView.render().el)
    } else if (paymentId === 6) {
      const rechargeName = this.$('.js-rc-aliPay-name').val()
      const aliAndBankTransferView = new AliAndBankTransfer({
        type: paymentId, name: rechargeName, amount: payAmount, ac: this.options.ac, tips: this.paymentList,
      })
      this.$('.jc-rc-confirm-view').html(aliAndBankTransferView.render().el)
    } else {
      const bankName = this.$('.js-fc-rc-bank-selectedItem').data('name')
      const rechargeConfirmView = new RechargeConfirmView({
        type: paymentId, pname: paymentName, bname: bankName, amount: payAmount,
      })
      this.$('.jc-rc-confirm-view').html(rechargeConfirmView.render().el)
    }
  },
  preStepHandler() {
    if (this.cur > 0) {
      this.slide(this.conInnerConWidth, this.cur - 1)
    }
  },
  slide(conInnerConWidth, index) {
    this.$('.jc-fc-rc-maskCon').animate({ marginLeft: `${-index * conInnerConWidth}px` })
    this.cur = index
  },
  // 选择快捷金额事件
  selectQuickSetHandler(e) {
    const $target = $(e.currentTarget)
    // 取消当前选择的快捷金额
    this.$('.js-rc-leftBar-quickPay-select').find('.active').removeClass('active')
    // 选择当前选择的快捷金额
    $target.addClass('active')
    // 充值金额重新赋值
    const amount = $target.data('value')
    this.$('.js-rc-money-input').val(amount)
    // 重新计算手续费
    const paymentId = $target.data('type')
    const payInfo = rechargeService.getPaymentInfo(paymentId, this.paymentList)
    const feeData = rechargeService.doFeeData(payInfo)
    const feeList = rechargeService.getFee(amount, feeData.charge, feeData.limit, feeData.maxLimit, paymentId)
    this.$('.js-payMoney-feeLimit-value').html(feeList.fareValue)
    this.$('.js-payMoney-feeAccount-value').html(feeList.amountValue)
  },
  // 充值金额变动事件
  amountChangeHandler() {
    this.$('.js-rc-leftBar-quickPay-select').find('.active').removeClass('active')
    const amount = $('.js-rc-money-input').val()
    const paymentId = this.$('.js-rc-select-quickSet').data('type')
    const payInfo = rechargeService.getPaymentInfo(paymentId, this.paymentList)
    const feeData = rechargeService.doFeeData(payInfo)
    const feeList = rechargeService.getFee(amount, feeData.charge, feeData.limit, feeData.maxLimit, paymentId)
    this.$('.js-payMoney-feeLimit-value').html(feeList.fareValue)
    this.$('.js-payMoney-feeAccount-value').html(feeList.amountValue)
  },
  // 支付列表重新选择事件
  changeTypeHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    this.$('.js-fc-rc-payType-select').removeClass('side-down').scrollTop(0)
    this.$('.js-select-type-down').removeClass('up')
    this.initPaymentData(type, this.paymentList)
  },
  // 银行列表重新选择事件
  changeBankHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    const bankId = $target.data('id')
    this.$('.js-fc-re-bankList-select').removeClass('side-down').scrollTop(0)
    this.$('.js-select-bank-down').removeClass('up')
    const bankData = rechargeService.getBankList(type, this.paymentList, bankId)
    // 初始化已选银行
    this.$('.js-fc-rc-bank-selected').html(bankData.selectedItem)
    // 初始化其他银行
    this.$('.js-fc-rc-bank-items').html(bankData.items)
  },
  // 支付列表下拉事件
  selectTypeDownHandler() {
    const con = this.$('.js-fc-rc-payType-select').height()
    if (con < 100) {
      this.$('.js-fc-rc-payType-select').addClass('side-down')
      this.$('.js-select-type-down').addClass('up')
      // this.$('.js-fc-rc-payType-items').removeClass('hidden')
    } else {
      this.$('.js-fc-rc-payType-select').removeClass('side-down')
      this.$('.js-select-type-down').removeClass('up')
      // this.$('.js-fc-rc-payType-items').addClass('hidden')
    }
  },
  // 银行列表下拉事件
  selectBankDownHandler() {
    const con = this.$('.js-fc-re-bankList-select').height()
    if (con < 100) {
      this.$('.js-fc-re-bankList-select').addClass('side-down')
      this.$('.js-select-bank-down').addClass('up')
    } else {
      this.$('.js-fc-re-bankList-select').removeClass('side-down')
      this.$('.js-select-bank-down').removeClass('up')
    }
  },
  copySuccessHandler(e) {
    $(e.currentTarget).addClass('active').siblings().removeClass('active')
    Global.ui.notification.show('复制成功！')
  },
})

export default RechargeView
