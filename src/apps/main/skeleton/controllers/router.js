import SidebarView from 'com/sidebar'

import './index.scss'


const SideMenuMainView = Base.LayoutView.extend({
  className: 'clearfix',
  template: '<div class="admin-container"><div class="js-gl-sidebar pull-left col-md-2"></div>' +
  '<div class="js-gl-main pull-left col-md-10"></div></div>',
})

const RouterController = Base.Controller.extend({

  changeMainReginView(mainView, config) {
    config = config || {}

    config = _.defaults(config || {}, {
      destroyDiff: 'high',
    })

    config.main = _.defaults(config.main || {}, {
      subReturn: false,
    })
    if (config.hideHeaderRight) {
      $('#navbar,#quickEntry,#footer').addClass('hidden')
      // $('#footer').addClass('mark6-footer');
    } else {
      $('#navbar,#quickEntry,#footer').removeClass('hidden')
      // $('#footer').removeClass('mark6-footer');
    }

    if (config.sidebar) {
      this._changeSideMenuMainReginView(mainView, config)
    } else {
      this._changeMainReginView(mainView, config)
    }

    Global.ui.menu.selectMenuFromCurrentHash()
  },

  _changeSideMenuMainReginView(mainView, config) {
    const currentView = Global.viewPool.setCurrentView(new SideMenuMainView())

    currentView.addRegions({
      sidebar: '.js-gl-sidebar',
      mainRegin: '.js-gl-main',
    })

    Global.mainRegin.show(currentView, {
      // preventDestroy: true,
      forceShow: true,
    })

    currentView.sidebar.show(new SidebarView(config))

    this.changeSubReginView(mainView, config)
  },

  // 侧边栏子菜单view切换
  changeSubReginView(view, config) {
    const currentView = Global.viewPool.getCurrentView()

    config = _.defaults(config || {}, {
      destroyDiff: 'low',
    })

    config.main = _.defaults(config.main || {}, {
      subReturn: true,
    })

    if (currentView) {
      this._changeReginView(currentView, view, config)
    } else {
      Global.appRouter.navigate(_(config.parentRouter).addHrefArgs('_t', _.now()), { trigger: true, replace: false })
    }
  },

  _changeMainReginView(view, config) {
    this._changeReginView(Global, view, config)
  },

  _changeReginView(currentView, view, config) {
    let mainView

    if (config.main && config.main.title) {
      const MainView = Base.LayoutView.extend({
        className: 'clearfix',
        template: require('skeleton/templates/main.html'),
        serializeData() {
          return config.main
        },
      })

      mainView = new MainView()

      mainView.addRegions({
        mainRegin: '.js-rt-main',
      })

      currentView.mainRegin.show(mainView, {
        preventDestroy: true,
        forceShow: true,
      })

      view.$_parentEl = mainView.$el

      mainView.mainRegin.show(view)
    } else {
      currentView.mainRegin.show(view, {
        preventDestroy: true,
        forceShow: true,
      })
    }

    Global.viewPool.push({
      regin: currentView.mainRegin,
      view: currentView.mainRegin.currentView,
      router: Backbone.history.getHash(),
      parentRouter: config.parentRouter,
    }, {
      destroyDiff: config.destroyDiff,
    })
  },
})

module.exports = RouterController

