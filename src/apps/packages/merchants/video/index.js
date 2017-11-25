

require('./index.scss')

const VideoView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  onShow() {
    this.$el.fullpage({
      navigation: false,
      paddingTop: '3.5rem',
    })
  },

  destroy() {
    this.$el.fullpage.destroy(true)
  },
})

module.exports = VideoView
