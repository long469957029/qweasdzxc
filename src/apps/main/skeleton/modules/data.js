

const DataModule = Base.Module.extend({

  startWithParent: false,

  _dataPool: [],

  set(name, collection) {
    this._dataPool.push({
      name,
      collection,
    })

    return collection
  },

  get(name) {
    const data = _(this._dataPool).findWhere({
      name,
    })

    return data && data.collection
  },

})

module.exports = DataModule
