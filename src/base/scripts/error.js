const errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number']

Base.Error = Base.extend.call(Error, {

  constructor(message, options) {
    if (_.isObject(message)) {
      options = message
      message = options.message
    } else if (!options) {
      options = {}
    }

    const error = Error.call(this, message)
    _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps))

    this.captureStackTrace()

    if (options.url) {
      this.url = options.url
    }
  },

  captureStackTrace() {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Base.Error)
    }
  },

  toString() {
    return `${this.name}: ${this.message}${this.url ? ` 参考: ${this.url}` : ''}`
  },
})

Base.Error.extend = Base.extend
