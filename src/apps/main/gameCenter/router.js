const SlotCenterView = () => import(/* webpackChunkName: "outer-center" */ './slot/slotTab')

export default [
  {
    path: '/gc/sc',
    component: function(resolve) {
      RouterController.async(resolve, SlotCenterView, {
        triggerTab: 'jsPTSlot'
      }, {
        main: {
          title: '老虎机',
        },
      })
    },
  },
  {
    path: '/gc/scmg',
    component: function(resolve) {
      RouterController.async(resolve, SlotCenterView, {
        triggerTab: 'jsMGSlot'
      }, {
        main: {
          title: '老虎机',
        },
      })
    },
  },
]
