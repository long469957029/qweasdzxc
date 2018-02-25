Base.Application = Base.BaseObject.extend({

  constructor(options) {
    this._initializeRegions(options)
    this._initStorage(options)
    this._initCallbacks = new Base.Callbacks()
    this.submodules = {}
    _.extend(this, options)
    Base.BaseObject.call(this, options)
  },

  /**
   * 添加一个`initializer`，其执行的点：
   *   1. 如果在`start`执行前添加，那么当`start`方法被调用的时候执行
   *   2. 如果在`start`执行后添加，那么立即执行
   *
   */
  addInitializer(initializer) {
    this._initCallbacks.add(initializer)
  },

  /**
   * [!!!]启动应用`application`
   * 该方法允许你在应用`route`前，做一些应用需要在正式启动前做的事情，
   * 比如发送一个AJAX请求获取应用需要的初始化需要的数据
   */
  start(options) {
    this.triggerMethod('before:start', options)
    this._initCallbacks.run(options, this)
    this.triggerMethod('start', options)
  },

  /**
   * 在应用中添加region(s)
   * addRegions({something: "#someRegion"})
   * addRegions({something: Region.extend({el: "#someRegion"}) });
   */
  addRegions(regions) {
    return this._regionManager.addRegions(regions)
  },

  /**
   * 清空应用中的region(s)，但不移除他们
   */
  emptyRegions() {
    return this._regionManager.emptyRegions()
  },

  /**
   * 根据name移除region
   * removeRegion('myRegion')
   */
  removeRegion(region) {
    return this._regionManager.removeRegion(region)
  },

  /**
   * 根据name获取region
   * getRegion('myRegion')
   */
  getRegion(region) {
    return this._regionManager.get(region)
  },

  /**
   * 获取所有的region
   */
  getRegions() {
    return this._regionManager.getRegions()
  },

  /**
   * 为应用添加一个模块
   *
   * @param moduleDefinition
   *  The module itself
   *  The Application object
   *  Backbone
   *  Base
   *  jQuery
   *  Underscore
   *  Any custom arguments
   */
  module(moduleNames, moduleDefinition) {
    const ModuleClass = Base.Module.getClass(moduleDefinition)

    const args = _.toArray(arguments)
    args.unshift(this)

    return ModuleClass.create(...args)
  },

  getRegionManager() {
    return new Base.RegionManager()
  },

  _initializeRegions(options) {
    const regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {}

    this._initRegionManager()

    let optionRegions = Base.getOption(options, 'regions')

    if (_.isFunction(optionRegions)) {
      optionRegions = optionRegions.call(this, options)
    }

    _.extend(regions, optionRegions)

    this.addRegions(regions)

    return this
  },

  _initStorage(options) {
    const optionCacheTypes = Base.getOption(options, 'cacheTypes') || ['memory', 'local', 'session', 'cookie']

    for (let i = 0; i < optionCacheTypes.length; i++) {
      const optionCacheType = optionCacheTypes[i]
      this[`${optionCacheType}Cache`] = new Base.Storage({
        name: 'newappstorage',
        type: optionCacheType,
        domain: window.location.hostname.indexOf('localhost') > -1 ? '' : _.last(window.location.hostname.split('.'), 2).join('.')
      })
    }
  },

  _initRegionManager() {
    this._regionManager = this.getRegionManager()
    this._regionManager._parent = this

    this.listenTo(this._regionManager, 'before:add:region', function() {
      Base._triggerMethod(this, 'before:add:region', arguments)
    })

    this.listenTo(this._regionManager, 'add:region', function(name, region) {
      this[name] = region
      Base._triggerMethod(this, 'add:region', arguments)
    })

    this.listenTo(this._regionManager, 'before:remove:region', function() {
      Base._triggerMethod(this, 'before:remove:region', arguments)
    })

    this.listenTo(this._regionManager, 'remove:region', function(name) {
      delete this[name]
      Base._triggerMethod(this, 'remove:region', arguments)
    })
  },

})
