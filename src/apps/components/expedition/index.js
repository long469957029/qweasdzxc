

require('./index.scss')

const CombineView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-expedition-go': 'closeHandler',
    'click .js-expedition-close': 'closeHandler',
  },

  onRender() {

  },
  closeHandler(e) {
    this.destroy()
  },

})

module.exports = CombineView
