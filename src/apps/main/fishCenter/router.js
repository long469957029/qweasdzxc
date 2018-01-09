const FishCenterView = require('fishCenter/index')

export default [
  {
    path: '/fc',
    component: function() {
      RouterController.changeMainReginView(new FishCenterView())
    },
  },
]
