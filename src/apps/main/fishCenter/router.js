const FishCenterView = () => import(/* webpackChunkName: "outer-center" */ './fishCenter.vue')

export default [
  {
    path: '/fh',
    component: FishCenterView
  },
]
