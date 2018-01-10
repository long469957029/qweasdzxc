

require('./index.scss')

const avatarCfg = require('userCenter/misc/avatarConfig')

const SidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  initialize() {
    this.subscribe('safe', 'safe:updating', this.render())
  },

  serializeData() {
    let sidebar = ''
    const acctInfo = Global.memoryCache.get('acctInfo')
    const accountSafe = Global.memoryCache.get('accountSafe')
    // if (_.isUndefined(accountSafe)) {
    //   accountSafe.hasFundPassword = false
    //   accountSafe.hasSecurityQuestion = false
    //   accountSafe.hasFundPassword = false
    //   accountSafe.hasFundPassword = false
    // }
    if (_(this.options.sidebar).isArray()) {
      sidebar = _(this.options.sidebar).map(this.formatSidebar.bind(this))
    } else {
      sidebar = this.formatSidebar(this.options.sidebar)
    }
    return {
      menus: sidebar,
      showUserInfo: sidebar.router === 'uc', // _(sidebar).findIndex({ router: 'uc' }) > -1,
      showTeamEntry: acctInfo.userType === 0,
      isTeam: sidebar.router === 'ac',
      dividendStatus: acctInfo.dividendStatus,
      userName: acctInfo.username,
      img: avatarCfg.get(_.isNull(acctInfo.headIcon) ? _.random(1, 21) : Number(acctInfo.headIcon)).logo,
      accountSafe,
    }
  },
  // onRender() {
  //   // const self = this
  //   // this.$iconLock = this.$('.js-sfa-icon-lock')
  //   // this.$iconLightBulb = this.$('.js-sfa-icon-light-bulb')
  //   // this.$iconMobile = this.$('.js-sfa-icon-mobile')
  //   // this.$iconMail = this.$('.js-sfa-icon-mail')
  //   // this.$safeLevel = this.$('.js-user-info-safe-level')
  //   // this.$progressBar = this.$('.js-safe-progress-bar')
  //   // this.getAccountSafeXhr()
  //   //   .done((res) => {
  //   //     if (res.result === 0) {
  //   //       const data = res.root
  //   //       self.$iconLock.addClass(data.hasFundPassword ? 'sfa-icon-lock-over' : 'sfa-icon-lock')
  //   //       self.$iconLightBulb.addClass(data.hasSecurityQuestion ? 'sfa-icon-light-bulb-over' : 'sfa-icon-light-bulb')
  //   //       self.$iconMobile.addClass(data.hasBindingMobile ? 'sfa-icon-mobile-over' : ' sfa-icon-mobile')
  //   //       self.$iconMail.addClass(data.hasBindingEmail ? 'sfa-icon-mail-over' : ' sfa-icon-mail')
  //   //       if (data.securityLevel < 3) {
  //   //         self.$safeLevel.html('低')
  //   //       } else if (data.securityLevel < 5) {
  //   //         self.$safeLevel.html('中')
  //   //       } else {
  //   //         self.$safeLevel.html('高')
  //   //       }
  //   //       self.$progressBar.css({ width: `${_(_(data.securityLevel).div(5)).mul(100)}%` })
  //   //     }
  //   //   })
  // },

  formatSidebar(sidebar) {
    const self = this
    sidebar = _(sidebar).clone()
    _(sidebar.sub).each((menu, index) => {
      sidebar.sub[index].list = _(menu.list).map((item) => {
        return _({}).extend(item, {
          isActive: window.location.hash.indexOf(item.router) !== -1 || item.router === self.options.activeMenu,
        })
      })
    })
    return sidebar
  },
})

module.exports = SidebarView
