const OpenAccountManageView = Base.ItemView.extend({

  template: require('agencyCenter/templates/openAccountManage-auto.html'),
  confirmTpl: _(require('agencyCenter/templates/openAccountManage-confirm.html')).template(),
  startOnLoading: true,

  events: {
    'click .js-ac-add-link': 'addLinkHandler',
    'blur .js-ac-auto-rebate': 'inputRebateHandler',
    'blur .js-ac-auto-remarkInput': 'remarkHandler',
    'blur .js-ac-auto-red-money': 'redMoneyHandler',
    'blur .js-ac-auto-red-money-all': 'redMoneyHandler',
    'blur .js-ac-auto-red-num': 'redNumHandler',
    'click .js-look-bonus': 'lookBonusViewHandler',
    'click .js-ac-auto-checkbox': 'checkboxHandler',
    'click .js-ac-redType>button': 'redTypeHandler',
    'keyup .js-ac-auto-red-money,.js-ac-auto-red-money-all,.js-ac-auto-rebate,.js-ac-auto-red-num': 'keyUpHandler',
  },

  getSubAcctLinkXhr() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacctlink.json',
    })
  },

  onRender() {
    const self = this
    this.$acOpenAccountAutoForm = this.$('.js-ac-openAccountAuto-form')
    this.$acUserType = this.$('.js-ac-userType')
    this.$acAutoReBate = this.$('.js-ac-auto-rebate')
    this.$acManualRebateInfo = this.$('.js-ac-manual-rebate-info')
    this.$acBonusRangePrompt = this.$('.js-ac-bonus-range-Prompt')
    this.$acAutoRemarkInput = this.$('.js-ac-auto-remarkInput')
    this.$acRemarkTip = this.$('.js-ac-remark-tip')
    this.$acRedTypeTab = this.$('.js-ac-red-type')
    this.$acAutoRedInfo = this.$('.js-ac-auto-red-info')
    this.$acRedFixed = this.$('.js-ac-red-fixed')
    this.$acRedRandom = this.$('.js-ac-red-random')
    this.$acAutoCheckbox = this.$('.js-ac-auto-checkbox')
    this.$acRedType = this.$('.js-ac-redType')
    this.$acRedMoney = this.$('.js-ac-auto-red-money')
    this.$acRedPackTip = this.$('.js-ac-red-pack-tip')
    this.$acRedMoneyAll = this.$('.js-ac-auto-red-money-all')
    this.$acRedAllTip = this.$('.js-ac-red-pack-all-tip')
    this.$acRedNum = this.$('.js-ac-auto-red-num')
    this.$acRedNumTip = this.$('.js-ac-red-pack-num-tip')
    this.$acAddLink = this.$('.js-ac-add-link')
    this.getSubAcctLinkXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root
          self.$acAutoReBate.val(_(0).formatDiv(10, { fixed: 1 }))
          self.rebateMin = _(0).formatDiv(10, { fixed: 1 })
          self.rebateMax = _(data.maxRebateBeUse).formatDiv(10, { fixed: 1 })
          const subRebateRangePrompt = `${'0.0～'}${_(data.maxRebateBeUse > 130 ? 130 : data.maxRebateBeUse).formatDiv(10, { fixed: 1 })}`
          self.$acBonusRangePrompt.html(subRebateRangePrompt)
          self._parentView.renderLimit(res.root.quotaList)
        }
      })
  },
  // event handlers
  // 新增链接
  addLinkHandler() {
    const rebateValidate = this.$acOpenAccountAutoForm.parsley().validate()
    if (!rebateValidate) {
      return
    }

    const userType = this.$acUserType.find('button.active').data('type')
    const data = {
      userType,
      rebate: _(this.$acAutoReBate.val()).formatMul(10),
      remark: this.$acAutoRemarkInput.val(),
    }

    if (this.$acAutoCheckbox.is(':checked')) {
      const redpackType = this.$acRedType.find('button.active').data('type')
      const $input = redpackType === 2 ? this.$acRedMoney : this.$acRedMoneyAll
      if (this.redMoneyHandler() && this.redNumHandler()) {
        const redpackAmount = $input.val()
        _(data).extend({
          redpackOpenType: 1,
          redpackAmount,
          redpackType,
          redpackNum: this.$acRedNum.val(),
        })
        this.saveConfirmDialog(data)
      }
    } else {
      this.saveHandler(1, data)
    }
  },

  saveHandler(urlType, data) {
    const self = this
    let url = ''
    if (urlType === 1) {
      url = '/acct/subaccount/createsubacctlink.json'
    } else {
      url = '/acct/subaccount/createSubRedpackAcctlink.json'
    }
    this.$acAddLink.button('loading')
    Global.sync.ajax({
      url,
      data,
    }).always(() => {
      self.$acAddLink.button('reset')
    })
      .done((res) => {
        if (res.result === 0) {
          Global.ui.notification.show('开户链接已生成！', { type: 'success' })
          self.render()
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '链接生成失败' : res.msg)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '链接生成失败' : res.msg)
      })
  },

  saveConfirmDialog(data) {
    const self = this
    const $dialog = Global.ui.dialog.show({
      closeBtn: false,
      body: '<div class="js-confirm-dialog"></div>',
      anySize: '480',
      bodyClass: 'no-padding',
    })
    const $confirmDialog = $dialog.find('.js-confirm-dialog')
    $confirmDialog.html(this.confirmTpl({
      data,
      type: 2, // 1代表手动开户  2代表链接开户  3代表手动开户成功
      title: '红包开户确认',
    }))
    $dialog.off('click.save').on('click.save', '.js-confrim-btn', () => {
      $dialog.modal('hide')
      self.saveHandler(2, data)
    })
    $dialog.on('hidden.modal', function () {
      $(this).remove()
    })
  },
  inputRebateHandler(e) {
    const $target = $(e.currentTarget)
    const rebate = $target.val()
    if (rebate !== '' && _(rebate).isFinite()) {
      const myReg = /^(0|[1-9][0-9]*)(.\d{1})?$/
      const reg = myReg.test(rebate)
      if (!reg) {
        this.changeEleClass(this.$acAutoReBate, 'error')
        this.$acManualRebateInfo.html(this.getErrorTooltip('值最多能精确到小数点后一位'))
      } else if (rebate < this.rebateMin) {
        $target.val(this.rebateMin)
        this.changeEleClass(this.$acAutoReBate, 'error')
        this.$acManualRebateInfo.html(this.getErrorTooltip(`返点可配置范围${this.rebateMin}~${this.rebateMax}`))
      } else if (rebate > this.rebateMax) {
        $target.val(this.rebateMax)
        this.changeEleClass(this.$acAutoReBate, 'error')
        this.$acManualRebateInfo.html(this.getErrorTooltip(`返点可配置范围${this.rebateMin}~${this.rebateMax}`))
      } else {
        this.changeEleClass(this.$acAutoReBate, 'success')
        this.$acManualRebateInfo.html('<span class="sfa sfa-error-gray-icon vertical-sub m-right-xs"></span>' +
          `返点可配置范围${this.rebateMin}~${this.rebateMax}`)
      }
    } else {
      $target.val(this.rebateMin)
    }
  },
  remarkHandler(e) {
    const $target = $(e.currentTarget)
    const remark = $target.val()
    if (remark.replace(/[\u4e00-\u9fa5]/g, '**').length > 40) {
      this.changeEleClass(this.$acAutoRemarkInput, 'error')
      this.$acRemarkTip.html(this.getErrorTooltip('备注不可超过20个字符'))
    } else {
      this.changeEleClass(this.$acAutoRemarkInput, 'success')
      this.$acRemarkTip.html('<span class="sfa sfa-error-gray-icon vertical-sub m-right-xs"></span>' +
        '备注不可超过20个字符')
    }
  },
  redMoneyHandler() {
    const type = this.$acRedType.find('button.active').data('type')
    const $input = type === 2 ? this.$acRedMoney : this.$acRedMoneyAll
    const $tip = type === 2 ? this.$acRedPackTip : this.$acRedAllTip
    const text = type === 2 ? '金额' : '总额'
    const redText = type === 2 ? '单个红包金额' : '红包总金额'
    const money = $input.val()
    let isValidate = false
    const myReg = /^(0|[1-9][0-9]*)(.\d{1,2})?$/
    const reg = myReg.test(money)
    if (money === '') {
      this.changeEleClass($input, 'error')
      $tip.html(this.getErrorTooltip(`请输入${redText}`))
    } else if (!reg) {
      this.changeEleClass($input, 'error')
      $tip.html(this.getErrorTooltip('值最多能精确到小数点后两位'))
    } else if (Number(money) < 1) {
      this.changeEleClass($input, 'error')
      $tip.html(this.getErrorTooltip(`红包${text}不得低于1元`))
    } else {
      this.changeEleClass($input, 'success')
      $tip.html(`<span class="sfa sfa-error-gray-icon vertical-sub m-right-xs"></span>红包${text}不得低于1元`)
      isValidate = true
    }
    return isValidate
  },
  redNumHandler() {
    const val = this.$acRedNum.val()
    let isValidate = false
    if (val === '') {
      this.changeEleClass(this.$acRedNum, 'error')
      this.$acRedNumTip.html(this.getErrorTooltip('请设置红包个数'))
    } else {
      this.changeEleClass(this.$acRedNum, 'success')
      this.$acRedNumTip.empty()
      isValidate = true
    }
    return isValidate
  },
  getErrorTooltip (errorText) {
    const errorHtml =
      `${'<div class="tooltip parsley-errors-list tooltip-error filled">' +
      '<span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
      '<div class="tooltip-inner">'}${errorText}</div>` +
      '</div>'
    return errorHtml
  },

  lookBonusViewHandler (e) {
    const $target = $(e.currentTarget)
    const ticket = $target.data('ticket')
    const rebate = Number(this.$('.js-ac-auto-rebate').val())
    if (_(rebate).isNumber() && _(rebate).isFinite()) {
      Global.router.goTo(`ac/oam/pd/${ticket}?rebate=${rebate}`, { trigger: true, replace: false })
    } else {
      Global.ui.notification.show('请输入有效的返点值。')
    }
  },
  changeEleClass ($ele, status) {
    if (status === 'success') {
      $ele.addClass('parsley-success').removeClass('parsley-error')
    } else if (status === 'error') {
      $ele.addClass('parsley-error').removeClass('parsley-success')
    }
  },
  checkboxHandler(e) {
    const $target = $(e.currentTarget)
    if ($target.is(':checked')) {
      this.$acRedTypeTab.removeClass('hidden')
      this.$acAutoRedInfo.removeClass('hidden')
    } else {
      this.$acRedTypeTab.addClass('hidden')
      this.$acAutoRedInfo.addClass('hidden')
    }
  },
  redTypeHandler(e) {
    const $target = $(e.currentTarget)
    const type = Number($target.data('type'))
    if (type === 2) {
      this.$acRedFixed.removeClass('hidden')
      this.$acRedRandom.addClass('hidden')
    } else {
      this.$acRedFixed.addClass('hidden')
      this.$acRedRandom.removeClass('hidden')
    }
  },
  keyUpHandler(e) {
    const $target = $(e.currentTarget)
    const val = $target.val()
    const num = $target.data('num')
    let myReg
    if (Number(num) === 1) {
      myReg = /^\+?[1-9][0-9]*$/
    } else {
      myReg = /^\d+(\.\d*)?$/
    }
    const reg = myReg.test(val)
    if (!reg) {
      $target.val('')
    }
  },
})

module.exports = OpenAccountManageView
