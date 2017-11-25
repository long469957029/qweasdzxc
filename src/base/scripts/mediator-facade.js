// 中介者门面文件

Base.MediatorFacade = (function(mediator, permissions) {
  return {
    subscribe(subscriber, channel, callback, options) {
      options = _.extend({
        init: true,
      }, options)

      if (permissions.validate(subscriber, channel)) {
        mediator.subscribe(channel, callback, options)

        return true
      }

      return false
    },

    publish(channel) {
      const args = [].slice.call(arguments, 1)

      mediator.publish.apply(this, [channel].concat(args))
    },

    unSubscribe(subscriber, channel, callback) {
      if (permissions.validate(subscriber, channel)) {
        mediator.unSubscribe(channel, callback)
      }
    },
  }
}(Base.Mediator, Base.SubscribePermissions))
