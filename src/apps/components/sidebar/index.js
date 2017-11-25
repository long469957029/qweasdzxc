

require('./index.scss')

const SidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  initialize() {},

  serializeData() {
    const self = this
    const sidebar = _(this.options.sidebar).clone()
    sidebar.sub = _(sidebar.sub).map((menu) => {
      return _({}).extend(menu, {
        isActive: window.location.hash.indexOf(menu.router) !== -1 || menu.router == self.options.activeMenu,
      })
    })

    return {
      menus: sidebar,
    }
  },
})

module.exports = SidebarView
