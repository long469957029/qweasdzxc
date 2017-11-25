

require('./index.scss')

const CombineView = Base.ItemView.extend({

  template: require('./index.html'),
  events: {
    'click .js-expedition-notice': 'noticeShowHandler',
  },


  onRender() {
    this.$pop = this.$('.js-expedition-pop')
  },
  noticeShowHandler(e) {
    this.$pop.toggleClass('hidden')
  },

})

module.exports = CombineView

new CombineView({
  el: '.js-package',
}).render()
