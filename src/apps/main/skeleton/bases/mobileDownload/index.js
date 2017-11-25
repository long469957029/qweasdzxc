

require('./index.scss')

const MobileDownloadView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-mobile-entry': 'entryHandler',
    'click .js-close': 'closeHandler',
  },

  initialize() {

  },

  onRender() {
    const self = this
    this.$entry = this.$('.js-mobile-entry')
    this.$mobileBottom = this.$('.js-mobile-bottom')
  },
  entryHandler () {
    const self = this
    this.$entry.animate({ left: '-140px' }, 400, () => {
      self.$entry.addClass('hidden')
      self.$mobileBottom.removeClass('hidden')
      self.$mobileBottom.animate({ left: '0' }, 1000)
    })
  },
  closeHandler () {
    const self = this
    this.$mobileBottom.animate({ left: '-100%' }, 800, () => {
      self.$mobileBottom.addClass('hidden')
      self.$entry.removeClass('hidden')
      self.$entry.animate({ left: '0' }, 400)
    })
  },

})

module.exports = MobileDownloadView
