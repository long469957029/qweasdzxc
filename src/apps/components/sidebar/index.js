require('./index.scss')

const avatarCfg = require('userCenter/misc/avatarConfig')

const SidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  initialize() {
    // this.subscribe('safe', 'safe:updating', this.render)
  },

  serializeData() {
    let sidebar = ''
    const acctInfo = Global.memoryCache.get('acctInfo')
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
// <<<<<<< HEAD
//       img: avatarCfg.get(_.isNull(acctInfo.headIcon) ? _.random(1, 21) : _(acctInfo.headIcon).toString()).logo,
// =======
      img: avatarCfg.get(_(acctInfo.headIcon).toString()).logo,
    }
  },
  onRender() {
    const self = this
    this.$iconLock = this.$('.js-sfa-icon-lock')
    this.$iconLightBulb = this.$('.js-sfa-icon-light-bulb')
    this.$iconMobile = this.$('.js-sfa-icon-mobile')
    this.$iconMail = this.$('.js-sfa-icon-mail')
    this.$safeLevel = this.$('.js-user-info-safe-level')
    this.$progressBar = this.$('.js-safe-progress-bar')
    this.subscribe('safe', 'safe:updating', () => {
      self._onRender()
    })
  },
  _onRender() {
    const accountSafe = Global.memoryCache.get('accountSafe')
    this.$iconLock.addClass(accountSafe && accountSafe.hasFundPassword ? 'sfa-icon-lock-over' : 'sfa-icon-lock')
    this.$iconLightBulb.addClass(accountSafe && accountSafe.hasSecurityQuestion ? 'sfa-icon-light-bulb-over' : 'sfa-icon-light-bulb')
    this.$iconMobile.addClass(accountSafe && accountSafe.hasBindingMobile ? 'sfa-icon-mobile-over' : ' sfa-icon-mobile')
    this.$iconMail.addClass(accountSafe && accountSafe.hasBindingEmail ? 'sfa-icon-mail-over' : ' sfa-icon-mail')
    if (accountSafe && accountSafe.securityLevel < 3) {
      this.$safeLevel.html('低')
    } else if (accountSafe && accountSafe.securityLevel < 5) {
      this.$safeLevel.html('中')
    } else {
      this.$safeLevel.html('高')
    }
    this.$progressBar.css({width: `${accountSafe ? _(_(accountSafe.securityLevel).div(5)).mul(100) : 0}%`})
  },

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
