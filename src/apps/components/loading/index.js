

require('./index.scss')

const LoadingView = Base.ItemView.extend({
  template: require('./index.html'),

  render () {
    this.$el.html(_(this.template).template()(this.options))
  },
})

module.exports = LoadingView
