

import './index.scss'

const RealCenterView = Base.ItemView.extend({

  template: require('realCenter/index.html'),

  events: {
    'mouseenter .js-rc-main-item': 'enterHandler',
  },

  onRender() {
  },

  enterHandler(e) {
    const $target = $(e.currentTarget)
    $('.js-rc-main-item').each((index, dom) => {
      $(dom).removeClass('active')
    })
    $target.addClass('active')
  },

})

module.exports = RealCenterView
