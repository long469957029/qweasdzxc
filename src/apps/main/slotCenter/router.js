const SlotCenterView = () => import(/* webpackChunkName: "outer-center" */ './index')

export default [
  {
    path: '/sc',
    component: function(resolve) {
      RouterController.async(resolve, SlotCenterView)
    }
  },
]
