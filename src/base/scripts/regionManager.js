/**
 * `RegionManager` 用于管理一个或多个相关的`Region`对象
 */
Base.RegionManager = Base.Controller.extend({

  constructor(options) {
    this._regions = {}

    Base.Controller.call(this, options)

    this.addRegions(this.getOption('regions'))
  },

  /**
   * 添加多个 Region
   */
  addRegions(regionDefinitions, defaults) {
    regionDefinitions = Base._getValue(regionDefinitions, this, arguments)

    return _.reduce(regionDefinitions, function(regions, definition, name) {
      if (_.isString(definition)) {
        definition = {
          selector: definition,
        }
      }
      if (definition.selector) {
        definition = _.defaults({}, definition, defaults)
      }

      regions[name] = this.addRegion(name, definition)
      return regions
    }, {}, this)
  },

  /**
   * 添加一个 Region
   */
  addRegion(name, definition) {
    let region

    if (definition instanceof Base.Region) {
      region = definition
    } else {
      region = Base.Region.buildRegion(definition, Base.Region)
    }

    this.triggerMethod('before:add:region', name, region)

    region._parent = this
    this._store(name, region)

    this.triggerMethod('add:region', name, region)
    return region
  },

  /**
   * 根据name获取region
   */
  get(name) {
    return this._regions[name]
  },

  /**
   * 获取所有的region
   */
  getRegions() {
    return _.clone(this._regions)
  },

  /**
   * 根据name移除region
   */
  removeRegion(name) {
    const region = this._regions[name]
    this._remove(name, region)

    return region
  },

  /**
   * 移除所有的region
   */
  removeRegions() {
    const regions = this.getRegions()
    _.each(this._regions, function(region, name) {
      this._remove(name, region)
    }, this)

    return regions
  },

  /**
   * 移除所有的region，但是`leave them attached`
   */
  emptyRegions() {
    const regions = this.getRegions()
    _.invoke(regions, 'empty')
    return regions
  },

  /**
   * 移除所有的region，并且关闭region manager
   */
  destroy() {
    this.removeRegions()
    return Base.Controller.prototype.destroy.apply(this, arguments)
  },

  _store(name, region) {
    this._regions[name] = region
    this._setLength()
  },

  _remove(name, region) {
    this.triggerMethod('before:remove:region', name, region)
    region.empty()
    region.stopListening()

    delete region._parent
    delete this._regions[name]
    this._setLength()
    this.triggerMethod('remove:region', name, region)
  },

  _setLength() {
    this.length = _.size(this._regions)
  },

})

Base.actAsCollection(Base.RegionManager.prototype, '_regions')
