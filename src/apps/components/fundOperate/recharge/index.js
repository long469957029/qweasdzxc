import '../index.scss'

const quickPayConfig = require('com/fundOperate/quickPayConfig')
const rechargeService = require('./rechargeService')
const RechargeConfirmView = require('./rechargeConfirm')
const AliAndBankTransfer = require('./aliAndBankTransfer')

const RechargeView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-rc-next-step': 'nextStepHandler',
    'click .js-fc-rc-pre': 'preStepHandler',
    'click .js-select-type-down': 'selectTypeDownHandler',
    // 'click .js-select-bank-down': 'selectBankDownHandler',
    'click .js-fc-re-bankList-select': 'selectBankDownHandler',
    'click .js-rc-select-quickSet': 'selectQuickSetHandler',
    'keyup .js-rc-money-input': 'amountChangeHandler',
    'click .js-fc-rc-payType-item': 'changeTypeHandler',
    'click .js-fc-rc-bank-item': 'changeBankHandler',
    // 'click .jc-rc-info-copy-name': 'copyNameSuccessHandler',
    'click .js-fc-rc-recharge-submit': 'confirmHandler',
    'click .js-fc-re-gotoAliPay': 'gotoAliPayHandler',
    'click .js-tips-footer-submit': 'nextStepHandler',
  },
  getRechargeBaseInfoXhr() {
    return Global.sync.ajax({
      url: '/fund/recharge/rechargetype.json',
    })
  },
  gotoAliPayHandler() {
    window.open('https://www.alipay.com')
  },
  getActivityInfo() {
    return Global.sync.ajax({
      url: '/info/activityCenter/fundList.json',
    })
  },
  initialize() {
    this.cur = 0
  },

  onRender() {
    const self = this
    this.$feeContainer = this.$('.js-rc-leftBar-payMoney-fee')
    if (!Global.memoryCache.get('rechargeAc')) { //如果缓存里面没有活动数据就调用接口查询
      $.when(this.getActivityInfo(), this.getRechargeBaseInfoXhr()).done(function (res1, res2) {
        if (res1[0] && res1[0].result === 0) {
          // 生成充值页广告
          Global.memoryCache.set('rechargeAc', res1[0].root.records)
          // 生成充值页广告
          self.$('.jc-rc-activity').html(rechargeService.getFunActivity(Global.memoryCache.get('rechargeAc')))
        } else {
          Global.ui.notification.show('服务器异常')
        }
        if (res2[0].result === 0) {
          // 获取上次采用的支付方式,初始化面板
          self.initPaymentData(res2[0].root.lastPaymentType, res2[0].root.paymentList, res2[0].root.vip)
        } else {
          Global.ui.notification.show('服务器异常')
        }
      })
    } else {
      // 请求充值基础数据（已开通支付方式，银行等）
      if (!Global.memoryCache.get('rechargeList')) {
        this.getRechargeBaseInfoXhr()
          .done((res) => {
            if (res.result === 0) {
              // 获取上次采用的支付方式,初始化面板
              Global.memoryCache.set('rechargeList', res.root)
              self.initPaymentData(res.root.lastPaymentType, res.root.paymentList, res.root.vip)
            }
          })
      } else {
        const data = Global.memoryCache.get('rechargeList')
        self.initPaymentData(data.lastPaymentType, data.paymentList, data.vip)
      }
      // 生成充值页广告
      this.$('.jc-rc-activity').html(rechargeService.getFunActivity(Global.memoryCache.get('rechargeAc')))
    }

    // 初始化内容滑动效果数据
    this.conInnerConWidth = 740
    this.conSize = this.$('.jc-fc-rc-view').size()
    if (!this.cur || this.cur >= 1) {
      this.cur = 0
    }
    this.parsley = this.$('.jc-rc-recharge-form').parsley({
      errorsWrapper: '<div class="tooltip parsley-errors-list"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })
    // 监听click事件
    window.addEventListener('click', (e) => {
      const $target = $(e.target)
      if ($target.hasClass('.js-fc-rc-payType-select')) {
        this.selectTypeDownHandler()
      }
      if ($target.hasClass('.js-fc-re-bankList-select')) {
        this.selectBankDownHandler()
      }
      if (!$target.hasClass('.js-fc-rc-payType-select') && !$target.hasClass('.js-fc-re-bankList-select')) {
        const outHeight = this.$('.js-fc-rc-payType-select').height()
        const inHeight = this.$('.js-fc-re-bankList-select').height()
        if (outHeight > 100) {
          this.$('.js-fc-rc-payType-select').removeClass('side-down').scrollTop(0)
          this.$('.js-select-type-down').removeClass('up')
        }
        if (inHeight > 100) {
          this.$('.js-fc-re-bankList-select').removeClass('side-down').scrollTop(0)
          this.$('.js-select-bank-down').removeClass('up')
        }
      }
    }, false)
  },
  // 获取上次采用的支付方式,初始化面板
  initPaymentData(type, data, vip) {
    if (vip === 0) {
      this.$('.js-fund-operate').append('<div class="js-fund-vip-img fund-vip-img"></div>')
    }
    this.paymentList = data
    if (type === null) {
      type = 1
    }
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
    if (type !== paymentData.type) {
      type = paymentData.type
    }
    const nameRequired = this.$('.js-rc-aliPay-name').attr('required') // 当不是支付宝转账时，名称输入框设置为非必填项
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
      if (nameRequired !== undefined && nameRequired === 'required') {
        this.$('.js-rc-aliPay-name').attr('required', false)
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
      if (nameRequired === undefined || nameRequired === false) {
        this.$('.js-rc-aliPay-name').prop('required', true)
      }
    } else { // 快捷支付/支付宝/微信/QQ扫码/银联扫码/京东扫码/信用卡支付，不包含显示内容
      if (!this.$('.jc-rc-leftBar-subType-area').is(':hidden')) {
        this.$('.jc-rc-leftBar-subType-area').addClass('hidden')
      }
      this.$('.jc-rc-leftBar-bottom-area').css('top', '125px')
      if (nameRequired !== undefined && nameRequired === 'required') {
        this.$('.js-rc-aliPay-name').attr('required', false)
      }
    }
    // 4 获取充值初始化金额
    const amountList = rechargeService.getQuickAmountHtml(lastPayInfo, type)
    this.$('.js-rc-money-input').val(amountList.amount)
    this.$('.js-rc-money-input').attr('data-parsley-range', `[${feeData.min},${feeData.max}]`) // 初始化充值金额最大最小金额校验
    // 5 遍历取快捷金额配置
    this.$('.js-rc-leftBar-quickPay-select').html(amountList.setHtml)
    // 6 返回手续费与到账金额
    this.$feeContainer.toggleClass('hidden', !(feeData.limit > 0))
    const feeList = rechargeService.getFee(amountList.amount, feeData.charge, feeData.limit, feeData.maxLimit, type)

    this.$('.js-payMoney-feeLimit-value').html(feeList.fareValue)
    this.$('.js-payMoney-feeAccount-value').html(feeList.amountValue)
    // 7 返回温馨提示
    this.$('.js-rc-tips-content').html(rechargeService.get(type, feeData.min, feeData.max, feeData.limit, feeData.maxLimit))
    // 8 输入框归位
    const nameTop = this.$('.fc-rc-leftBar-bottom-area').css('top')
    if (nameTop > 205) {
      this.$('.jc-rc-leftBar-bottom-area').css('top', '205px')
      this.$('.js-rc-aliPay-name-text').removeClass('hidden')
    }
  },
  // 提交充值请求
  confirmHandler() {
    const $form = this.$('.jc-rc-recharge-form')
    const paymentId = this.$('.js-fc-rc-payType-selectedItem').data('id')
    this.$('input[name="paymentId"]').val(paymentId)
    this.$('input[name="paymentType"]').val(this.$('.js-fc-rc-payType-selectedItem').data('type'))
    this.$('input[name="bankId"]').val(this.$('.js-fc-rc-bank-selectedItem').data('id'))
    this.$('input[name="bankCode"]').val(this.$('.js-fc-rc-bank-selectedItem').data('code'))
    this.$('input[name="token"]').val(Global.cookieCache.get('token'))
    this.$('.js-rc-money-input').removeAttr('data-parsley-type')
    if (this.parsley.validate()) {
      $form.submit()
      this.$('.js-rc-money-input').attr('data-parsley-type','integer')
    } else {
      return false
    }
  },
  // 点击充值确定按钮下一步操作判断
  nextStepHandler() {
    if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
      Global.ui.notification.show('试玩会员无法进行充值操作，请先注册正式游戏账号',{modalDialogShadow:'modal-dialog-shadow'})
      return false
    }
    const paymentId = this.$('.js-fc-rc-payType-selectedItem').data('type')
    if (paymentId === 6) {
      const name = this.$('.js-rc-aliPay-name').val()
      if (name === undefined || name === null || name === '') {
        this.$('.jc-rc-leftBar-bottom-area').css('top', '225px')
        this.$('.js-rc-aliPay-name-text').addClass('hidden')
      }
    }
    if (this.parsley.validate()) {
      let paymentInfo = quickPayConfig.get(paymentId)
      if (paymentInfo.changeAmount) { // 判断是否是需要自动扣金额的支付类型，如果是，弹出提示框
        this.openNoticeDialog()
      } else {
        this.nextStepConfirmHandler()
      }
    } else {
      return false
    }
  },
  // 微信转账/扫码支付/支付宝/微信支付/银联扫码/QQ扫码/京东扫码增加随机减金额功能 提示框
  openNoticeDialog() {
    const oldAmount = this.$('.js-rc-money-input').val()
    const newAmount = _(Number(oldAmount)).sub(Math.round(Math.random() * 998 + 1) / 100).toFixed(2);
    const $dialog = Global.ui.dialog.show({
      id: _.now(),
      size: 'fund-operate-pay-tips',
      // bStyle: 'width: 740px;height:680px;border: 1px solid #d7d7d7;',
      // bodyClass: 'fund-operate-pay-tips',
      body: '<div class="sfa sfa-dialog-info-sm inline-block"></div><div class="tips-content inline-block">' +
      '<div class="tips-content-title">【为避免支付限额】</div><div class="tips-content-text">系统对您填写的<span class="tips-content-text amount">' + oldAmount + '</span>元' +
      '充值金额进行了随机减少，调整后的充值金额为<span class="tips-content-text amount">' + newAmount + '</span>元。</div>' +
      '<div class="tips-footer"><div class="js-tips-footer-submit tips-footer-submit">确定</div>' +
      '<div class="js-tips-footer-cancel tips-footer-cancel">取消</div></div></div>',
    })
    $dialog.on('hidden.modal', () => {
      $(this).remove()
    })
    $dialog.on('click.modal', '.js-tips-footer-cancel', () => {
      $dialog.modal('hide')
    })
    $dialog.on('click.modal', '.js-tips-footer-submit', () => {
      this.$('.js-rc-money-input').val(newAmount)
      this.nextStepConfirmHandler()
      $dialog.modal('hide')
    })

  },
  nextStepConfirmHandler() {
    const paymentId = this.$('.js-fc-rc-payType-selectedItem').data('type')
    if (this.cur < this.conSize - 1) {
      this.slide(this.conInnerConWidth, this.cur + 1)
    }
    const paymentName = this.$('.js-fc-rc-payType-selectedItem').data('name')
    const payAmount = this.$('.js-rc-money-input').val()
    if (paymentId === 11) {
      const bId = this.$('.js-fc-rc-bank-selectedItem').data('id')
      const aliAndBankTransferView = new AliAndBankTransfer({
        type: paymentId, bankId: bId, amount: payAmount, ac: this.options.ac, tips: this.paymentList,
      })
      this.$('.jc-rc-confirm-view').html(aliAndBankTransferView.render().el)
    } else if (paymentId === 6 || paymentId === 16) {
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
    this.render()
  }
  ,
  slide(conInnerConWidth, index) {
    this.$('.jc-fc-rc-maskCon').animate({marginLeft: `${-index * conInnerConWidth}px`})
    this.cur = index
  }
  ,
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
  }
  ,
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
  }
  ,
