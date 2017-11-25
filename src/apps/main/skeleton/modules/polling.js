define((require, exports, module) => {
  const PollingModule = Base.Module.extend({

    startWithParent: false,

    _interval: 1000,

    _polling: {},

    initialize(options, moduleName, app) {

    },

    start(pollingId, pollingFn) {
      if (!this._polling[pollingId]) {
        this._polling[pollingId] = pollingFn

        pollingFn.call(this)
      }
    },

    stop(pollingId) {
      if (pollingId) {
        clearInterval(this._polling[pollingId])
        delete this._polling[pollingId]
      } else {
        _.each(this._polling, (fn, pollingId) => {
          clearInterval(pollingId.timer)
        })

        this._polling = {}
      }
    },

    next(pollingId, options) {
      const self = this

      options = options || {}

      if (pollingId) {
        setTimeout(() => {
          if (self._polling[pollingId]) {
            self._polling[pollingId].call(self)
          }
        }, options.interval || this._interval)
      }
    },

  })

  module.exports = PollingModule
})
