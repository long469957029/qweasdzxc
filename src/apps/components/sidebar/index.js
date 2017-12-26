

require('./index.scss')

const SidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  initialize() {},

  serializeData() {
    let sidebar = ''
    // const acctInfo = Global.memoryCache.get('acctInfo')
    // console.log(acctInfo)
    // const userName = acctInfo.userName
    if (_(this.options.sidebar).isArray()) {
      sidebar = _(this.options.sidebar).map(this.formatSidebar.bind(this))
    } else {
      sidebar = this.formatSidebar(this.options.sidebar)
    }
    console.log(sidebar)
    return {
      menus: sidebar,
      showUserInfo: sidebar.router === 'uc', // _(sidebar).findIndex({ router: 'uc' }) > -1,
      showTeamEntry: true,
      isTeam: _(sidebar).findIndex({ router: 'ac' }) > -1,
    }
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
