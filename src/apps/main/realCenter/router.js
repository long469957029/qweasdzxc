const RealCenterView = () => import(/* webpackChunkName: "outer-center" */ './index')

export default [
  {
    path: '/rc',
    component: function(resolve) {
      RouterController.async(resolve, RealCenterView)
    }
  },
]