// 支付列表重新选择事件
  changeTypeHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    this.$('.js-fc-rc-payType-select').removeClass('side-down').scrollTop(0)
    this.$('.js-select-type-down').removeClass('up')
    this.initPaymentData(type, this.paymentList)
  }
  ,
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
  }
  ,
// 支付列表下拉事件
  selectTypeDownHandler() {
    const con = this.$('.js-fc-rc-payType-select').height()
    if (con < 100) {
      this.$('.js-fc-rc-payType-select').addClass('side-down')
      this.$('.js-select-type-down').addClass('up')
      // this.$('.js-fc-rc-payType-items').removeClass('hidden')
    } else {
      this.$('.js-fc-rc-payType-select').removeClass('side-down').scrollTop(0)
      this.$('.js-select-type-down').removeClass('up')
      // this.$('.js-fc-rc-payType-items').addClass('hidden')
    }
  }
  ,
// 银行列表下拉事件
  selectBankDownHandler() {
    const con = this.$('.js-fc-re-bankList-select').height()
    if (con < 100) {
      this.$('.js-fc-re-bankList-select').addClass('side-down')
      this.$('.js-select-bank-down').addClass('up')
    } else {
      this.$('.js-fc-re-bankList-select').removeClass('side-down').scrollTop(0)
      this.$('.js-select-bank-down').removeClass('up')
    }
  },
  // copyNameSuccessHandler(e)
  // {
  //   $(e.currentTarget).addClass('active').siblings().removeClass('active')
  //   Global.ui.notification.show('复制成功！')
  // }
})

export default RechargeView
