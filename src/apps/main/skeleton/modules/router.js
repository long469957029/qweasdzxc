

const RouterModule = Base.Module.extend({

  startWithParent: false,

  _history: [],

  initialize() {
    const self = this

    $(document).off('click.router').on('click.router', 'a.router', (e) => {
      self._history.push(Backbone.history.getHash())
    })

    $(document).off('click.sub-return').on('click.sub-return', 'a.sub-return,button.sub-return', (e) => {
      window.app.$router.back()

      // this.back()
    })
  },

  goTo(hash) {
    window.location.hash = `#/${hash}`
  },

  back() {
    const superior = Global.viewPool.pop()

    if (!superior.noParent && superior.view) {
      // superior.regin.$el.removeClass('hidden');

      superior.regin.show(superior.view, {
        preventRender: true,
      })

      try {
        superior.view.trigger('router:back')
        superior.view.mainRegin.currentView.trigger('router:back')
      } catch (e) {

      }


      // Global.appRouter.navigate(this._history.pop(), { trigger: false, replace: true })
    } else if (superior.noParent && superior.parentRouter) {
      superior.view.destroy()

      Global.appRouter.navigate(superior.parentRouter, { trigger: true, replace: false })
    } else {
      Global.appRouter.navigate('#', { trigger: true, replace: false })
    }
  },
})

module.exports = RouterModule
