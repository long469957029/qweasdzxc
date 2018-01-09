const SlotCenterView = require('gameCenter/slot/slotTab')

export default [
  {
    path: '/gc/sc',
    component: function() {
      RouterController.changeMainReginView(new SlotCenterView({ triggerTab: 'jsPTSlot' }), {
        main: {
          title: '老虎机',
        },
      })
    },
  },
  {
    path: '/gc/scmg',
    component: function() {
      RouterController.changeMainReginView(new SlotCenterView({ triggerTab: 'jsMGSlot' }), {
        main: {
          title: '老虎机',
        },
      })
    },
  },
]
