

require('./index.scss')

const HeaderView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-nav': 'navSelectHandler',
  },

  onRender() {
    this.$nav = this.$('.js-nav')
  },

  turn(hash) {
    if (!hash) {
      hash = '#'
    }

    this.$nav.each((index, nav) => {
      const $a = $(nav).find('a')
      if (hash.indexOf($a.attr('href')) > -1) {
        $(nav).addClass('active').siblings().removeClass('active')
      }
    })
  },
})

module.exports = HeaderView
