
var Clipboard = require('clipboard')
const OpenAccountManageView = Base.ItemView.extend({

  template: require('agencyCenter/templates/openAccountManage-manual.html'),
  confirmTpl: _(require('agencyCenter/templates/openAccountManage-confirm.html')).template(),
  startOnLoading: true,
  events: {
    'click .js-ac-submitOpenAccountInfo': 'submitOpenAccountInfoHandler',
    'blur .js-ac-userName': 'checkUserName',
    // 'click .js-ac-ticket-link': 'ticketPriceViewHandler',
    'blur .js-ac-manual-rebate': 'inputRebateHandler',
    'blur .js-ac-password': 'checkUserPassword',
    'blur .js-ac-red-pack': 'checkRedPackHandler',
    'keyup .js-ac-red-pack,.js-ac-manual-rebate': 'keyUpHandler',
    'click .js-look-bonus': 'lookBonusViewHandler',
    'click .js-ac-manual-checkbox': 'checkboxHandler',
  },
  getSubAcctXhr() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json',
      abort: false,
    })
  },
  checkUserExistXhr(data) {
    return Global.sync.ajax({
      url: '/acct/userinfo/userexist.json',
      data,
      async: false,
    })
  },
  serializeData(){
    return{
      merchant: Global.memoryCache.get('acctInfo').merchant
    }
  },

  onRender() {
    const self = this

    this.$limit = this.$('.js-ac-quota-container')

    this.$acUserName = this.$('.js-ac-userName')
    this.$acUserNameTip = this.$('.js-ac-userName-tip')
    this.$acPassword = this.$('.js-ac-password')
    this.$acPasswordTip = this.$('.js-ac-password-tip')
    this.$acmanualRebate = this.$('.js-ac-manual-rebate')
    this.$acBonusRangePrompt = this.$('.js-ac-bonus-range-Prompt')
    this.$acOpenAccountManualForm = this.$('.js-ac-openAccountManual-form')
    this.$acUserType = this.$('.js-ac-userType')
    this.$acManualRebateInfo = this.$('.js-ac-manual-rebate-info')
    this.$acRedPack = this.$('.js-ac-red-pack')
    this.$acRedPackTip = this.$('.js-ac-red-pack-tip')
    this.$acRedPackMoney = this.$('.js-ac-red-pack-money')
    this.$acManualCheckbox = this.$('.js-ac-manual-checkbox')
    this.$acSubmitBtn = this.$('.js-ac-submitOpenAccountInfo')
    this.getSubAcctXhr().always(() => {
      self.loadingFinish()
    })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root.seriesList
          const subRebateRange = data.subRebateRange
          self.$acmanualRebate.val(_(subRebateRange.subAcctRebate).formatDiv(10, { fixed: 1 }))
          // self.$acmanualRebate.attr('data-parsley-range', `[${_(subRebateRange.rebateMin).formatDiv(10, { fixed: 1 })},${_(subRebateRange.rebateMax).formatDiv(10, { fixed: 1 })}]`)
          self.rebateMin = _(subRebateRange.rebateMin).formatDiv(10, { fixed: 1 })
          self.rebateMax = _(subRebateRange.rebateMax).formatDiv(10, { fixed: 1 })
          const subRebateRangePrompt = `${subRebateRange.rebateMin}～${_(subRebateRange.rebateMax > 130 ? 130 : subRebateRange.rebateMax).formatDiv(10, { fixed: 1 })}`

          self.$acBonusRangePrompt.html(subRebateRangePrompt)

          self._parentView.renderLimit(res.root.quotaList)

          const acctInfo = Global.memoryCache.get('acctInfo')
          if (acctInfo.merchant) {
            self.$acUserType.find('button').eq(1).remove()
            self.$acManualRebateInfo.hide()
            self.$acmanualRebate.val(_(acctInfo.userRebate).formatDiv(10, { fixed: 1 })).attr('disabled', 'disabled')
          }
        }
      })
  },

  // TODO 手工开户提交
  submitOpenAccountInfoHandler () {
    const rebateValidate = this.$acOpenAccountManualForm.parsley().validate()

    if (this.checkUserName() && this.checkUserPassword() && rebateValidate) {
      const acctInfo = Global.memoryCache.get('acctInfo')
      if (acctInfo.merchant) {
        this.$('.js-ac-manual-rebate').val(13)
      }

      const globalData = {
        userName: this.$acUserName.val(),
        loginPwd: this.$acPassword.val(),
        rebate: _(this.$acmanualRebate.val()).formatMul(10),
      }
      const userType = this.$acUserType.find('button.active').data('type')
      const data = {
        userName: this.$acUserName.val(),
        loginPwd: this.$acPassword.val(),
        rebate: _(this.$acmanualRebate.val()).formatMul(10),
        userType,
      }
      if (this.$acManualCheckbox.is(':checked')) {
        const preStatus = window.Global.cookieCache.get('security')
        if (this.checkRedPackHandler()) {
          _(data).extend({
            redpackOpenType: 1,
            redpackAmount: this.$acRedPack.val(),
          })
          if(preStatus === 1 || preStatus === 2){
            this.saveConfirmDialog(globalData, data)
          }else{
            $(document).securityTip({
              content: '资金密码未设置，请先设置资金密码后再进行红包开户',
              hasMoneyPwd: false,
              hasBankCard: false,
              showBankCard: false,
            })
          }
        }
      } else {
        this.saveHandler(1,globalData, data)
      }
    }
  },
  saveConfirmDialog(globalData, data) {
    const self = this
    this.$dialog = Global.ui.dialog.show({
      closeBtn: false,
      body: '<div class="js-confirm-dialog"></div>',
      anySize: '480',
      bodyClass: 'no-padding',
    })
    const $confirmDialog = this.$dialog.find('.js-confirm-dialog')
    $confirmDialog.html(this.confirmTpl({
      data,
      type: 1, // 1代表手动开户  2代表链接开户  3代表手动开户成功
      title: '红包开户确认',
    }))
    const $pwdInput = this.$dialog.find('.js-pwd-input')
    this.$confirmError = this.$dialog.find('.js-error-info')
    this.$confirmErrorText = this.$dialog.find('.js-error-text')
    this.$dialog.off('click.save').on('click.save', '.js-confrim-btn', () => {
      // this.$dialog.modal('hide')
      if($pwdInput.val() === ''){
        self.$confirmError.removeClass('hidden')
        self.$confirmErrorText.html('请输入资金密码')
      }else{
        _(data).extend({
          moneyPwd: $pwdInput.val()
        })
        self.saveHandler(2,globalData, data)
      }
    })
    this.$dialog.on('hidden.modal', function() {
      $(this).remove()
    })
  },
  saveHandler(type,globalData, data) {  // type: 1表示正常开户 2表示红包开户
    if (data) {
      this.$('.js-confrim-btn').button('loading')
      const self = this
      Global.sync.ajax({
        url: '/acct/subaccount/savesubacct.json',
        data,
      }).always(() => {
        self.$('.js-confrim-btn').button('reset')
      })
        .done((res) => {
          if (res && res.result === 0) {
            if(type === 2){
              this.$dialog.modal('hide')
            }
            self.showCopyDailog(globalData)
            Global.router.goTo('ac/oam')
            self.render()
          } else {
            if(type === 2){
              self.$confirmError.removeClass('hidden')
              let errorText= ''
              if (res.root != null && _(res.root).isNumber()) {
                if (res.root > 0) {
                  errorText = `验证失败,剩余${res.root}次机会。`
                } else {
                  errorText = '验证失败,请一个小时后再验证！'
                }
                self.$confirmErrorText.html(errorText)
              }else{
                self.$confirmErrorText.html(res.msg === 'fail' ? '资金密码错误' : res.msg)
              }
            }else{
              Global.ui.notification.show(`保存失败，${res.msg}`)
            }
          }
        })
    }
  },
  checkUserName() {
    const self = this

    const acUserNameVal = this.$acUserName.val()
    // const $parentDiv = this.$acUserName.parent()
    let isValidate = false

    const userNameReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
    // this.$acUserNameTip.find('.js-errorTooltip').remove()

    if (acUserNameVal === '') {
      this.changeEleClass(this.$acUserName, 'error')
      this.$acUserNameTip.html(this.getErrorTooltip('用户名不能为空'))
    } else if (userNameReg.test(acUserNameVal)) {
      this.checkUserExistXhr({ username: acUserNameVal }).fail(() => {
      }).done((res) => {
        if (res.result === 0) {
          self.changeEleClass(self.$acUserName, 'success')
          self.$acUserNameTip.html('<span class="sfa sfa-error-gray-icon vertical-sub m-right-xs"></span>' +
            '4-16个字符，支持英文和数字，不能以数字开头')
          isValidate = true
        } else {
          self.changeEleClass(self.$acUserName, 'error')
          this.$acUserNameTip.html(self.getErrorTooltip(res.msg))
        }
      })
    } else {
      this.changeEleClass(this.$acUserName, 'error')
      this.$acUserNameTip.html(this.getErrorTooltip('4-16个字符，支持中英文和数字，不能以数字开头'))
    }
    return isValidate
  },

  lookBonusViewHandler (e) {
    const $target = $(e.currentTarget)
    const ticket = $target.data('ticket')
    const rebate = Number(this.$('.js-ac-manual-rebate').val())
    if (_(rebate).isNumber() && _(rebate).isFinite()) {
      Global.router.goTo(`ac/oam/pd/${ticket}?rebate=${rebate}`, { trigger: true, replace: false })
    } else {
      Global.ui.notification.show('请输入有效的返点值。')
    }
  },
  inputRebateHandler(e) {
    const $target = $(e.currentTarget)
    const rebate = Number($target.val())
    if (rebate !== '' && _(rebate).isFinite()) {
      const myReg = /^(0|[1-9][0-9]*)(.\d{1})?$/
      const reg = myReg.test(rebate)
      if (!reg) {
        this.changeEleClass(this.$acmanualRebate, 'error')
        this.$acManualRebateInfo.html(this.getErrorTooltip('值最多能精确到小数点后一位'))
      } else if (rebate < this.rebateMin) {
        $target.val(this.rebateMin)
        this.changeEleClass(this.$acmanualRebate, 'error')
        this.$acManualRebateInfo.html(this.getErrorTooltip(`返点可配置范围${this.rebateMin}~${this.rebateMax}`))
      } else if (rebate > this.rebateMax) {
        $target.val(this.rebateMax)
        this.changeEleClass(this.$acmanualRebate, 'error')
        this.$acManualRebateInfo.html(this.getErrorTooltip(`返点可配置范围${this.rebateMin}~${this.rebateMax}`))
      } else {
        this.changeEleClass(this.$acmanualRebate, 'success')
        this.$acManualRebateInfo.html('<span class="sfa sfa-error-gray-icon vertical-sub m-right-xs"></span>' +
          `返点可配置范围${this.rebateMin}~${this.rebateMax}`)
      }
    } else {
      $target.val(this.rebateMin)
    }
  },
  checkRedPackHandler() {
    const acRedPack = this.$acRedPack.val()
    let isValidate = false
    const myReg = /^(0|[1-9][0-9]*)(.\d{1,2})?$/
    const reg = myReg.test(acRedPack)
    if (acRedPack === '') {
      this.changeEleClass(this.$acRedPack, 'error')
      this.$acRedPackTip.html(this.getErrorTooltip('请输入红包金额'))
    } else if (!reg) {
      this.changeEleClass(this.$acRedPack, 'error')
      this.$acRedPackTip.html(this.getErrorTooltip('值最多能精确到小数点后两位'))
    } else if (Number(acRedPack) < 1) {
      this.changeEleClass(this.$acRedPack, 'error')
      this.$acRedPackTip.html(this.getErrorTooltip('红包金额不得低于1元'))
    } else {
      this.changeEleClass(this.$acRedPack, 'success')
      this.$acRedPackTip.html('<span class="sfa sfa-error-gray-icon vertical-sub m-right-xs"></span>' +
        '红包金额不得低于1元')
      isValidate = true
    }
    return isValidate
  },
  showCopyDailog(data) {
    const copyText = '账号：'+data.userName+
      '\n密码：'+data.loginPwd+
      '\n返点：'+_(data.rebate).formatDiv(10,{fixed:1})+
      '\n网址：'+_('/login.html').toLink()

    const $dialog = Global.ui.dialog.show({
      closeBtn: false,
      body: '<div class="js-copy-dialog"></div>',
      anySize: '480',
      bodyClass: 'no-padding',
    })
    const copyContant = $dialog.find('.js-copy-dialog')
    copyContant.html(this.confirmTpl({
      title: '开户成功',
      container: `${'<form><div class="copy-contant m-bottom-lg m-top-lg">' +
      '<div class="p-left-lg m-top-md  m-bottom-md"><label class="text-left">账号:&nbsp;&nbsp;&nbsp;&nbsp;  '}${data.userName}</label></div>` +
      `<div class="p-left-lg m-top-md  m-bottom-md"><label class="text-left">密码:&nbsp;&nbsp;&nbsp;&nbsp;  ${data.loginPwd}</label></div>` +
      `<div class="p-left-lg m-top-md  m-bottom-md"><label class="text-left">返点:&nbsp;&nbsp;&nbsp;&nbsp;  ${_(data.rebate).formatDiv(10, { fixed: 1 })}</label></div></div>` +
      `<div class="m-top-lg m-bottom-lg text-center"><button type="button" class="js-ac-ocm-copy ac-ocm-copy btn btn-sun"
          data-clipboard-text="${copyText}" data-dismiss="modal">复制并关闭</button></div></form>`,

      type: 3,
    }))

    $dialog.on('hidden.modal', function () {
      $(this).remove()
    })

    //
    // $dialog.find('.js-ac-ocm-copy').textCopy({
    //   text: `账号：${data.userName}\n密码：${data.loginPwd
    //   }\n返点：${_(data.rebate).formatDiv(10, { fixed: 1 })}`,
    //   notShowToolTip: true,
    // })
    const clipboard = new Clipboard('.js-ac-ocm-copy');
    clipboard.on('success', function(e) {
      e.clearSelection();
    });

    clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  },

  checkUserPassword () {
    const acPwVal = this.$acPassword.val()
    // const $parentDiv = this.$acPassword.parent()
    const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
    let isValidate = false

    this.$acPasswordTip.find('.js-errorTooltip').remove()
    if (acPwVal === '') {
      this.changeEleClass(this.$acPassword, 'error')
      this.$acPasswordTip.html(this.getErrorTooltip('密码不能为空'))
    } else if (acPwVal.length < 9 && this.strBetweenIsNumber(acPwVal, 0, 7)) {
      this.changeEleClass(this.$acPassword, 'error')
      this.$acPasswordTip.html(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else if (!pwReg.test(acPwVal)) {
      this.changeEleClass(this.$acPassword, 'error')
      this.$acPasswordTip.html(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else {
      this.changeEleClass(this.$acPassword, 'success')
      this.$acPasswordTip.html('<span class="sfa sfa-error-gray-icon vertical-sub m-right-xs"></span>' +
        '6-20位字符组成，区分大小写，不能使用特殊字符')
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

  strBetweenIsNumber (str, star, end) {
    const strArr = str.split('').slice(star, end)
    let isHasNumber = true
    $.each(strArr, (index, item) => {
      if (!$.isNumeric(item)) {
        isHasNumber = false
      }
    })
    return isHasNumber
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
      this.$acRedPackMoney.removeClass('hidden')
    } else {
      this.$acRedPackMoney.addClass('hidden')
    }
  },
  keyUpHandler(e) {
    const $target = $(e.currentTarget)
    const val = $target.val()
    const myReg = /^\d+(\.\d*)?$/
    const reg = myReg.test(val)
    if (!reg) {
      $target.val('')
    }
  },
})

module.exports = OpenAccountManageView
