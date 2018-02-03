const SlotCenterView = () => import(/* webpackChunkName: "outer-center" */ './slot/index')
const FishCenterView = () => import(/* webpackChunkName: "outer-center" */ './fish/fishCenter.vue')
const RealCenterView = () => import(/* webpackChunkName: "outer-center" */ './real/realCenter.vue')

export default [
  {
    path: '/sc',
    component: function(resolve) {
      RouterController.async(resolve, SlotCenterView)
    }
  },
  {
    path: '/fh',
    component: FishCenterView
  },
  {
    path: '/rc',
    component: RealCenterView
  },
]
