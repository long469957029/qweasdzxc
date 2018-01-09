const SlotCenterView = require('slotCenter/index')

export default [
  {
    path: '/sc',
    component: function() {
      RouterController.changeMainReginView(new SlotCenterView())
    }
  },
]
