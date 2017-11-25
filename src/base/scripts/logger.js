Base.Logger = (function() {
  const loggers = []

  const addLogger = function(logger) {
    loggers.push(logger)
  }

  if (typeof window.console !== 'undefined') {
    if (typeof window.console.log === 'function' && _.isFunction(window.console.log.apply)) {
      addLogger(function() {
        window.console.log.apply(window.console, arguments)
      })
    } else {
      addLogger(function() {
        window.console.log(arguments)
      })
    }
  }

  return {

    // Add to the global logger pool. Takes a function that accepts an
    // unknown number of arguments and should print them or send them somewhere
    // The first argument is always a timestamp.
    addLogger,

    // Sends a log message to each logger listed in the global
    // loggers pool. Can take any number of arguments.
    // Also prefixes the arguments with a timestamp.
    log() {
      let args = Array.prototype.slice.call(arguments),
        self = this
      args.unshift(`[${Date()}]`)
      _.each(loggers, (logger, i) => {
        logger.apply(self, args)
      })
    },

  }
}())

Base.addLogger = Base.Logger.addLogger
Base.log = Base.Logger.log
