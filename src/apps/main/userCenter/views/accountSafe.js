
import LoginPassWord from './passwordManage-loginPwd'
import FundPassWord from './passwordManage-fundPwd'
import QuestionPwd from './securityQuestion'
import PhoneBind from './phoneBinding'
import EmailBind from './mailBinding'

const AccountSafeView = Base.ItemView.extend({

  template: require('userCenter/templates/accountSafe.html'),

  startOnLoading: true,

  events: {
    'click .js-setting-btn': 'settingBtnHandler',
    'click .js-setting-info-close': 'settingBtnHandler',
  },

  className: '',

  getAccountSafeXhr() {
    return Global.sync.ajax({
      url: '/acct/userinfo/accountCenter.json',
    })
  },

  onRender() {
    const self = this
    this.$loginPwd = this.$('.js-setting-login-pwd')
    this.$fundPwd = this.$('.js-setting-fund-pwd')
    this.$questionPwd = this.$('.js-setting-question-pwd')
    this.$phonePwd = this.$('.js-setting-phone-pwd')
    this.$mailPwd = this.$('.js-setting-mail-pwd')
    this.$safeLevelText = this.$('.js-safe-level-text')
    this.$safeProgressInfo = this.$('.js-safe-progress-info')
    this.$safeInfoDate = this.$('.js-safe-info-date')
    this.$safeInfoIp = this.$('.js-safe-info-ip')
    this.$safeInfoAddress = this.$('.js-safe-info-address')
    this.$settingPhoneNum = this.$('.js-setting-phone-num')
    this.$settingMailNum = this.$('.js-setting-mail-num')
    this.$loginPwd.html(new LoginPassWord().on('render:true', () => {
      self.onRender()
    }).render().el)

    this.getAccountSafeXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.root) {
            const data = res.root
            if (data.securityLevel < 3) {
              self.$safeLevelText.html('低')
            } else if (data.securityLevel < 5) {
              self.$safeLevelText.html('中')
            } else {
              self.$safeLevelText.html('高')
            }
            self.$safeProgressInfo.css({ width: `${_(_(data.securityLevel).div(5)).mul(100)}%` })
            self.$safeInfoDate.html(_(data.loginLogs[0].loginTime).toTime())
            self.$safeInfoIp.html(data.loginLogs[0].ip)
            self.$safeInfoAddress.html(data.loginLogs[0].address)
            if (data.hasLoginPassword) {
              self.$('.js-setting-icon[data-type="login"]').addClass('active')
            }
            if (data.hasFundPassword) {
              self.$('.js-setting-icon[data-type="fund"]').addClass('active')
              self.$('.js-setting-btn[data-type="fund"]').html('修改')
              self.$('.js-setting-info-title[data-type="fund"]').html('修改资金密码')
              self.$('.js-important-tip[data-type="fund"]').addClass('hidden')
            }
            if (data.hasSecurityQuestion) {
              self.$('.js-setting-icon[data-type="question"]').addClass('active')
              self.$('.js-setting-btn[data-type="question"]').html('修改')
              self.$('.js-setting-info-title[data-type="question"]').html('变更密保问题')
              self.$('.js-important-tip[data-type="question"]').addClass('hidden')
            }
            if (data.hasBindingMobile) {
              self.$('.js-setting-icon[data-type="phone"]').addClass('active')
              self.$('.js-setting-btn[data-type="phone"]').html('修改')
              self.$('.js-setting-info-title[data-type="phone"]').html('变更手机')
              self.$('.js-important-tip[data-type="phone"]').addClass('hidden')
              self.$settingPhoneNum.html(data.mobile)
            }
            if (data.hasBindingEmail) {
              self.$('.js-setting-icon[data-type="mail"]').addClass('active')
              self.$('.js-setting-btn[data-type="mail"]').html('修改')
              self.$('.js-setting-info-title[data-type="mail"]').html('变更邮箱')
              self.$('.js-important-tip[data-type="mail"]').addClass('hidden')
              self.$settingMailNum.html(data.email)
            }
            self.$fundPwd.html(new FundPassWord({ hasFundPassword: data.hasFundPassword }).on('render:true', () => {
              self.onRender()
            }).render().el)
            self.$questionPwd.html(new QuestionPwd({ hasSecurityQuestion: data.hasSecurityQuestion }).on('render:true', () => {
              self.onRender()
            }).render().el)
            self.$phonePwd.html(new PhoneBind({ hasBindingMobile: data.hasBindingMobile, mobile: data.mobile }).on('render:true', () => {
              self.onRender()
            }).render().el)
            self.$mailPwd.html(new EmailBind({ hasBindingEmail: data.hasBindingEmail }).on('render:true', () => {
              self.onRender()
            }).render().el)
          }
          self.loadingFinish()
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '获取账户安全信息失败！' : res.msg)
          self.loadingFinish()
        }
      })
  },

  settingBtnHandler(e) {
    const $target = $(e.currentTarget)
    $target.parents('.js-setting-info').toggleClass('active').siblings().removeClass('active')
  },

})

module.exports = AccountSafeView
