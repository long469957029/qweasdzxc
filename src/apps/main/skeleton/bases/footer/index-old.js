

require('./index.scss')

const logo = require('./footerLogo.png')

const calendar = require('./footerCalendar.png')

const FooterView = Base.ItemView.extend({

  template: require('./index.html'),

  onRender() {
    const self = this
    this.$('.js-footer-logo').attr('src', logo)
    this.$('.js-footer-calendar-icon').attr('src', calendar)

    this.$calendarText = this.$('.js-footer-calendar-text')

    setInterval(() => {
      self.$calendarText.html(_(new Date()).formatTime('YYYY-MM-DD HH:mm:ss'))
    }, 1000)
  },
})

module.exports = FooterView
