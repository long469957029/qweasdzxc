

import './index.scss'

const RealCenterView = Base.ItemView.extend({

  template: require('realCenter/index.html'),

  // itemTpl: _(require('activeCenter/activityItem.html')).template(),

  events: {
    'mouseenter .js-rc-main-item': 'enterHandler',
    // 'mouseleave .js-rc-main-item': 'leaveHandler'
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
