

import './index.scss'

const SportCenterView = Base.ItemView.extend({

  template: require('sportCenter/index.html'),

  // itemTpl: _(require('activeCenter/activityItem.html')).template(),

  events: {},

  onRender() {
    console.log(_.range(10))
    console.log(lo.range(10))
    console.log(R.range(1, 10))
  },

})

module.exports = SportCenterView
