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
  // getBindInfoXhr(){
  //   return Global.sync.ajax({
  //     url: '/info/newpack/bindinfo.json',
  //   })
  // },

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
      self.$('.js-setting-info').removeClass('active')
      self.onRender()
    }).render().el)
    const bindInfo = Global.cookieCache.get('userBindInfo')
    this.getAccountSafeXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.root) {
            const data = res.root
            Global.memoryCache.set('accountSafe', res.root)
            Global.m.publish('safe:updating', res.root)
            if (data.securityLevel < 3) {
              self.$safeLevelText.html('低')
            } else if (data.securityLevel < 5) {
              self.$safeLevelText.html('中')
            } else {
              self.$safeLevelText.html('高')
            }
            self.$safeProgressInfo.css({width: `${_(_(data.securityLevel).div(5)).mul(100)}%`})
            self.$safeInfoDate.html(data.loginLogs[0] ? _(data.loginLogs[0].loginTime).toTime() : '')
            self.$safeInfoIp.html(data.loginLogs[0] ? data.loginLogs[0].ip : '')
            self.$safeInfoAddress.html(data.loginLogs[0] ? data.loginLogs[0].address : '')
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
            if(bindInfo){
              if(bindInfo.phoneStatus === 0){
                self.$('.js-reward[data-type="phone"]').html(`（<span class="text-prominent">+${_(bindInfo.bindPhoneBonus).convert2yuan()}</span>元奖励）`)
              }
              if(bindInfo.mailStatus === 0){
                self.$('.js-reward[data-type="mail"]').html(`（<span class="text-prominent">+${_(bindInfo.bindMailBonus).convert2yuan()}</span>元奖励）`)
              }
            }
            self.$fundPwd.html(new FundPassWord({hasFundPassword: data.hasFundPassword}).on('render:true', () => {
              self.$('.js-setting-info').removeClass('active')
              self.render()
            }).render().el)
            self.$questionPwd.html(new QuestionPwd({hasSecurityQuestion: data.hasSecurityQuestion}).on('render:true', () => {
              self.render()
            }).render().el)
            self.$phonePwd.html(new PhoneBind({
              hasBindingMobile: data.hasBindingMobile,
              mobile: data.mobile
            }).on('render:true', () => {
              if(!_(bindInfo).isUndefined() && bindInfo.phoneStatus === 0){
                bindInfo.phoneStatus = 1
                Global.cookieCache.set('userBindInfo', bindInfo)
              }
              self.render()
            }).render().el)
            self.$mailPwd.html(new EmailBind({
              hasBindingEmail: data.hasBindingEmail,
              email: data.email
            }).on('render:true', () => {
              if(!_(bindInfo).isUndefined() && bindInfo.mailStatus === 0){
                bindInfo.mailStatus = 1
                Global.cookieCache.set('userBindInfo', bindInfo)
              }
              self.render()
            }).render().el)
          }
          self.loadingFinish()
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '获取账户安全信息失败！' : res.msg)
          self.loadingFinish()
        }
      })
    // this.getBindInfoXhr()
    //   .done((res) => {  // 获取首次绑定手机和邮箱的奖励
    //     if(res && res.result === 0 && !_(res.root).isNull()){
    //       const data = res.root
    //       if(data.phoneStatus === 0){
    //         self.$('.js-reward[data-type="phone"]').html(`（<span class="text-prominent">+${_(data.bindPhoneBonus).convert2yuan()}</span>元奖励）`)
    //       }
    //       if(data.mailStatus === 0){
    //         self.$('.js-reward[data-type="mail"]').html(`（<span class="text-prominent">+${_(data.bindMailBonus).convert2yuan()}</span>元奖励）`)
    //       }
    //     }
    //   })
  },

  settingBtnHandler(e) {
    if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
      Global.ui.notification.show('试玩会员无法进行安全设置操作，请先注册正式游戏账号')
      return false
    }
    const $target = $(e.currentTarget)
    $target.parents('.js-setting-info').toggleClass('active').siblings().removeClass('active')
  },

})

module.exports = AccountSafeView
