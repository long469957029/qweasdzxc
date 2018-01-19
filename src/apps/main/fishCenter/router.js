const FishCenterView = () => import(/* webpackChunkName: "outer-center" */ './index')

export default [
  {
    path: '/fh',
    component: function(resolve) {
      RouterController.async(resolve, FishCenterView)
    },
  },
]
