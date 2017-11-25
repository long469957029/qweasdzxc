

const LoaderModule = Base.Module.extend({

  startWithParent: false,

  template: _(require('./index.html')).template(),

  initialize(options, moduleName, app) {
    if ($('.wt-wrapper>.loader').size() === 0) {
      $('.wt-wrapper').append($(this.template({})).addClass('hidden'))
    }
  },

  show() {
    $('.wt-wrapper>.loader').removeClass('hidden')
  },

  hide() {
    $('.wt-wrapper>.loader').addClass('hidden')
  },

  get(options) {
    options = _(options || {}).defaults({
      wrapperClass: '',
    })
    return this.template(options)
  },

})

module.exports = LoaderModule
