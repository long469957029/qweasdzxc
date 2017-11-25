

require('./index.scss')

const ActiveCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
  },

  onShow() {
    this.$el.fullpage({
      navigation: true,
      loopTop: true,
      loopBottom: true,
      paddingTop: '3.5rem',
      afterLoad(anchorLink, index) {
        const $animates = this.find('.js-animate')
        $animates.removeClass('hidden').addClass($animates.data('class'))
      },
    })
  },

  destroy() {
    this.$el.fullpage.destroy(true)
  },
})

module.exports = ActiveCenterView
