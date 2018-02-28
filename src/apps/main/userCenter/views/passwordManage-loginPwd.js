const LoginPwdView = Base.ItemView.extend({

  template: require('userCenter/templates/passwordManage-login.html'),

  className: 'uc-change-pwd-view',

  // 绑定事件
  events: {
    // 修改登陆密码
    'click .js-changeLoginPassword-submit': 'changeLoginPasswordHandler',
    // 'blur #oldLoginPassword': 'checkOldLoginPassword',
    // 'blur #newLoginPassword': 'checkNewLoginPassword',
    // 'blur #newLoginPassword1': 'checkNewLoginPassword1',
  },

  onRender() {
    this.$changeLoginPasswordForm = this.$('.js-uc-changeLoginPassword-form')
    this.$oldLoginPassword = this.$('#oldLoginPassword')
    this.$newLoginPassword = this.$('#newLoginPassword')
    this.$newLoginPassword1 = this.$('#newLoginPassword1')
    this.$formContainer = this.$('.js-uc-changePwd-container')
    this.$successTip = this.$('.js-uc-changeLpwd-success')
  },

  changeLoginPasswordHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    var clpValidate = this.$changeLoginPasswordForm.parsley().validate();
    // this.checkOldLoginPassword() && this.checkNewLoginPassword() && this.checkNewLoginPassword1()
    if (clpValidate) {
      $target.button('loading')

      Global.sync.ajax({
        url: '/acct/userinfo/updateloginpwd.json',
        data: {
          oldPwd: this.$('#oldLoginPassword').val(),
          NewPwd: this.$('#newLoginPassword').val(),
        },
      })
        .always(() => {
          $target.button('reset')
        })
        .done((res) => {
          if (res && res.result === 0) {
            Global.ui.notification.show('修改密码成功', {
              type: 'success',
            })
            // self.$formContainer.addClass('hidden')
            // self.$successTip.removeClass('hidden')
            setTimeout(() => {
              self.trigger('render:true')
            }, 2000)
          } else if (res.msg === 'fail' && (res.root !== null)) {
            // Global.ui.notification.show(`验证失败，${res.root}`)
            const errorData = {
              el: this.$('.js-uc-pl-lp-error'),
              errorText: `验证失败，${res.root}`,
            }
            this.formateError(errorData)
          } else {
            const errorData = {
              el: this.$('.js-uc-pl-lp-error'),
              errorText: `验证失败，${res.msg}`,
            }
            this.formateError(errorData)
          }
        })
    }
  },

  checkOldLoginPassword() {
    const oldLoginPwVal = this.$oldLoginPassword.val()
    const $parentDiv = this.$oldLoginPassword.parent()
    let isValidate = false

    $parentDiv.find('.js-errorTooltip').remove()
    if (oldLoginPwVal === '') {
      this.changeEleClass(this.$oldLoginPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('当前密码不能为空'))
    } else {
      this.changeEleClass(this.$oldLoginPassword, 'success')
      $parentDiv.find('.js-errorTooltip').remove()
      isValidate = true
    }
    return isValidate
  },

  checkNewLoginPassword() {
    const newLoginPwVal = this.$newLoginPassword.val()
    const $parentDiv = this.$newLoginPassword.parent()
    const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
    let isValidate = false

    $parentDiv.find('.js-errorTooltip').remove()
    if (newLoginPwVal === '') {
      this.changeEleClass(this.$newLoginPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('新密码不能为空'))
    } else if (newLoginPwVal.length < 9 && this.strBetweenIsNumber(newLoginPwVal, 0, 7)) {
      this.changeEleClass(this.$newLoginPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else if (!pwReg.test(newLoginPwVal)) {
      this.changeEleClass(this.$newLoginPassword, 'error')
      $parentDiv.append(this.getErrorTooltip('您填写的密码不符合要求，请重新填写'))
    } else {
      this.changeEleClass(this.$newLoginPassword, 'success')
      $parentDiv.find('.js-errorTooltip').remove()
      isValidate = true
    }
    return isValidate
  },
  checkNewLoginPassword1() {
    const newLoginPwVal = this.$newLoginPassword.val()
    const newLoginPw1Val = this.$newLoginPassword1.val()
    const $parentDiv = this.$newLoginPassword1.parent()
    let isValidate = false

    $parentDiv.find('.js-errorTooltip').remove()
    if (newLoginPw1Val === '') {
      this.changeEleClass(this.$newLoginPassword1, 'error')
      $parentDiv.append(this.getErrorTooltip('确认新密码不能为空'))
    } else if (newLoginPwVal !== newLoginPw1Val) {
      this.changeEleClass(this.$newLoginPassword1, 'error')
      $parentDiv.append(this.getErrorTooltip('两次密码输入不一致'))
    } else {
      this.changeEleClass(this.$newLoginPassword1, 'success')
      $parentDiv.find('.js-errorTooltip').remove()
      isValidate = true
    }
    return isValidate
  },

  getErrorTooltip(errorText) {
    const errorHtml =`<div class="js-errorTooltip tooltip bottom parsley-errors-list filled"><span class="sfa sfa-error-icon vertical-middle tooltip-icon"></span><div class="tooltip-inner">${errorText}</div></div>`
    return errorHtml
  },

  strBetweenIsNumber(str, star, end) {
    const strArr = str.split('').slice(star, end)
    let isHasNumber = true
    $.each(strArr, (index, item) => {
      if (!$.isNumeric(item)) {
        isHasNumber = false
      }
    })
    return isHasNumber
  },

  changeEleClass($ele, status) {
    if (status === 'success') {
      $ele.addClass('parsley-success').removeClass('parsley-error')
    } else if (status === 'error') {
      $ele.addClass('parsley-error').removeClass('parsley-success')
    }
  },
  formateError(data) {
    const errorTpl = `<div class="m-top-sm"><span class="sfa sfa-error-icon vertical-middle tooltip-icon"></span><div class="tooltip-inner">${data.errorText}</div></div>`
    data.el.html(errorTpl)
  },
})

module.exports = LoginPwdView
