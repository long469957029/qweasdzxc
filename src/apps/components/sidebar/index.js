require('./index.scss')

const avatarCfg = require('userCenter/misc/avatarConfig')

const SidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-user-info-safe-up':'changeUrlHandler',
  },

  initialize() {
    // this.subscribe('safe', 'safe:updating', this.render)
  },

  serializeData() {
    let sidebar = ''
    const acctInfo = Global.memoryCache.get('acctInfo')
    const myPointsNoUse = Global.memoryCache.get('myPointsNoUse')
    if (_(this.options.sidebar).isArray()) {
      sidebar = _(this.options.sidebar).map(this.formatSidebar.bind(this))
    } else {
      sidebar = this.formatSidebar(this.options.sidebar)
    }
    let headIcon = acctInfo.headIcon
    return {
      menus: sidebar,
      showUserInfo: sidebar.router === 'uc', // _(sidebar).findIndex({ router: 'uc' }) > -1,
      showTeamEntry: acctInfo ? acctInfo.userType === 0 : false,
      isTeam: sidebar.router === 'ac',
      dividendStatus: acctInfo ? acctInfo.dividendStatus : 0,
      userName: acctInfo.uName || acctInfo.username,
      img: avatarCfg.get(headIcon).logo,
      myPointsNoUse: (_(myPointsNoUse).isUndefined() || myPointsNoUse === 0) ? '' : `(${myPointsNoUse})`
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
    this.$userName = this.$('.js-user-name')
    this.$userAvatar = this.$('.js-user-avatar')
    this.$myPoints = this.$('.js-my-points')
    this._onRender()
    this.subscribe('safe', 'safe:updating', () => {
      self._onRender()
    })
    Vue.$global.bus.$on('update:userInfo',(data)=>{
      this.$userName.html(data.uName)
      this.$userAvatar.attr('src',avatarCfg.get(data.headIconId.toString()).logo)
    })
    Vue.$global.bus.$on('myPointsNoUse',(data)=>{
      this.$myPoints.html((_(data).isUndefined() || data === 0) ? '' : `(${data})`)
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
  changeUrlHandler(){
    Global.router.goTo('uc/pl')
  },
})

module.exports = SidebarView
