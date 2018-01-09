const MallCenterView = require('mallCenter/index/index')

const instructionView = require('mallCenter/instruction/index')

export default [
  {
    path: '/ma',
    component: function() {
      RouterController.changeMainReginView(new MallCenterView(), {
        hideHeaderRight: true,
      })
    },
  },
  {
    path: '/mad',
    component: function() {
      RouterController.changeMainReginView(new instructionView(), {
        hideHeaderRight: true,
      })
    },
  },
]
