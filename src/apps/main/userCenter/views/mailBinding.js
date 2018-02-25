const MailBindingView = Base.ItemView.extend({

  template: require('userCenter/templates/mailBinding.html'),

  className: 'uc-change-pwd-view',

  events: {
    'click .js-email-bind-btn': 'bindBtnHandler',
    'click .js-uc-email-reSend': 'sendCodeHandler',
  },
  sendValidataCodeXhr (url, data) {
    return Global.sync.ajax({
      url,
      data,
    })
  },
  validateCodeXhr (url, data) {
    return Global.sync.ajax({
      url,
      data,
    })
  },
  serializeData() {
    return {
      hasBindingEmail: this.options.hasBindingEmail,
      email: this.options.email,
    }
  },

  onRender() {
    // const self = this
    this.$changeContainer = this.$('.js-email-change-container')
    if (!this.options.hasBindingMobile) {
      this.$changeContainer.steps({
        headerTag: 'h3',
        bodyTag: '.js-uc-email-steps',
        forceMoveForward: false,
        enablePagination: false,
        transitionEffect: 'slideLeft',
        onStepChanging(event, currentIndex, newIndex) {
          return newIndex !== 3
        },
      })
    }
    this.$bindForm = this.$('.js-uc-email-bind-form')
    this.$email = this.$('.js-uc-email-num')
    this.$verificationCode = this.$('.js-uc-email-verification-code')
    this.$lastEmailForm = this.$('.js-uc-last-email-form')
    this.$lastEmailNum = this.$('.js-uc-last-email-num')
    this.$lastVerificationCode = this.$('.js-uc-last-verification-code')
    this.$bindError = this.$('.js-bind-error-text')
    this.$changeError = this.$('.js-change-error-text')
  },

  sendCodeCountdown ($reSend, $countdown) {
    const self = this
    let time = 60
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
      let url = ''
      if (type === 'add') {
        const parsley = this.$email.parsley()
        if (parsley.validate() && parsley.isValid()) {
          const email = this.$email.val()
          data.email = email
        } else {
          return false
        }
        url = '/acct/smtpCode/send.json'
      } else {
        url = '/acct/smtpCode/sendByModify.json'
      }
      this.sendValidataCodeXhr(url, data).done((res) => {
        if (res && res.result === 0) {
          self.$email.attr('disabled',true)
          $target.html('<span class="js-uc-pm-mobile-countdown">60</span>秒后重发')
          $target.data('status', 1)
          self.sendCodeCountdown($target, $('.js-uc-pm-mobile-countdown'))
          self.$bindError.html('')
          self.$changeError.html('')
        } else {
          $target.html('重新发送')
          self.getErrorEl({
            text: res.msg === 'fail' ? '验证码发送失败' : res.msg,
            el: type === 'add' ? self.$bindError : self.$changeError,
          })
        }
      })
    }
  },

  bindBtnHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    const bindStaus = type === 'add' ? this.$bindForm.parsley() : this.$lastEmailForm.parsley()
    if (bindStaus.validate() && bindStaus.isValid()) {
      const data = {}
      let url = ''
      if (type === 'add') {
        data.code = this.$verificationCode.val()
        url = '/acct/smtpCode/val.json'
      } else {
        data.code = this.$lastVerificationCode.val()
        url = '/acct/smtpCode/valByModify.json'
      }
      $target.button('loading')
      this.validateCodeXhr(url, data)
        .always(() => {
          $target.button('reset')
        }).done((res) => {
          if (res && res.result === 0) {
            Global.m.oauth.check()
            if (res.root.success === 0) {
              if (type === 'add') {
                Global.ui.notification.show('恭喜您，邮箱绑定成功！')
                self.trigger('render:true')
                Global.m.publish('safe:updating')
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
              const data = {
                text: '您的验证码有误，请输入正确的验证码！',
              }
              if (type === 'add') {
                self.$verificationCode.focus()
                data.el = self.$bindError
              } else {
                self.$lastVerificationCode.focus()
                data.el = self.$changeError
              }
              self.getErrorEl(data)
              // Global.ui.notification.show('您的验证码有误，请输入正确的验证码！', { displayTime: 2000 })// (res.msg === 'fail' || res.msg === 'ok') ? '' : res.msg
            }
          } else {
            const data = {
              text: `绑定失败！${res.msg === 'fail' ? '' : res.msg}`,
            }
            if (type === 'add') {
              data.el = self.$bindError
            } else {
              data.el = self.$changeError
            }
            self.getErrorEl(data)
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

module.exports = MailBindingView
