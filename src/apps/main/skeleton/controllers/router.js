import SidebarView from 'com/sidebar'

const SideMenuMainView = Base.LayoutView.extend({
  className: 'clearfix',
  template: '<div class="admin-container clearfix"><div class="js-gl-sidebar pull-left col-md-2"></div>' +
  '<div class="js-gl-main pull-left col-md-10"></div></div>',
})

export default {
  async(resolve, viewPromise, params, config) {
    if (!config) {
      config = params
      params = {}
    }
    viewPromise().then((view) => {
      this.changeMainReginView(new view(params), config)
      resolve()
    })
  },

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

    // 在路由变换变更主区域内容的时候 设定 .ripple-btn 有水波纹效果
    this._setRippleBtns()
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
          _(config.main).extend({ titleDes: config.main.titleDes || null })
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


  _setRippleBtns() {
    const buttons = document.querySelectorAll('.ripple-btn')

    function createRipple(e) {
      const circle = document.createElement('div')
      this.appendChild(circle)

      const d = Math.max(this.clientWidth, this.clientHeight)

      circle.style.width = `${d}px`
      circle.style.height = `${d}px`

      const rect = this.getBoundingClientRect()
      circle.style.left = `${e.clientX - rect.left - d / 2}px`
      circle.style.top = `${e.clientY - rect.top - d / 2}px`

      circle.classList.add('ripple')
    }

    Array.prototype.forEach.call(buttons, (b) => {
      b.addEventListener('click', createRipple)
    })
  },
}


