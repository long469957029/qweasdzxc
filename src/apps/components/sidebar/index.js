

require('./index.scss')

const SidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  initialize() {},

  serializeData() {
    let sidebar = ''
    // const acctInfo = Global.memoryCache.get('acctInfo')
    // const userName = acctInfo.userName
    if (_(this.options.sidebar).isArray()) {
      sidebar = _(this.options.sidebar).map(this.formatSidebar.bind(this))
    } else {
      sidebar = this.formatSidebar(this.options.sidebar)
    }
    return {
      menus: sidebar,
      showUserInfo: _(sidebar).findIndex({ router: 'uc' }) > -1,
    }
  },
  formatSidebar(sidebar) {
    const self = this
    sidebar = _(sidebar).clone()
    sidebar.sub = _(sidebar.sub).map((menu) => {
      return _({}).extend(menu, {
        isActive: window.location.hash.indexOf(menu.router) !== -1 || menu.router === self.options.activeMenu,
      })
    })
    return sidebar
  },
})

module.exports = SidebarView
