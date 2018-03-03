

const PollingModule = Base.Module.extend({

  startWithParent: false,

  _quickPolling: [],

  _polling: [],

  _currentView: null,

  initialize(options, moduleName, app) {

  },

  push(viewInfo, config) {
    config = config || {
      destroyDiff: 'high',
    }

    viewInfo.router = viewInfo.router.replace(/\?.*/, '') || '#'

    if (config.destroyDiff && viewInfo.router) {
      this._clearDiff(viewInfo.router, config.destroyDiff)
    }

    this._polling.push(viewInfo)
    // console.log(this._polling);
  },

  replace(viewInfo) {
    const last = this._polling.pop()

    if (last) {
      last.router = viewInfo.router
      last.view.mainRegin.attachView(viewInfo.view)

      this._polling.push(last)

      // console.log(this._polling);
    }
  },

  pop() {
    const current = this._polling.pop()
    let find
    // console.log(this._polling);

    if (this._polling.length === 0) {
      find = _(this._quickPolling).findWhere({
        router: current.parentRouter,
      })
      if (find) {
        return {
          regin: Global.mainRegin,
          router: find.router,
          view: find.view,
        }
      }
      return _(current).extend({
        noParent: true,
      })
    }
    return _(this._polling).last()
  },

  empty() {
    _(this._polling).each((superior) => {
      superior.regin.empty()
    })

    // console.log(this._polling);
  },

  setCurrentView(view) {
    this._currentView = view
    return this._currentView
  },

  getCurrentView() {
    return this._currentView
  },

  _getRootRouter(router) {
    let rootRouter = router.match(/^(.*?)\//)
    if (rootRouter) {
      rootRouter = rootRouter[1]
    } else {
      rootRouter = router
    }

    return rootRouter
  },

  _clearDiff(router, destroyDiff) {
    const rootRouter = this._getRootRouter(router)

    _(this._polling).each(function(poll) {
      if (poll.router) {
        if (destroyDiff === 'high') {
          if (router.indexOf(poll.router) === -1 || router === poll.router) {
            if (poll.view && !poll.view.isDestroyed) {
              poll.view.destroy()
            }

            this._polling = _(this._polling).without(poll)
          }
        } else if (this._getRootRouter(poll.router) !== rootRouter) {
          if (poll.view && !poll.view.isDestroyed) {
            poll.view.destroy()
          }

          this._polling = _(this._polling).without(poll)
        }
      }
    }, this)
  },

  quickClear() {
    _(this._quickPolling).each((viewInfo) => {
      if (!viewInfo.display) {
        viewInfo.view.destroy()
      } else {
      }
    })

    this._quickPolling = []
  },

  quickPush(viewInfo, config) {
    viewInfo.view._remain = true
    this._quickPolling.push(viewInfo)
  },

  getQuick(router) {
    let isFind = false

    _(this._quickPolling).each((viewInfo) => {
      if (router === `#${viewInfo.router}`) {
        viewInfo.display = true
        Global.mainRegin.show(viewInfo.view, {
          preventRender: true,
          preventDestroy: true,
          forceShow: true,
        })
        viewInfo.view.trigger('entry:show')

        isFind = true
      } else {
        viewInfo.display = false
      }
    })

    return isFind
  },
})

module.exports = PollingModule
