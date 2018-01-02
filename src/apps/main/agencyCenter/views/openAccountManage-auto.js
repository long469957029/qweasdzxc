
const OpenAccountManageView = Base.ItemView.extend({

  template: require('agencyCenter/templates/openAccountManage-auto.html'),
  startOnLoading: true,

  events: {
    'click .js-ac-add-link': 'addLinkHandler',
    'blur .js-ac-auto-rebate': 'inputRebateHandler',
    'blur .js-ac-auto-remarkInput': 'remarkHandler',
    'click .js-look-bonus': 'lookBonusViewHandler',
    'click .js-ac-auto-checkbox': 'checkboxHandler',
    'click .js-ac-redType>button': 'redTypeHandler',
  },

  createSubAcctXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/createsubacctlink.json',
      data,
    })
  },
  createSubRedPackAcctXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/createsubacctlink.json',
      data,
    })
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
    this.$aRedAllTip = this.$('.js-ac-red-pack-all-tip')
    this.$acRedNum = this.$('.js-ac-auto-red-num')
    this.$acRedNumTip = this.$('.js-ac-red-pack-num-tip')
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
  addLinkHandler(e) {
    const rebateValidate = this.$acOpenAccountAutoForm.parsley().validate()
    if (!rebateValidate) {
      return
    }
    const self = this
    const $target = $(e.currentTarget)

    $target.button('loading')

    const userType = this.$acUserType.find('button.active').data('type')
    const data = {
      userType,
      rebate: _(this.$acAutoReBate.val()).formatMul(10),
      remark: this.$acAutoRemarkInput.val(),
    }
    let url = this.createSubAcctXhr()
    if (this.$acAutoCheckbox.is(':checked')) {
      const redpackType = this.$acRedType.find('button.active').data('type')
      const redpackAmount = redpackType === 2 ? this.$acRedMoney.val() : this.$acRedMoneyAll.val()
      _(data).extend({
        redpackOpenType: 1,
        redpackAmount,
        redpackType,
        redpackNum: this.$acRedNum.val(),
      })
      url = this.createSubRedPackAcctXhr()
    }

    // $.when(this._parentView.subSubAcctXhr, this.createSubAcctXhr(data))
    //   .always(() => {
    //     $target.button('reset')
    //   })
    //   .done((infoResList, createResList) => {
    //     const infoRes = infoResList[0]
    //     const createRes = createResList[0]
    //     if (infoRes.result === 0 && createRes.result === 0) {
    //       const rebateVal = _(createRes.root.rebate).formatDiv(10, { fixed: 1 })
    //       const row = {
    //         columnEls: [
    //           self.$autoContainer.find('tbody tr').length + 1,
    //           `<span class="js-ac-span-link ac-span-link m-right-xs" title="${_(`/register.html?linkId=${createRes.root.linkId}`).toLink()}">${_(`/register.html?linkId=${createRes.root.linkId}`).toLink()}</span>` +
    //           '<button type="button" class="js-ac-btn-link-copy btn btn-cool m-right-xs ac-btn-link-copy">复制</button>' +
    //           `<button userLinkUrl="${createRes.root.linkId}" type="button" class="js-ac-btn-qr-code btn btn-cool ac-btn-qr-code">二维码</button>`,
    //           userType == 1 ? '玩家' : '代理',
    //           `<span class="js-ac-auto-subAcctRebate" data-subacctrebate="${createRes.root.rebate}">${rebateVal}</span>`,
    //           '0',
    //           '0',
    //           // _.isEmpty(createRes.root.remark) ?
    //           //   '<input type="text" class="js-ac-auto-remark ac-auto-remark" data-parsley-maxlength="20" /><span class="js-ac-auto-remark-saveBtn ac-auto-remark-saveBtn"></span>' :
    //           `<span class="js-ac-span-remark ac-span-remark" title="${createRes.root.remark}">${createRes.root.remark}</span><span class="js-ac-auto-remark-updateBtn ac-auto-remark-updateBtn"></span>`,
    //           `<span data-userlinkid="${createRes.root.userLinkId}" class="js-ac-link-del ac-link-del"></span>`,
    //         ],
    //       }
    //
    //       self.$autoContainer.staticGrid('addRows', row)
    //       const $tbodyLastTr = self.$autoContainer.find('tbody tr:last')
    //       self.copyLinkHandler($tbodyLastTr)
    //     }
    //   })
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
      Global.appRouter.navigate(`#ac/oam/pd/${ticket}?rebate=${rebate}`, { trigger: true, replace: false })
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
    if (type === 0) {
      this.$acRedFixed.removeClass('hidden')
      this.$acRedRandom.addClass('hidden')
    } else {
      this.$acRedFixed.addClass('hidden')
      this.$acRedRandom.removeClass('hidden')
    }
  },
})

module.exports = OpenAccountManageView
