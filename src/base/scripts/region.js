/**
 * `Region` => visual region 视觉区域
 * `Regions`提供了一些列方法来统一管理、展现和销毁应用(applications)或布局(layouts)中的视图(view)，
 * 他们使用jQuery选择器在确定的地方展现不同的视图`views`
 *
 * @see http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
 */
Base.Region = Base.BaseObject.extend({

  constructor(options) {
    // 临时设置`options`，以便获取`el`
    // `options`将会被`BaseObject.constructor`重写
    this.options = options || {}
    this.el = this.getOption('el')

    this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el

    if (!this.el) {
      throw new Base.Error({
        name: 'NoElError',
        message: '必须为每一个regin指定"el"',
      })
    }

    this.$el = this.getEl(this.el)
    Base.BaseObject.call(this, options)
  },

  /**
   * 在`region`中显示一个backbone view。实际上自动调用`view`中的`render`方法，
   * 同时会在显示`view`之后调用`onShow`方法（如果存在），
   * 在销毁`view`之前调用`onDestory`方法（如果存在）
   *
   * 参数 options 中：
   *   preventDestroy: 在显示的时候，防止来自 old view 的 view 被销毁
   *   forceShow: 如果view在region中已经显示，可以用来强制刷新这个view
   *
   */
  show(view, options) {
    if (!this._ensureElement()) {
      return
    }

    this._ensureViewIsIntact(view)

    const showOptions = options || {}
    const isDifferentView = view !== this.currentView
    const preventRender = !!showOptions.preventRender
    const preventDestroy = !!showOptions.preventDestroy
    const forceShow = !!showOptions.forceShow

    // 只有当`currentView`不为空的时候，才`change`视图
    const isChangingView = !!this.currentView

    let _shouldDestroyView = isDifferentView && !preventDestroy

    const _shouldShowView = isDifferentView || forceShow

    if (isChangingView) {
      this.triggerMethod('before:swapOut', this.currentView, this, options)
    }

    if (this.currentView) {
      delete this.currentView._parent
      if (this.currentView._remain) {
        _shouldDestroyView = false
      }
    }

    if (_shouldDestroyView) {
      this.empty()
    } else if (isChangingView && _shouldShowView) {
      // `destory`事件用于手动清理被移除的视图。
      // 我们需要给没有用的视图`detach`这个事件
      this.currentView.off('destroy', this.empty, this)
    }

    if (_shouldShowView) {
      view.once('destroy', this.empty, this)

      if (!preventRender) {
        view.render()
      }

      view._parent = this

      if (isChangingView) {
        this.triggerMethod('before:swap', view, this, options)
      }

      this.triggerMethod('before:show', view, this, options)
      Base.triggerMethodOn(view, 'before:show', view, this, options)

      if (isChangingView) {
        this.triggerMethod('swapOut', this.currentView, this, options)
      }

      const attachedRegion = Base.isNodeAttached(this.el)

      // 用于存放 attach 到 document 上的 views
      // 由于`_getNestedViews`是潜在的影响性能的因素，因此要防止其执行
      let displayedViews = []

      const triggerBeforeAttach = showOptions.triggerBeforeAttach || this.triggerBeforeAttach
      const triggerAttach = showOptions.triggerAttach || this.triggerAttach

      if (attachedRegion && triggerBeforeAttach) {
        displayedViews = this._displayedViews(view)
        this._triggerAttach(displayedViews, 'before:')
      }

      this.attachHtml(view)
      this.currentView = view

      if (attachedRegion && triggerAttach) {
        displayedViews = this._displayedViews(view)
        this._triggerAttach(displayedViews)
      }

      if (isChangingView) {
        this.triggerMethod('swap', view, this, options)
      }

      this.triggerMethod('show', view, this, options)
      Base.triggerMethodOn(view, 'show', view, this, options)

      return this
    }

    return this
  },

  triggerBeforeAttach: true,
  triggerAttach: true,

  _triggerAttach(views, prefix) {
    const eventName = `${prefix || ''}attach`
    _.each(views, function(view) {
      Base.triggerMethodOn(view, eventName, view, this)
    }, this)
  },

  _displayedViews(view) {
    return _.union([view], _.result(view, '_getNestedViews') || [])
  },

  _ensureElement() {
    if (!_.isObject(this.el)) {
      this.$el = this.getEl(this.el)
      this.el = this.$el[0]
    }

    if (!this.$el || this.$el.length === 0) {
      if (this.getOption('allowMissingEl')) {
        return false
      }
      throw new Base.Error(`"el" ${this.$el.selector} 在DOM树中必须存在`)
    }
    return true
  },

  _ensureViewIsIntact(view) {
    if (!view) {
      throw new Base.Error({
        name: 'ViewNotValid',
        message: '参数view为空，你必须传递一个view实例以便显示。',
      })
    }

    if (view.isDestroyed) {
      throw new Base.Error({
        name: 'ViewDestroyedError',
        message: `View (cid: "${view.cid}") 已经被\`destroyed\`, 不能使用。`,
      })
    }
  },

  /**
   * 返回一个jQuery selector对象，或者 document
   *
   */
  getEl(el) {
    return Backbone.$(el, Base._getValue(this.options.parentEl, this))
  },

  attachHtml(view) {
    this.$el.contents().detach()

    this.$el.append(view.$el)
  },

  /**
   * 销毁当前的视图
   */
  empty() {
    const view = this.currentView

    if (!view) {
      return
    }

    view.off('destroy', this.empty, this)
    this.triggerMethod('before:empty', view)
    this._destroyView()
    this.triggerMethod('empty', view)

    delete this.currentView
    return this
  },

  _destroyView() {
    const view = this.currentView

    if (view.destroy && !view.isDestroyed) {
      view.destroy()
    } else if (view.remove) {
      this.unbind() // 移除当前view的所有事件监听。不是必须做，因为会被垃圾回收。
      view.remove()

      view.isDestroyed = true
    }
  },

  /**
   * 将`view`附加到region上。该方法不会执行 `render`或者`onShow`方法，
   * 同样也不会替代`el`的HTML
   */
  attachView(view) {
    this.currentView = view
    return this
  },

  /**
   * 检查`currentView`是否存在
   */
  hasView() {
    return !!this.currentView
  },

  /**
   *  重置、清空
   */
  reset() {
    this.empty()

    if (this.$el) {
      this.el = this.$el.selector
    }

    delete this.$el
    return this
  },

}, {

  /**
   * 构建 region 实例
   *
   * `regionConfig`可以是一个jQuery DOM selector *like的字符串，
   * 可以直接是一个Region class，或者是一个指定一个selector的对象字面量...
   * {
   *   selector: "#foo",
   *   regionClass: MyCustomRegion,
   *   allowMissingEl: false
   * }
   *
   */
  buildRegion(regionConfig, DefaultRegionClass) {
    if (_.isString(regionConfig)) {
      return this._buildRegionFromSelector(regionConfig, DefaultRegionClass)
    }

    if (regionConfig.selector || regionConfig.el || regionConfig.regionClass) {
      return this._buildRegionFromObject(regionConfig, DefaultRegionClass)
    }

    if (_.isFunction(regionConfig)) {
      return this._buildRegionFromRegionClass(regionConfig)
    }

    throw new Base.Error('配置信息错误')
  },

  // 通过 string-selector-like，例如 '#foo-region' 构建 region
  _buildRegionFromSelector(selector, DefaultRegionClass) {
    return new DefaultRegionClass({
      el: selector,
    })
  },

  // 通过一个配置的对象字面量构建 region
  // 例如： { selector: '#foo', regionClass: FooRegion, allowMissingEl: false }
  _buildRegionFromObject(regionConfig, DefaultRegionClass) {
    const RegionClass = regionConfig.regionClass || DefaultRegionClass
    const options = _.omit(regionConfig, 'selector', 'regionClass')

    if (regionConfig.selector && !options.el) {
      options.el = regionConfig.selector
    }

    return new RegionClass(options)
  },

  // 直接通过一个 `RegionClass` 构建
  _buildRegionFromRegionClass(RegionClass) {
    return new RegionClass()
  },

})
