
const TabView = Base.LayoutView.extend({

  _tabTemplate: require('./tab-view.html'),

  _tabViews: {},

  _renderTemplate() {
    _(this.options).defaults({
      tabClass: 'nav-tabs nav-tabs-border',
      loadingHeight: 490,
      tabs: [],
      onTriggerTab: _.noop,
    })

    const template = this._tabTemplate

    this._tabViews = []
    this.tabs = this.tabs || this.options.tabs
    this.triggerTab = this.triggerTab || this.options.triggerTab
    this.append = this.options.append || ''

    if (template === false) {
      return
    }

    if (!template) {
      throw new Base.Error({
        name: 'UndefinedTemplateError',
        message: 'template为空，不能渲染。',
      })
    }

    let compiledTpl = _.template(template)

    let html

    const _html = compiledTpl({
      tabClass: this.options.tabClass,
      tabs: this.tabs,
      triggerTab: this.triggerTab,
      append: this.append,
    })

    if (this.startOnLoading) {
      html = `<div class="${this.uniqueId} hidden">${_html}</div>`
      html += this._getLoading()
    } else {
      html = _html
      // html = '<div class="' + this.uniqueId + '">' + compiledTpl(data) + '</div>';
    }

    if (this.template) {
      compiledTpl = _.template(this.getTemplate())
      html = compiledTpl({
        tabHtml: html,
      })
    }

    this.attachElContent(html)

    return this
  },

  onRender() {
    this._initTabs()
  },

  // common APIs

  updateTabs(tabs) {
    this.tabs = tabs
    this._renderTemplate()
    this._initTabs()
  },

  _initTabs() {
    const self = this
    let init = true

    if (_.isEmpty(this.tabs)) {
      return false
    }

    this.addRegions(_(this.tabs).reduce((regions, tab) => {
      regions[tab.name] = `#${tab.id}`
      return regions
    }, {}))

    this.$('a[data-toggle="tab"]').on('show', (e) => {
      const $target = $(e.currentTarget)
      let tabInfo = self.tabs[$target.data('index')]

      if (self.isDestroyed) {
        return
      }

      tabInfo = _(tabInfo).defaults({
        toggleInit: true,
      })

      if (tabInfo.view) {
        if (!self._tabViews[tabInfo.name]) {
          const TabinfoView = tabInfo.view
          self._tabViews[tabInfo.name] = new TabinfoView(tabInfo.options || {})
          self._tabViews[tabInfo.name]._parentView = self
        }

        self[tabInfo.name].show(self._tabViews[tabInfo.name], {
          forceShow: tabInfo.toggleInit,
        })
      } else {
        const StaticView = Base.ItemView.extend({
          template: tabInfo.template,
        })

        self[tabInfo.name].show(new StaticView())
        // self.$('#' + tabInfo.id).html(_(tabInfo.template).template());
        // 调用onRender方法
        self[`on${_($target.data('name')).ucFirst()}Render`]()
      }

      if (tabInfo.router) {
        if (!init) {
          Global.viewPool.replace({
            view: self,
            router: tabInfo.router,
          })
        }
        Global.appRouter.navigate(tabInfo.router, { trigger: false, replace: true })
      }

      init = false

      if (self.options.onTriggerTab) {
        self.options.onTriggerTab()
      }
    })

    if (this.options.triggerTab) {
      this.$(`a[data-name=${this.options.triggerTab}]`).trigger('show')
    } else {
      this.$(`[href=#${this.tabs[0].id}]`).trigger('show')
    }
  },
})

module.exports = TabView
