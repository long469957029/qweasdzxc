require('./index.scss')

// var NewsBarView = require('../newsBar');
const LockView = require('fundCenter/fundManage/lock')// 资金锁定
const UnlockView = require('fundCenter/fundManage/unlock')// 资金解锁

const dividendConfig = require('agencyCenter/dividendManage/dividendConfig')

const HeaderView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    // 'click .js-gl-hd-notice-container': 'toggleNoticeHandler',
    'click .js-header-announcement': 'checkAnnouncementHandler',
    'click .js-gl-h-ticket-main': 'clickEmptyTicketMainHandler',
    'click .js-gl-hd-refresh': 'refreshHandler',
    'mouseover .js-gl-h-ticket-div': 'inTicketSelectHandler',
    'mouseout .js-gl-h-ticket-div': 'outTicketSelectHandler',
    'click .js-gl-hd-logout': 'logoutHandler',
    'click .js-gl-hd-wd': 'withdrawHandler', // 在线提现

    'click .js-gl-hd-lock': 'lockClickHandler', // 资金锁定
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/fund/withdraw/info.json',
    })
  },

  // acct/usersecurity/fundslock.json 资金锁定Xhr
  fundslockXhr(data) {
    return Global.sync.ajax({
      url: 'acct/usersecurity/fundslock.json',
      data,
    })
  },

  // acct/usersecurity/fundslock.json 资金解锁Xhr
  fundsunlockXhr(data) {
    return Global.sync.ajax({
      url: 'acct/usersecurity/fundsunlock.json',
      data,
    })
  },
  getUserMallInfoXhr () {
    return Global.sync.ajax({
      url: '/mall/integral/info.json',
    })
  },
  initialize() {
    _.bindAll(this, 'renderUpdateUnread', 'renderUnread')

    this.subscribe('news', 'news:updating', this.renderUpdateUnread)
  },

  serializeData() {
    return {
      ticketList: ticketConfig.getCompleteAll(),
    }
  },
  onRender() {
    const self = this

    this.answerArr = []

    this.$unRead = this.$('.js-gl-hd-notice')
    this.$ticketDropdown = this.$('.js-gl-h-ticket-dropdown')

    this.$('.js-gl-head-acct-menu').dropMenu()
    this.$('.js-gl-head-main-menu').dropMenu()
    this.$('.js-gl-head-money-menu').dropMenu()

    this.subscribe('acct', 'acct:updating', () => {
      self.renderAcctInfo()
    })
    this.renderUserRoleMenu()

    this.$unReadNotice = this.$('.js-gl-hd-msg-num')
    this.subscribe('news', 'news:updating', this.renderUnread)
  },
  renderUnread(model) {
    const unReadNotice = model.get('unReadNotice')
    if (unReadNotice === 0) {
      this.$unReadNotice.addClass('hidden')
    } else {
      this.$unReadNotice.removeClass('hidden')
    }
    this.$unReadNotice.text(unReadNotice > 99 ? '99' : unReadNotice)
  },

  renderUserRoleMenu() {
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (acctInfo.userType != 1) {
      this.$('.js-header-agency-center').removeClass('hidden')
    }
    const dividendStatus = acctInfo.dividendStatus !== dividendConfig.getByName('UN_APPLIED').id
    this.$('.js-header-router-role[href="#ac/dm"]').toggleClass('hidden', !dividendStatus && !acctInfo.merchant)// header菜单显示权限处理
    this.$('.js-header-router-role[href="#ac/rp"]').toggleClass('hidden', !acctInfo.redEnvelope)// header菜单显示权限处理
    this.$('.js-header-router-role[href="#ac/reb"]').toggleClass('hidden', !acctInfo.merchant)// header菜单显示权限处理
  },

  renderAcctInfo() {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')
    this.$('.js-gl-hd-userName').html(acctInfo.uName ? (acctInfo.uName) : (acctInfo.username))
    this.$('.js-gl-hd-balance').html(acctInfo.fBalance)
    this.$('.js-gl-hd-nickName').attr('title', acctInfo.uName ? (`昵称：${acctInfo.uName}`) : (`用户名：${acctInfo.username}`))
    // this.$('.js-gl-vip-level').html(this.levelName(acctInfo.memberLevel));
    this.$('.js-gl-vip-level').html(`<span class="sfa mall-level-${acctInfo.mallMemberLevel} vertical-middle"></span>`)
    this.$('.js-gl-hd-lock').toggleClass('sfa-h-unlocked', !acctInfo.foundsLock).toggleClass('sfa-h-locked', acctInfo.foundsLock).data('status', acctInfo.foundsLock ? '1' : '0')
  },

  levelName (level) {
    let levelName = ''
    switch (parseInt(level)) {
      case 0:
        levelName = '骑士'
        break
      case 1:
        levelName = '男爵'
        break
      case 2:
        levelName = '子爵'
        break
      case 3:
        levelName = '伯爵'
        break
      case 4:
        levelName = '侯爵'
        break
      case 5:
        levelName = '公爵'
        break
      case 6:
        levelName = '大公'
        break
      default:
        levelName = '未知'
        break
    }
    return levelName
  },

  renderUpdateUnread(model) {
    const unRead = model.getUnreadCount()
    if (unRead) {
      this.$unRead.removeClass('hidden').text(unRead > 99 ? 99 : unRead)
    } else {
      this.$unRead.addClass('hidden')
    }
  },

  // event handlers

  clickEmptyTicketMainHandler(e) {
    const $target = $(e.target)
    if ($target.hasClass('js-gl-h-ticket-entry') || $target.closest('.js-gl-h-ticket-entry').length) {
      this.$ticketDropdown.dropdown('toggle')
    } else {
      return false
    }
  },

  // toggleNoticeHandler: function(e) {
  //  var self = this;
  //  var $target = $(e.currentTarget);
  //
  //  if (!$target.data('popover')) {
  //    var $html = $('<div class="width-md">');
  //    this.newsBarView = new NewsBarView();
  //    $target.popover({
  //      content: $html,
  //      placement: 'bottom',
  //      html: true
  //    }).popover('show');
  //
  //    $html.html(this.newsBarView.render().$el);
  //
  //  }
  //  $target.off('hide').on('hide', function() {
  //    self.newsBarView.hidden();
  //  });
  // },

  refreshHandler(e) {
    e.stopPropagation()
    e.preventDefault()
    const $target = $(e.currentTarget)

    $target.addClass('fa-spin')

    Global.m.oauth.check()
      .always(() => {
        $target.removeClass('fa-spin')
      })
  },

  logoutHandler(e) {
    Global.ui.loader.show()

    $(document).confirm({

      content: '<div class="m-TB-lg">确定要退出登录？</div>',
      type: 'exit',
      agreeCallback() {
        Global.oauth.logout().done((data) => {
          if (data && data.result === 0) {
            Global.cookieCache.clear('token')
            Global.cookieCache.clear('loginState')
            window.location.href = 'login.html'
          }
        }).always(() => {
          Global.ui.loader.hide()
        })
      },
    })

    return false
  },


  withdrawHandler() {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')

    if (!acctInfo || acctInfo.userStatus === 100) {
      Global.ui.notification.show('用户已被冻结，无法进行提现操作。')
      return false
    }
    if (Global.memoryCache.get('acctInfo').foundsLock) {
      Global.ui.notification.show('资金已锁定，请先' + '<a href="javascript:void(0);" ' +
        'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
        'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>' + '。')
      return false
    }

    Global.appRouter.navigate('#fc/wd', { trigger: true, replace: false })
  },

  // inTicketSelectHandler: function(e){
  //   var $target  = $(e.currentTarget);
  //   if(!$target.hasClass('open')){
  //     this.$ticketDropdown.dropdown('toggle');
  //   }
  // },
  // outTicketSelectHandler: function(e){
  //   var $target  = $(e.currentTarget);
  //   if($target.hasClass('open')){
  //     this.$ticketDropdown.dropdown('toggle');
  //   }
  //   return false;
  // }
  lockClickHandler(e) {
    e.stopPropagation()
    e.preventDefault()
    const $target = $(e.currentTarget)
    const status = $target.data('status')
    if (status == 0) {
      this.lockHandler()
    } else {
      this.unlockHandler()
    }
  },

  // 资金锁定
  lockHandler() {
    const self = this
    this.getInfoXhr().always(() => { /* self.loadingFinish(); */
    }).done((res) => {
      const data = res && res.root || {}
      if (res && res.result === 0) {
        if (!data.hasMoneyPwd) {
          // 未设置则弹出链接到资金密码设置页面的提示框
          $(document).securityTip({
            content: '您未设置资金密码，无法进行资金锁定',
            customizeClass: 'dialog-money-locked',
            showMoneyPwd: true,
            hasMoneyPwd: false,
            showBankCard: false,
            hasBankCard: false,
            showSecurity: false,
          })
        } else {
          self.lockCallBack()
        }
      } else {
        Global.ui.notification.show('服务器异常')
      }
    })
  },

  // 资金解锁
  unlockHandler() {
    const self = this
    this.getInfoXhr().always(() => { /* self.loadingFinish(); */
    }).done((res) => {
      const data = res && res.root || {}
      if (res && res.result === 0) {
        if (!data.hasSecurity) {
          $(document).securityTip({
            content: '您未绑定安全问题，无法进行资金解锁',
            customizeClass: 'dialog-money-unlocked',
            showMoneyPwd: false,
            hasMoneyPwd: false,
            showBankCard: false,
            hasBankCard: false,
            showSecurity: true,
          })
        } else {
          self.unlockCallBack(res.root)
        }
      } else {
        Global.ui.notification.show('服务器异常')
      }
    })
  },
  // 资金锁定
  lockCallBack() {
    const self = this
    const lockView = new LockView()

    this.$dialogWd = Global.ui.dialog.show({
      title: '资金锁定',
      size: 'modal-md',
      body: '<div class="js-fc-lock-container"></div>',
    })

    this.$dialogWd.find('.js-fc-lock-container').html(lockView.render().el)

    this.$dialogWd.on('hidden.modal', function (e) {
      $(this).remove()
    })

    this.$dialogWd.on('click', '.js-lock-commit', () => {
      const clpValidate = self.$dialogWd.find('.js-lock-confirm').parsley().validate()
      if (clpValidate) {
        const password = $('.js-lock-password').val()

        self.fundslockXhr({ fundsPassword: password }).done((res) => {
          if (res.result == 0) {
            self.$('.js-gl-hd-lock').removeClass('sfa-h-unlocked').addClass('sfa-h-locked').data('status', '1')
            Global.ui.notification.show(res.msg)
            self.$dialogWd.modal('hide')
            Global.m.oauth.check()
          }
          if (res.result == 1) {
            $('.js-password-tip').html(res.msg)
          }
        })
      }
    })
  },

  // 资金解锁
  unlockCallBack(res) {
    const self = this
    this.num = 0
    const unlockView = new UnlockView()
    this.$dialogWd = Global.ui.dialog.show({
      title: '资金解锁',
      size: 'modal-md',
      body: '<div class="js-fc-lock-container"></div>',
    })
    this.answerArr = res.userPwdSecurities
    this.$dialogWd.find('.js-fc-lock-container').html(unlockView.render().el)

    this.$dialogWd.on('hidden.modal', function (e) {
      $(this).remove()
    })

    this.$dialogWd.find('.js-lock-question').html(self.answerArr[self.num].userSecurityQuestion)
    this.$dialogWd.find('.js-questionId-input').val(res.userPwdSecurities[self.num].userSecurityId)

    this.$dialogWd.on('click', '.js-refresh', () => {
      self.num = self.num >= 2 ? 0 : self.num + 1
      self.$dialogWd.find('.js-lock-question').html(self.answerArr[self.num].userSecurityQuestion)
      self.$dialogWd.find('.js-questionId-input').val(res.userPwdSecurities[self.num].userSecurityId)
    })

    this.$dialogWd.on('click', '.js-unlock-commit', () => {
      const clpValidate = self.$dialogWd.find('.js-unlock-confirm').parsley().validate()

      if (clpValidate) {
        const password = $('.js-unlock-password').val()
        const question = $('.js-unlock-question').val()
        const securityId = $('.js-questionId-input').val()

        self.fundsunlockXhr({ fundsPassword: password, securityId, securityAsw: question }).done((res) => {
          if (res.result == 0) {
            Global.ui.notification.show(res.msg)
            self.$dialogWd.modal('hide')
            Global.m.oauth.check()
            self.$('.js-gl-hd-lock').removeClass('sfa-h-locked').addClass('sfa-h-unlocked').data('status', '0')
          }
          if (res.result == 1) {
            Global.ui.notification.show(res.msg)
          }
        })
      }
    })
  },
  checkAnnouncementHandler () {
    Global.m.router.goTo('#nc/px')
  },

})

module.exports = HeaderView

