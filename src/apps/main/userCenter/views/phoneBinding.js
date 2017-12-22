
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
    }
  },

  onRender() {
    // const self = this
    this.$bindForm = this.$('.js-uc-phone-bind-form')
    this.$phoneNum = this.$('.js-uc-phone-num')
    this.$verificationCode = this.$('.js-uc-phone-verification-code')
    this.$changeContainer = this.$('.js-phone-change-container')
    this.$lastPhoneForm = this.$('.js-uc-last-phone-form')
    this.$lastPhoneNum = this.$('.js-uc-last-phone-num')
    this.$lastVerificationCode = this.$('.js-uc-last-verification-code')
    if (!this.options.hasBindingMobile) {
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
    if (status === 0) {
      const parsley = this.$phoneNum.parsley()
      if (parsley.validate() && parsley.isValid()) {
        const mobile = this.$phoneNum.val()
        this.sendValidataCodeXhr({
          mobile,
          type: 1,
        }).done((res) => {
          if (res && res.result === 0) {
            $target.html('<span class="js-uc-pm-mobile-countdown">30</span>秒后重发')
            $target.data('status', 1)
            self.sendCodeCountdown($target, $('.js-uc-pm-mobile-countdown'))
            Global.ui.notification.show('发送成功！', { displayTime: 2000 })
          } else {
            $target.html('重新发送')
            Global.ui.notification.show(res.msg === 'fail' ? '发送失败' : res.msg, { displayTime: 2000 })// 您的手机号码已经绑定其他账号，请更换新的手机号码！
          }
        })
      }
    }
  },

  bindBtnHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    const bindStaus = this.$bindForm.parsley()
    if (bindStaus.validate() && bindStaus.isValid()) {
      this.validateCodeXhr({ code: this.$verificationCode.val(), type: 1 }).done((res) => {
        if (res && res.result === 0) {
          Global.m.oauth.check()
          if (res.root.success === 0) {
            if (type === 'add') {
              Global.ui.notification.show('恭喜您，验证成功！')
              self.trigger('render:true')
            } else {
              self.trigger('render:true')
            }
          } else {
            self.$verificationCode.focus()
            Global.ui.notification.show('您的验证码有误，请输入正确的验证码！', { displayTime: 2000 })// (res.msg === 'fail' || res.msg === 'ok') ? '' : res.msg
          }
        } else {
          Global.ui.notification.show(`绑定失败！${res.msg === 'fail' ? '' : res.msg}`, { displayTime: 2000 })
        }
      })
    }
  },

})

module.exports = PhoneBindingView
