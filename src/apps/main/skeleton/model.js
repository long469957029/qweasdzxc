

const Model = Backbone.Model.extend({

  initialize(attributes, options) {
    if (options) {
      this.options = options
      this.setOptions()
    }
    this.deferred = new Base.Deferred()
    this._ajaxOptions = {
      dataType: 'json',
      beforeSend(xhr) {
        xhr.setRequestHeader('Content-encoding', 'gzip, deflate')
        // xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json')
      },
    }
  },

  request: null,

  fetch(options) {
    options = _(options || {}).defaults({
      type: 'POST',
    })
    if (!options.success) {
      options.success = this.fetchSuccess
    }
    if (!options.error) {
      options.error = this.fetchError
    }
    // _.extend(options, this._ajaxOptions);
    if (!options.data) {
      options.data = {}
    }

    return Backbone.Model.prototype.fetch.call(this, options)
  },

  fetchSuccess(model, response) {
    if (model.deferred) {
      if (!model.request) {
        model.request = model.deferred.promise()
      }
      model.deferred.resolve()
    }
  },

  fetchError(model, response) {
    if (model.deferred) {
      model.deferred.reject()
    }
  },

  save(attrs, options) {
    options = options || {}
    _.extend(options, this._ajaxOptions)
    this.request = Backbone.Model.prototype.save.call(this, attrs, options)
    return this.request
  },

  setOptions() {
    if (this.options && this.options.urlRoot) {
      this.urlRoot = this.options.urlRoot
    }
  },

  setXhr(urlOptions) {
    if (urlOptions.url) {
      this.url = urlOptions.url
      delete urlOptions.url
    }
    _(this).extend(urlOptions)
  },

})

module.exports = Model
