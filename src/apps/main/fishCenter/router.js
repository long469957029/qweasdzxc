const FishCenterView = () => import(/* webpackChunkName: "outer-center" */ './index')

export default [
  {
    path: '/fc',
    component: function(resolve) {
      RouterController.async(resolve, FishCenterView)
    },
  },
]
