
const PhoneBindingView = Base.ItemView.extend({

  template: require('userCenter/templates/phoneBinding.html'),

  className: 'uc-change-pwd-view',

  events: {
    'click .js-phone-bind-btn': 'bindBtnHandler',
    'click .js-uc-mobile-reSend': 'sendCodeHandler',
  },
  sendValidataCodeXhr (data) {
    return Global.sync.ajax({
      url: '/acct/smscode/send.json',
      data,
    })
  },
  validateCodeXhr (data) {
    return Global.sync.ajax({
      url: '/acct/smscode/val.json',
      data,
    })
  },
  serializeData() {
    return {
      hasBindingMobile: this.options.hasBindingMobile,
      mobile: this.options.mobile,
    }
  },

  onRender() {
    // const self = this
    this.$changeContainer = this.$('.js-phone-change-container')
    if (this.options.hasBindingMobile) {
      this.$changeContainer.steps({
        headerTag: 'h3',
        bodyTag: '.js-uc-phone-steps',
        forceMoveForward: false,
        enablePagination: false,
        transitionEffect: 'slideLeft',
        onStepChanging(event, currentIndex, newIndex) {
          return newIndex !== 3
        },
      })
    }
    this.$bindForm = this.$('.js-uc-phone-bind-form')
    this.$phoneNum = this.$('.js-uc-phone-num')
    this.$verificationCode = this.$('.js-uc-phone-verification-code')
    this.$lastPhoneForm = this.$('.js-uc-last-phone-form')
    this.$lastVerificationCode = this.$('.js-uc-last-verification-code')
    this.$bindError = this.$('.js-bind-error-text')
    this.$changeError = this.$('.js-change-error-text')
  },

  sendCodeCountdown ($reSend, $countdown) {
    const self = this
    let time = 30
    clearInterval(this.countdown)
    this.countdown = setInterval(() => {
      time -= 1
      $countdown.text(time)
      if (time === 0) {
        self.countDownSecond = time
        clearInterval(self.countdown)
        if ($reSend) {
          $reSend.text('重新发送')
          $reSend.data('status', 0)
        }
      }
    }, 1000)
  },

  sendCodeHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const status = $target.data('status')
    const type = $target.data('type')
    const data = {}
    if (status === 0) {
      if (type === 'add') {
        const parsley = this.$phoneNum.parsley()
        if (parsley.validate() && parsley.isValid()) {
          const mobile = this.$phoneNum.val()
          data.mobile = mobile
          data.type = 1
        } else {
          return false
        }
      } else {
        data.type = 2
      }
      this.sendValidataCodeXhr(data).done((res) => {
        if (res && res.result === 0) {
          $target.html('<span class="js-uc-pm-mobile-countdown">30</span>秒后重发')
          $target.data('status', 1)
          self.sendCodeCountdown($target, $('.js-uc-pm-mobile-countdown'))
        } else {
          $target.html('重新发送')
          self.getErrorEl({ text: res.msg === 'fail' ? '验证码发送失败' : res.msg, el: type === 'add' ? self.$bindError : self.$changeError })
        }
      })
    }
  },

  bindBtnHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    const bindStaus = type === 'add' ? this.$bindForm.parsley() : this.$lastPhoneForm.parsley()
    if (bindStaus.validate() && bindStaus.isValid()) {
      const data = {
      }
      if (type === 'add') {
        data.code = this.$verificationCode.val()
        data.type = 1
      } else {
        data.code = this.$lastVerificationCode.val()
        data.type = 2
      }
      $target.button('loading')
      this.validateCodeXhr(data)
        .always(() => {
          $target.button('reset')
        }).done((res) => {
          if (res && res.result === 0) {
            Global.m.oauth.check()
            if (res.root.success === 0) {
              if (type === 'add') {
                Global.ui.notification.show('恭喜您，手机绑定成功！')
                self.trigger('render:true')
              } else {
                const num = $target.data('num')
                self.$changeContainer.steps('goTo', num)
                if (num === 2) {
                  setTimeout(() => {
                    self.trigger('render:true')
                  }, 2000)
                }
              }
            } else {
              const dataError = {
                text: '您的验证码有误，请输入正确的验证码！',
              }
              if (type === 'add') {
                self.$verificationCode.focus()
                data.el = self.$bindError
              } else {
                self.$lastVerificationCode.focus()
                data.el = self.$changeError
              }
              self.getErrorEl(dataError)
              // Global.ui.notification.show('您的验证码有误，请输入正确的验证码！', { displayTime: 2000 })// (res.msg === 'fail' || res.msg === 'ok') ? '' : res.msg
            }
          } else {
            const dataError = {
              text: `绑定失败！${res.msg === 'fail' ? '' : res.msg}`,
            }
            if (type === 'add') {
              data.el = self.$bindError
            } else {
              data.el = self.$changeError
            }
            self.getErrorEl(dataError)
            // Global.ui.notification.show(`绑定失败！${res.msg === 'fail' ? '' : res.msg}`, { displayTime: 2000 })
          }
        })
    }
  },
  getErrorEl (data) {
    const errorTpl = `<span class="text-hot"><i class="sfa sfa-error-icon m-right-xs vertical-sub"></i>${data.text}</span>`
    data.el.html(errorTpl)
  },
})

module.exports = PhoneBindingView
