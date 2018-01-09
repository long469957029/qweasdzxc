const RealCenterView = require('realCenter/index')

export default [
  {
    path: '/rc',
    component: function() {
      RouterController.changeMainReginView(new RealCenterView())
    }
  },
]
