Base.View = Backbone.View.extend({

  isDestroyed: false,

  constructor(options) {
    this.subsribes = []

    _.bindAll(this, 'render')

    options = Base._getValue(options, this)

    this.options = _.extend({}, _.result(this, 'options'), options)

    Backbone.View.apply(this, arguments)

    Base.MonitorDOMRefresh(this)
    this.on('show', this.onShowCalled)
  },

  /**
   * 获取`view`实例的`template`
   */
  getTemplate() {
    return this.getOption('template')
  },

  mixinTemplateHelpers(target) {
    target = target || {}
    let templateHelpers = this.getOption('templateHelpers')
    templateHelpers = Base._getValue(templateHelpers, this)
    return _.extend(target, templateHelpers)
  },

  /**
   * 序列化`model`，返回它的属性
   */
  serializeModel(model) {
    return model.toJSON(..._.rest(arguments))
  },

  // 重写 Backbone.View 的 `delegateEvents`，处理`modelEvents`, 以及 `collectionEvents`
  delegateEvents(events) {
    Backbone.View.prototype.delegateEvents.call(this, events)

    this.bindEntityEvents(this.model, this.getOption('modelEvents'))
    this.bindEntityEvents(this.collection, this.getOption('collectionEvents'))

    return this
  },

  //  重写 Backbone.View 的 `undelegateEvents`，处理`modelEvents`, 以及 `collectionEvents`
  undelegateEvents() {
    Backbone.View.prototype.undelegateEvents.apply(this, arguments)

    this.unbindEntityEvents(this.model, this.getOption('modelEvents'))
    this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'))

    return this
  },

  /**
   * 处理 `show` 事件
   */
  onShowCalled() {},

  // 检查 view 是否 destroyed
  _ensureViewIsIntact() {
    if (this.isDestroyed) {
      throw new Base.Error({
        name: 'ViewDestroyedError',
        message: `View (cid: "${this.cid}") 已经 destroyed, 不能使用.`,
      })
    }
  },

  destroy() {
    if (this.isDestroyed) {
      return
    }

    const args = _.toArray(arguments)

    this.triggerMethod.apply(this, ['before:destroy'].concat(args))

    this.isDestroyed = true
    this.triggerMethod.apply(this, ['destroy'].concat(args))

    this.unSubscribeFromAll() // 移除view绑定的中介者。
    this.unbind() // 移除当前view的所有事件监听。不是必须做，因为会被垃圾回收。
    this.remove() // 调用Backbone.View.remove()方法，把this.el从DOM中移除，同时移除DOM事件。

    return this
  },

  triggerMethod() {
    const triggerMethod = Base._triggerMethod
    const ret = triggerMethod(this, arguments)
    return ret
  },

  getOption: Base.proxyGetOption,

  bindEntityEvents: Base.proxyBindEntityEvents,

  unbindEntityEvents: Base.proxyUnbindEntityEvents,

  subscribe(subscriber, channel, callback, options) {
    if (Base.MediatorFacade.subscribe(subscriber, channel, callback, options)) {
      this.subsribes.push({
        subscriber,
        channel,
        callback,
      })
    }
  },

  publish: Base.MediatorFacade.publish,

  unSubscribe: Base.MediatorFacade.unSubscribe,

  unSubscribeFromAll () {
    _.each(this.subsribes, function(subscribe) {
      this.unSubscribe(subscribe.subscriber, subscribe.channel, subscribe.callback)
    }, this)

    this.subsribes = []
  },
})
