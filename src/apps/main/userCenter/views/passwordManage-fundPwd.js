

const FundPwdView = Base.ItemView.extend({

  template: require('userCenter/templates/passwordManage-fundPwd.html'),

  className: 'uc-change-pwd-view',

  events: {
    'click .js-uc-setFundPassword-submit': 'setFundPasswordHandler',
    'blur #oldFundPassword': 'checkOldFundPassword',
    'blur #newUpdateFundPassword': 'checkNewUpdateFundPassword',
    'blur #newUpdateFundPassword1': 'checkNewUpdateFundPassword1',
  },

  serializeData() {
    return {
      hasFundPassword: this.options.hasFundPassword,
    }
  },

  onRender() {
    // const self = this

    this.$setFundPasswordForm = this.$('.js-uc-setFundPassword-form')

    this.$oldFundPassword = this.$('#oldFundPassword')
    this.$newUpdateFundPassword = this.$('#newUpdateFundPassword')
    this.$newUpdateFundPassword1 = this.$('#newUpdateFundPassword1')
  },

  setFundPasswordHandler (e) {
    const $target = $(e.currentTarget)
    const self = this
    const type = $target.data('type')
    // var clpValidate = this.$setFundPasswordForm.parsley().validate();

    if (type === 'add' && this.checkNewUpdateFundPassword() && this.checkNewUpdateFundPassword1()) {
      $target.button('loading')
      Global.sync.ajax({
        url: '/fund/moneypd/savepaypwd.json',

        data: {
          payPwd: this.$('#newUpdateFundPassword').val(),
        },
      })
        .always(() => {
          $target.button('reset')
        })
        .done((res) => {
          if (res && res.result === 0) {
            // suc
            Global.ui.notification.show('设置密码成功')
            self.trigger('render:true')
            // 判断是否绑定银行卡，0：银行卡与密码都未绑定，1：银行卡与密码都已绑定，2：只绑定资金密码，3：只绑定银行卡
            const preStatus = window.Global.cookieCache.get('security')
            let status = 0
            if (preStatus === 0) {
              status = 2
              window.Global.cookieCache.set('security', status)
            } else if (preStatus === 3) {
              status = 1
              window.Global.cookieCache.set('security', status)
            }
          } else {
            // fail
            Global.ui.notification.show(res.msg)
          }
        })
    } else if (type === 'update' && this.checkOldFundPassword() && this.checkNewUpdateFundPassword() && this.checkNewUpdateFundPassword1()) {
      $target.button('loading')
      Global.sync.ajax({
        url: '/acct/userinfo/updatepaypwd.json',
        data: {
          oldPayPwd: this.$('#oldFundPassword').val(),
          payPwd: this.$('#newUpdateFundPassword').val(),
        },
      })
        .always(() => {
          $target.button('reset')
        })
        .done((res) => {
          if (res && res.result === 0) {
            // suc
            Global.ui.notification.show('修改资金密码成功', {
              type: 'success',
            })
            self.trigger('render:true')
          } else if (_(res.root).isNumber && res.root > 0) {
            Global.ui.notification.show(`验证失败，剩余&nbsp;${res.root}&nbsp;次机会`)
          } else {
            Global.ui.notification.show(res.msg)
          }
        })
    }
  },

  checkOldFundPassword () {
    const oldFundPwVal = this.$oldFundPassword.val()
    const $parentDiv = this.$oldFundPassword.parent()
    let isValidate = false

    $parentDiv.find('.js-errorTooltip').remove()
    if (oldFundPwVal === '') {
      this.changeEleClass(this.$oldFundPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('当前密码不能为空'))
    } else {
      this.changeEleClass(this.$oldFundPassword, 'success')
      $parentDiv.find('.js-errorTooltip').remove()
      isValidate = true
    }
    return isValidate
  },

  checkNewUpdateFundPassword () {
    const newUpdateFundPwVal = this.$newUpdateFundPassword.val()
    const $parentDiv = this.$newUpdateFundPassword.parent()
    const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
    let isValidate = false

    $parentDiv.find('.js-errorTooltip').remove()
    if (newUpdateFundPwVal === '') {
      this.changeEleClass(this.$newUpdateFundPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('新密码不能为空'))
    } else if (newUpdateFundPwVal.length < 9 && this.strBetweenIsNumber(newUpdateFundPwVal, 0, 7)) {
      this.changeEleClass(this.$newUpdateFundPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else if (!pwReg.test(newUpdateFundPwVal)) {
      this.changeEleClass(this.$newUpdateFundPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else {
      this.changeEleClass(this.$newUpdateFundPassword, 'success')
      $parentDiv.find('.js-errorTooltip').remove()
      isValidate = true
    }
    return isValidate
  },
  checkNewUpdateFundPassword1 () {
    const newUpdateFundPwVal = this.$newUpdateFundPassword.val()
    const newUpdateFundPw1Val = this.$newUpdateFundPassword1.val()
    const $parentDiv = this.$newUpdateFundPassword1.parent()
    let isValidate = false

    $parentDiv.find('.js-errorTooltip').remove()
    if (newUpdateFundPw1Val === '') {
      this.changeEleClass(this.$newUpdateFundPassword1, 'error')
      $parentDiv.append(this.getErrorTooltip('确认新密码不能为空'))
    } else if (newUpdateFundPwVal !== newUpdateFundPw1Val) {
      this.changeEleClass(this.$newUpdateFundPassword1, 'error')
      $parentDiv.append(this.getErrorTooltip('两次密码输入不一致'))
    } else {
      this.changeEleClass(this.$newUpdateFundPassword1, 'success')
      $parentDiv.find('.js-errorTooltip').remove()
      isValidate = true
    }
    return isValidate
  },

  getErrorTooltip (errorText) {
    const errorHtml =
      `${'<div class="js-errorTooltip tooltip bottom parsley-errors-list filled">' +
      '<div class="tooltip-inner"><span class="sfa sfa-error-icon vertical-middle m-right-xs"></span>'}${errorText}</div>` +
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


})

module.exports = FundPwdView
