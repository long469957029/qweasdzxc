

require('./index.scss')

const TicketsView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
  },

  onShow() {
    this.$el.fullpage({
      navigation: true,
      loopTop: true,
      loopBottom: true,
      paddingTop: '3.5rem',
    })

    if (this.options.id) {
      this.$el.fullpage.moveTo(this.options.id)
    }
  },

  destroy() {
    this.$el.fullpage.destroy(true)
  },
})

module.exports = TicketsView
