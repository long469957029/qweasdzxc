const HelpCenterView = require('helpCenter/index')

export default [
  {
    path: '/hc',
    component: function() {
      RouterController.changeMainReginView(new HelpCenterView())
    },
  },
]
